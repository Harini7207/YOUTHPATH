import React from 'react';
import { Globe, Target, ShieldCheck, HeartHandshake, CheckCircle2, TrendingUp } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-left">
      
      {/* Title */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
          <Target className="w-3.5 h-3.5 text-teal-600" />
          <span>Youth Employment & Education Platform</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About YouthPath
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Bridging the critical gap between university education and real-world employment readiness through structured guidance, transparent skill pathways, and authentic AI simulation.
        </p>
      </div>

      {/* The Challenge */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs leading-relaxed text-slate-700">
        <h2 className="text-base font-bold text-slate-900">The Problem We Are Solving</h2>
        <p>
          Worldwide, millions of university students and vocational graduates face an opaque transition into the workforce. Traditional job portals bombard young job seekers with senior requirements, predatory placement scams, and algorithmic keyword filters that ignore foundational potential.
        </p>
        <p>
          YouthPath was established to create a zero-noise, honest, and accessible career support system designed specifically for the early-career transition.
        </p>
      </div>

      {/* Core Impact Pillars */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900">Our Core Impact Pillars</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-teal-200 bg-teal-50/50 space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Productive Career Pathways</h3>
            </div>
            <p className="leading-relaxed">
              We empower young candidates with realistic role mappings, transparent compensation expectations, and entry-level interview practice to overcome experience barriers.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-teal-200 bg-teal-50/50 space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Practical Skills & Lifelong Learning</h3>
            </div>
            <p className="leading-relaxed">
              We curate high-reputation open educational resources from Mozilla, Harvard CS50, Python Foundation, and Mode SQL to develop true technical and professional competencies.
            </p>
          </div>
        </div>
      </div>

      {/* Guiding Principles */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Our Guiding Engineering & Ethics Principles</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <h4 className="font-bold text-slate-900">1. Zero Hallucinated Claims</h4>
            <p className="text-slate-600 leading-relaxed">
              We never fabricate company hiring statistics, claim AI guarantees employment, or invent job postings. All sample data is explicitly labeled.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <h4 className="font-bold text-slate-900">2. Respect Student Privacy</h4>
            <p className="text-slate-600 leading-relaxed">
              Your resume, contact information, and interview responses belong solely to you, protected by Zero-Trust Firestore security rules.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
            <h4 className="font-bold text-slate-900">3. Practical Skill Readiness</h4>
            <p className="text-slate-600 leading-relaxed">
              We focus on building true projects and authentic competencies rather than superficial badge collections.
            </p>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">Ready to begin your journey?</p>
          <p className="text-xs text-slate-500">Explore 14+ career pathways or try our mock interview simulator.</p>
        </div>
        <button
          onClick={() => navigate('/careers')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
        >
          Explore Careers &rarr;
        </button>
      </div>

    </div>
  );
};
