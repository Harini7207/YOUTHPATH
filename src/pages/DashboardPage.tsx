import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  GraduationCap, 
  ArrowRight, 
  Bookmark, 
  CheckCircle, 
  Clock, 
  Award,
  Sparkles,
  User as UserIcon,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { SavedJobRecord, ResumeData, InterviewSessionRecord, CareerRecommendation } from '../types';

interface DashboardPageProps {
  navigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ navigate }) => {
  const { user, profile, profileCompletion } = useAuth();
  const { notifications } = useNotifications();

  const [savedJobs, setSavedJobs] = useState<SavedJobRecord[]>([]);
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [interviews, setInterviews] = useState<InterviewSessionRecord[]>([]);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadDashboardData = async () => {
      try {
        // 1. Saved Jobs
        const jobsQ = query(collection(db, 'savedJobs'), where('userId', '==', user.uid), limit(4));
        const jobsSnap = await getDocs(jobsQ);
        const jList: SavedJobRecord[] = [];
        jobsSnap.forEach(d => jList.push({ id: d.id, ...d.data() } as SavedJobRecord));
        setSavedJobs(jList);

        // 2. Resumes
        const resumesQ = query(collection(db, 'resumes'), where('userId', '==', user.uid), limit(4));
        const resumesSnap = await getDocs(resumesQ);
        const rList: ResumeData[] = [];
        resumesSnap.forEach(d => rList.push({ id: d.id, ...d.data() } as ResumeData));
        setResumes(rList);

        // 3. Interviews
        const intQ = query(collection(db, 'interviewSessions'), where('userId', '==', user.uid), limit(3));
        const intSnap = await getDocs(intQ);
        const iList: InterviewSessionRecord[] = [];
        intSnap.forEach(d => iList.push({ id: d.id, ...d.data() } as InterviewSessionRecord));
        setInterviews(iList);

        // 4. Saved Career Recommendations
        const recQ = query(collection(db, 'careerRecommendations'), where('userId', '==', user.uid), limit(3));
        const recSnap = await getDocs(recQ);
        const rcList: CareerRecommendation[] = [];
        recSnap.forEach(d => rcList.push({ id: d.id, ...d.data() } as CareerRecommendation));
        setRecommendations(rcList);
      } catch (err) {
        console.warn('Dashboard data fetch warning:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Sign in to Access Your Dashboard</h2>
        <p className="text-xs text-slate-500">
          Your dashboard saves resumes, bookmarked jobs, learning milestones, and interview simulations in your account.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
        >
          Sign In to YouthPath
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Welcome & Profile Completion Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/60 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
            YouthPath Student Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile?.fullName || user.email?.split('@')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {profile?.educationLevel ? `${profile.educationLevel} · ${profile.degree || 'Degree in Progress'}` : 'Start charting your career readiness journey.'}
          </p>
        </div>

        {/* Profile Completion Dial / Bar */}
        <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 w-full md:w-72 space-y-2 shrink-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">Profile Readiness</span>
            <span className="font-bold text-teal-400 tabular-nums">{profileCompletion}%</span>
          </div>
          
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-teal-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${profileCompletion}%` }}
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">
              {profileCompletion < 80 ? 'Add skills & preferences' : 'Profile looking strong!'}
            </span>
            <button
              onClick={() => navigate('/profile')}
              className="text-[11px] font-semibold text-teal-300 hover:text-teal-200 cursor-pointer"
            >
              Edit Profile &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <button
          onClick={() => navigate('/careers')}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:shadow-sm transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Compass className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">Explore Careers</p>
          <p className="text-[11px] text-slate-500">14+ industry tracks</p>
        </button>

        <button
          onClick={() => navigate('/resume-builder')}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:shadow-sm transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">Resume Builder</p>
          <p className="text-[11px] text-slate-500">PDF & AI polisher</p>
        </button>

        <button
          onClick={() => navigate('/interview')}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:shadow-sm transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <MessageSquare className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">Mock Interviews</p>
          <p className="text-[11px] text-slate-500">Gemini 3.8 Flash</p>
        </button>

        <button
          onClick={() => navigate('/jobs')}
          className="p-4 rounded-xl border border-slate-200 bg-white hover:border-teal-500 hover:shadow-sm transition-all text-left space-y-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Briefcase className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700">Find Jobs</p>
          <p className="text-[11px] text-slate-500">Curated opportunities</p>
        </button>

      </div>

      {/* Main 2-Column Split: Active Progress & Saved Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Saved Jobs & AI Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Saved Jobs Widget */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900">Saved Job Listings</h2>
                <span className="text-xs text-slate-400 tabular-nums">({savedJobs.length})</span>
              </div>
              <button
                onClick={() => navigate('/jobs')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                Browse All
              </button>
            </div>

            {savedJobs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <p>You haven't bookmarked any jobs yet.</p>
                <button
                  onClick={() => navigate('/jobs')}
                  className="text-teal-600 font-semibold hover:underline cursor-pointer"
                >
                  Explore Entry-Level Openings &rarr;
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {savedJobs.map((j) => (
                  <div key={j.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate">{j.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{j.company} · {j.location}</p>
                    </div>
                    <a
                      href={j.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors shrink-0"
                    >
                      Apply
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved AI Career Recommendations */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900">Your Recommended Career Paths</h2>
              </div>
              <button
                onClick={() => navigate('/careers')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                Retake Assessment
              </button>
            </div>

            {recommendations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 space-y-2">
                <p>No saved career assessments yet.</p>
                <button
                  onClick={() => navigate('/careers')}
                  className="text-teal-600 font-semibold hover:underline cursor-pointer"
                >
                  Take 2-min Career Assessment &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5 text-xs">
                    <h3 className="font-bold text-slate-900">{rec.careerTitle}</h3>
                    <p className="text-slate-600 text-xs line-clamp-2">{rec.explanation}</p>
                    <div className="text-[10px] text-teal-700 font-medium pt-1">
                      Matching Skills: {rec.matchingSkills.slice(0, 3).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Resumes & Interview Performance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Resumes Widget */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900">Resume Drafts</h2>
              </div>
              <button
                onClick={() => navigate('/resume-builder')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                + New Resume
              </button>
            </div>

            {resumes.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 space-y-1">
                <p>No custom resumes saved yet.</p>
                <button
                  onClick={() => navigate('/resume-builder')}
                  className="text-teal-600 font-semibold hover:underline cursor-pointer"
                >
                  Create Your First Resume &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {resumes.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => navigate('/resume-builder')}
                    className="p-3 rounded-lg border border-slate-200 hover:border-teal-500 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{r.title}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{r.template} Template · A4 Ready</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Interview Practice */}
          <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900">Recent Interview Scores</h2>
              </div>
              <button
                onClick={() => navigate('/interview')}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
              >
                Practice
              </button>
            </div>

            {interviews.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 space-y-1">
                <p>No completed interview simulations.</p>
                <button
                  onClick={() => navigate('/interview')}
                  className="text-teal-600 font-semibold hover:underline cursor-pointer"
                >
                  Start Turn-by-Turn Mock Interview &rarr;
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {interviews.map((int) => (
                  <div key={int.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{int.role}</p>
                      <p className="text-[10px] text-slate-500">{int.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-teal-600 text-sm tabular-nums">{int.overallScore}/10</span>
                      <p className="text-[9px] text-slate-400 tabular-nums">{new Date(int.completedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
