import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

const ADMIN_PIN = '1234'; // Matches your AdminContext PIN

let cachedPortfolioData: any = null;

export async function GET() {
  try {
    if (cachedPortfolioData) {
      return NextResponse.json(cachedPortfolioData);
    }

    const client = await clientPromise;
    const db = client.db('portfolio');
    const data = await db.collection('content').findOne({ _id: 'main_data' as any });

    if (!data) {
      cachedPortfolioData = {
        home: {
          heroTitle: "Building digital experiences with Next.js & React",
          heroBio: "I design and build robust, scalable web applications.",
          heroImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"
        },
        projects: [],
        events: []
      };
    } else {
      const { _id, ...cleanData } = data;
      cachedPortfolioData = cleanData;
    }

    return NextResponse.json(cachedPortfolioData);
  } catch (error: any) {
    console.error('GET Portfolio Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pin = body.pin;
    const incomingData = body.data || body;

    // Convert both to strings to prevent type mismatches (e.g., number vs string)
    if (pin !== undefined && pin !== null && String(pin) !== String(ADMIN_PIN)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid PIN' }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('portfolio');

    const existingDoc: any = await db.collection('content').findOne({ _id: 'main_data' as any }) || {};

    const updatedPayload = {
      home: incomingData.home || existingDoc.home || {},
      projects: incomingData.projects !== undefined ? incomingData.projects : (existingDoc.projects || []),
      events: incomingData.events !== undefined ? incomingData.events : (existingDoc.events || [])
    };

    await db.collection('content').updateOne(
      { _id: 'main_data' as any },
      { $set: updatedPayload },
      { upsert: true }
    );

    cachedPortfolioData = updatedPayload;

    return NextResponse.json({ success: true, data: updatedPayload });
  } catch (error: any) {
    console.error('POST Portfolio Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save portfolio data' }, { status: 500 });
  }
}