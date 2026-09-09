import { getPortfolioData, updatePortfolioData } from '@/app/actions';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsClientView from '@/components/ProjectsClientView'; // We separate client interactive parts

export default async function ProjectsPage() {
  const data = await getPortfolioData();

  return (
    <main className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-20 w-full flex-1">
        <h1 className="text-4xl font-extrabold mb-4">My Projects</h1>
        <p className="text-slate-400 mb-10">Explore the applications and tools I have built.</p>
        
        {/* Pass initial data and server action down to a client component wrapper */}
        <ProjectsClientView initialProjects={data.projects} />
      </div>
      <Footer />
    </main>
  );
}