import React, { useState, useEffect } from 'react';
import { 
  User, 
  Save, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  X, 
  GraduationCap, 
  Briefcase, 
  Wrench, 
  MapPin, 
  HeartHandshake 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types';

interface ProfilePageProps {
  navigate: (path: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const { user, profile, updateUserProfile, deleteUserAccount, profileCompletion } = useAuth();
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    fullName: '',
    location: '',
    educationLevel: "Bachelor's Degree",
    degree: '',
    graduationYear: '2026',
    technicalSkills: [],
    softSkills: [],
    workExperience: '',
    internshipExperience: '',
    projects: '',
    certifications: '',
    languages: ['English'],
    preferredJobRoles: [],
    preferredLocations: [],
    preferredEmploymentType: 'Full-time',
    careerInterests: '',
    learningGoals: '',
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        location: profile.location || '',
        educationLevel: profile.educationLevel || "Bachelor's Degree",
        degree: profile.degree || '',
        graduationYear: profile.graduationYear || '2026',
        technicalSkills: profile.technicalSkills || [],
        softSkills: profile.softSkills || [],
        workExperience: profile.workExperience || '',
        internshipExperience: profile.internshipExperience || '',
        projects: profile.projects || '',
        certifications: profile.certifications || '',
        languages: profile.languages || ['English'],
        preferredJobRoles: profile.preferredJobRoles || [],
        preferredLocations: profile.preferredLocations || [],
        preferredEmploymentType: profile.preferredEmploymentType || 'Full-time',
        careerInterests: profile.careerInterests || '',
        learningGoals: profile.learningGoals || '',
      });
    }
  }, [profile]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Sign In to Edit Your Profile</h2>
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    const skills = formData.technicalSkills || [];
    if (!skills.includes(newSkill.trim())) {
      setFormData({ ...formData, technicalSkills: [...skills, newSkill.trim()] });
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      technicalSkills: (formData.technicalSkills || []).filter(s => s !== skill),
    });
  };

  const handleAddRole = () => {
    if (!newRole.trim()) return;
    const roles = formData.preferredJobRoles || [];
    if (!roles.includes(newRole.trim())) {
      setFormData({ ...formData, preferredJobRoles: [...roles, newRole.trim()] });
    }
    setNewRole('');
  };

  const handleRemoveRole = (role: string) => {
    setFormData({
      ...formData,
      preferredJobRoles: (formData.preferredJobRoles || []).filter(r => r !== role),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await updateUserProfile(formData);
      setSuccessMsg('Profile updated and synchronized successfully!');
    } catch (err: unknown) {
      console.error('Save error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update profile.');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccessMsg(null), 4000);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your YouthPath account and all associated resumes and data? This action is permanent.')) {
      try {
        await deleteUserAccount();
        navigate('/');
      } catch (err) {
        alert('Failed to delete account. You may need to re-login recently before deleting.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Career Profile & Preferences</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Keep your skills, degree, and career interests up to date to get tailored recommendations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Completion:</span>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded tabular-nums">
            {profileCompletion}%
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-teal-50 border border-teal-200 text-teal-800 text-xs rounded-lg font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-teal-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Personal Details */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            <span>Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email (Authenticated)</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full p-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bengaluru, Hyderabad, Pune, Mumbai, Delhi NCR, Remote"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Education Details */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-teal-600" />
            <span>Education & Academic Background</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Education Level</label>
              <select
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option>Bachelor's Degree (B.Tech / B.E. / BCA / B.Sc / B.Com)</option>
                <option>Master's Degree (M.Tech / MCA / M.Sc / MBA)</option>
                <option>Diploma / Polytechnic</option>
                <option>Higher Secondary (12th Standard / Intermediate)</option>
                <option>Secondary (10th Standard / Matriculation)</option>
                <option>Doctorate / PhD</option>
                <option>Certification / Vocational Training</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Degree & Major</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. B.Tech in Computer Science, BCA, B.Sc IT"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Graduation Year</label>
              <input
                type="text"
                value={formData.graduationYear}
                onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                placeholder="e.g. 2026"
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Technical & Soft Skills */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-teal-600" />
            <span>Technical Skills</span>
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="Add skill (e.g. React, SQL, Python, Figma) and press Enter..."
              className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-teal-500"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {(formData.technicalSkills || []).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-red-500 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Job Roles & Employment */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-teal-600" />
            <span>Career Preferences & Targets</span>
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Roles</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddRole();
                    }
                  }}
                  placeholder="e.g. Junior Frontend Developer, Associate Data Analyst..."
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
                >
                  Add Role
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {(formData.preferredJobRoles || []).map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-medium border border-teal-200"
                  >
                    <span>{r}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRole(r)}
                      className="text-teal-400 hover:text-red-500 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Employment Type</label>
              <select
                value={formData.preferredEmploymentType}
                onChange={(e) => setFormData({ ...formData, preferredEmploymentType: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Account & Data</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
