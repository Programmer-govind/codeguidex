import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from './providers';
import { ConditionalHeader, ConditionalFooter } from '@components/layout/ConditionalLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodeGuideX - Learn, Connect, Grow',
  description:
    'A beginner-friendly platform to post doubts, join communities, interact with mentors, and attend live video sessions.',
  keywords: ['learning', 'mentoring', 'community', 'video sessions', 'coding'],
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ReduxProvider>
          <ConditionalHeader />
          <main className="flex-1 w-full">
            {children}
          </main>
          <ConditionalFooter />
        </ReduxProvider>
      </body>
    </html>
  );
}
