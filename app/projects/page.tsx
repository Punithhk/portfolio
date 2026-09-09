import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsClientView from '@/components/ProjectsClientView';
import fs from 'fs';
import path from 'path';

// Read directly from the JSON file on the server
async function getData() {
  const filePath = path.join(process.cwd(), 'portfolio-data.json');
  if (!fs.existsSync(filePath)) {
    return { projects: [] };
  }
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData);
}

export default async function ProjectsPage() {
  const data = await getData();

  return (
    <main className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-20 w-full flex-1">
        <h1 className="text-4xl font-extrabold mb-4">My Projects</h1>
        <p className="text-slate-400 mb-10">Explore the applications and tools I have built.</p>
        
        <ProjectsClientView initialProjects={data.projects || []} />
      </div>
      <Footer />
    </main>
  );
}