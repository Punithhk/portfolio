'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from './AdminContext';

interface SkillCategory {
  id: string;
  category: string;
  items: string;
}

export default function SkillsClientView({ initialSkills }: { initialSkills: SkillCategory[] }) {
  const { isAdmin, pin } = useAdmin();
  const router = useRouter();
  const [skills, setSkills] = useState<SkillCategory[]>(initialSkills);

  const [category, setCategory] = useState('');
  const [items, setItems] = useState('');

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !items) {
      alert('Category and items are required.');
      return;
    }

    const newSkill: SkillCategory = {
      id: Date.now().toString(),
      category,
      items,
    };

    const updatedSkills = [...skills, newSkill];

    try {
      const resGet = await fetch('/api/portfolio');
      const allData = await resGet.json();
      allData.skills = updatedSkills;

      const resPost = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, data: allData }),
      });

      if (!resPost.ok) throw new Error('Failed to save skill');

      setSkills(updatedSkills);
      setCategory('');
      setItems('');
      router.refresh();
      alert('Skill category added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    const updatedSkills = skills.filter((s) => s.id !== id);
    try {
      const resGet = await fetch('/api/portfolio');
      const allData = await resGet.json();
      allData.skills = updatedSkills;

      const resPost = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, data: allData }),
      });

      if (!resPost.ok) throw new Error('Failed to delete skill');

      setSkills(updatedSkills);
      router.refresh();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div>
      {isAdmin && (
        <div className="mb-12 p-6 bg-cyan-950/20 border border-cyan-500/40 rounded-xl space-y-4">
          <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-xs">Add Skill Category Widget</h3>
          <form onSubmit={handleAddSkill} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Category Name (e.g. Frontend)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
              required
            />
            <input
              type="text"
              placeholder="Tech Stack Items (comma-separated)"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-cyan-500 text-slate-950 font-semibold rounded-lg hover:bg-cyan-400 transition md:col-span-2 text-sm"
            >
              Add Skill Matrix
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((skill) => (
          <div key={skill.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-3">{skill.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.split(',').map((item, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-md">
                    {item.trim()}
                  </span>
                ))}
              </div>
            </div>
            {isAdmin && (
              <div className="pt-4 mt-6 border-t border-slate-800 flex justify-end">
                <button onClick={() => handleDelete(skill.id)} className="text-red-400 text-xs hover:underline">
                  Delete Category
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}