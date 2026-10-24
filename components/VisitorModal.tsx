'use client';

import { useState, useEffect } from 'react';

export default function VisitorForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    visitor_name: '',
    visitor_company: '',
    visitor_purpose: '',
    data_consent: false,
  });

  useEffect(() => {
    const hasVisited = localStorage.getItem('visitor_submitted');
    if (hasVisited === 'true') {
      setIsSubmitted(true);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.data_consent) return;

    localStorage.setItem('visitor_submitted', 'true');
    localStorage.setItem('visitor_name', formData.visitor_name);
    localStorage.setItem('visitor_company', formData.visitor_company);
    localStorage.setItem('visitor_purpose', formData.visitor_purpose);

    setIsSubmitted(true);
  };

  if (isSubmitted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
        
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Welcome to Punith&apos;s Website
          </h2>
          <p className="text-slate-400 text-sm">
            Please enter your details to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Your Name
            </label>
            <input
              type="text"
              name="visitor_name"
              required
              value={formData.visitor_name}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Company / Organization
            </label>
            <input
              type="text"
              name="visitor_company"
              value={formData.visitor_company}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition"
              placeholder="Company Inc."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Purpose of Visit
            </label>
            <input
              type="text"
              name="visitor_purpose"
              value={formData.visitor_purpose}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-500 transition"
              placeholder="e.g. Hiring, Collaboration"
            />
          </div>

          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              name="data_consent"
              id="data_consent"
              required
              checked={formData.data_consent}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
            />
            <label htmlFor="data_consent" className="text-xs text-slate-400 leading-relaxed cursor-pointer">
              I consent to providing my details and agree that my data will be handled securely, stored responsibly, and used strictly in accordance with standard privacy practices.
            </label>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center font-semibold py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition shadow-sm text-sm mt-4"
          >
            Submit & Continue
          </button>
        </form>

      </div>
    </div>
  );
}