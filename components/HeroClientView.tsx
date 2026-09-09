'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from './AdminContext';

interface HomeData {
  heroTitle: string;
  heroBio: string;
}

export default function HomeClientView({ initialData }: { initialData: HomeData }) {
  const { isAdmin, pin } = useAdmin();
  const router = useRouter();

  const [heroTitle, setHeroTitle] = useState(initialData.heroTitle);
  const [heroBio, setHeroBio] = useState(initialData.heroBio);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Fetch current full data via GET
      const resGet = await fetch('/api/portfolio');
      const allData = await resGet.json();

      // 2. Modify home properties
      allData.home = { heroTitle, heroBio };

      // 3. Send update via POST API route
      const resPost = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, data: allData }),
      });

      const result = await resPost.json();

      if (!resPost.ok) {
        throw new Error(result.error || 'Failed to save');
      }

      setIsEditing(false);
      router.refresh();
      alert('Hero section successfully updated in JSON file!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-28 text-center flex-1 flex flex-col justify-center items-center">
      {!isEditing ? (
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {heroTitle || 'Welcome to My Portfolio'}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            {heroBio || 'Explore my work, projects, and skills.'}
          </p>

          {isAdmin && (
            <div className="pt-4">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-semibold rounded-lg hover:bg-cyan-400 transition text-sm"
              >
                Edit Hero Content
              </button>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl space-y-4 text-left shadow-2xl">
          <h3 className="text-lg font-bold text-cyan-400">Edit Hero Section</h3>
          
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Hero Title</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Hero Bio</label>
            <textarea
              value={heroBio}
              onChange={(e) => setHeroBio(e.target.value)}
              className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm"
              rows={3}
              required
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-cyan-500 text-slate-950 font-semibold rounded-lg hover:bg-cyan-400 transition text-sm"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}