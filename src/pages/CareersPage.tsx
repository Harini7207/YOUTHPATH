import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  ExternalLink, 
  X, 
  BookOpen, 
  Award, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';
import { CAREER_TRACKS } from '../data/careersData';
import { CareerTrack, CareerRecommendation, CareerQuestionnaireInput } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface CareersPageProps {
  navigate: (path: string) => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCareer, setSelectedCareer] = useState<CareerTrack | null>(null);
  
  // AI Questionnaire Modal State
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [assessmentError, setAssessmentError] = useState<string | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<CareerRecommendation[] | null>(null);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState<string | null>(null);

  const [questionnaire, setQuestionnaire] = useState<CareerQuestionnaireInput>({
    educationLevel: "Bachelor's Degree (B.Tech / B.E. / BCA / B.Sc)",
    degreeOrField: 'Computer Science & Engineering',
    interests: ['Software Development', 'Problem Solving'],
    existingSkills: ['Python / Java', 'Data Structures & Algorithms', 'Git', 'SQL'],
    preferredWorkType: 'Remote or Hybrid',
    careerGoals: 'Crack campus placements or secure an entry-level SDE role in tech/GCCs',
    learningPreferences: 'Self-paced documentation, tutorials, and practical portfolio projects',
  });

  const categories = ['All', 'Tech', 'Data & AI', 'Design', 'Business & Operations', 'Marketing & Content'];

  const filteredCareers = CAREER_TRACKS.filter(c => {
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || 
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.keyTechnicalSkills.some(s => s.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const interestOptions = [
    'Software Development',
    'Web & App Design',
    'Data Analysis & Numbers',
    'Artificial Intelligence',
    'Cyber Defense & Networking',
    'Writing & Content Strategy',
    'People & Team Operations',
    'Sales & Client Negotiations',
    'Financial Modeling',
    'Product Management',
  ];

  const handleInterestToggle = (opt: string) => {
    setQuestionnaire(prev => {
      const exists = prev.interests.includes(opt);
      return {
        ...prev,
        interests: exists ? prev.interests.filter(i => i !== opt) : [...prev.interests, opt],
      };
    });
  };

  const handleRunAssessment = async () => {
    if (questionnaire.interests.length === 0) {
      setAssessmentError('Please select at least one interest area.');
      return;
    }

    setAssessmentLoading(true);
    setAssessmentError(null);
    setAssessmentResults(null);
    setSavedSuccessMsg(null);

    try {
      const res = await fetch('/api/career-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionnaire),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to generate recommendations.');
      }

      setAssessmentResults(data.recommendations || []);
    } catch (err: unknown) {
      console.error('Assessment error:', err);
      setAssessmentError(err instanceof Error ? err.message : 'Failed to connect to recommendation service.');
    } finally {
      setAssessmentLoading(false);
    }
  };

  const handleSaveRecommendation = async (rec: CareerRecommendation) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addDoc(collection(db, 'careerRecommendations'), {
        ...rec,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });
      setSavedSuccessMsg(`Saved "${rec.careerTitle}" to your career dashboard!`);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'careerRecommendations');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header Banner with Visual Asset */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white p-6 sm:p-10 shadow-lg">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/src/assets/images/career_exploration_1792323669955.jpg"
            alt="Career paths background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Structured Youth Career Guide</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Explore 14+ Real-World Career Pathways
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Gain transparent insight into roles, core responsibilities, starter projects, certifications, and beginner-friendly learning paths without marketing fluff.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsAssessmentOpen(true)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-900 bg-teal-400 hover:bg-teal-300 rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Get AI Career Recommendations</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category Filter Tabs (Zero-pill discipline: segmented control) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role or skill (e.g. SQL, React)..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>

      </div>

      {/* Careers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCareers.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 space-y-2">
            <p className="text-sm font-semibold">No career tracks match your search.</p>
            <p className="text-xs text-slate-400">Try clearing filters or searching for different keywords.</p>
          </div>
        ) : (
          filteredCareers.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-xl border border-slate-200 bg-white hover:border-teal-500/60 hover:shadow-sm transition-all flex flex-col justify-between text-left"
            >
              <div>
                {/* Unboxed Metadata with · separator */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-teal-700">{c.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{c.learningRoadmap.length} Stages</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {c.description}
                </p>

                {/* Key Skills */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2">Core Skills</p>
                  <div className="flex flex-wrap gap-1.5 text-xs text-slate-600">
                    {c.keyTechnicalSkills.slice(0, 4).map((s, idx) => (
                      <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700">
                        {s}
                      </span>
                    ))}
                    {c.keyTechnicalSkills.length > 4 && (
                      <span className="text-[11px] text-slate-400 self-center">
                        +{c.keyTechnicalSkills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Entry Titles */}
                <div className="mt-3 text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">Entry Titles: </span>
                  <span>{c.entryLevelTitles.join(', ')}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedCareer(c)}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Complete Career Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Selected Career Detailed Modal / Drawer */}
      {selectedCareer && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-left my-8">
            
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold mb-1">
                  <span>{selectedCareer.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>Career Track</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedCareer.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCareer(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-xs text-slate-700">
              
              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Role Overview</h4>
                <p className="leading-relaxed text-slate-600 text-sm">{selectedCareer.description}</p>
              </div>

              {/* Responsibilities */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Common Responsibilities</h4>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                  {selectedCareer.commonResponsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>

              {/* Skills Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <div>
                  <h5 className="font-bold text-slate-900 mb-2">Technical Skills</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCareer.keyTechnicalSkills.map((s, i) => (
                      <span key={i} className="bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 mb-2">Soft Skills</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCareer.keySoftSkills.map((s, i) => (
                      <span key={i} className="bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Education & Qualifications */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Education & Qualifications</h4>
                <p className="text-slate-600">{selectedCareer.educationGuidance}</p>
              </div>

              {/* Learning Roadmap */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Beginner Learning Roadmap</h4>
                <div className="space-y-3">
                  {selectedCareer.learningRoadmap.map((stage, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                        <span>{idx + 1}. {stage.stage}</span>
                        <span className="text-teal-700 font-normal tabular-nums">{stage.duration}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Topics: {stage.topics.join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Projects */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Recommended Portfolio Projects</h4>
                <div className="space-y-3">
                  {selectedCareer.exampleProjects.map((p, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
                      <p className="font-bold text-slate-900 text-xs">{p.title}</p>
                      <p className="text-[11px] text-slate-600 mt-1">{p.description}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5 font-medium">
                        Skills Applied: {p.skillsApplied.join(', ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Recognized Certifications</h4>
                <p className="text-slate-600">{selectedCareer.certifications.join(' · ')}</p>
              </div>

              {/* Interview Preparation Suggestions */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Interview Preparation Suggestions</h4>
                <ul className="space-y-1 text-slate-600 list-disc list-inside">
                  {selectedCareer.interviewTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Learning Resources */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Curated Reputable Resources</h4>
                <div className="space-y-2">
                  {selectedCareer.recommendedResources.map((res, idx) => (
                    <a
                      key={idx}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-xs text-slate-800"
                    >
                      <div>
                        <span className="font-semibold text-teal-700">{res.title}</span>
                        <span className="text-slate-500 text-[11px] ml-2">by {res.provider}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => navigate('/interview')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Practice Interview for this Role
              </button>
              <button
                onClick={() => setSelectedCareer(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* AI Career Assessment Questionnaire Modal */}
      {isAssessmentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-left my-8">
            
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Gemini 3.8 Flash Career Assessment</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">Discover Your Tailored Career Pathways</h3>
              </div>
              <button
                onClick={() => setIsAssessmentOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!assessmentResults ? (
              <div className="space-y-4 text-xs">
                
                {/* Education */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Education Level</label>
                    <select
                      value={questionnaire.educationLevel}
                      onChange={(e) => setQuestionnaire({ ...questionnaire, educationLevel: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    >
                      <option>High School / Secondary</option>
                      <option>Undergraduate / Bachelor's</option>
                      <option>Master's / Graduate</option>
                      <option>Vocational / Polytechnic</option>
                      <option>Self-Taught / Bootcamp</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Degree or Major Field</label>
                    <input
                      type="text"
                      value={questionnaire.degreeOrField}
                      onChange={(e) => setQuestionnaire({ ...questionnaire, degreeOrField: e.target.value })}
                      placeholder="e.g. Information Technology, Business, Biology..."
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Areas of Interest (Select all that apply)</label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((opt) => {
                      const selected = questionnaire.interests.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleInterestToggle(opt)}
                          className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                            selected
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Existing Skills */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Skills (Comma-separated)</label>
                  <input
                    type="text"
                    value={questionnaire.existingSkills.join(', ')}
                    onChange={(e) => setQuestionnaire({
                      ...questionnaire,
                      existingSkills: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                    })}
                    placeholder="e.g. Python, Excel, Communication, Figma, SQL..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Preferred Work Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Preferred Work Environment</label>
                    <select
                      value={questionnaire.preferredWorkType}
                      onChange={(e) => setQuestionnaire({ ...questionnaire, preferredWorkType: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    >
                      <option>Remote or Hybrid</option>
                      <option>Onsite Office</option>
                      <option>Flexible / Open</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Learning Style</label>
                    <select
                      value={questionnaire.learningPreferences}
                      onChange={(e) => setQuestionnaire({ ...questionnaire, learningPreferences: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                    >
                      <option>Self-paced documentation & projects</option>
                      <option>Video lectures & structured courses</option>
                      <option>Peer study & collaborative code labs</option>
                    </select>
                  </div>
                </div>

                {/* Career Goals */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Career Goal</label>
                  <input
                    type="text"
                    value={questionnaire.careerGoals}
                    onChange={(e) => setQuestionnaire({ ...questionnaire, careerGoals: e.target.value })}
                    placeholder="e.g. Secure a paid junior developer internship within 6 months"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                  />
                </div>

                {assessmentError && (
                  <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{assessmentError}</span>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsAssessmentOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleRunAssessment}
                    disabled={assessmentLoading}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {assessmentLoading ? (
                      <>
                        <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Analyzing with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Analyze & Generate Recommendations</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            ) : (
              /* Results View */
              <div className="space-y-6 text-xs">
                
                {savedSuccessMsg && (
                  <div className="p-3 bg-teal-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{savedSuccessMsg}</span>
                  </div>
                )}

                <div className="space-y-4">
                  {assessmentResults.map((rec, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-left">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wide">
                            Match #{idx + 1}
                          </span>
                          <h4 className="text-base font-bold text-slate-900">{rec.careerTitle}</h4>
                        </div>
                        <button
                          onClick={() => handleSaveRecommendation(rec)}
                          className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-100 hover:bg-teal-200 rounded-md transition-colors cursor-pointer inline-flex items-center gap-1"
                        >
                          <BookmarkCheck className="w-3.5 h-3.5" />
                          <span>Save to Profile</span>
                        </button>
                      </div>

                      <p className="text-slate-700 leading-relaxed text-xs">{rec.explanation}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <p className="font-bold text-emerald-800 text-[11px] mb-1">Your Matching Skills</p>
                          <p className="text-slate-600 text-[11px]">{rec.matchingSkills.join(', ') || 'Foundational readiness'}</p>
                        </div>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <p className="font-bold text-amber-800 text-[11px] mb-1">Recommended Skills to Build</p>
                          <p className="text-slate-600 text-[11px]">{rec.missingSkills.join(', ')}</p>
                        </div>
                      </div>

                      <div>
                        <p className="font-bold text-slate-900 text-[11px] mb-1">Suggested Next Steps:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-slate-600 text-[11px]">
                          {rec.nextSteps.map((step, sIdx) => (
                            <li key={sIdx}>{step}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => setAssessmentResults(null)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                  >
                    Adjust Answers & Retake
                  </button>
                  <button
                    onClick={() => setIsAssessmentOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Close
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
