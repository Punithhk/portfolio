import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('portfolio');
    const visitors = await db.collection('visitors').find({}).sort({ timestamp: -1 }).toArray();

    return NextResponse.json(visitors);
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch visitors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, purpose } = body;

    const client = await clientPromise;
    const db = client.db('portfolio');

    const newVisitor = {
      name,
      email,
      company,
      purpose,
      timestamp: new Date().toISOString(),
    };

    await db.collection('visitors').insertOne(newVisitor);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    // This will print the actual MongoDB error stack trace to your terminal
    console.error('Detailed MongoDB POST Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save visitor' }, { status: 500 });
  }
}