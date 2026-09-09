'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';

export default function VisitorModal() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    visitor_name: '',
    visitor_company: '',
    visitor_purpose: '',
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (session) {
      localStorage.setItem('visitor_submitted', 'true');
      setIsOpen(false);
      return;
    }

    const hasVisited = localStorage.getItem('visitor_submitted');
    if (!hasVisited) {
      setIsOpen(true);
    }
  }, [session, status]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleOAuthLogin = () => {
    document.cookie = `pending_name=${encodeURIComponent(formData.visitor_name)}; path=/; max-age=300; SameSite=Lax`;
    document.cookie = `pending_company=${encodeURIComponent(formData.visitor_company)}; path=/; max-age=300; SameSite=Lax`;
    document.cookie = `pending_purpose=${encodeURIComponent(formData.visitor_purpose)}; path=/; max-age=300; SameSite=Lax`;
    
    localStorage.setItem('visitor_submitted', 'true');
    signIn('google');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
        
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black text-white tracking-tight">
            Welcome to Punith&apos;s Website
          </h2>
          <p className="text-slate-400 text-sm">
            Enter your details and continue with Google to unlock the content.
          </p>
        </div>

        <div className="space-y-4">
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

          <button
            type="button"
            onClick={handleGoogleOAuthLogin}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold py-3 px-4 rounded-xl hover:bg-slate-100 transition shadow-sm text-sm mt-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.36 7.23 24 12 24z" />
              <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.19C.43 8.14 0 9.88 0 12s.43 3.86 1.19 5.39l4.08-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.64 1.19 6.61l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z" />
            </svg>
            Continue with Google & Submit
          </button>
        </div>

      </div>
    </div>
  );
}