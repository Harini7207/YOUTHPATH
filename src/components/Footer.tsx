import React from 'react';
import { TrendingUp, ShieldCheck, HeartHandshake, Target } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-900 shadow-sm">
                <TrendingUp className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans">
                Youth<span className="text-teal-400">Path</span>
              </span>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Discover your skills, build your future. YouthPath is a smart employment and career guidance ecosystem connecting students, graduates, and young job seekers to verified opportunities, skill pathways, and AI practice.
            </p>

            {/* Platform Mission statement */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-teal-300 font-medium">
                <Target className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Empowering Youth Employment & Skills Readiness</span>
              </div>
              <div className="text-[11px] text-slate-400 space-y-1">
                <p><strong className="text-slate-200">Career Access:</strong> Fostering productive entry into the workforce.</p>
                <p><strong className="text-slate-200">Skill Development:</strong> Promoting lifelong learning and practical workplace readiness.</p>
              </div>
            </div>
          </div>

          {/* Column 1: Core Navigation */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/careers')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Explore Careers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/jobs')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Find Jobs & Internships
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/skills')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Skill Development Hub
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/interview')} className="hover:text-white transition-colors cursor-pointer text-left">
                  AI Mock Interviews
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/resume-builder')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Interactive Resume Builder
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Platform & Guidance */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors cursor-pointer text-left">
                  About YouthPath
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/profile')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Career Profile
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Contact & Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Trust & Security */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Trust & Security</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Terms of Use
                </button>
              </li>
            </ul>

            <div className="mt-4 p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Zero-Trust Privacy</span>
              </div>
              <p>Personal data and resumes are owner-protected through Firebase security rules.</p>
            </div>
          </div>

        </div>

        {/* Disclaimer and Bottom Row */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            YouthPath &copy; {new Date().getFullYear()} — Smart Employment Support System for Youth. All rights reserved.
          </p>
          <p className="text-center sm:text-right text-[11px] text-slate-500 max-w-md">
            Career recommendations, AI simulations, and curriculum roadmaps are educational guidance tools and do not represent guaranteed hiring outcomes.
          </p>
        </div>

      </div>
    </footer>
  );
};
