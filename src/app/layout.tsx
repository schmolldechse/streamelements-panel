import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StreamElements Panel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <head>
        <script src='./scripts/dragscroll.ts' defer />
      </head>

      <body className={inter.className}>
        <main className='p-3 flex gap-3'>
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}