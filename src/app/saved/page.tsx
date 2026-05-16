"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bookmark, LayoutTemplate, MessageSquare, GraduationCap, ArrowRight, ExternalLink, Trash2 } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"

import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function SavedPage() {
  const [activeTab, setActiveTab] = useState("Templates")

  const savedTemplates = [
    { title: "SaaS Starter Kit Pro", type: "Template", added: "2 days ago", icon: LayoutTemplate, gradient: "from-blue-500 to-indigo-600" },
    { title: "E-Commerce Storefront", type: "Template", added: "1 week ago", icon: LayoutTemplate, gradient: "from-orange-400 to-rose-500" },
  ]

  const savedPosts = [
    { title: "Best architecture for Next.js 14 App Router?", type: "Discussion", added: "3 hours ago", icon: MessageSquare, gradient: "from-emerald-400 to-teal-500" },
    { title: "Tailwind CSS v4 is amazing!", type: "Discussion", added: "Yesterday", icon: MessageSquare, gradient: "from-cyan-400 to-blue-500" },
  ]

  const savedMentors = [
    { title: "Alex Chen", type: "Mentor", added: "Just now", icon: GraduationCap, gradient: "from-purple-500 to-pink-500" },
  ]

  const getActiveItems = () => {
    switch(activeTab) {
      case "Templates": return savedTemplates;
      case "Discussions": return savedPosts;
      case "Mentors": return savedMentors;
      default: return [];
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
  }

  return (
    <ProtectedRoute>
      <div className="space-y-10 pb-16 max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="relative rounded-3xl overflow-hidden bg-background/40 border border-white/10 backdrop-blur-xl p-8 shadow-2xl shadow-amber-500/5">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.15),transparent_50%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.1),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-500 mb-1">
                <Bookmark className="mr-2 h-4 w-4 fill-amber-500/20" /> Your Library
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Saved <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Items</span>
              </h1>
              <p className="text-muted-foreground">
                Quickly access the resources, discussions, and mentors you've bookmarked for later.
              </p>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="relative z-10 flex gap-4 mt-8 border-b border-white/5 pb-2 overflow-x-auto">
            {["Templates", "Discussions", "Mentors"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 pb-2 border-b-2 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? "border-amber-500 text-amber-500" 
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "Templates" && <LayoutTemplate className="h-4 w-4" />}
                {tab === "Discussions" && <MessageSquare className="h-4 w-4" />}
                {tab === "Mentors" && <GraduationCap className="h-4 w-4" />}
                {tab}
                <Badge variant="secondary" className="ml-1 bg-white/5 text-xs px-1.5 py-0 h-5">
                  {tab === "Templates" && savedTemplates.length}
                  {tab === "Discussions" && savedPosts.length}
                  {tab === "Mentors" && savedMentors.length}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* List Section */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          key={activeTab} // Retrigger animation on tab change
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {getActiveItems().map((savedItem, i) => (
            <motion.div key={i} variants={item}>
              <Card className="group bg-background/40 backdrop-blur-md border-white/10 hover:border-amber-500/40 transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] overflow-hidden">
                <div className="flex items-center p-4">
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${savedItem.gradient} shadow-lg mr-4 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                    <savedItem.icon className="h-5 w-5 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-semibold text-foreground truncate group-hover:text-amber-500 transition-colors">
                      {savedItem.title}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span className="font-medium text-foreground/70">{savedItem.type}</span>
                      <span className="mx-2">•</span>
                      Saved {savedItem.added}
                    </div>
                  </div>
                  
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-amber-500 hover:bg-amber-500/10">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {getActiveItems().length === 0 && (
          <div className="text-center py-20 bg-background/30 rounded-2xl border border-white/5 border-dashed">
            <Bookmark className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold">Nothing saved yet</h3>
            <p className="text-muted-foreground mt-2">You haven&apos;t bookmarked any {activeTab.toLowerCase()} yet.</p>
            <Button variant="outline" className="mt-6 border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
              Browse {activeTab} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

      </div>
    </ProtectedRoute>
  )
}
