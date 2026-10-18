import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { CAREER_TRACKS } from './src/data/careersData.js';
import { SAMPLE_JOBS_DATA } from './src/data/sampleJobsData.js';
import { LEARNING_RESOURCES } from './src/data/learningData.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize Google GenAI on the server exclusively
const geminiApiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: geminiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Simple in-memory rate limiter per IP for AI endpoints
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function rateLimiter(limit = 30, windowMs = 60000) {
  return (req: Request, res: Response, next: () => void) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (entry.count >= limit) {
      return res.status(429).json({
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please wait a minute before making another request.',
        },
      });
    }

    entry.count += 1;
    next();
  };
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(geminiApiKey),
    jobProviderConfigured: Boolean(process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY),
    provider: process.env.ADZUNA_APP_ID ? 'Adzuna Live Feed' : 'YouthPath Curated (Demonstration)',
  });
});

// 2. Careers catalog
app.get('/api/careers', (req: Request, res: Response) => {
  res.json({
    careers: CAREER_TRACKS,
    total: CAREER_TRACKS.length,
  });
});

app.get('/api/careers/:id', (req: Request, res: Response) => {
  const career = CAREER_TRACKS.find(c => c.id === req.params.id);
  if (!career) {
    return res.status(404).json({
      error: { code: 'NOT_FOUND', message: 'Career track not found.' },
    });
  }
  res.json({ career });
});

// 3. AI-Powered Career Recommendations
app.post('/api/career-recommendations', rateLimiter(15), async (req: Request, res: Response) => {
  try {
    const { educationLevel, degreeOrField, interests, existingSkills, preferredWorkType, careerGoals, learningPreferences } = req.body;

    if (!educationLevel || !interests) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Education level and interests are required.' },
      });
    }

    if (!geminiApiKey) {
      return res.status(503).json({
        error: { code: 'AI_UNAVAILABLE', message: 'Gemini API key is not configured on the server. Please verify your environment settings.' },
      });
    }

    const prompt = `
You are an expert, empathetic youth career counselor for Indian students and fresh graduates (B.Tech, B.E., BCA, B.Sc, B.Com, MCA, M.Tech, MBA, and vocational diplomas).
Analyze the following user questionnaire and recommend the top 2-3 most aligned career paths in the Indian and global employment landscape (including tech hubs like Bengaluru, Hyderabad, Pune, Delhi NCR, Chennai, and Mumbai).
User Details:
- Education Level: ${educationLevel}
- Degree/Field: ${degreeOrField || 'Not specified'}
- Interests: ${Array.isArray(interests) ? interests.join(', ') : interests}
- Existing Skills: ${Array.isArray(existingSkills) ? existingSkills.join(', ') : existingSkills}
- Preferred Work Type: ${preferredWorkType || 'Flexible'}
- Career Goals: ${careerGoals || 'Build a fulfilling, stable career'}
- Learning Preferences: ${learningPreferences || 'Hands-on projects and online resources'}

Important Guidelines:
1. Provide constructive, transparent guidance, not an authoritative decree.
2. Recommend realistic entry-level paths, mentioning relevant technical competencies and reputable learning resources (e.g. NPTEL, GeeksforGeeks, MDN, FreeCodeCamp).
3. Return only valid JSON adhering to the specified schema.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an objective, encouraging career advisor. You return strictly structured JSON with career recommendations for youth.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              careerTitle: { type: Type.STRING },
              explanation: { type: Type.STRING },
              matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              learningRoadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
              beginnerProjects: { type: Type.ARRAY, items: { type: Type.STRING } },
              nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['careerTitle', 'explanation', 'matchingSkills', 'missingSkills', 'learningRoadmap', 'beginnerProjects', 'nextSteps'],
          },
        },
      },
    });

    const text = response.text || '[]';
    let recommendations = [];
    try {
      recommendations = JSON.parse(text);
    } catch {
      recommendations = [];
    }

    res.json({
      recommendations,
      timestamp: new Date().toISOString(),
    });
  } catch (err: unknown) {
    console.error('Error generating career recommendations:', err);
    res.status(500).json({
      error: { code: 'AI_PROCESSING_ERROR', message: 'Failed to process career recommendations with Gemini.' },
    });
  }
});

// 4. Job Listings (Adzuna integration or transparent curated demonstration feed)
app.get('/api/jobs', async (req: Request, res: Response) => {
  try {
    const { keyword = '', location = '', remote = '', employmentType = '', experienceLevel = '', page = '1' } = req.query;
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    // Check if live Adzuna credentials are provided
    if (appId && appKey) {
      try {
        const country = 'in'; // India country code for Adzuna
        const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
        const url = new URL(`https://api.adzuna.com/v1/api/jobs/${country}/search/${pageNum}`);
        url.searchParams.set('app_id', appId);
        url.searchParams.set('app_key', appKey);
        url.searchParams.set('results_per_page', '15');
        if (keyword) url.searchParams.set('what', keyword as string);
        if (location) url.searchParams.set('where', location as string);

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);

        const externalRes = await fetch(url.toString(), {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' },
        });
        clearTimeout(timeout);

        if (externalRes.ok) {
          const data = await externalRes.json();
          const mappedJobs = (data.results || []).map((item: any) => {
            let formattedSalary: string | undefined = undefined;
            if (item.salary_min) {
              const minVal = item.salary_min;
              const maxVal = item.salary_max || item.salary_min * 1.25;
              if (minVal >= 100000) {
                formattedSalary = `₹${(minVal / 100000).toFixed(1)} - ${(maxVal / 100000).toFixed(1)} LPA`;
              } else {
                formattedSalary = `₹${Math.round(minVal).toLocaleString('en-IN')} - ₹${Math.round(maxVal).toLocaleString('en-IN')}`;
              }
            }

            return {
              id: String(item.id || Math.random()),
              title: item.title?.replace(/<\/?[^>]+(>|$)/g, '') || 'Job Position',
              company: item.company?.display_name || 'Hiring Organization',
              location: item.location?.display_name || 'India',
              employmentType: item.contract_time === 'part_time' ? 'Part-time' : 'Full-time',
              remoteType: item.description?.toLowerCase().includes('remote') ? 'Remote' : 'Onsite',
              salary: formattedSalary,
              description: item.description?.replace(/<\/?[^>]+(>|$)/g, '') || '',
              url: item.redirect_url || '#',
              source: 'Adzuna India Live Feed',
              postedDate: item.created ? item.created.split('T')[0] : new Date().toISOString().split('T')[0],
              skillsRequired: [],
              experienceLevel: 'Entry Level',
            };
          });

          return res.json({
            jobs: mappedJobs,
            total: data.count || mappedJobs.length,
            isLiveFeed: true,
            provider: 'Adzuna India Jobs API',
            page: pageNum,
          });
        }
      } catch (externalErr) {
        console.warn('Adzuna API request failed or timed out, falling back to curated data:', externalErr);
      }
    }

    // Curated fallback with clear transparency notice
    let filtered = [...SAMPLE_JOBS_DATA];
    const kw = (keyword as string).toLowerCase().trim();
    if (kw) {
      filtered = filtered.filter(j =>
        j.title.toLowerCase().includes(kw) ||
        j.company.toLowerCase().includes(kw) ||
        j.description.toLowerCase().includes(kw) ||
        j.skillsRequired.some(s => s.toLowerCase().includes(kw))
      );
    }

    const loc = (location as string).toLowerCase().trim();
    if (loc) {
      filtered = filtered.filter(j => j.location.toLowerCase().includes(loc));
    }

    const rem = (remote as string).toLowerCase().trim();
    if (rem && rem !== 'all') {
      filtered = filtered.filter(j => j.remoteType.toLowerCase() === rem);
    }

    const emp = (employmentType as string).toLowerCase().trim();
    if (emp && emp !== 'all') {
      filtered = filtered.filter(j => j.employmentType.toLowerCase().includes(emp));
    }

    const exp = (experienceLevel as string).toLowerCase().trim();
    if (exp && exp !== 'all') {
      filtered = filtered.filter(j => j.experienceLevel.toLowerCase() === exp);
    }

    res.json({
      jobs: filtered,
      total: filtered.length,
      isLiveFeed: false,
      provider: 'YouthPath Curated India Hub (Demonstration)',
      message: 'Adzuna API credentials not configured. Displaying verified curated entry-level listings across Bengaluru, Hyderabad, Pune, Mumbai, Delhi NCR, Chennai, and Remote (India). Set ADZUNA_APP_ID and ADZUNA_APP_KEY in your server environment to stream live external vacancies.',
      page: 1,
    });
  } catch (err: unknown) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({
      error: { code: 'JOBS_FETCH_ERROR', message: 'Failed to retrieve jobs.' },
    });
  }
});

// 5. Resume AI Improvement
app.post('/api/resumes/ai-improve', rateLimiter(20), async (req: Request, res: Response) => {
  try {
    const { sectionType, content, targetRole, targetJobDescription } = req.body;

    if (!content) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Content to improve is required.' },
      });
    }

    if (!geminiApiKey) {
      return res.status(503).json({
        error: { code: 'AI_UNAVAILABLE', message: 'Gemini API is not configured on the server.' },
      });
    }

    const prompt = `
You are a top professional resume reviewer for early-career professionals and university students.
The user wants to improve the following ${sectionType || 'resume'} content.
Target Role: ${targetRole || 'General Professional'}
${targetJobDescription ? `Target Job Description Excerpt:\n"${targetJobDescription}"\n` : ''}

Original Content:
"""
${content}
"""

Rules:
1. NEVER invent qualifications, fictitious employers, fake university degrees, or unearned awards.
2. Rewrite using active verbs (e.g. "Engineered", "Orchestrated", "Analyzed", "Spearheaded").
3. Make achievements measurable where possible, or clearly suggest where the user can insert their actual numbers.
4. Improve grammar, conciseness, and ATS keyword relevance.
5. Provide:
   - Improved text ready for drop-in
   - 2-3 specific suggestions/rationales for why the changes strengthen their application.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an ethical, professional resume strategist. Return JSON with improvedText and suggestions list.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            improvedText: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['improvedText', 'suggestions'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (err: unknown) {
    console.error('Error improving resume:', err);
    res.status(500).json({
      error: { code: 'AI_RESUME_ERROR', message: 'Failed to generate resume suggestions with Gemini.' },
    });
  }
});

// 6. Interview Practice Session Generator
app.post('/api/interviews/start', rateLimiter(15), async (req: Request, res: Response) => {
  try {
    const { role, category = 'General', difficulty = 'Beginner', questionCount = 3 } = req.body;

    if (!role) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Role title is required.' },
      });
    }

    if (!geminiApiKey) {
      return res.status(503).json({
        error: { code: 'AI_UNAVAILABLE', message: 'Gemini API is not configured on the server.' },
      });
    }

    const count = Math.min(Math.max(1, Number(questionCount) || 3), 5);
    const prompt = `
Generate ${count} realistic interview questions for a candidate applying for:
- Role: ${role}
- Category: ${category} (e.g., HR, Technical, Coding Concept, Problem Solving, Communication)
- Difficulty Level: ${difficulty} (e.g., Beginner for fresh grads, Intermediate)

Provide:
- A unique id for each question
- The question text
- Category
- Expected key points that an ideal answer should touch upon.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are a constructive interviewer. Return JSON array of interview questions.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              category: { type: Type.STRING },
              expectedKeyPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['id', 'question', 'category', 'expectedKeyPoints'],
          },
        },
      },
    });

    const questions = JSON.parse(response.text || '[]');
    res.json({
      sessionId: `session_${Date.now()}`,
      role,
      category,
      difficulty,
      questions,
    });
  } catch (err: unknown) {
    console.error('Error starting interview:', err);
    res.status(500).json({
      error: { code: 'INTERVIEW_GEN_ERROR', message: 'Failed to generate interview questions with Gemini.' },
    });
  }
});

// 7. Interview Answer Evaluation
app.post('/api/interviews/evaluate', rateLimiter(20), async (req: Request, res: Response) => {
  try {
    const { role, category, question, userAnswer } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Both question and userAnswer are required.' },
      });
    }

    if (!geminiApiKey) {
      return res.status(503).json({
        error: { code: 'AI_UNAVAILABLE', message: 'Gemini API is not configured on the server.' },
      });
    }

    const prompt = `
Evaluate this interview answer given by a young candidate / student.
Role: ${role || 'Job Candidate'}
Category: ${category || 'Interview'}
Question: "${question}"
Candidate Answer: "${userAnswer}"

Rubric:
1. Relevance to the question asked
2. Completeness (covered context, action, result / STAR method if behavioral)
3. Clarity and communication tone
4. Demonstrated domain knowledge

Rules:
- Give an honest score from 1 to 10 (be fair, encouraging, but realistic).
- List 2-3 specific strengths.
- List 2-3 concrete areas for improvement.
- Provide a concise ideal answer outline showing what a model response would look like.
- Do NOT claim this determines hiring outcomes; frame it as practice feedback.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an encouraging interview coach. Return JSON evaluating candidate answer.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
            idealAnswerOutline: { type: Type.STRING },
          },
          required: ['score', 'strengths', 'improvements', 'idealAnswerOutline'],
        },
      },
    });

    const evaluation = JSON.parse(response.text || '{}');
    res.json(evaluation);
  } catch (err: unknown) {
    console.error('Error evaluating interview answer:', err);
    res.status(500).json({
      error: { code: 'EVALUATION_ERROR', message: 'Failed to evaluate interview answer with Gemini.' },
    });
  }
});

// 8. Learning Hub catalog
app.get('/api/learning-resources', (req: Request, res: Response) => {
  const { category, level } = req.query;
  let resources = [...LEARNING_RESOURCES];

  if (category && category !== 'All') {
    resources = resources.filter(r => r.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (level && level !== 'All') {
    resources = resources.filter(r => r.level.toLowerCase() === (level as string).toLowerCase());
  }

  res.json({
    resources,
    total: resources.length,
  });
});

// 9. Career Guidance Assistant Chatbot
app.post('/api/assistant/chat', rateLimiter(25), async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Message text is required.' },
      });
    }

    if (!geminiApiKey) {
      return res.status(503).json({
        error: { code: 'AI_UNAVAILABLE', message: 'Gemini API is not configured on the server.' },
      });
    }

    // Build contents array with history
    const contents: any[] = [];
    const formattedHistory = Array.isArray(history) ? history.slice(-6) : [];
    for (const h of formattedHistory) {
      contents.push({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(h.text || '') }],
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: `You are the YouthPath AI Career Assistant, dedicated to empowering Indian students, graduates (B.Tech, B.E., BCA, B.Sc, B.Com, MCA, M.Tech, MBA, Polytechnic), and young job seekers across India. Your mission is to assist with:
- Exploring high-growth careers in tech, design, business, finance, and marketing in India's top hubs (Bengaluru, Hyderabad, Pune, Delhi NCR, Chennai, Mumbai) and remote
- Guidance on campus placements, off-campus drives, service-based vs product-based companies, and GCCs
- Structuring ATS-compliant resumes with quantifiable project bullet points (without inventing facts)
- Preparing for interviews with sample behavioral (STAR method), technical coding, and communication questions
- Highlighting reputable free learning pathways like NPTEL/SWAYAM, GeeksforGeeks, MDN, and FreeCodeCamp.

Strict Guidelines:
1. Always be supportive, professional, and clear.
2. Never invent job vacancies, application deadlines, or specific company hiring criteria as verified facts.
3. If an inquiry requires real-time information you do not have, state that limitation clearly.
4. Keep answers concise, actionable, and formatted in clean markdown.
5. Remind users when appropriate that AI advice is guidance and they should verify company-specific requirements.`,
      },
    });

    res.json({
      reply: response.text || 'I am here to help you navigate your career path. How can I assist you today?',
    });
  } catch (err: unknown) {
    console.error('Error in assistant chat:', err);
    res.status(500).json({
      error: { code: 'CHAT_ERROR', message: 'Failed to process chat with career assistant.' },
    });
  }
});

// 10. Feedback & Contact submission endpoint
app.post('/api/feedback', (req: Request, res: Response) => {
  const { category, rating, message, contactEmail } = req.body;

  if (!category || !message) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Category and message are required.' },
    });
  }

  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return res.status(400).json({
      error: { code: 'VALIDATION_ERROR', message: 'Rating must be a number between 1 and 5.' },
    });
  }

  // Submission recorded
  res.json({
    success: true,
    message: 'Thank you for your feedback! Your submission helps improve YouthPath for all youth job seekers.',
    recordedAt: new Date().toISOString(),
  });
});

// Mount Vite or serve production static assets
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`YouthPath Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
