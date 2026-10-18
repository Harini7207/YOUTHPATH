import React from 'react';
import { ShieldCheck, Lock, EyeOff, UserCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left text-xs text-slate-700 leading-relaxed">
      
      <div className="space-y-2 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2 text-teal-700 font-semibold uppercase tracking-wider text-[11px]">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Security & Data Governance</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500">Effective Date: October 2026</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">1. Our Commitment to Student & Youth Privacy</h2>
        <p>
          YouthPath is designed with a fundamental commitment to user dignity and data protection. We recognize that young job seekers and university students frequently entrust career platforms with personal resumes, educational milestones, and private contact information. We treat this data with strict confidentiality.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
        <p>We only collect information directly necessary for functioning as a career guidance platform:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><strong>Authentication Information:</strong> Your email address and unique user identifier (UID) managed via Firebase Authentication.</li>
          <li><strong>Career Profile & Preferences:</strong> Self-reported degree, graduation year, technical skills, and target job roles.</li>
          <li><strong>Resume Content:</strong> Education entries, project summaries, and work history you explicitly draft in our resume builder.</li>
          <li><strong>Simulation Responses:</strong> Answers typed during mock interview sessions, solely used to generate immediate formative feedback.</li>
        </ul>
        <p className="text-slate-500 italic">
          We NEVER require national identity documents, passports, bank credentials, or sensitive demographic identifiers.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">3. Storage & Zero-Trust Security Rules</h2>
        <p>
          User records, resumes, and saved jobs are persisted in Cloud Firestore databases governed by Attribute-Based Access Control (ABAC) and Zero-Trust rules. Specifically:
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>Blanket document listing is programmatically rejected at the database level.</li>
          <li>Users can only read, update, or delete records matching their authenticated user ID (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded">request.auth.uid == userId</code>).</li>
          <li>We do not sell, rent, or lease candidate data to third-party marketing brokers.</li>
        </ul>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">4. Artificial Intelligence & Third-Party Processing</h2>
        <p>
          YouthPath utilizes the Google Gemini API (model <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">gemini-3.8-flash</code>) on our secure server for career recommendations, resume phrasing improvements, and mock interview evaluation.
        </p>
        <p>
          Server API credentials are never exposed to browser clients, and AI calls are executed server-side. AI interactions are transiently evaluated and are not used to train proprietary public models.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">5. User Control & Right to Erasure (Account Deletion)</h2>
        <p>
          You maintain full ownership of your data. You may export your resumes to PDF at any time, edit your profile attributes, or permanently delete your account and associated records directly from the Career Profile settings page.
        </p>
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">6. Contact for Privacy Inquiries</h2>
        <p>
          If you have questions or concerns regarding our privacy policies or data handling, please contact our data coordinator at <span className="font-mono text-slate-800">privacy@youthpath.edu</span>.
        </p>
      </div>

    </div>
  );
};
