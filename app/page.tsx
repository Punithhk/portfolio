import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomeClientView from '@/components/HomeClientView';
import fs from 'fs';
import path from 'path';

async function getData() {
  const filePath = path.join(process.cwd(), 'portfolio-data.json');
  if (!fs.existsSync(filePath)) {
    return { home: { heroTitle: '', heroBio: '' }, sections: [] };
  }
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData);
}

export default async function Home() {
  const data = await getData();

  return (
    <main className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      <Navbar />
      <HomeClientView 
        initialHome={data.home || { heroTitle: '', heroBio: '' }} 
        initialSections={data.sections || []} 
      />
      <Footer />
    </main>
  );
}