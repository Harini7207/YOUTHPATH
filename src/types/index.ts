export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  location?: string;
  educationLevel?: string;
  degree?: string;
  graduationYear?: string;
  technicalSkills: string[];
  softSkills: string[];
  workExperience?: string;
  internshipExperience?: string;
  projects?: string;
  certifications?: string;
  languages: string[];
  preferredJobRoles: string[];
  preferredLocations: string[];
  preferredEmploymentType?: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Remote';
  careerInterests?: string;
  learningGoals?: string;
  profileCompletion?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CareerTrack {
  id: string;
  title: string;
  category: 'Tech' | 'Design' | 'Data & AI' | 'Business & Operations' | 'Marketing & Content';
  description: string;
  commonResponsibilities: string[];
  keyTechnicalSkills: string[];
  keySoftSkills: string[];
  educationGuidance: string;
  learningRoadmap: {
    stage: string;
    duration: string;
    topics: string[];
  }[];
  certifications: string[];
  exampleProjects: {
    title: string;
    description: string;
    skillsApplied: string[];
  }[];
  entryLevelTitles: string[];
  interviewTips: string[];
  recommendedResources: {
    title: string;
    provider: string;
    url: string;
    isFree: boolean;
  }[];
}

export interface CareerRecommendation {
  id?: string;
  userId: string;
  careerTitle: string;
  explanation: string;
  matchingSkills: string[];
  missingSkills: string[];
  learningRoadmap: string[];
  beginnerProjects: string[];
  nextSteps: string[];
  createdAt: string;
}

export interface CareerQuestionnaireInput {
  educationLevel: string;
  degreeOrField: string;
  interests: string[];
  existingSkills: string[];
  preferredWorkType: string;
  careerGoals: string;
  learningPreferences: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  remoteType: 'Remote' | 'Hybrid' | 'Onsite';
  salary?: string;
  description: string;
  url: string;
  source: string;
  postedDate: string;
  skillsRequired: string[];
  experienceLevel: 'Entry Level' | 'Associate' | 'Mid Level' | 'Internship';
}

export interface SavedJobRecord {
  id: string;
  userId: string;
  jobId: string;
  title: string;
  company: string;
  location: string;
  employmentType: string;
  remoteType: string;
  salary?: string;
  description: string;
  url: string;
  source: string;
  postedDate: string;
  savedAt: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gradeOrGpa?: string;
  highlights?: string;
}

export interface ResumeExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bulletPoints: string[];
}

export interface ResumeProject {
  id: string;
  name: string;
  roleOrContext?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  technologies: string[];
  description: string;
}

export interface ResumeData {
  id?: string;
  userId: string;
  title: string;
  template: 'modern' | 'minimal' | 'executive';
  contactInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    portfolioUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
  };
  summary: string;
  education: ResumeEducation[];
  technicalSkills: string[];
  softSkills: string[];
  workExperience: ResumeExperience[];
  internships: ResumeExperience[];
  projects: ResumeProject[];
  certifications: string[];
  achievements: string[];
  languages: string[];
  createdAt: string;
  updatedAt: string;
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  category: string;
  expectedKeyPoints: string[];
}

export interface InterviewEvaluationItem {
  question: string;
  userAnswer: string;
  score: number; // 1-10
  strengths: string[];
  improvements: string[];
  idealAnswerOutline: string;
}

export interface InterviewSessionRecord {
  id?: string;
  userId: string;
  role: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
  evaluations: InterviewEvaluationItem[];
  overallScore: number;
  overallFeedback: string;
  completedAt: string;
  createdAt: string;
}

export interface LearningResourceItem {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  url: string;
  provider: string;
  estimatedHours: number;
  isFree: boolean;
  skillsCovered: string[];
}

export interface UserLearningProgress {
  id: string;
  userId: string;
  resourceId: string;
  title: string;
  category: string;
  level: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;
  notes?: string;
  updatedAt: string;
}

export interface AppNotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job_alert' | 'resume_tip' | 'interview_reminder' | 'learning_milestone';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface FeedbackData {
  id?: string;
  userId?: string;
  category: 'general' | 'bug' | 'feature' | 'career_advice' | 'interview_prep';
  rating: number; // 1-5
  message: string;
  contactEmail?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
