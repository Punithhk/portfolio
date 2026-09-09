import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AdminProvider } from '@/components/AdminContext';
import VisitorModal from '@/components/VisitorModal';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dev Portfolio',
  description: 'Personal portfolio with local CMS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-100`}>
        <Providers>
          <AdminProvider>
            <VisitorModal />
            {children}
          </AdminProvider>
        </Providers>
      </body>
    </html>
  );
}