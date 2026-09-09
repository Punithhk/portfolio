'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from './AdminContext';

interface EventItem {
  id?: string;
  _id?: string;
  eventName: string;
  location: string;
  summary: string;
  photo: string;
}

export default function EventsClientView({ initialEvents }: { initialEvents: EventItem[] }) {
  const { isAdmin, pin } = useAdmin();
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>(initialEvents);

  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [summary, setSummary] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName || !summary) {
      alert('Event name and summary are required.');
      return;
    }

    setUploading(true);

    try {
      let photoUrl = '';

      if (file) {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('pin', pin || '1234'); // Fallback to '1234' if context pin is empty

        const resUpload = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        const uploadResult = await resUpload.json();
        if (!resUpload.ok) throw new Error(uploadResult.error || 'Image upload failed');
        photoUrl = uploadResult.url;
      }

      const newEvent: EventItem = {
        id: Date.now().toString(),
        eventName,
        location,
        summary,
        photo: photoUrl,
      };

      const updatedEvents = [...events, newEvent];

      const resGet = await fetch('/api/portfolio');
      const allData = await resGet.json();
      allData.events = updatedEvents;

      const resPost = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin || '1234', data: allData }),
      });

      if (!resPost.ok) {
        const errData = await resPost.json();
        throw new Error(errData.error || 'Failed to save event');
      }

      setEvents(updatedEvents);
      setEventName('');
      setLocation('');
      setSummary('');
      setFile(null);
      router.refresh();
      alert('Event and photo successfully uploaded and saved!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (targetId: string) => {
    const updatedEvents = events.filter((ev) => ev.id !== targetId && ev._id !== targetId);
    try {
      const resGet = await fetch('/api/portfolio');
      const allData = await resGet.json();
      allData.events = updatedEvents;

      const resPost = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pin || '1234', data: allData }),
      });

      if (!resPost.ok) {
        const errData = await resPost.json();
        throw new Error(errData.error || 'Failed to delete event');
      }

      setEvents(updatedEvents);
      router.refresh();
    } catch (err: any) {
      alert('Delete failed: ' + err.message);
    }
  };

  return (
    <div>
      {isAdmin && (
        <div className="mb-12 p-6 bg-cyan-950/20 border border-cyan-500/40 rounded-xl space-y-4">
          <h3 className="text-cyan-400 font-bold uppercase tracking-wider text-xs">Add Event Widget</h3>
          <form onSubmit={handleAddEvent} className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Event Name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm"
            />
            <div className="md:col-span-2">
              <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Upload Event Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400"
              />
            </div>
            <textarea
              placeholder="Summary & Learnings"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm md:col-span-2"
              rows={3}
              required
            />
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-3 bg-cyan-500 text-slate-950 font-semibold rounded-lg hover:bg-cyan-400 transition md:col-span-2 text-sm disabled:opacity-50"
            >
              {uploading ? 'Uploading & Saving...' : 'Add Event'}
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {events.map((ev, idx) => {
          const uniqueKey = ev.id || ev._id || idx;
          return (
            <div key={uniqueKey} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
              {ev.photo && (
                <img src={ev.photo} alt={ev.eventName} className="w-full h-48 object-cover border-b border-slate-800" />
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white">{ev.eventName}</h3>
                    {ev.location && <span className="text-xs text-cyan-400 font-medium px-2 py-1 bg-cyan-950/40 rounded border border-cyan-800/50">{ev.location}</span>}
                  </div>
                  <p className="text-slate-400 text-sm mt-2">{ev.summary}</p>
                </div>
                {isAdmin && (
                  <div className="pt-4 mt-6 border-t border-slate-800 flex justify-end">
                    <button onClick={() => handleDelete(ev.id || ev._id || '')} className="text-red-400 text-xs hover:underline">
                      Delete Event
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}