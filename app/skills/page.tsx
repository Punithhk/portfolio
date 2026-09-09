import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillsClientView from '@/components/SkillsClientView';
import fs from 'fs';
import path from 'path';

async function getData() {
  const filePath = path.join(process.cwd(), 'portfolio-data.json');
  if (!fs.existsSync(filePath)) {
    return { skills: [] };
  }
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData);
}

export default async function SkillsPage() {
  const data = await getData();

  return (
    <main className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-20 w-full flex-1">
        <h1 className="text-4xl font-extrabold mb-4">Tech Stack & Skills</h1>
        <p className="text-slate-400 mb-10">A structured breakdown of my core technical competencies and tools.</p>
        
        <SkillsClientView initialSkills={data.skills || []} />
      </div>
      <Footer />
    </main>
  );
}