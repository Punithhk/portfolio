import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventsClientView from '@/components/EventsClientView';
import clientPromise from '@/lib/mongodb';

async function getData() {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio');
    const data = await db.collection('content').findOne({ _id: 'main_data' as any });

    if (!data) {
      return { events: [] };
    }

    const { _id, ...cleanData } = data as any;
    return cleanData;
  } catch (error) {
    console.error('Failed to fetch events from MongoDB:', error);
    return { events: [] };
  }
}

export default async function EventsPage() {
  const data = await getData();

  return (
    <main className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-20 w-full flex-1">
        <h1 className="text-4xl font-extrabold mb-4">Recent Events & Learnings</h1>
        <p className="text-slate-400 mb-10">Conferences, meetups, and key takeaways from recent tech gatherings.</p>
        
        <EventsClientView initialEvents={data.events || []} />
      </div>
      <Footer />
    </main>
  );
}