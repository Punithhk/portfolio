'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const filePath = path.join(process.cwd(), 'portfolio-data.json');

export async function getPortfolioData() {
  try {
    if (!fs.existsSync(filePath)) {
      const defaultData = { home: { heroTitle: '', heroBio: '' }, projects: [], sections: [] };
      fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (error) {
    console.error('Server read error:', error);
    return { home: { heroTitle: '', heroBio: '' }, projects: [], sections: [] };
  }
}

export async function updatePortfolioData(pin: string, newData: any) {
  console.log('Action called with PIN:', pin); // This will print if the button works

  if (pin !== '1234') {
    throw new Error('Unauthorized: Invalid PIN (Expected "1234")');
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
    console.log('File successfully written at:', filePath);
    
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/about');
    revalidatePath('/contact');

    return { success: true };
  } catch (error) {
    console.error('File write error:', error);
    throw error;
  }
}