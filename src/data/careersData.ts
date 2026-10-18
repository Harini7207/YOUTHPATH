import { CareerTrack } from '../types';

export const CAREER_TRACKS: CareerTrack[] = [
  {
    id: 'software-dev',
    title: 'Software Engineer',
    category: 'Tech',
    description: 'Design, write, and maintain robust software applications and system architectures using modern programming languages and software engineering principles.',
    commonResponsibilities: [
      'Write modular, well-tested code for backend services, APIs, and business logic',
      'Collaborate with product teams to translate requirements into technical specifications',
      'Debug application issues, analyze logs, and optimize system performance',
      'Participate in code reviews, automated testing, and CI/CD deployment pipelines'
    ],
    keyTechnicalSkills: ['Data Structures & Algorithms', 'TypeScript / JavaScript', 'Python / Java / Go', 'SQL Databases', 'RESTful APIs', 'Git'],
    keySoftSkills: ['Logical Problem Solving', 'Active Communication', 'Team Collaboration', 'Curiosity to Learn'],
    educationGuidance: 'Degree in Computer Science, Software Engineering, or equivalent practical coding bootcamp and project portfolio.',
    learningRoadmap: [
      { stage: 'Foundations', duration: '4-6 weeks', topics: ['Algorithmic Thinking', 'Object-Oriented Design', 'Git Version Control'] },
      { stage: 'Core Development', duration: '6-8 weeks', topics: ['Database Schema Design', 'API Development', 'Testing with Vitest/Jest'] },
      { stage: 'Production Readiness', duration: '4-6 weeks', topics: ['Cloud Deployment Basics', 'Docker Containers', 'System Architecture'] }
    ],
    certifications: ['AWS Certified Developer Associate', 'GitHub Foundations', 'Oracle Certified Java Associate'],
    exampleProjects: [
      {
        title: 'Task Automation Microservice',
        description: 'A REST API service that schedules asynchronous background jobs with email dispatch and rate limiting.',
        skillsApplied: ['Node.js / Express', 'PostgreSQL', 'Redis', 'Unit Testing']
      },
      {
        title: 'Real-time Event Tracker',
        description: 'High-throughput event logging service with search indexing and metrics aggregation.',
        skillsApplied: ['Python', 'SQL', 'FastAPI', 'Docker']
      }
    ],
    entryLevelTitles: ['Junior Software Engineer', 'Associate Software Developer', 'Graduate Software Engineer'],
    interviewTips: [
      'Practice explaining your thought process clearly before writing code in data structures problems',
      'Be prepared to discuss tradeoffs you made in your student/capstone projects',
      'Understand how HTTP methods, status codes, and database indexing work'
    ],
    recommendedResources: [
      { title: 'Full Stack Open', provider: 'University of Helsinki', url: 'https://fullstackopen.com/en/', isFree: true },
      { title: 'LeetCode Problem Sets', provider: 'LeetCode', url: 'https://leetcode.com', isFree: true },
      { title: 'Clean Code Architecture Guide', provider: 'Martin Fowler Guide', url: 'https://martinfowler.com', isFree: true }
    ]
  },
  {
    id: 'web-dev',
    title: 'Web Developer (Frontend & Full-Stack)',
    category: 'Tech',
    description: 'Build responsive, accessible, high-performance web applications that provide intuitive user experiences on desktop and mobile devices.',
    commonResponsibilities: [
      'Construct reactive UI components with React, TypeScript, and modern CSS/Tailwind',
      'Integrate frontend applications with REST/GraphQL backend services',
      'Ensure WCAG AA accessibility, cross-browser compatibility, and mobile responsiveness',
      'Optimize web performance, Core Web Vitals, and bundle sizes'
    ],
    keyTechnicalSkills: ['HTML5 & Semantic Web', 'Tailwind CSS / Modern CSS', 'React & TypeScript', 'State Management', 'REST APIs', 'Vite / Next.js'],
    keySoftSkills: ['Eye for Visual Detail', 'User Empathy', 'Cross-functional Communication', 'Adaptability'],
    educationGuidance: 'Degree in CS, Information Systems, Interactive Media, or self-taught with a live production portfolio of accessible web apps.',
    learningRoadmap: [
      { stage: 'Web Essentials', duration: '3-4 weeks', topics: ['Semantic HTML5', 'CSS Flexbox/Grid', 'DOM & Modern JavaScript ES6+'] },
      { stage: 'React & TypeScript', duration: '6-8 weeks', topics: ['React Hooks', 'State Architecture', 'TypeScript Typing', 'Tailwind CSS'] },
      { stage: 'Full-Stack Integration', duration: '4-6 weeks', topics: ['Server-side Rendering', 'Authentication Integration', 'API Route Handlers'] }
    ],
    certifications: ['Meta Front-End Developer Certificate', 'freeCodeCamp Full Stack Certificate'],
    exampleProjects: [
      {
        title: 'Accessible Job Search Portal',
        description: 'Single-page web application featuring live filtering, keyboard navigation, and bookmark persistence.',
        skillsApplied: ['React', 'TypeScript', 'Tailwind CSS', 'Accessible ARIA']
      },
      {
        title: 'Collaborative Study Planner',
        description: 'Interactive dashboard with drag-and-drop course organizing and local sync.',
        skillsApplied: ['React', 'LocalStorage/IndexedDB', 'Tailwind', 'Vite']
      }
    ],
    entryLevelTitles: ['Junior Web Developer', 'Front-End Developer I', 'Associate Full-Stack Developer'],
    interviewTips: [
      'Be ready to demonstrate how the React lifecycle and hook dependencies operate',
      'Know the differences between server-side rendering, client-side rendering, and static site generation',
      'Explain how you ensure your interfaces are accessible to screen readers'
    ],
    recommendedResources: [
      { title: 'MDN Web Docs', provider: 'Mozilla Developer Network', url: 'https://developer.mozilla.org', isFree: true },
      { title: 'React Official Documentation', provider: 'React Team', url: 'https://react.dev', isFree: true }
    ]
  },
  {
    id: 'data-analytics',
    title: 'Data Analyst',
    category: 'Data & AI',
    description: 'Transform complex raw datasets into actionable business intelligence, interactive dashboards, and strategic recommendations for stakeholders.',
    commonResponsibilities: [
      'Extract, clean, and validate data from SQL databases and analytical warehouses',
      'Build dynamic dashboards and KPI monitoring tools in PowerBI, Tableau, or Metabase',
      'Perform exploratory data analysis to detect trends, anomalies, and operational efficiencies',
      'Present findings and data-driven recommendations to non-technical business leaders'
    ],
    keyTechnicalSkills: ['SQL (Joins, CTEs, Window Functions)', 'Python (Pandas, NumPy)', 'Data Visualization (Tableau / PowerBI)', 'Excel Modeling', 'Statistical Analysis'],
    keySoftSkills: ['Analytical Rigor', 'Data Storytelling', 'Curiosity', 'Business Acumen'],
    educationGuidance: 'Degree in Data Science, Statistics, Mathematics, Economics, Computer Science, or Business Analytics.',
    learningRoadmap: [
      { stage: 'Data Wrangling', duration: '4 weeks', topics: ['Advanced SQL Queries', 'Relational Schemas', 'Excel Data Cleaning'] },
      { stage: 'Python & Analysis', duration: '6 weeks', topics: ['Pandas', 'NumPy', 'Jupyter Notebooks', 'Exploratory Analysis'] },
      { stage: 'Visualization & Storytelling', duration: '4 weeks', topics: ['Dashboard Design', 'Metric Definitions', 'Executive Presentation'] }
    ],
    certifications: ['Google Data Analytics Professional Certificate', 'Microsoft Certified: Power BI Data Analyst Associate'],
    exampleProjects: [
      {
        title: 'Graduate Employment Trends Report',
        description: 'Interactive dashboard analyzing university graduate hiring rates, industry distribution, and salary benchmarks.',
        skillsApplied: ['SQL', 'Python (Pandas)', 'PowerBI / Streamlit', 'Data Cleaning']
      }
    ],
    entryLevelTitles: ['Junior Data Analyst', 'Business Intelligence Analyst I', 'Data Operations Associate'],
    interviewTips: [
      'Be prepared to write SQL live (joins, group by, window functions like RANK/ROW_NUMBER)',
      'Prepare a story about an unexpected insight you discovered in messy data',
      'Know the difference between correlation and causation in business metrics'
    ],
    recommendedResources: [
      { title: 'Mode Analytics SQL Tutorial', provider: 'Mode Analytics', url: 'https://mode.com/sql-tutorial/', isFree: true },
      { title: 'Kaggle Micro-Courses', provider: 'Kaggle', url: 'https://www.kaggle.com/learn', isFree: true }
    ]
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI & Machine Learning Engineer',
    category: 'Data & AI',
    description: 'Develop, fine-tune, and deploy machine learning models and generative AI systems to automate processes, make predictions, and extract insights.',
    commonResponsibilities: [
      'Preprocess large training datasets, handle vector embeddings, and design pipelines',
      'Train, evaluate, and benchmark deep learning models and LLM integrations',
      'Deploy AI services via production APIs with low latency and safety filters',
      'Monitor model drift, hallucination rates, and performance benchmarks'
    ],
    keyTechnicalSkills: ['Python & PyTorch / TensorFlow', 'LLM API Integration & RAG', 'Vector Databases', 'Scikit-Learn', 'Math (Linear Algebra, Calculus)', 'MLOps Basics'],
    keySoftSkills: ['Scientific Rigor', 'Ethics in AI', 'Critical Thinking', 'Patience with Iteration'],
    educationGuidance: 'Degree in Computer Science, Artificial Intelligence, Mathematics, Electrical Engineering, or specialized AI graduate work.',
    learningRoadmap: [
      { stage: 'Math & Classic ML', duration: '6-8 weeks', topics: ['Linear Algebra', 'Regression & Classification', 'Scikit-Learn'] },
      { stage: 'Deep Learning & Neural Networks', duration: '8 weeks', topics: ['PyTorch Foundations', 'Transformers', 'Embeddings'] },
      { stage: 'Applied GenAI & MLOps', duration: '6 weeks', topics: ['RAG Architectures', 'Model Deployment', 'Prompt Engineering & Evaluation'] }
    ],
    certifications: ['AWS Certified Machine Learning - Specialty', 'Google Cloud Professional Machine Learning Engineer'],
    exampleProjects: [
      {
        title: 'Intelligent Resume Screener & Skill Matcher',
        description: 'Semantic vector search tool comparing candidate resumes against job descriptions with explanation rubrics.',
        skillsApplied: ['Python', 'Embeddings', 'LangChain / GenAI SDK', 'FastAPI']
      }
    ],
    entryLevelTitles: ['Associate Machine Learning Engineer', 'Junior AI Developer', 'Data Scientist I'],
    interviewTips: [
      'Be comfortable explaining loss functions, overfitting/underfitting, and regularization',
      'Explain how attention mechanisms work in modern transformer architectures',
      'Discuss how you evaluate generative AI applications beyond simple accuracy'
    ],
    recommendedResources: [
      { title: 'DeepLearning.AI Courses', provider: 'DeepLearning.AI', url: 'https://www.deeplearning.ai', isFree: true },
      { title: 'Hugging Face NLP Course', provider: 'Hugging Face', url: 'https://huggingface.co/learn', isFree: true }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Analyst',
    category: 'Tech',
    description: 'Protect organizational networks, cloud systems, and sensitive user data from cyber threats, vulnerabilities, and security breaches.',
    commonResponsibilities: [
      'Monitor Security Information and Event Management (SIEM) systems for security alerts',
      'Conduct vulnerability assessments, threat analysis, and penetration tests',
      'Enforce identity access management (IAM), zero-trust policies, and encryption standards',
      'Assist with incident response procedures, forensic investigation, and compliance auditing'
    ],
    keyTechnicalSkills: ['Network Protocols (TCP/IP, DNS, SSL/TLS)', 'Linux Security & Scripting (Bash, Python)', 'SIEM Tools (Splunk / Elastic)', 'OWASP Top 10', 'Firewalls & IAM'],
    keySoftSkills: ['Integrity', 'Calm Under Pressure', 'Investigative Mindset', 'Attention to Discrepancies'],
    educationGuidance: 'Degree in Cybersecurity, Computer Networks, Information Technology, or relevant security certifications.',
    learningRoadmap: [
      { stage: 'Networking & OS Core', duration: '5 weeks', topics: ['Network Packets', 'Linux Administration', 'Cryptography Basics'] },
      { stage: 'Security Defense & Analysis', duration: '6 weeks', topics: ['Vulnerability Scanning', 'SIEM Monitoring', 'Threat Modeling'] },
      { stage: 'Incident Response & Governance', duration: '4 weeks', topics: ['Incident Handling', 'SOC Workflows', 'Compliance (ISO 27001, NIST)'] }
    ],
    certifications: ['CompTIA Security+', 'Certified in Cybersecurity (ISC2 CC)', 'GIAC Information Security Fundamentals (GISF)'],
    exampleProjects: [
      {
        title: 'Vulnerability Assessment Lab',
        description: 'Simulated network penetration testing and hardening report detailing CVE patches and firewall rule sets.',
        skillsApplied: ['Wireshark', 'Nmap', 'Linux', 'Security Hardening']
      }
    ],
    entryLevelTitles: ['Junior SOC Analyst', 'Cybersecurity Associate', 'Information Security Specialist I'],
    interviewTips: [
      'Demonstrate deep knowledge of the OSI model and common attack vectors (phishing, SQL injection, XSS)',
      'Explain how public-key cryptography and digital certificates establish secure communication',
      'Detail the steps you would take upon detecting an unauthorized breach attempt'
    ],
    recommendedResources: [
      { title: 'TryHackMe Cyber Defense Labs', provider: 'TryHackMe', url: 'https://tryhackme.com', isFree: true },
      { title: 'CISA Free Security Toolkits', provider: 'CISA', url: 'https://www.cisa.gov', isFree: true }
    ]
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps Engineer',
    category: 'Tech',
    description: 'Automate build, deployment, and infrastructure processes across public cloud platforms to ensure reliable, high-availability software delivery.',
    commonResponsibilities: [
      'Provision and manage cloud infrastructure using Infrastructure as Code (Terraform)',
      'Build and maintain continuous integration and continuous deployment (CI/CD) pipelines',
      'Containerize applications with Docker and orchestrate services with Kubernetes',
      'Implement system observability, metrics monitoring, and uptime alert systems'
    ],
    keyTechnicalSkills: ['Linux System Administration', 'Docker & Containerization', 'CI/CD (GitHub Actions / GitLab)', 'Terraform / CloudFormation', 'AWS / Google Cloud / Azure', 'Prometheus & Grafana'],
    keySoftSkills: ['Automation-First Mindset', 'Cross-Team Communication', 'Disaster Recovery Thinking'],
    educationGuidance: 'Degree in Computer Science, Systems Engineering, or proven cloud certifications and infrastructure portfolio.',
    learningRoadmap: [
      { stage: 'Linux & Scripting', duration: '4 weeks', topics: ['Shell Scripting', 'SSH & Networking', 'Systemd Services'] },
      { stage: 'Containers & CI/CD', duration: '6 weeks', topics: ['Docker Multi-stage Builds', 'GitHub Actions Pipelines', 'Automated Testing'] },
      { stage: 'Cloud & IaC', duration: '6 weeks', topics: ['Terraform Provisioning', 'VPC & Subnets', 'Kubernetes Architecture'] }
    ],
    certifications: ['AWS Certified Solutions Architect Associate', 'CKA: Certified Kubernetes Administrator', 'HashiCorp Certified Terraform Associate'],
    exampleProjects: [
      {
        title: 'Zero-Downtime Microservice Pipeline',
        description: 'Automated CI/CD workflow deploying a containerized application with automated health checks and rollbacks.',
        skillsApplied: ['Docker', 'GitHub Actions', 'Terraform', 'AWS/GCP']
      }
    ],
    entryLevelTitles: ['Junior DevOps Engineer', 'Cloud Systems Associate', 'Junior Site Reliability Engineer'],
    interviewTips: [
      'Understand the lifecycle of a container from Dockerfile to registry to cluster',
      'Be able to explain blue-green versus canary deployment strategies',
      'Explain how you would troubleshoot a service failing with HTTP 502/504 errors'
    ],
    recommendedResources: [
      { title: 'Roadmap.sh DevOps Guide', provider: 'Roadmap.sh', url: 'https://roadmap.sh/devops', isFree: true },
      { title: 'Docker Official Getting Started', provider: 'Docker', url: 'https://docs.docker.com/get-started/', isFree: true }
    ]
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX & Product Designer',
    category: 'Design',
    description: 'Craft beautiful, accessible, and intuitive digital interfaces and user journeys grounded in user research, wireframing, and design systems.',
    commonResponsibilities: [
      'Conduct user interviews, usability testing, and qualitative UX research',
      'Create wireframes, user task flows, interactive prototypes, and high-fidelity mockups in Figma',
      'Build and maintain scalable design systems with tokens, variants, and accessibility standards',
      'Collaborate closely with frontend engineers to ensure design fidelity in code'
    ],
    keyTechnicalSkills: ['Figma / FigJam', 'Wireframing & Prototyping', 'Design Systems & Tokens', 'User Research & Personas', 'WCAG Accessibility Standards', 'Information Architecture'],
    keySoftSkills: ['Empathy', 'Visual Taste', 'Constructive Critique Receptivity', 'Storytelling'],
    educationGuidance: 'Degree in Human-Computer Interaction (HCI), Graphic Design, Digital Media, or a strong case-study portfolio.',
    learningRoadmap: [
      { stage: 'UX Foundations & Research', duration: '4 weeks', topics: ['User Journeys', 'Card Sorting', 'Usability Testing', 'Heuristic Evaluation'] },
      { stage: 'UI Craft & Design Systems', duration: '6 weeks', topics: ['Figma Auto-Layout & Components', 'Typography & Color Math', 'Micro-interactions'] },
      { stage: 'Portfolio Case Studies', duration: '4 weeks', topics: ['End-to-End Problem Solving', 'Engineering Hand-off', 'Case Study Presentation'] }
    ],
    certifications: ['Google UX Design Professional Certificate', 'Nielsen Norman Group UX Master Certification'],
    exampleProjects: [
      {
        title: 'Youth Career Navigation Mobile App',
        description: 'Full design case study with user research interviews, wireframes, accessible color system, and interactive Figma prototype.',
        skillsApplied: ['Figma', 'UX Research', 'Design System', 'Usability Testing']
      }
    ],
    entryLevelTitles: ['Junior UX Designer', 'Associate UI Designer', 'Product Design Apprentice'],
    interviewTips: [
      'Walk through your case study emphasizing why you made specific design choices, not just what it looks like',
      'Demonstrate how you accommodated accessibility constraints (contrast, touch targets)',
      'Show how you incorporated user testing feedback to pivot an initial concept'
    ],
    recommendedResources: [
      { title: 'Laws of UX', provider: 'Jon Yablonski', url: 'https://lawsofux.com', isFree: true },
      { title: 'Figma Community Design System Kits', provider: 'Figma', url: 'https://figma.com/community', isFree: true }
    ]
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing & Growth Specialist',
    category: 'Marketing & Content',
    description: 'Drive brand awareness, organic engagement, and qualified user acquisition across search engines, social channels, and content platforms.',
    commonResponsibilities: [
      'Manage multi-channel content strategies, SEO optimization, and email marketing campaigns',
      'Analyze campaign metrics (CAC, LTV, CTR, conversion rates) with Google Analytics',
      'Conduct keyword research, competitive landscape analysis, and on-page optimization',
      'Run A/B tests on landing pages, ad copy, and email subject lines'
    ],
    keyTechnicalSkills: ['Search Engine Optimization (SEO)', 'Google Analytics 4', 'Content Strategy & Copywriting', 'Email Marketing (Mailchimp/Klaviyo)', 'Social Media Management', 'A/B Testing'],
    keySoftSkills: ['Persuasive Writing', 'Analytical Mindset', 'Creative Experimentation', 'Trend Awareness'],
    educationGuidance: 'Degree in Marketing, Communications, Business Administration, or verified digital marketing certifications.',
    learningRoadmap: [
      { stage: 'Fundamentals of Marketing', duration: '3 weeks', topics: ['Marketing Funnels', 'Audience Personas', 'Value Propositions'] },
      { stage: 'SEO & Content Marketing', duration: '5 weeks', topics: ['Keyword Research', 'Technical SEO', 'Content Calendars', 'Copywriting'] },
      { stage: 'Analytics & Paid Channels', duration: '4 weeks', topics: ['GA4 Event Tracking', 'Meta/Google Ads Basics', 'Conversion Rate Optimization'] }
    ],
    certifications: ['HubSpot Inbound Marketing Certification', 'Google Analytics 4 Certification', 'Meta Certified Digital Marketing Associate'],
    exampleProjects: [
      {
        title: 'Student Startup Growth Campaign',
        description: 'End-to-end inbound marketing plan with SEO pillar articles, email welcome sequence, and analytics tracking.',
        skillsApplied: ['SEO', 'Copywriting', 'GA4', 'Conversion Optimization']
      }
    ],
    entryLevelTitles: ['Digital Marketing Associate', 'Content & SEO Coordinator', 'Junior Growth Specialist'],
    interviewTips: [
      'Be prepared to discuss concrete metrics from past projects (e.g. increase in CTR, organic traffic growth)',
      'Explain how you research target audiences and uncover high-intent search keywords',
      'Share how you test different hypotheses using rapid A/B experiments'
    ],
    recommendedResources: [
      { title: 'HubSpot Academy', provider: 'HubSpot', url: 'https://academy.hubspot.com', isFree: true },
      { title: 'Google Digital Garage', provider: 'Google', url: 'https://learndigital.withgoogle.com', isFree: true }
    ]
  },
  {
    id: 'hr-talent',
    title: 'Human Resources & Talent Acquisition',
    category: 'Business & Operations',
    description: 'Source, recruit, onboard, and support talent while cultivating an inclusive, productive, and compliant organizational culture.',
    commonResponsibilities: [
      'Source candidate pipelines through LinkedIn, university career fairs, and job boards',
      'Coordinate interview schedules, conduct phone screens, and communicate hiring decisions',
      'Facilitate employee onboarding, training workshops, and performance appraisal cycles',
      'Ensure compliance with labor standards, equal employment policies, and benefits administration'
    ],
    keyTechnicalSkills: ['Applicant Tracking Systems (ATS)', 'LinkedIn Recruiter', 'Labor Law Foundations', 'HRIS Systems (Workday/BambooHR)', 'Structured Interviewing', 'Diversity & Inclusion Principles'],
    keySoftSkills: ['Active Listening', 'High Empathy & Discretion', 'Conflict Resolution', 'Relationship Building'],
    educationGuidance: 'Degree in Human Resource Management, Psychology, Business Administration, or Sociology.',
    learningRoadmap: [
      { stage: 'HR Core & Employment Law', duration: '4 weeks', topics: ['Equal Employment Opportunity', 'Labor Standards', 'Employee Relations'] },
      { stage: 'Recruitment & Sourcing', duration: '5 weeks', topics: ['Boolean Search Sourcing', 'Behavioral Interviewing', 'Candidate Experience'] },
      { stage: 'People Operations', duration: '4 weeks', topics: ['Onboarding Design', 'Performance Feedback', 'Culture & Retention'] }
    ],
    certifications: ['SHRM Certified Professional (SHRM-CP)', 'aPHR: Associate Professional in Human Resources'],
    exampleProjects: [
      {
        title: 'University Graduate Recruitment Playbook',
        description: 'Comprehensive hiring guide with structured rubric questions, bias mitigation checks, and candidate communication templates.',
        skillsApplied: ['Talent Sourcing', 'Interview Rubrics', 'Onboarding Workflows']
      }
    ],
    entryLevelTitles: ['Talent Acquisition Coordinator', 'HR Assistant', 'People Operations Associate'],
    interviewTips: [
      'Practice explaining behavioral interview frameworks (STAR method)',
      'Demonstrate how you handle sensitive, confidential candidate or employee matters with discretion',
      'Explain your strategy for building diverse and equitable talent candidate pools'
    ],
    recommendedResources: [
      { title: 'SHRM Student Resources', provider: 'SHRM', url: 'https://www.shrm.org', isFree: true },
      { title: 'Workable Recruitment Guides', provider: 'Workable', url: 'https://resources.workable.com', isFree: true }
    ]
  },
  {
    id: 'sales-bizdev',
    title: 'Sales & Business Development',
    category: 'Business & Operations',
    description: 'Identify commercial opportunities, engage potential enterprise clients, conduct product demonstrations, and close revenue partnerships.',
    commonResponsibilities: [
      'Prospect and qualify inbound leads and conduct outbound research on target accounts',
      'Conduct discovery calls to identify prospect business pain points and operational requirements',
      'Deliver tailored product presentations and value proposition demonstrations',
      'Manage CRM pipelines (Salesforce / HubSpot) to accurately track deals and forecast revenue'
    ],
    keyTechnicalSkills: ['CRM Tools (Salesforce, HubSpot)', 'Cold Outreach & Prospecting', 'B2B Solution Selling', 'Pipeline Forecasting', 'Contract Negotiation Basics'],
    keySoftSkills: ['Resilience & Grit', 'Persuasion', 'Active Listening', 'Confidence'],
    educationGuidance: 'Degree in Business, Communications, Economics, or any field with demonstrated competitive drive and interpersonal skills.',
    learningRoadmap: [
      { stage: 'Sales Fundamentals', duration: '3 weeks', topics: ['B2B Sales Cycles', 'Lead Qualification (BANT / MEDDIC)', 'Value Selling'] },
      { stage: 'Prospecting & Outreach', duration: '4 weeks', topics: ['Cold Email/Call Strategy', 'Social Selling on LinkedIn', 'Discovery Calling'] },
      { stage: 'Closing & Objection Handling', duration: '4 weeks', topics: ['Overcoming Objections', 'Demos that Convert', 'CRM Hygiene'] }
    ],
    certifications: ['HubSpot Inbound Sales Certification', 'Salesforce Certified Associate'],
    exampleProjects: [
      {
        title: 'SaaS Outbound Prospecting Campaign',
        description: 'Strategic market research identifying 100 ICP accounts with tailored value messaging and discovery call scripts.',
        skillsApplied: ['CRM Pipeline', 'Lead Qualification', 'Value Proposition']
      }
    ],
    entryLevelTitles: ['Business Development Representative (BDR)', 'Sales Development Representative (SDR)', 'Account Coordinator'],
    interviewTips: [
      'Be ready to perform a roleplay discovery call or sell a product live during the interview',
      'Show that you handle rejection positively and maintain consistent daily outreach activity',
      'Demonstrate deep research on the hiring company’s product and target customer base'
    ],
    recommendedResources: [
      { title: 'SalesHacker Articles & Webinars', provider: 'SalesHacker', url: 'https://www.saleshacker.com', isFree: true }
    ]
  },
  {
    id: 'finance-banking',
    title: 'Financial & Investment Analyst',
    category: 'Business & Operations',
    description: 'Evaluate financial statements, build quantitative valuation models, and assess commercial investments and corporate performance.',
    commonResponsibilities: [
      'Build 3-statement financial models, discounted cash flow (DCF) analyses, and variance reports',
      'Examine financial statements (10-K, 10-Q) for profitability, liquidity, and solvency metrics',
      'Track macroeconomic indicators, industry benchmarks, and market competitor valuations',
      'Prepare investment memos, executive slide decks, and quarterly management briefings'
    ],
    keyTechnicalSkills: ['Financial Modeling & DCF', 'Advanced Excel (VLOOKUP, INDEX/MATCH, Macros)', 'Financial Statement Analysis', 'PowerPoint Presentation', 'Bloomberg / Capital IQ Basics', 'SQL / Python for Finance'],
    keySoftSkills: ['Attention to Detail', 'Quantitative Logic', 'High Work Ethic', 'Clear Writing'],
    educationGuidance: 'Degree in Finance, Accounting, Economics, Applied Mathematics, or Actuarial Science.',
    learningRoadmap: [
      { stage: 'Accounting & Statements', duration: '4 weeks', topics: ['Income Statement, Balance Sheet, Cash Flow Linkages', 'Working Capital'] },
      { stage: 'Valuation & Modeling', duration: '6 weeks', topics: ['DCF Modeling', 'Comparable Company Analysis', 'Precedent Transactions'] },
      { stage: 'Corporate Finance & Reporting', duration: '4 weeks', topics: ['Capital Budgeting', 'WACC Calculations', 'Executive Pitch Decks'] }
    ],
    certifications: ['CFA Investment Foundations / CFA Level I', 'Financial Modeling and Valuation Analyst (FMVA)'],
    exampleProjects: [
      {
        title: 'Public Tech Company Equity Valuation',
        description: 'Comprehensive financial model forecasting 5-year revenues, cash flows, and terminal valuation with sensitivity analysis.',
        skillsApplied: ['Excel Financial Modeling', 'DCF', 'Statement Analysis']
      }
    ],
    entryLevelTitles: ['Junior Financial Analyst', 'Investment Banking Analyst I', 'Corporate FP&A Associate'],
    interviewTips: [
      'Master the links between the three financial statements (e.g. how a ₹1,000 depreciation adjustment affects all three)',
      'Be able to walk an interviewer through a DCF step-by-step from unlevered free cash flow to enterprise value',
      'Demonstrate awareness of current capital markets, interest rate trends, and macroeconomic developments'
    ],
    recommendedResources: [
      { title: 'Investopedia Educational Hub', provider: 'Investopedia', url: 'https://www.investopedia.com', isFree: true },
      { title: 'Corporate Finance Institute Free Courses', provider: 'CFI', url: 'https://corporatefinanceinstitute.com', isFree: true }
    ]
  },
  {
    id: 'content-writer',
    title: 'Technical Writer & Content Strategist',
    category: 'Marketing & Content',
    description: 'Transform complex technical concepts, product workflows, and software architectures into clear, concise, and accessible documentation and articles.',
    commonResponsibilities: [
      'Author user manuals, developer API reference documentation, and step-by-step onboarding guides',
      'Interview engineers, product managers, and subject matter experts to gather technical specifications',
      'Standardize terminology, maintain style guides, and audit existing documentation for clarity',
      'Write in-depth thought leadership articles, case studies, and release notes'
    ],
    keyTechnicalSkills: ['Technical Documentation', 'Markdown & Docs-as-Code (Git)', 'API Documentation (Swagger/OpenAPI)', 'Content Management Systems (CMS)', 'SEO Best Practices'],
    keySoftSkills: ['Precision of Expression', 'Curiosity', 'Simplification of Complex Ideas', 'Empathy for Beginners'],
    educationGuidance: 'Degree in English, Technical Communication, Journalism, Computer Science, or verified portfolio of published technical writing.',
    learningRoadmap: [
      { stage: 'Writing Craft & Structure', duration: '3 weeks', topics: ['Clarity and Brevity', 'Information Architecture', 'Chicago Manual / Microsoft Style'] },
      { stage: 'Docs as Code & Tools', duration: '5 weeks', topics: ['Git Workflows', 'Markdown/MDX', 'Static Site Generators (Docusaurus)', 'API Docs'] },
      { stage: 'Content Strategy', duration: '4 weeks', topics: ['User Persona Mapping', 'Content Audits', 'SEO Strategy'] }
    ],
    certifications: ['Google Technical Writing Course Certification', 'Society for Technical Communication (STC) Associate'],
    exampleProjects: [
      {
        title: 'Open Source Developer Documentation',
        description: 'Complete documentation portal for a REST API including quickstart guide, code samples in multiple languages, and error reference.',
        skillsApplied: ['Markdown', 'OpenAPI/Swagger', 'Docs-as-Code', 'Git']
      }
    ],
    entryLevelTitles: ['Associate Technical Writer', 'Content Writer I', 'Documentation Specialist'],
    interviewTips: [
      'Provide 2-3 writing samples that take a difficult technical concept and make it easy to understand',
      'Explain your process for interviewing developers who may have limited time to explain code',
      'Know the basics of Docs-as-Code (Git, Markdown, pull request review workflows)'
    ],
    recommendedResources: [
      { title: 'Google Technical Writing One and Two', provider: 'Google', url: 'https://developers.google.com/tech-writing', isFree: true },
      { title: 'Write the Docs Community', provider: 'Write the Docs', url: 'https://www.writethedocs.org', isFree: true }
    ]
  },
  {
    id: 'operations-management',
    title: 'Business Operations & Project Coordinator',
    category: 'Business & Operations',
    description: 'Coordinate cross-functional business initiatives, optimize organizational workflows, and ensure on-time delivery of strategic company projects.',
    commonResponsibilities: [
      'Track project milestones, deliverables, sprint schedules, and budget allocations using Agile frameworks',
      'Identify operational bottlenecks, streamline manual workflows, and document SOPs',
      'Facilitate team meetings, daily standups, sprint retrospectives, and stakeholder status updates',
      'Manage change management and communication across departmental boundaries'
    ],
    keyTechnicalSkills: ['Project Management Tools (Jira, Asana, Notion)', 'Agile & Scrum Methodologies', 'Process Mapping (BPMN / Lucidchart)', 'Spreadsheet Modeling', 'KPI Dashboard Monitoring'],
    keySoftSkills: ['Organization', 'Proactive Communication', 'Time Management', 'Conflict Mediation'],
    educationGuidance: 'Degree in Business Administration, Operations Management, Industrial Engineering, or certified project management coursework.',
    learningRoadmap: [
      { stage: 'Operations Foundations', duration: '4 weeks', topics: ['Process Optimization', 'Lean Methodologies', 'Workflow Mapping'] },
      { stage: 'Agile & Project Frameworks', duration: '5 weeks', topics: ['Scrum Ceremonies', 'Sprint Planning', 'Jira Administration'] },
      { stage: 'Stakeholder & Risk Management', duration: '4 weeks', topics: ['Risk Matrices', 'Change Management', 'Executive Reporting'] }
    ],
    certifications: ['Certified Associate in Project Management (CAPM)', 'Google Project Management Professional Certificate', 'Scrum Alliance Certified ScrumMaster (CSM)'],
    exampleProjects: [
      {
        title: 'Cross-Functional Product Launch Blueprint',
        description: 'Comprehensive project management schedule with Gantt charts, RACI matrix, risk register, and retrospectives.',
        skillsApplied: ['Jira', 'Agile/Scrum', 'RACI Matrix', 'Process Mapping']
      }
    ],
    entryLevelTitles: ['Project Coordinator', 'Junior Operations Analyst', 'Associate Scrum Master'],
    interviewTips: [
      'Be prepared to describe how you manage competing priorities when deadlines conflict',
      'Explain the difference between Agile, Waterfall, and hybrid project methodologies',
      'Demonstrate how you track deliverables and communicate transparently when risks arise'
    ],
    recommendedResources: [
      { title: 'Scrum.org Open Assessments', provider: 'Scrum.org', url: 'https://www.scrum.org/open-assessments', isFree: true },
      { title: 'Atlassian Agile Coach Guides', provider: 'Atlassian', url: 'https://www.atlassian.com/agile', isFree: true }
    ]
  },
  {
    id: 'customer-success',
    title: 'Customer Success & Client Specialist',
    category: 'Business & Operations',
    description: 'Ensure client satisfaction, drive product adoption, resolve complex customer challenges, and foster long-term account retention.',
    commonResponsibilities: [
      'Lead customer onboarding journeys, product walkthroughs, and user training sessions',
      'Address technical inquiries, troubleshoot customer issues, and collaborate with engineering on bugs',
      'Monitor client health scores, churn indicators, and usage analytics to proactively offer support',
      'Advocate for customer needs by providing feedback to internal product development teams'
    ],
    keyTechnicalSkills: ['Helpdesk Software (Zendesk / Intercom)', 'Customer Success Platforms (Gainsight / Vitally)', 'CRM Systems', 'Basic Technical Troubleshooting (Browser DevTools, APIs)'],
    keySoftSkills: ['Empathetic Communication', 'De-escalation Skills', 'Problem Solving', 'Customer Advocacy'],
    educationGuidance: 'Degree in Communications, Business, Psychology, or demonstrated customer-facing experience.',
    learningRoadmap: [
      { stage: 'Customer Experience Foundations', duration: '3 weeks', topics: ['Customer Lifecycle', 'SaaS Retention & Churn', 'Net Promoter Score (NPS)'] },
      { stage: 'Support Tools & Troubleshooting', duration: '4 weeks', topics: ['Ticket Triage', 'SLA Management', 'Knowledgebase Authoring'] },
      { stage: 'Account Management & Advocacy', duration: '4 weeks', topics: ['Quarterly Business Reviews', 'Expansion Opportunities', 'Client Health Monitoring'] }
    ],
    certifications: ['HubSpot Customer Service Certification', 'Zendesk Support Specialist'],
    exampleProjects: [
      {
        title: 'Customer Onboarding Academy & Knowledge Base',
        description: 'Self-serve knowledgebase articles and automated email sequences decreasing first-response times by 35%.',
        skillsApplied: ['Zendesk', 'Customer Journey Mapping', 'Technical Writing']
      }
    ],
    entryLevelTitles: ['Customer Success Associate', 'Client Support Specialist', 'Junior Account Manager'],
    interviewTips: [
      'Demonstrate a real example of handling an upset or dissatisfied customer with calm empathy',
      'Explain how you balance customer desires with organizational constraints and product roadmaps',
      'Share your approach to measuring customer engagement and satisfaction'
    ],
    recommendedResources: [
      { title: 'SuccessCOACHING Foundations', provider: 'SuccessHACKER', url: 'https://successcoaching.co', isFree: true }
    ]
  }
];
