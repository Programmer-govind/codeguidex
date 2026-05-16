import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { MainLayout } from '@/components/layout/MainLayout';
import { ReduxProvider } from '@/app/providers';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CodeGuideX — Learn, Connect, Grow',
  description:
    'AI-powered developer platform to generate code ideas, connect with tech communities, and get personalized mentorship from industry experts.',
  keywords: ['coding', 'mentorship', 'AI', 'developer community', 'programming', 'learning'],
  openGraph: {
    title: 'CodeGuideX',
    description: 'AI-powered developer learning platform',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            storageKey="codeguidex-theme"
            disableTransitionOnChange
          >
            <MainLayout>{children}</MainLayout>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
