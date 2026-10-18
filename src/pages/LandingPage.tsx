import React from 'react';
import { 
  Compass, 
  Briefcase, 
  FileText, 
  GraduationCap, 
  MessageSquare, 
  ArrowRight, 
  Globe, 
  Target, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 lg:pt-14 pb-12 bg-gradient-to-b from-slate-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-md border border-teal-200/60">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Smart Employment Support System for Youth</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]" style={{ textWrap: 'balance' }}>
                Your Career Journey <span className="text-teal-600">Starts Here.</span>
              </h1>

              <p className="text-base text-slate-600 leading-relaxed max-w-xl">
                YouthPath empowers students, fresh graduates, and early-career seekers to discover verified career tracks, master in-demand skills, build professional resumes, and practice realistic AI interviews.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate(user ? '/dashboard' : '/register')}
                  className="px-5 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2 whitespace-nowrap"
                >
                  <span>{user ? 'Go to Your Dashboard' : 'Build Your Career Profile'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/jobs')}
                  className="px-5 py-3 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
                >
                  Explore Opportunities
                </button>
              </div>

              {/* Value Highlights */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-xs text-slate-600">
                <div>
                  <p className="font-bold text-slate-900 text-sm">14+ Tracks</p>
                  <p className="text-[11px] text-slate-500">Tech & Business</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">AI Simulator</p>
                  <p className="text-[11px] text-slate-500">Turn-by-turn Feedback</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">Verified Jobs</p>
                  <p className="text-[11px] text-slate-500">Early-Career Focus</p>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-100 aspect-video">
                <img
                  src="/src/assets/images/hero_career_students_1792323669992.jpg"
                  alt="Students and young professionals collaborating on career planning in a modern bright setting"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent flex items-end p-4 sm:p-6">
                  <div className="text-white text-left">
                    <p className="text-xs uppercase tracking-wider font-semibold text-teal-300">Empowering Youth</p>
                    <p className="text-sm font-medium text-slate-100">Equipping students for the future of work</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Capabilities (Asymmetric Bento Grid) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-left max-w-2xl mb-10">
          <h2 className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-1.5">Capabilities</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Designed for Every Step of the Transition from Student to Professional
          </h3>
          <p className="text-sm text-slate-600 mt-2">
            Practical, interconnected tools that replace confusion with structured, transparent guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Career Exploration */}
          <div 
            onClick={() => navigate('/careers')}
            className="group p-6 rounded-xl border border-slate-200 bg-white hover:border-teal-500/60 hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                14+ In-Depth Career Tracks
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Explore tech, data, design, marketing, operations, and finance roles with transparent responsibilities, starter projects, certifications, and realistic learning roadmaps.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
              <span>Explore Career Profiles</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 2: AI Career Assessment */}
          <div 
            onClick={() => navigate('/careers')}
            className="group p-6 rounded-xl border border-slate-200 bg-white hover:border-teal-500/60 hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                AI Career Path Recommendations
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Take an honest 2-minute assessment evaluating your interests, education, and current skill set. Gemini 3.8 Flash returns structured, tailored recommendations without empty jargon.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 3: Resume Builder */}
          <div 
            onClick={() => navigate('/resume-builder')}
            className="group p-6 rounded-xl border border-slate-200 bg-white hover:border-teal-500/60 hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                Interactive Resume Builder & PDF Export
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Create ATS-friendly resumes with live preview, multiple templates, A4 print layout, and AI bullet-point enhancers that highlight your true student projects without fabrication.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
              <span>Build Your Resume</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 4: Jobs & Opportunities */}
          <div 
            onClick={() => navigate('/jobs')}
            className="group p-6 rounded-xl border border-slate-200 bg-white hover:border-teal-500/60 hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                Verified Jobs & Internships
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Search entry-level and associate roles. Supports real-time Adzuna API streaming when configured, with clear transparency regarding provider feeds, salary ranges, and direct application links.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
              <span>Search Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 5: AI Mock Interviews */}
          <div 
            onClick={() => navigate('/interview')}
            className="group p-6 rounded-xl border border-slate-200 bg-white hover:border-teal-500/60 hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                AI Mock Interview Simulator
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Practice HR, technical, and communication questions. Type answers to receive immediate scoring across relevance, clarity, and knowledge, with concrete tips on what to improve.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
              <span>Practice Interviews</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

          {/* Card 6: Skill Development Hub */}
          <div 
            onClick={() => navigate('/skills')}
            className="group p-6 rounded-xl border border-slate-200 bg-white hover:border-teal-500/60 hover:shadow-md transition-all cursor-pointer text-left flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                Curated Skill Development Hub
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                High-reputation free courses from NPTEL/SWAYAM, GeeksforGeeks, MDN, Harvard CS50, and Python Foundation. Track your learning progress and save checklists directly to your account.
              </p>
            </div>
            <div className="pt-6 flex items-center text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
              <span>View Learning Paths</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </div>

        </div>
      </section>

      {/* 3-Step Process Explanation */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-1">Simple & Actionable</h2>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">How YouthPath Works</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Three straightforward stages to transform your academic experience into workforce confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="p-6 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left space-y-3">
              <span className="text-xs font-bold text-teal-400">01. Assess & Discover</span>
              <h4 className="text-base font-bold text-white">Find Your Fit</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Take our AI-guided career questionnaire to map your current academic coursework, personal interests, and aptitudes to realistic high-growth roles.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left space-y-3">
              <span className="text-xs font-bold text-teal-400">02. Build Skills & Resume</span>
              <h4 className="text-base font-bold text-white">Bridge the Skill Gap</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complete reputable tutorials, track milestones, and compile your verified achievements into an ATS-optimized resume using our live editor.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl bg-slate-800/60 border border-slate-700/60 text-left space-y-3">
              <span className="text-xs font-bold text-teal-400">03. Practice & Get Hired</span>
              <h4 className="text-base font-bold text-white">Interview with Confidence</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Simulate role-specific technical and behavioral interviews with instant constructive critique, then discover real job openings suited for graduates.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Our Mission & Core Impact */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-2xl bg-teal-900 text-white border border-teal-800/60 shadow-lg text-left">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-teal-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-teal-300 uppercase tracking-wider mb-1">
                <Target className="w-4 h-4 text-teal-300" />
                <span>Our Platform Mission</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white">
                Fostering Meaningful Youth Employment & Skills Readiness
              </h3>
            </div>
            
            <div className="text-xs text-teal-200 max-w-sm">
              YouthPath is built as an open, accessible public platform to reduce the skills gap and provide equitable career guidance.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-teal-300">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                <h4 className="text-base font-bold text-white">Productive Career Pathways</h4>
              </div>
              <p className="text-xs text-teal-100/90 leading-relaxed">
                We empower young job seekers with verified job listings, realistic compensation expectations, and entry-level interview practice to ease the transition into high-growth industries.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-teal-300">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                <h4 className="text-base font-bold text-white">Practical Education & Lifelong Learning</h4>
              </div>
              <p className="text-xs text-teal-100/90 leading-relaxed">
                We connect users with reputable open-educational resources from world-class universities and documentation authorities to bridge classroom learning with workplace expectations.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-8 sm:p-12 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready to Take Control of Your Career Path?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Create your free account today. Save jobs, generate resumes, and practice interviews with no hidden fees or false guarantees.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/register')}
              className="px-6 py-3 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>{user ? 'Open Your Dashboard' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
