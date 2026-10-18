import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ExternalLink, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Sparkles,
  Filter
} from 'lucide-react';
import { LEARNING_RESOURCES } from '../data/learningData';
import { LearningResourceItem, UserLearningProgress } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore';

interface SkillsPageProps {
  navigate: (path: string) => void;
}

export const SkillsPage: React.FC<SkillsPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [userProgressMap, setUserProgressMap] = useState<Record<string, UserLearningProgress>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const categories = [
    'All',
    'Web Development',
    'Software Engineering',
    'Data Analytics',
    'Computer Science',
    'Cloud & DevOps',
    'UI/UX Design',
    'Cybersecurity',
    'Marketing',
    'Human Resources',
    'Finance',
    'Communications'
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  // Load user learning progress from Firestore
  useEffect(() => {
    if (!user) {
      setUserProgressMap({});
      return;
    }

    const fetchProgress = async () => {
      try {
        const q = query(collection(db, 'learningProgress'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const map: Record<string, UserLearningProgress> = {};
        snap.forEach(d => {
          const item = d.data() as UserLearningProgress;
          map[item.resourceId] = { ...item, id: d.id };
        });
        setUserProgressMap(map);
      } catch (err) {
        console.warn('Learning progress fetch warning:', err);
      }
    };

    fetchProgress();
  }, [user]);

  const updateStatus = async (resource: LearningResourceItem, newStatus: 'not_started' | 'in_progress' | 'completed') => {
    if (!user) {
      navigate('/login');
      return;
    }

    setUpdatingId(resource.id);
    const docId = `${user.uid}_${resource.id}`;
    const progressItem: UserLearningProgress = {
      id: docId,
      userId: user.uid,
      resourceId: resource.id,
      title: resource.title,
      category: resource.category,
      level: resource.level,
      status: newStatus,
      progressPercentage: newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? 50 : 0,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'learningProgress', docId), progressItem);
      setUserProgressMap(prev => ({ ...prev, [resource.id]: progressItem }));
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `learningProgress/${docId}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredResources = LEARNING_RESOURCES.filter(r => {
    const matchCat = selectedCategory === 'All' || r.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchLevel = selectedLevel === 'All' || r.level.toLowerCase() === selectedLevel.toLowerCase();
    return matchCat && matchLevel;
  });

  const completedCount = Object.values(userProgressMap).filter(p => p.status === 'completed').length;
  const inProgressCount = Object.values(userProgressMap).filter(p => p.status === 'in_progress').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Skill Development & Learning Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Curated, reputable educational resources from official documentation authorities and leading institutions. Track your milestones and build practical competency.
          </p>
        </div>

        {user && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs">
            <div>
              <span className="text-slate-500 font-medium">In Progress: </span>
              <span className="font-bold text-amber-700 tabular-nums">{inProgressCount}</span>
            </div>
            <span aria-hidden="true" className="text-slate-300">|</span>
            <div>
              <span className="text-slate-500 font-medium">Completed: </span>
              <span className="font-bold text-teal-700 tabular-nums">{completedCount}</span>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bars */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Category Filter:</span>
        </div>
        
        {/* Category tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level filter */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">Skill Level:</span>
          {levels.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          const userProg = userProgressMap[res.id];
          const currentStatus = userProg?.status || 'not_started';

          return (
            <div
              key={res.id}
              className="p-6 rounded-xl border border-slate-200 bg-white hover:border-teal-500/60 hover:shadow-xs transition-all flex flex-col justify-between text-left"
            >
              <div>
                
                {/* Unboxed Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-teal-700">{res.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{res.level}</span>
                  </div>
                  <span className="tabular-nums flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ~{res.estimatedHours}h
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">{res.title}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Offered by {res.provider}</p>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                  {res.description}
                </p>

                {/* Covered skills */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {res.skillsCovered.map((s, idx) => (
                      <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Progress and Action Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                
                {/* Status Toggle buttons */}
                <div className="flex items-center justify-between gap-1 text-[11px]">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateStatus(res, 'not_started')}
                      disabled={updatingId === res.id}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        currentStatus === 'not_started' 
                          ? 'bg-slate-200 text-slate-800 font-semibold' 
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Not Started
                    </button>
                    <button
                      onClick={() => updateStatus(res, 'in_progress')}
                      disabled={updatingId === res.id}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        currentStatus === 'in_progress' 
                          ? 'bg-amber-100 text-amber-800 font-semibold' 
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => updateStatus(res, 'completed')}
                      disabled={updatingId === res.id}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        currentStatus === 'completed' 
                          ? 'bg-teal-100 text-teal-800 font-semibold' 
                          : 'text-slate-400 hover:text-slate-700'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>

                {/* Launch External resource link */}
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-slate-50 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Access Educational Resource</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
