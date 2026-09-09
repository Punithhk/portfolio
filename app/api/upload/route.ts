import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ADMIN_PIN = '1234';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const pin = formData.get('pin');

    // Coerce both values to strings to prevent type mismatch failures
    if (pin !== undefined && pin !== null && String(pin) !== String(ADMIN_PIN)) {
      return NextResponse.json({ error: 'Unauthorized: Invalid PIN' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Create a unique filename to avoid overwriting files with the same name
    const filename = `${Date.now()}-${file.name.replaceAll(' ', '_')}`;
    const publicDir = path.join(process.cwd(), 'public');

    // Ensure public folder exists
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write file to public folder
    fs.writeFileSync(path.join(publicDir, filename), buffer);

    // Return the relative public URL path
    return NextResponse.json({ success: true, url: `/${filename}` });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: error.message || 'Failed to upload file' }, { status: 500 });
  }
}