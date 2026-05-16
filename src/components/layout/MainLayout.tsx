'use client';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ChatWidget } from '@/components/chat/ChatWidget';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-x-hidden transition-colors duration-300">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute -top-[30%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.06)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(79,70,229,0.12)_0%,transparent_60%)] blur-[80px] animate-spin-slow origin-center" />
        <div className="absolute top-[20%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.04)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(147,51,234,0.08)_0%,transparent_60%)] blur-[80px] animate-spin-reverse-slow origin-center" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.03)_0%,transparent_50%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.06)_0%,transparent_50%)] blur-[80px] animate-pulse-slow" />
      </div>

      <Navbar />
      <Sidebar />

      <div className="flex-1 flex flex-col w-full">
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10 pb-16">
          {children}
        </main>
        <Footer />
      </div>

      {/* Global AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}
