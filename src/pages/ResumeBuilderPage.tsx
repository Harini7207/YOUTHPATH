import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Sparkles, 
  Printer, 
  Save, 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  CheckCircle, 
  ArrowLeft,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Layers,
  Wand2,
  AlertCircle,
  X
} from 'lucide-react';
import { ResumeData, ResumeEducation, ResumeExperience, ResumeProject } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

interface ResumeBuilderPageProps {
  navigate: (path: string) => void;
}

const defaultResume: ResumeData = {
  userId: '',
  title: 'My Professional Resume',
  template: 'modern',
  contactInfo: {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@nitk.edu.in',
    phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka',
    portfolioUrl: 'https://aaravsharma.dev',
    linkedinUrl: 'https://linkedin.com/in/aaravsharma',
    githubUrl: 'https://github.com/aaravsharma',
  },
  summary: 'Motivated Computer Science graduate from National Institute of Technology with hands-on experience building full-stack web applications, REST APIs, and microservices. Strong foundation in Data Structures, Algorithms, and DBMS, eager to contribute to high-impact software engineering teams.',
  education: [
    {
      id: 'edu-1',
      institution: 'National Institute of Technology (NIT)',
      degree: 'B.Tech in Computer Science and Engineering',
      fieldOfStudy: 'Computer Science',
      startDate: '2022',
      endDate: '2026',
      gradeOrGpa: '8.8 CGPA',
      highlights: "Institute Merit Scholar, Lead Coordinator at Campus Coding Club",
    },
  ],
  technicalSkills: ['Java', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Git', 'Docker'],
  softSkills: ['Analytical Problem Solving', 'Active Communication', 'Agile Collaboration', 'Time Management'],
  workExperience: [
    {
      id: 'exp-1',
      role: 'Software Development Intern',
      company: 'NextGen Technologies India',
      location: 'Bengaluru, Karnataka',
      startDate: 'May 2025',
      endDate: 'Jul 2025',
      isCurrent: false,
      bulletPoints: [
        'Developed reusable React component library reducing UI design inconsistencies across 4 core client modules.',
        'Optimized PostgreSQL database queries and indexing, decreasing average API response latency by 28%.',
        'Collaborated with senior engineering mentors in weekly Agile sprints and code review sessions.',
      ],
    },
  ],
  internships: [],
  projects: [
    {
      id: 'proj-1',
      name: 'Smart UPI Khata & Expense Tracker',
      roleOrContext: 'Lead Developer',
      link: 'https://github.com/aaravsharma/upi-khata-tracker',
      startDate: 'Jan 2026',
      endDate: 'Apr 2026',
      technologies: ['React', 'TypeScript', 'Express', 'PostgreSQL'],
      description: 'Built a full-stack digital ledger portal with real-time transaction categorizing, monthly analytics visualization, and automated alert triggers.',
    },
  ],
  certifications: ['NPTEL Elite Certificate in Data Structures & Algorithms (2025)', 'AWS Certified Cloud Practitioner (2025)'],
  achievements: ['1st Place - Smart India Hackathon College Round 2025', 'Solved 350+ algorithmic problems on LeetCode & GeeksforGeeks'],
  languages: ['English (Professional)', 'Hindi (Fluent)'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const ResumeBuilderPage: React.FC<ResumeBuilderPageProps> = ({ navigate }) => {
  const { user, profile } = useAuth();
  const [activeResume, setActiveResume] = useState<ResumeData>(defaultResume);
  const [savedResumes, setSavedResumes] = useState<ResumeData[]>([]);
  const [activeSection, setActiveSection] = useState<'contact' | 'summary' | 'education' | 'experience' | 'projects' | 'skills' | 'certifications'>('contact');
  const [previewMode, setPreviewMode] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // AI Assistant Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTargetRole, setAiTargetRole] = useState('Junior Software Engineer');
  const [aiJobDescription, setAiJobDescription] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ improvedText: string; suggestions: string[] } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Initialize from user profile if brand new
  useEffect(() => {
    if (user && profile) {
      setActiveResume(prev => ({
        ...prev,
        userId: user.uid,
        contactInfo: {
          ...prev.contactInfo,
          fullName: profile.fullName || prev.contactInfo.fullName,
          email: profile.email || prev.contactInfo.email,
          location: profile.location || prev.contactInfo.location,
        },
        technicalSkills: profile.technicalSkills.length > 0 ? profile.technicalSkills : prev.technicalSkills,
        softSkills: profile.softSkills.length > 0 ? profile.softSkills : prev.softSkills,
      }));
    }
  }, [user, profile]);

  // Load user resumes from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchResumes = async () => {
      try {
        const q = query(collection(db, 'resumes'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const list: ResumeData[] = [];
        snap.forEach(d => {
          list.push({ id: d.id, ...d.data() } as ResumeData);
        });
        setSavedResumes(list);
        if (list.length > 0) {
          setActiveResume(list[0]);
        }
      } catch (err) {
        console.warn('Resume load error:', err);
      }
    };
    fetchResumes();
  }, [user]);

  const handleSaveResume = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSaveLoading(true);
    setSuccessToast(null);

    const payload = {
      ...activeResume,
      userId: user.uid,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (activeResume.id) {
        await updateDoc(doc(db, 'resumes', activeResume.id), payload);
        setSavedResumes(prev => prev.map(r => r.id === activeResume.id ? { ...payload, id: activeResume.id } : r));
        setSuccessToast('Resume updated successfully!');
      } else {
        const ref = await addDoc(collection(db, 'resumes'), payload);
        const saved = { ...payload, id: ref.id };
        setActiveResume(saved);
        setSavedResumes(prev => [saved, ...prev]);
        setSuccessToast('New resume draft saved to your account!');
      }
    } catch (err) {
      handleFirestoreError(err, activeResume.id ? OperationType.UPDATE : OperationType.CREATE, 'resumes');
    } finally {
      setSaveLoading(false);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleDuplicate = () => {
    const duplicated: ResumeData = {
      ...activeResume,
      id: undefined,
      title: `${activeResume.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setActiveResume(duplicated);
    setSuccessToast('Duplicated resume draft ready to edit!');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDelete = async (id?: string) => {
    if (!id || !user) return;
    if (!window.confirm('Delete this resume draft?')) return;
    try {
      await deleteDoc(doc(db, 'resumes', id));
      setSavedResumes(prev => prev.filter(r => r.id !== id));
      setActiveResume(defaultResume);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `resumes/${id}`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // AI Resume Improvement
  const handleRunAiEnhancer = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    const contentToImprove = activeSection === 'summary' 
      ? activeResume.summary 
      : activeResume.workExperience.map(e => `${e.role} at ${e.company}:\n${e.bulletPoints.join('\n')}`).join('\n\n');

    try {
      const res = await fetch('/api/resumes/ai-improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionType: activeSection,
          content: contentToImprove,
          targetRole: aiTargetRole,
          targetJobDescription: aiJobDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to generate resume suggestions.');
      }

      setAiResult(data);
    } catch (err: unknown) {
      console.error('AI resume error:', err);
      setAiError(err instanceof Error ? err.message : 'AI enhancement request failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiSummary = () => {
    if (aiResult?.improvedText) {
      setActiveResume(prev => ({ ...prev, summary: aiResult.improvedText }));
      setIsAiModalOpen(false);
      setSuccessToast('AI improved summary applied to resume!');
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left print:p-0 print:m-0 print:max-w-none print:w-full print:space-y-0">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={activeResume.title}
              onChange={(e) => setActiveResume({ ...activeResume, title: e.target.value })}
              className="text-xl sm:text-2xl font-extrabold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-teal-500 focus:outline-none bg-transparent"
            />
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Template: {activeResume.template.toUpperCase()} · Standard A4 Printable Layout
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Resume Enhancer</span>
          </button>

          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewMode ? 'Edit Mode' : 'Full Preview'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Export to PDF using clean A4 print preview"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF Export</span>
          </button>

          <button
            onClick={handleSaveResume}
            disabled={saveLoading}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveLoading ? 'Saving...' : 'Save Draft'}</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {successToast && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-lg font-medium flex items-center gap-2 print:hidden">
          <CheckCircle className="w-4 h-4 text-teal-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Template Chooser Bar */}
      <div className="flex items-center justify-between gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Choose Template:</span>
          {(['modern', 'minimal', 'executive'] as const).map((tmpl) => (
            <button
              key={tmpl}
              onClick={() => setActiveResume({ ...activeResume, template: tmpl })}
              className={`px-3 py-1 rounded-md font-medium capitalize transition-colors cursor-pointer ${
                activeResume.template === tmpl
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tmpl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDuplicate}
            className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate</span>
          </button>
          {activeResume.id && (
            <button
              onClick={() => handleDelete(activeResume.id)}
              className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 ml-2 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Split Layout: Editor (Left) & Real-Time A4 Preview (Right) */}
      <div className={`grid grid-cols-1 ${previewMode ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-8 items-start`}>
        
        {/* Editor Form Column */}
        {!previewMode && (
          <div className="lg:col-span-6 space-y-6 print:hidden">
            
            {/* Section Selector Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'contact', label: 'Contact' },
                { id: 'summary', label: 'Summary' },
                { id: 'education', label: 'Education' },
                { id: 'experience', label: 'Experience' },
                { id: 'projects', label: 'Projects' },
                { id: 'skills', label: 'Skills' },
                { id: 'certifications', label: 'Certifications' },
              ].map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeSection === sec.id
                      ? 'bg-teal-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Section 1: Contact Info */}
            {activeSection === 'contact' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Personal & Contact Details</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={activeResume.contactInfo.fullName}
                      onChange={(e) => setActiveResume({
                        ...activeResume,
                        contactInfo: { ...activeResume.contactInfo, fullName: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={activeResume.contactInfo.email}
                      onChange={(e) => setActiveResume({
                        ...activeResume,
                        contactInfo: { ...activeResume.contactInfo, email: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={activeResume.contactInfo.phone}
                      onChange={(e) => setActiveResume({
                        ...activeResume,
                        contactInfo: { ...activeResume.contactInfo, phone: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Location (City, State / Country)</label>
                    <input
                      type="text"
                      value={activeResume.contactInfo.location}
                      onChange={(e) => setActiveResume({
                        ...activeResume,
                        contactInfo: { ...activeResume.contactInfo, location: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Portfolio or Website URL</label>
                    <input
                      type="text"
                      value={activeResume.contactInfo.portfolioUrl || ''}
                      onChange={(e) => setActiveResume({
                        ...activeResume,
                        contactInfo: { ...activeResume.contactInfo, portfolioUrl: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">LinkedIn URL</label>
                    <input
                      type="text"
                      value={activeResume.contactInfo.linkedinUrl || ''}
                      onChange={(e) => setActiveResume({
                        ...activeResume,
                        contactInfo: { ...activeResume.contactInfo, linkedinUrl: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-medium text-slate-700 mb-1">GitHub / Code Repository URL</label>
                    <input
                      type="text"
                      value={activeResume.contactInfo.githubUrl || ''}
                      onChange={(e) => setActiveResume({
                        ...activeResume,
                        contactInfo: { ...activeResume.contactInfo, githubUrl: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Summary */}
            {activeSection === 'summary' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Professional Summary</h3>
                  <button
                    onClick={() => setIsAiModalOpen(true)}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Improve with AI</span>
                  </button>
                </div>

                <p className="text-slate-500 text-[11px]">
                  Write a concise 2-4 sentence summary emphasizing your degree, core skills, and career focus.
                </p>

                <textarea
                  value={activeResume.summary}
                  onChange={(e) => setActiveResume({ ...activeResume, summary: e.target.value })}
                  rows={4}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg leading-relaxed focus:outline-none focus:bg-white focus:border-teal-500"
                />
              </div>
            )}

            {/* Section 3: Education */}
            {activeSection === 'education' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Education History</h3>
                  <button
                    onClick={() => {
                      const newEdu: ResumeEducation = {
                        id: `edu-${Date.now()}`,
                        institution: 'University Name',
                        degree: "Bachelor's Degree",
                        fieldOfStudy: 'Major Field',
                        startDate: '2022',
                        endDate: '2026',
                        gradeOrGpa: '',
                        highlights: '',
                      };
                      setActiveResume({ ...activeResume, education: [...activeResume.education, newEdu] });
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Education</span>
                  </button>
                </div>

                {activeResume.education.map((edu, idx) => (
                  <div key={edu.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Entry #{idx + 1}</span>
                      <button
                        onClick={() => {
                          setActiveResume({
                            ...activeResume,
                            education: activeResume.education.filter(e => e.id !== edu.id),
                          });
                        }}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Institution (e.g. State University)"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...activeResume.education];
                          updated[idx].institution = e.target.value;
                          setActiveResume({ ...activeResume, education: updated });
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded focus:border-teal-500"
                      />
                      <input
                        type="text"
                        placeholder="Degree (e.g. B.S. in Computer Science)"
                        value={edu.degree}
                        onChange={(e) => {
                          const updated = [...activeResume.education];
                          updated[idx].degree = e.target.value;
                          setActiveResume({ ...activeResume, education: updated });
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded focus:border-teal-500"
                      />
                      <input
                        type="text"
                        placeholder="Graduation Year (e.g. 2026)"
                        value={edu.endDate}
                        onChange={(e) => {
                          const updated = [...activeResume.education];
                          updated[idx].endDate = e.target.value;
                          setActiveResume({ ...activeResume, education: updated });
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded focus:border-teal-500"
                      />
                      <input
                        type="text"
                        placeholder="GPA or Honors (Optional, e.g. 3.8 GPA)"
                        value={edu.gradeOrGpa || ''}
                        onChange={(e) => {
                          const updated = [...activeResume.education];
                          updated[idx].gradeOrGpa = e.target.value;
                          setActiveResume({ ...activeResume, education: updated });
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded focus:border-teal-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section 4: Work Experience & Internships */}
            {activeSection === 'experience' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Work Experience & Internships</h3>
                  <button
                    onClick={() => {
                      const newExp: ResumeExperience = {
                        id: `exp-${Date.now()}`,
                        role: 'Software Intern',
                        company: 'Company Name',
                        location: 'City, State',
                        startDate: 'Jun 2025',
                        endDate: 'Aug 2025',
                        isCurrent: false,
                        bulletPoints: ['Collaborated on feature development using modern software methodologies.'],
                      };
                      setActiveResume({ ...activeResume, workExperience: [...activeResume.workExperience, newExp] });
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Experience</span>
                  </button>
                </div>

                {activeResume.workExperience.map((exp, idx) => (
                  <div key={exp.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Role #{idx + 1}</span>
                      <button
                        onClick={() => {
                          setActiveResume({
                            ...activeResume,
                            workExperience: activeResume.workExperience.filter(e => e.id !== exp.id),
                          });
                        }}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Job Title / Role"
                        value={exp.role}
                        onChange={(e) => {
                          const updated = [...activeResume.workExperience];
                          updated[idx].role = e.target.value;
                          setActiveResume({ ...activeResume, workExperience: updated });
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded focus:border-teal-500"
                      />
                      <input
                        type="text"
                        placeholder="Company / Organization"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...activeResume.workExperience];
                          updated[idx].company = e.target.value;
                          setActiveResume({ ...activeResume, workExperience: updated });
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded focus:border-teal-500"
                      />
                      <input
                        type="text"
                        placeholder="Dates (e.g. May 2025 - Aug 2025)"
                        value={`${exp.startDate} - ${exp.endDate}`}
                        onChange={(e) => {
                          const updated = [...activeResume.workExperience];
                          const parts = e.target.value.split('-');
                          updated[idx].startDate = parts[0]?.trim() || '';
                          updated[idx].endDate = parts[1]?.trim() || '';
                          setActiveResume({ ...activeResume, workExperience: updated });
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded focus:border-teal-500"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={exp.location}
                        onChange={(e) => {
                          const updated = [...activeResume.workExperience];
                          updated[idx].location = e.target.value;
                          setActiveResume({ ...activeResume, workExperience: updated });
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded focus:border-teal-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-600 mb-1">
                        Accomplishment Bullet Points (1 per line)
                      </label>
                      <textarea
                        rows={3}
                        value={exp.bulletPoints.join('\n')}
                        onChange={(e) => {
                          const updated = [...activeResume.workExperience];
                          updated[idx].bulletPoints = e.target.value.split('\n').filter(b => b.trim().length > 0);
                          setActiveResume({ ...activeResume, workExperience: updated });
                        }}
                        className="w-full p-2 bg-white border border-slate-200 rounded text-xs leading-relaxed focus:border-teal-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section 5: Projects */}
            {activeSection === 'projects' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Key Projects</h3>
                  <button
                    onClick={() => {
                      const newProj: ResumeProject = {
                        id: `proj-${Date.now()}`,
                        name: 'Project Title',
                        roleOrContext: 'Creator',
                        link: '',
                        technologies: ['React', 'TypeScript'],
                        description: 'Describe the problem solved, architecture used, and impact.',
                      };
                      setActiveResume({ ...activeResume, projects: [...activeResume.projects, newProj] });
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                </div>

                {activeResume.projects.map((proj, idx) => (
                  <div key={proj.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Project #{idx + 1}</span>
                      <button
                        onClick={() => {
                          setActiveResume({
                            ...activeResume,
                            projects: activeResume.projects.filter(p => p.id !== proj.id),
                          });
                        }}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={proj.name}
                        onChange={(e) => {
                          const updated = [...activeResume.projects];
                          updated[idx].name = e.target.value;
                          setActiveResume({ ...activeResume, projects: updated });
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded focus:border-teal-500"
                      />
                      <input
                        type="text"
                        placeholder="Technologies (comma-separated)"
                        value={proj.technologies.join(', ')}
                        onChange={(e) => {
                          const updated = [...activeResume.projects];
                          updated[idx].technologies = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setActiveResume({ ...activeResume, projects: updated });
                        }}
                        className="p-1.5 bg-white border border-slate-200 rounded focus:border-teal-500"
                      />
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Project description and key outcomes..."
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...activeResume.projects];
                        updated[idx].description = e.target.value;
                        setActiveResume({ ...activeResume, projects: updated });
                      }}
                      className="w-full p-2 bg-white border border-slate-200 rounded text-xs leading-relaxed focus:border-teal-500"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Section 6: Skills */}
            {activeSection === 'skills' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Skills & Competencies</h3>
                
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Technical Skills (comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    value={activeResume.technicalSkills.join(', ')}
                    onChange={(e) => setActiveResume({
                      ...activeResume,
                      technicalSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Soft / Professional Skills (comma-separated)
                  </label>
                  <textarea
                    rows={2}
                    value={activeResume.softSkills.join(', ')}
                    onChange={(e) => setActiveResume({
                      ...activeResume,
                      softSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Languages (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={activeResume.languages.join(', ')}
                    onChange={(e) => setActiveResume({
                      ...activeResume,
                      languages: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Section 7: Certifications & Honors */}
            {activeSection === 'certifications' && (
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm">Certifications & Honors</h3>
                
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Certifications (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={activeResume.certifications.join('\n')}
                    onChange={(e) => setActiveResume({
                      ...activeResume,
                      certifications: e.target.value.split('\n').filter(Boolean),
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Achievements & Awards (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={activeResume.achievements.join('\n')}
                    onChange={(e) => setActiveResume({
                      ...activeResume,
                      achievements: e.target.value.split('\n').filter(Boolean),
                    })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-teal-500"
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {/* Real-Time Live A4 Resume Preview Column */}
        <div className={`${previewMode ? 'lg:col-span-12 max-w-4xl mx-auto' : 'lg:col-span-6'} w-full print:w-full print:max-w-none print:m-0 print:p-0 print:block print:col-span-12`}>
          <div className="sticky top-20 print:static print:top-0">
            
            {/* A4 Sheet Container */}
            <div 
              id="resume-a4-sheet"
              className={`bg-white shadow-xl border border-slate-300 rounded-sm p-8 sm:p-12 text-slate-900 transition-all text-left print:p-0 print:m-0 print:border-none print:shadow-none print:w-full ${
                activeResume.template === 'modern' ? 'font-sans' : activeResume.template === 'executive' ? 'font-serif' : 'font-sans'
              }`}
              style={{ minHeight: '842px' }} // Standard A4 aspect representation
            >
              
              {/* Header / Contact Area */}
              <div className={`pb-4 border-b ${
                activeResume.template === 'modern' 
                  ? 'border-teal-600' 
                  : activeResume.template === 'executive' 
                  ? 'border-slate-800' 
                  : 'border-slate-300'
              }`}>
                <h1 className={`text-2xl font-bold tracking-tight ${
                  activeResume.template === 'modern' ? 'text-teal-900' : 'text-slate-950'
                }`}>
                  {activeResume.contactInfo.fullName}
                </h1>
                
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 mt-2">
                  <span>{activeResume.contactInfo.email}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeResume.contactInfo.phone}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeResume.contactInfo.location}</span>
                  {activeResume.contactInfo.linkedinUrl && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="truncate max-w-[200px]">{activeResume.contactInfo.linkedinUrl}</span>
                    </>
                  )}
                  {activeResume.contactInfo.githubUrl && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="truncate max-w-[200px]">{activeResume.contactInfo.githubUrl}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Summary */}
              {activeResume.summary && (
                <div className="py-3 border-b border-slate-200">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-1">
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {activeResume.summary}
                  </p>
                </div>
              )}

              {/* Education */}
              {activeResume.education.length > 0 && (
                <div className="py-3 border-b border-slate-200 space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Education
                  </h2>
                  {activeResume.education.map((edu, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{edu.institution}</span>
                        <span className="font-normal text-slate-600 tabular-nums">{edu.startDate} – {edu.endDate}</span>
                      </div>
                      <div className="text-slate-700 flex items-center justify-between">
                        <span>{edu.degree} in {edu.fieldOfStudy}</span>
                        {edu.gradeOrGpa && <span className="text-[11px] text-slate-500">{edu.gradeOrGpa}</span>}
                      </div>
                      {edu.highlights && (
                        <p className="text-[11px] text-slate-500 italic mt-0.5">{edu.highlights}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Experience */}
              {activeResume.workExperience.length > 0 && (
                <div className="py-3 border-b border-slate-200 space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Experience & Internships
                  </h2>
                  {activeResume.workExperience.map((exp, idx) => (
                    <div key={idx} className="text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{exp.role} · <span className="font-normal text-slate-700">{exp.company}</span></span>
                        <span className="font-normal text-slate-600 text-[11px] tabular-nums">
                          {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                        {exp.bulletPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="leading-relaxed">{pt}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Key Projects */}
              {activeResume.projects.length > 0 && (
                <div className="py-3 border-b border-slate-200 space-y-2.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Notable Projects
                  </h2>
                  {activeResume.projects.map((proj, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{proj.name}</span>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <span className="font-normal text-[11px] text-slate-500">
                            {proj.technologies.join(', ')}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              <div className="py-3 border-b border-slate-200 text-xs space-y-1.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Skills
                </h2>
                {activeResume.technicalSkills.length > 0 && (
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Technical: </strong>
                    {activeResume.technicalSkills.join(', ')}
                  </p>
                )}
                {activeResume.softSkills.length > 0 && (
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Professional: </strong>
                    {activeResume.softSkills.join(', ')}
                  </p>
                )}
                {activeResume.languages.length > 0 && (
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Languages: </strong>
                    {activeResume.languages.join(', ')}
                  </p>
                )}
              </div>

              {/* Certifications & Achievements */}
              {(activeResume.certifications.length > 0 || activeResume.achievements.length > 0) && (
                <div className="pt-3 text-xs space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Certifications & Honors
                  </h2>
                  {activeResume.certifications.length > 0 && (
                    <p className="text-slate-700">
                      <strong className="text-slate-900">Certifications: </strong>
                      {activeResume.certifications.join(' · ')}
                    </p>
                  )}
                  {activeResume.achievements.length > 0 && (
                    <p className="text-slate-700">
                      <strong className="text-slate-900">Honors: </strong>
                      {activeResume.achievements.join(' · ')}
                    </p>
                  )}
                </div>
              )}

            </div>

          </div>
        </div>

      </div>

      {/* AI Resume Enhancer Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:hidden">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 text-left my-8">
            
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-1.5 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini 3.8 Flash Resume Polisher</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">Enhance Content & ATS Keyword Alignment</h3>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={aiTargetRole}
                  onChange={(e) => setAiTargetRole(e.target.value)}
                  placeholder="e.g. Associate Web Developer"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Optional Job Description Excerpt (for keyword tailoring)
                </label>
                <textarea
                  rows={3}
                  value={aiJobDescription}
                  onChange={(e) => setAiJobDescription(e.target.value)}
                  placeholder="Paste excerpt from target job description here..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-600 text-[11px] space-y-1">
                <p><strong>Guardrail:</strong> The AI will polish grammar, active action verbs, and impact phrasing. It is strictly instructed never to fabricate false degrees, fake companies, or unearned awards.</p>
              </div>

              {aiError && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              {aiResult && (
                <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
                  <h4 className="font-bold text-slate-900 text-xs">Suggested Improved Phrasing:</h4>
                  <div className="p-3 bg-white border border-teal-200 rounded-lg text-slate-800 text-xs leading-relaxed whitespace-pre-wrap">
                    {aiResult.improvedText}
                  </div>

                  {aiResult.suggestions && aiResult.suggestions.length > 0 && (
                    <div className="pt-2">
                      <p className="font-bold text-slate-800 text-[11px] mb-1">Rationale:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                        {aiResult.suggestions.map((sug, idx) => (
                          <li key={idx}>{sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeSection === 'summary' && (
                    <button
                      onClick={handleApplyAiSummary}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
                    >
                      Apply Directly to Resume Summary
                    </button>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAiModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={handleRunAiEnhancer}
                  disabled={aiLoading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  {aiLoading ? (
                    <>
                      <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      <span>Generating with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Enhance Current Section</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
