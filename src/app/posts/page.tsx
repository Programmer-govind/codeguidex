"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageSquare, ArrowUp, ArrowDown, Share2, MoreHorizontal, Search, Filter, PenSquare, Hash, Flame, Clock } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const posts = [
    { 
      title: "Best architecture for Next.js 14 App Router?", 
      author: "alex_dev", 
      upvotes: 342, 
      comments: 89, 
      tags: ["Next.js", "Architecture"], 
      content: "I'm starting a new SaaS and wondering what the best folder structure is for Next.js 14. Should I co-locate components with routes, or keep a separate components folder? I've seen multiple approaches but I want something that scales well.",
      time: "3 hours ago",
      hot: true
    },
    { 
      title: "How to handle global state in 2024? Zustand vs Redux", 
      author: "sarah_codes", 
      upvotes: 215, 
      comments: 142, 
      tags: ["React", "State Management"], 
      content: "Redux feels like too much boilerplate. Is Zustand production-ready for large enterprise apps? I love the simplicity of Zustand but I'm worried about debugging large state trees without Redux DevTools.",
      time: "5 hours ago",
      hot: false
    },
    { 
      title: "My experience migrating from REST to GraphQL", 
      author: "mike_backend", 
      upvotes: 189, 
      comments: 45, 
      tags: ["API", "GraphQL"], 
      content: "We recently migrated our core API. Here are the pros, cons, and performance metrics we gathered. The N+1 query problem was real, but DataLoaders saved us. Highly recommend reading before you make the switch.",
      time: "12 hours ago",
      hot: false
    },
    { 
      title: "Tailwind CSS v4 is amazing!", 
      author: "ui_wizard", 
      upvotes: 520, 
      comments: 110, 
      tags: ["CSS", "Tailwind"], 
      content: "The new native CSS variable theming in Tailwind v4 is a game changer for design systems. No more complex config files just to add a new shade of primary color.",
      time: "1 day ago",
      hot: true
    },
  ]

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
  }

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      
      {/* Header Section */}
      <div className="relative rounded-3xl overflow-hidden bg-background/40 border border-white/10 backdrop-blur-xl p-8 shadow-2xl shadow-emerald-500/5">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(20,184,166,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Community <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Discussions</span>
            </h1>
            <p className="text-muted-foreground">
              Share knowledge, ask questions, and engage with developers from around the world.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search discussions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50 border-white/10 focus-visible:ring-emerald-500 backdrop-blur-sm" 
              />
            </div>
            <Button className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-md shadow-emerald-500/20 border-0">
              <PenSquare className="mr-2 h-4 w-4" /> New Post
            </Button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="relative z-10 flex gap-4 mt-8 border-b border-white/5 pb-2 overflow-x-auto">
          <button className="flex items-center gap-2 pb-2 border-b-2 border-emerald-500 text-emerald-500 font-medium whitespace-nowrap">
            <Flame className="h-4 w-4" /> Hot
          </button>
          <button className="flex items-center gap-2 pb-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            <Clock className="h-4 w-4" /> New
          </button>
          <button className="flex items-center gap-2 pb-2 border-b-2 border-transparent text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
            <ArrowUp className="h-4 w-4" /> Top
          </button>
        </div>
      </div>

      {/* Feed Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {filteredPosts.map((post, i) => (
          <motion.div key={i} variants={item}>
            <Card className="group bg-background/40 backdrop-blur-md border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                
                {/* Voting Sidebar */}
                <div className="flex sm:flex-col items-center sm:w-16 p-2 sm:p-4 bg-muted/5 sm:bg-muted/10 border-b sm:border-b-0 sm:border-r border-white/5 gap-2 sm:gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-emerald-500/10 hover:text-emerald-500 rounded-full transition-colors shrink-0">
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                  <span className="font-bold text-sm sm:my-1">{post.upvotes}</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors shrink-0">
                    <ArrowDown className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      {post.hot && (
                        <Badge variant="secondary" className="mr-2 bg-orange-500/10 text-orange-500 border-orange-500/20 text-[10px] px-1.5 py-0">
                          HOT
                        </Badge>
                      )}
                      Posted by <span className="font-medium text-foreground hover:text-emerald-500 transition-colors cursor-pointer ml-1">@{post.author}</span> 
                      <span className="mx-2">•</span> {post.time}
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <CardTitle className="text-xl mb-2 cursor-pointer group-hover:text-emerald-500 transition-colors leading-snug">
                    {post.title}
                  </CardTitle>
                  
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-4">
                    {post.content}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="bg-emerald-500/5 border-emerald-500/20 text-xs font-medium text-muted-foreground">
                          <Hash className="h-3 w-3 mr-0.5 opacity-70" />{tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors rounded-full">
                        <MessageSquare className="h-3.5 w-3.5 mr-1.5" /> {post.comments} Comments
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-medium text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors rounded-full">
                        <Share2 className="h-3.5 w-3.5 mr-1.5" /> Share
                      </Button>
                    </div>
                  </div>
                </div>
                
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-20 bg-background/30 rounded-2xl border border-white/5 border-dashed">
          <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No discussions found</h3>
          <p className="text-muted-foreground mt-2">We couldn&apos;t find any posts matching &quot;{searchQuery}&quot;</p>
          <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-6 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10">Clear Filters</Button>
        </div>
      )}

    </div>
  )
}
