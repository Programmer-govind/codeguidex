"use client"

import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { Footer } from "./Footer"
import { ChatWidget } from "@/components/chat/ChatWidget"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden transition-colors duration-300">
      {/* Gorgeous Background Layer (Hardware Accelerated) */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-background">
        {/* Noise Texture (No heavy mix-blend mode) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none"></div>
        
        {/* Animated Gradient Orbs */}
        <div className="absolute -top-[30%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(79,70,229,0.08)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(79,70,229,0.15)_0%,transparent_60%)] blur-[80px] animate-spin-slow origin-center" />
        
        <div className="absolute top-[20%] -right-[20%] w-[80vw] h-[80vw] rounded-full bg-[radial-gradient(circle,rgba(147,51,234,0.05)_0%,transparent_60%)] dark:bg-[radial-gradient(circle,rgba(147,51,234,0.1)_0%,transparent_60%)] blur-[80px] animate-spin-reverse-slow origin-center" />
        
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.04)_0%,transparent_50%)] dark:bg-[radial-gradient(circle,rgba(6,182,212,0.08)_0%,transparent_50%)] blur-[80px] animate-pulse-slow" />
      </div>

      <Navbar />
      <Sidebar />
      <div className="flex-1 flex flex-col w-full">
        <main className="flex-1 w-full max-w-[1400px] mx-auto overflow-hidden px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16">
          {children}
        </main>
        <Footer />
      </div>
      <ChatWidget />
    </div>
  )
}
