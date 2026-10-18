import React, { useState } from 'react';
import { Mail, MessageSquare, Star, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export const ContactPage: React.FC = () => {
  const { user } = useAuth();
  const [category, setCategory] = useState<'general' | 'bug' | 'feature' | 'career_advice' | 'interview_prep'>('general');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email || '');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg('Please write a message before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    try {
      // 1. Submit to server endpoint
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          rating,
          message,
          contactEmail,
          userId: user?.uid,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Feedback submission failed.');
      }

      // 2. Persist to Firestore feedback collection
      try {
        await addDoc(collection(db, 'feedback'), {
          userId: user?.uid || 'anonymous',
          category,
          rating,
          message,
          contactEmail: contactEmail || 'Not provided',
          createdAt: new Date().toISOString(),
        });
      } catch (dbErr) {
        console.warn('Firestore feedback persistence note:', dbErr);
      }

      setSubmitted(true);
      setMessage('');
    } catch (err: unknown) {
      console.error('Feedback submit error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Unable to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Contact & Community Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
          YouthPath is continuously refined based on feedback from students, educators, and career counselors. Share bug reports, feature suggestions, or educational inquiries.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-center space-y-4">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto text-teal-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">Thank You for Your Feedback!</h3>
          <p className="text-xs text-teal-800 max-w-md mx-auto leading-relaxed">
            Your feedback has been received and securely logged. Your insights help ensure YouthPath remains an open, accessible employment platform for youth everywhere.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-semibold hover:bg-teal-700 transition-colors cursor-pointer"
          >
            Submit Another Note
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5 text-xs">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Feedback Category */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Feedback Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="general">General Inquiry or Experience</option>
              <option value="bug">Report an Issue or Bug</option>
              <option value="feature">Suggest a New Feature or Track</option>
              <option value="career_advice">Career Guidance Accuracy</option>
              <option value="interview_prep">Mock Interview Simulation Quality</option>
            </select>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Overall Platform Experience Rating</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-300 hover:text-amber-400 focus:outline-none cursor-pointer transition-colors"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
              <span className="text-xs text-slate-500 ml-2 font-medium">({rating} of 5 stars)</span>
            </div>
          </div>

          {/* Contact Email */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Your Email (Optional, if you wish to receive a reply)</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="name@university.edu"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-teal-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Your Message or Suggestion</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What worked well? What could we improve or add to better assist your career journey?"
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed focus:outline-none focus:bg-white focus:border-teal-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Feedback</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

      {/* Direct Contact Details */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
        <p><strong>Configured Inquiries:</strong> Educational institutions, career fairs, or developer questions can be directed to the YouthPath open support desk.</p>
        <p>Email: <span className="font-mono text-slate-700">support@youthpath.edu</span></p>
      </div>

    </div>
  );
};
