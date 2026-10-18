import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Search, 
  MapPin, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink, 
  Info, 
  X, 
  IndianRupee, 
  Calendar, 
  Building2,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { JobListing, SavedJobRecord } from '../types';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

interface JobsPageProps {
  navigate: (path: string) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [providerInfo, setProviderInfo] = useState<{ isLiveFeed: boolean; provider: string; message?: string }>({
    isLiveFeed: false,
    provider: 'Loading provider status...',
  });

  // Search & Filters
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [remoteFilter, setRemoteFilter] = useState('all');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('all');
  const [experienceLevelFilter, setExperienceLevelFilter] = useState('all');

  // Selected Job Modal
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  // Saved Jobs tracking
  const [savedJobMap, setSavedJobMap] = useState<Record<string, string>>({}); // jobId -> savedRecordId
  const [saveActionLoading, setSaveActionLoading] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const params = new URLSearchParams();
      if (keyword) params.set('keyword', keyword);
      if (location) params.set('location', location);
      if (remoteFilter !== 'all') params.set('remote', remoteFilter);
      if (employmentTypeFilter !== 'all') params.set('employmentType', employmentTypeFilter);
      if (experienceLevelFilter !== 'all') params.set('experienceLevel', experienceLevelFilter);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to fetch job listings.');
      }

      setJobs(data.jobs || []);
      setProviderInfo({
        isLiveFeed: Boolean(data.isLiveFeed),
        provider: data.provider || 'YouthPath Job Engine',
        message: data.message,
      });
    } catch (err: unknown) {
      console.error('Job fetch error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Unable to connect to job engine.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [remoteFilter, employmentTypeFilter, experienceLevelFilter]);

  // Load user's saved jobs from Firestore
  useEffect(() => {
    if (!user) {
      setSavedJobMap({});
      return;
    }

    const loadSavedJobs = async () => {
      try {
        const q = query(collection(db, 'savedJobs'), where('userId', '==', user.uid));
        const snap = await getDocs(q);
        const map: Record<string, string> = {};
        snap.forEach(d => {
          const item = d.data() as SavedJobRecord;
          map[item.jobId] = d.id;
        });
        setSavedJobMap(map);
      } catch (err) {
        console.warn('Saved jobs load error:', err);
      }
    };

    loadSavedJobs();
  }, [user]);

  const toggleSaveJob = async (job: JobListing) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setSaveActionLoading(job.id);
    const existingDocId = savedJobMap[job.id];

    try {
      if (existingDocId) {
        // Unsave
        await deleteDoc(doc(db, 'savedJobs', existingDocId));
        setSavedJobMap(prev => {
          const next = { ...prev };
          delete next[job.id];
          return next;
        });
      } else {
        // Save
        const docRef = await addDoc(collection(db, 'savedJobs'), {
          userId: user.uid,
          jobId: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          employmentType: job.employmentType,
          remoteType: job.remoteType,
          salary: job.salary || '',
          description: job.description,
          url: job.url,
          source: job.source,
          postedDate: job.postedDate,
          savedAt: new Date().toISOString(),
        });
        setSavedJobMap(prev => ({ ...prev, [job.id]: docRef.id }));
      }
    } catch (err) {
      handleFirestoreError(err, existingDocId ? OperationType.DELETE : OperationType.CREATE, 'savedJobs');
    } finally {
      setSaveActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Youth & Entry-Level Job Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
          Search open vacancies, internships, and associate programs with transparent requirements, salary disclosure, and verified application destinations.
        </p>
      </div>

      {/* Provider Status & Configuration Banner */}
      <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
        providerInfo.isLiveFeed 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
          : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <Info className={`w-4 h-4 shrink-0 mt-0.5 ${providerInfo.isLiveFeed ? 'text-emerald-600' : 'text-slate-500'}`} />
        <div className="flex-1">
          <div className="font-semibold flex items-center gap-2">
            <span>Data Feed Source: {providerInfo.provider}</span>
            {providerInfo.isLiveFeed && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">Live API</span>
            )}
          </div>
          <p className="text-slate-600 mt-0.5">
            {providerInfo.message || 'Results are fetched directly from external job provider APIs or verified YouthPath demonstration listings.'}
          </p>
        </div>
      </div>

      {/* Search and Filters Strip */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Keyword & Location inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
              placeholder="Job title, technical skill, or keyword..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-500"
            />
          </div>

          <div className="md:col-span-4 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
              placeholder="e.g. Bengaluru, Hyderabad, Pune, Mumbai, Remote..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-teal-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              onClick={fetchJobs}
              className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns (Zero-pill discipline) */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={remoteFilter}
            onChange={(e) => setRemoteFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="all">All Workplaces</option>
            <option value="remote">Remote Only</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">Onsite</option>
          </select>

          <select
            value={employmentTypeFilter}
            onChange={(e) => setEmploymentTypeFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="all">All Employment Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="internship">Internship</option>
          </select>

          <select
            value={experienceLevelFilter}
            onChange={(e) => setExperienceLevelFilter(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-700 focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="all">All Experience Levels</option>
            <option value="entry level">Entry Level</option>
            <option value="associate">Associate</option>
            <option value="internship">Internship</option>
          </select>
        </div>

      </div>

      {/* Jobs Listing Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 rounded-xl border border-slate-200 bg-white animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-10 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : errorMsg ? (
        <div className="p-6 rounded-xl border border-red-200 bg-red-50 text-red-700 text-center space-y-2">
          <p className="text-sm font-semibold">{errorMsg}</p>
          <button
            onClick={fetchJobs}
            className="px-4 py-1.5 text-xs font-semibold bg-red-100 hover:bg-red-200 text-red-800 rounded-md cursor-pointer"
          >
            Retry Search
          </button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-slate-200 bg-white space-y-2">
          <p className="text-sm font-bold text-slate-800">No jobs found matching your criteria</p>
          <p className="text-xs text-slate-500">Try broadening your keyword or clearing workplace filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const isSaved = Boolean(savedJobMap[job.id]);
            return (
              <div
                key={job.id}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-teal-500/60 hover:shadow-sm transition-all flex flex-col justify-between text-left"
              >
                <div>
                  
                  {/* Top unboxed metadata */}
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-slate-800">{job.company}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.location}</span>
                    </div>

                    <button
                      onClick={() => toggleSaveJob(job)}
                      disabled={saveActionLoading === job.id}
                      className="p-1.5 text-slate-400 hover:text-teal-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                      title={isSaved ? 'Remove from Saved' : 'Save Job'}
                      aria-label="Save Job"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-teal-600 fill-teal-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-1">{job.title}</h3>

                  {/* Attributes line */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-2">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{job.employmentType}</span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">{job.remoteType}</span>
                    {job.salary && (
                      <span className="text-teal-700 font-semibold tabular-nums">{job.salary}</span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  {job.skillsRequired && job.skillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {job.skillsRequired.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 tabular-nums">
                    Posted: {job.postedDate} · Source: {job.source}
                  </span>
                  
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="font-semibold text-teal-600 hover:text-teal-700 cursor-pointer"
                  >
                    View Details
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 text-left my-8">
            
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-semibold text-teal-700">{selectedJob.company}</span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedJob.title}</h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedJob.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedJob.employmentType}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedJob.remoteType}</span>
                  {selectedJob.salary && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-semibold text-teal-700 tabular-nums">{selectedJob.salary}</span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-700">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Job Description</h4>
                <p className="leading-relaxed whitespace-pre-wrap text-slate-600 text-sm">
                  {selectedJob.description}
                </p>
              </div>

              {selectedJob.skillsRequired && selectedJob.skillsRequired.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Skills Required</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.skillsRequired.map((s, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-[11px] text-slate-500 space-y-1">
                <p><strong>Published By:</strong> {selectedJob.source}</p>
                <p><strong>Date Added:</strong> {selectedJob.postedDate}</p>
                <p><strong>Notice:</strong> YouthPath does not accept direct job submissions for unverified employers. Applications redirect to the official employer posting.</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
              <button
                onClick={() => toggleSaveJob(selectedJob)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                {savedJobMap[selectedJob.id] ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 text-teal-600" />
                    <span>Saved in Profile</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>Save Job</span>
                  </>
                )}
              </button>

              <a
                href={selectedJob.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Apply on Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
