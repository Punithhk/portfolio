'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from './AdminContext';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface HomeData {
  heroTitle: string;
  heroBio: string;
  heroImage?: string;
}

interface HomeClientViewProps {
  initialHome: HomeData;
  initialSections: Section[];
}

export default function HomeClientView({ initialHome, initialSections }: HomeClientViewProps) {
  const { isAdmin, pin } = useAdmin();
  const router = useRouter();

  const [heroTitle, setHeroTitle] = useState(initialHome.heroTitle);
  const [heroBio, setHeroBio] = useState(initialHome.heroBio);
  const [heroImage, setHeroImage] = useState(initialHome.heroImage || '');
  const [sections, setSections] = useState<Section[]>(initialSections);

  const [isEditingHero, setIsEditingHero] = useState(false);
  const [secTitle, setSecTitle] = useState('');
  const [secContent, setSecContent] = useState('');

  const handleUpdateHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resGet = await fetch('/api/portfolio');
      const allData = await resGet.json();

      allData.home = { heroTitle, heroBio, heroImage };

      const resPost = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, data: allData }),
      });

      if (!resPost.ok) throw new Error('Failed to save hero');

      setIsEditingHero(false);
      router.refresh();
      alert('Hero updated successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secTitle || !secContent) {
      alert('Fill out section title and content.');
      return;
    }

    const newSection: Section = { id: Date.now().toString(), title: secTitle, content: secContent };
    const updatedSections = [...sections, newSection];

    try {
      const resGet = await fetch('/api/portfolio');
      const allData = await resGet.json();

      allData.sections = updatedSections;

      const resPost = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, data: allData }),
      });

      if (!resPost.ok) throw new Error('Failed to add section');

      setSections(updatedSections);
      setSecTitle('');
      setSecContent('');
      router.refresh();
      alert('Section added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteSection = async (id: string) => {
    const updatedSections = sections.filter((s) => s.id !== id);
    try {
      const resGet = await fetch('/api/portfolio');
      const allData = await resGet.json();

      allData.sections = updatedSections;

      const resPost = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, data: allData }),
      });

      if (!resPost.ok) throw new Error('Failed to delete section');

      setSections(updatedSections);
      router.refresh();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 flex-1 flex flex-col justify-between w-full space-y-16">
      {/* Hero Section */}
      <div className="text-center flex flex-col items-center">
        {!isEditingHero ? (
          <div className="space-y-6 flex flex-col items-center">
            {heroImage && (
              <img 
                src={heroImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover border-2 border-cyan-500/50 shadow-lg mb-2" 
              />
            )}
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {heroTitle || 'Welcome to My Portfolio'}
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              {heroBio || 'Explore my work, projects, and skills.'}
            </p>

            {isAdmin && (
              <div className="pt-2">
                <button
                  onClick={() => setIsEditingHero(true)}
                  className="px-5 py-2 bg-slate-800 border border-slate-700 text-cyan-400 font-semibold rounded-lg hover:bg-slate-700 transition text-xs uppercase tracking-wider"
                >
                  Edit Hero Content & Photo
                </button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleUpdateHero} className="w-full bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 text-left shadow-2xl">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Edit Hero Section</h3>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Photo URL</label>
              <input
                type="text"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Title</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Bio</label>
              <textarea
                value={heroBio}
                onChange={(e) => setHeroBio(e.target.value)}
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm"
                rows={3}
                required
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-cyan-500 text-slate-950 font-semibold rounded-lg hover:bg-cyan-400 transition text-sm">Save</button>
              <button type="button" onClick={() => setIsEditingHero(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition text-sm">Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Dynamic Sections Management */}
      {isAdmin && (
        <div className="p-6 bg-cyan-950/20 border border-cyan-500/40 rounded-xl space-y-4">
          <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-xs">Add Home Section Widget</h3>
          <form onSubmit={handleAddSection} className="space-y-4">
            <input 
              type="text" 
              placeholder="Section Heading" 
              value={secTitle} 
              onChange={(e) => setSecTitle(e.target.value)} 
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm" 
            />
            <textarea 
              placeholder="Section Content" 
              value={secContent} 
              onChange={(e) => setSecContent(e.target.value)} 
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm" 
              rows={2} 
            />
            <button type="submit" className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-semibold rounded-lg hover:bg-cyan-400 transition text-sm">Add Section</button>
          </form>
        </div>
      )}

      {/* Render Sections */}
      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section) => (
          <div key={section.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{section.title}</h3>
              <p className="text-slate-400 text-sm">{section.content}</p>
            </div>
            {isAdmin && (
              <div className="pt-4 mt-4 border-t border-slate-800 flex justify-end">
                <button onClick={() => handleDeleteSection(section.id)} className="text-red-400 text-xs hover:underline">Delete Section</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}