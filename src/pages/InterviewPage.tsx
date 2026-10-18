import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  Send, 
  CheckCircle, 
  ArrowRight, 
  RefreshCw, 
  Award, 
  HelpCircle, 
  History, 
  X,
  AlertCircle
} from 'lucide-react';
import { InterviewQuestionItem, InterviewEvaluationItem, InterviewSessionRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

interface InterviewPageProps {
  navigate: (path: string) => void;
}

export const InterviewPage: React.FC<InterviewPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  
  // Setup Stage State
  const [role, setRole] = useState('Junior Software Engineer');
  const [category, setCategory] = useState('HR & Behavioral (STAR Method)');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [questionCount, setQuestionCount] = useState(3);

  // Active Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState<InterviewEvaluationItem | null>(null);
  const [completedEvaluations, setCompletedEvaluations] = useState<InterviewEvaluationItem[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // History State
  const [pastSessions, setPastSessions] = useState<InterviewSessionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'practice' | 'history'>('practice');

  const categories = [
    'HR & Behavioral (STAR Method)',
    'Technical Software Architecture',
    'Coding & Problem Solving Logic',
    'Data Analytics & SQL Reasoning',
    'Product & Design Thinking',
    'Verbal Communication & Pitch',
  ];

  // Fetch past sessions for signed-in user
  useEffect(() => {
    if (!user) {
      setPastSessions([]);
      return;
    }

    const loadHistory = async () => {
      try {
        const q = query(collection(db, 'interviewSessions'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const list: InterviewSessionRecord[] = [];
        snap.forEach(d => {
          list.push({ id: d.id, ...d.data() } as InterviewSessionRecord);
        });
        setPastSessions(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } catch (err) {
        console.warn('History fetch warning:', err);
      }
    };

    loadHistory();
  }, [user]);

  const handleStartInterview = async () => {
    if (!role.trim()) {
      setErrorMsg('Please specify a target role.');
      return;
    }

    setLoadingQuestions(true);
    setErrorMsg(null);
    setCurrentEvaluation(null);
    setCompletedEvaluations([]);
    setSessionCompleted(false);

    try {
      const res = await fetch('/api/interviews/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          category,
          difficulty,
          questionCount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to initialize interview simulation.');
      }

      setQuestions(data.questions || []);
      setCurrentIndex(0);
      setIsSimulating(true);
    } catch (err: unknown) {
      console.error('Interview start error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Unable to connect to interview service.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) return;

    setEvaluating(true);
    setErrorMsg(null);

    const activeQ = questions[currentIndex];

    try {
      const res = await fetch('/api/interviews/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          category,
          question: activeQ.question,
          userAnswer,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to evaluate answer.');
      }

      const evalResult: InterviewEvaluationItem = {
        question: activeQ.question,
        userAnswer,
        score: data.score || 7,
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        idealAnswerOutline: data.idealAnswerOutline || '',
      };

      setCurrentEvaluation(evalResult);
      setCompletedEvaluations(prev => [...prev, evalResult]);
    } catch (err: unknown) {
      console.error('Answer evaluation error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Evaluation failed. Please retry.');
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = async () => {
    setUserAnswer('');
    setCurrentEvaluation(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Session finished
      setSessionCompleted(true);

      const allEvals = completedEvaluations;
      const totalScore = allEvals.reduce((acc, curr) => acc + curr.score, 0);
      const avgScore = allEvals.length > 0 ? Math.round((totalScore / allEvals.length) * 10) / 10 : 0;

      if (user) {
        try {
          const sessionRecord: Omit<InterviewSessionRecord, 'id'> = {
            userId: user.uid,
            role,
            category,
            difficulty,
            questionCount: questions.length,
            evaluations: allEvals,
            overallScore: avgScore,
            overallFeedback: `Completed practice session with an average performance score of ${avgScore}/10 across ${allEvals.length} evaluated questions.`,
            completedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          };

          const docRef = await addDoc(collection(db, 'interviewSessions'), sessionRecord);
          setPastSessions(prev => [{ id: docRef.id, ...sessionRecord }, ...prev]);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, 'interviewSessions');
        }
      }
    }
  };

  const currentQ = questions[currentIndex];
  const overallAvg = completedEvaluations.length > 0
    ? Math.round((completedEvaluations.reduce((a, b) => a + b.score, 0) / completedEvaluations.length) * 10) / 10
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="absolute inset-0 opacity-20">
          <img
            src="/src/assets/images/interview_prep_banner_1792323670252.jpg"
            alt="Interview preparation"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.8 Flash Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            AI-Powered Mock Interview Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Practice role-specific behavioral and technical interview questions. Receive instant scoring across relevance, clarity, and knowledge, with constructive guidance for real interviews.
          </p>
        </div>
      </div>

      {/* Tabs: Practice vs Past History */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('practice')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'practice'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Mock Interview Studio
        </button>
        {user && (
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-teal-600 text-teal-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Session History ({pastSessions.length})</span>
          </button>
        )}
      </div>

      {activeTab === 'practice' ? (
        !isSimulating ? (
          /* Session Setup Form */
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Configure Your Practice Session</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select your target job title, category, and desired difficulty to generate tailored questions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Junior Frontend Developer, Associate Data Analyst..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interview Track / Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDifficulty(lvl)}
                      className={`py-2 rounded-lg font-semibold text-xs border transition-colors cursor-pointer ${
                        difficulty === lvl
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Number of Questions</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value={3}>3 Questions (~10 mins)</option>
                  <option value={4}>4 Questions (~15 mins)</option>
                  <option value={5}>5 Questions (~20 mins)</option>
                </select>
              </div>

            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleStartInterview}
                disabled={loadingQuestions}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
              >
                {loadingQuestions ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Generating Tailored Questions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Start Practice Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : sessionCompleted ? (
          /* Session Completed Summary Report */
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Practice Complete</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">End-of-Session Performance Report</h2>
                <p className="text-xs text-slate-500 mt-1">Role: {role} · Category: {category}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Overall Score</span>
                <span className="text-3xl font-extrabold text-teal-600 tabular-nums">{overallAvg}/10</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Question-by-Question Evaluation Breakdown</h3>
              
              {completedEvaluations.map((ev, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-900 text-sm">
                      Q{idx + 1}: {ev.question}
                    </p>
                    <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded font-bold tabular-nums shrink-0">
                      Score: {ev.score}/10
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-600 text-xs italic">
                    "{ev.userAnswer}"
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/60 rounded-lg">
                      <p className="font-bold text-emerald-900 text-[11px] mb-1">Key Strengths</p>
                      <ul className="list-disc list-inside text-emerald-800 space-y-0.5 text-[11px]">
                        {ev.strengths.map((st, sIdx) => <li key={sIdx}>{st}</li>)}
                      </ul>
                    </div>

                    <div className="p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg">
                      <p className="font-bold text-amber-900 text-[11px] mb-1">Areas to Strengthen</p>
                      <ul className="list-disc list-inside text-amber-800 space-y-0.5 text-[11px]">
                        {ev.improvements.map((im, iIdx) => <li key={iIdx}>{im}</li>)}
                      </ul>
                    </div>
                  </div>

                  {ev.idealAnswerOutline && (
                    <div className="pt-2 text-[11px] text-slate-600">
                      <strong className="text-slate-800 block mb-0.5">Ideal Answer Framework:</strong>
                      <p className="leading-relaxed">{ev.idealAnswerOutline}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsSimulating(false);
                  setSessionCompleted(false);
                }}
                className="px-5 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                Configure New Session
              </button>

              <button
                onClick={handleStartInterview}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm cursor-pointer"
              >
                Repeat Same Role
              </button>
            </div>
          </div>
        ) : (
          /* Active Interactive Simulation Screen */
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
            
            {/* Top Tracker */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <span className="font-semibold text-teal-700">{role}</span>
                <span aria-hidden="true">·</span>
                <span>{category}</span>
              </div>
              <span className="font-bold text-slate-900 tabular-nums">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Current Question */}
            {currentQ && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-widest">Interviewer Prompt</span>
                <p className="text-base font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </p>
                {currentQ.expectedKeyPoints && (
                  <p className="text-[11px] text-slate-400">
                    Hint: Address context, technical choice/rationale, and business or project outcome.
                  </p>
                )}
              </div>
            )}

            {/* Answer Input or Feedback Display */}
            {!currentEvaluation ? (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-700">Your Response:</label>
                <textarea
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  rows={5}
                  placeholder="Type your structured answer here. Be specific, articulate, and reference real tools or methodologies where applicable..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 leading-relaxed placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-500"
                />

                {errorMsg && (
                  <p className="text-xs text-red-600 font-medium">{errorMsg}</p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      if (window.confirm('Quit this session?')) {
                        setIsSimulating(false);
                      }
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Cancel Session
                  </button>

                  <button
                    onClick={handleEvaluateAnswer}
                    disabled={evaluating || !userAnswer.trim()}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-40 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
                  >
                    {evaluating ? (
                      <>
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Evaluating Response with Gemini...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Answer for Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Feedback Card for Current Answer */
              <div className="p-5 rounded-xl border border-teal-200 bg-teal-50/40 space-y-4 text-xs">
                
                <div className="flex items-center justify-between border-b border-teal-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-slate-900 text-sm">Response Evaluation</span>
                  </div>
                  <span className="px-2.5 py-1 bg-teal-600 text-white rounded-md font-bold text-xs tabular-nums">
                    Score: {currentEvaluation.score}/10
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="font-bold text-emerald-800 text-xs mb-1">Observed Strengths</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                      {currentEvaluation.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200">
                    <p className="font-bold text-amber-800 text-xs mb-1">Actionable Improvements</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                      {currentEvaluation.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {currentEvaluation.idealAnswerOutline && (
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-slate-700 text-xs leading-relaxed">
                    <p className="font-bold text-slate-900 mb-1">Recommended Response Outline:</p>
                    <p className="text-slate-600 text-[11px]">{currentEvaluation.idealAnswerOutline}</p>
                  </div>
                )}

                <div className="pt-3 border-t border-teal-200/60 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Final Report'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            )}

          </div>
        )
      ) : (
        /* History Tab */
        <div className="space-y-4">
          {pastSessions.length === 0 ? (
            <div className="p-12 text-center rounded-xl border border-slate-200 bg-white space-y-2">
              <p className="text-sm font-semibold text-slate-700">No past mock interview sessions yet.</p>
              <p className="text-xs text-slate-400">Complete a simulation to store and track your performance scores.</p>
            </div>
          ) : (
            pastSessions.map((s) => (
              <div key={s.id} className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{s.role}</h3>
                    <p className="text-slate-500 text-[11px]">{s.category} · {s.difficulty} Level · {s.questionCount} Questions</p>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-teal-600 tabular-nums">{s.overallScore}/10</span>
                    <p className="text-[10px] text-slate-400 tabular-nums">{new Date(s.completedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-slate-600 text-xs">{s.overallFeedback}</p>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
