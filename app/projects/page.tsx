import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectsClientView from '@/components/ProjectsClientView';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

async function getData() {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio');
    const data = await db.collection('content').findOne({ _id: 'main_data' as any });
    
    if (!data) {
      return { projects: [] };
    }
    
    const { _id, ...cleanData } = data;
    return cleanData;
  } catch (error) {
    console.error('Failed to fetch from DB:', error);
    return { projects: [] };
  }
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