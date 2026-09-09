'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from './AdminContext';

interface ProjectItem {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  skillsUsed: string;
  link: string;
  photo: string;
}

export default function ProjectsClientView({ initialProjects }: { initialProjects: ProjectItem[] }) {
  const { isAdmin, pin } = useAdmin();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skillsUsed, setSkillsUsed] = useState('');
  const [link, setLink] = useState('');
  const [photo, setPhoto] = useState('');

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      alert('Title and description are required.');
      return;
    }

    const newProject: ProjectItem = {
      id: Date.now().toString(),
      title,
      description,
      skillsUsed,
      link,
      photo: photo || 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400',
    };

    const updatedProjects = [...projects, newProject];

    try {
      const resGet = await fetch('/api/portfolio');
      const allData = await resGet.json();
      allData.projects = updatedProjects;

      const resPost = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, data: allData }),
      });

      if (!resPost.ok) throw new Error('Failed to save project');

      setProjects(updatedProjects);
      setTitle('');
      setDescription('');
      setSkillsUsed('');
      setLink('');
      setPhoto('');
      router.refresh();
      alert('Project added successfully!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDelete = async (targetId: string) => {
    // Filter out by matching either id or _id to ensure compatibility with MongoDB documents
    const updatedProjects = projects.filter((p) => p.id !== targetId && p._id !== targetId);
    try {
      const resGet = await fetch('/api/portfolio');
      const allData = await resGet.json();
      allData.projects = updatedProjects;

      const resPost = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, data: allData }),
      });

      if (!resPost.ok) throw new Error('Failed to delete project');

      setProjects(updatedProjects);
      router.refresh();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div>
      {isAdmin && (
        <div className="mb-12 p-6 bg-cyan-950/20 border border-cyan-500/40 rounded-xl space-y-4">
          <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-xs">Add Project Widget</h3>
          <form onSubmit={handleAddProject} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
              required
            />
            <input
              type="text"
              placeholder="Project Link URL"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
            />
            <input
              type="text"
              placeholder="Skills Used (e.g. Next.js, React, Tailwind)"
              value={skillsUsed}
              onChange={(e) => setSkillsUsed(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
            />
            <input
              type="text"
              placeholder="Photo URL"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
            />
            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm md:col-span-2"
              rows={3}
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-cyan-500 text-slate-950 font-semibold rounded-lg hover:bg-cyan-400 transition md:col-span-2 text-sm"
            >
              Add Project
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((proj, idx) => {
          const uniqueKey = proj.id || proj._id || idx;
          return (
            <div key={uniqueKey} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
              {proj.photo && (
                <img src={proj.photo} alt={proj.title} className="w-full h-48 object-cover border-b border-slate-800" />
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{proj.title}</h3>
                  <p className="text-slate-400 text-sm mb-4">{proj.description}</p>
                  
                  {proj.skillsUsed && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {proj.skillsUsed.split(',').map((skill, sIdx) => (
                        <span key={sIdx} className="px-2.5 py-0.5 bg-cyan-950/40 border border-cyan-800/40 text-cyan-400 text-xs rounded-md font-medium">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                  {proj.link ? (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 text-xs font-semibold hover:underline">
                      View Project →
                    </a>
                  ) : <span />}
                  
                  {isAdmin && (
                    <button onClick={() => handleDelete(proj.id || proj._id || '')} className="text-red-400 text-xs hover:underline">
                      Delete Project
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}