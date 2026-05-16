"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Users, MessageSquare, Filter, Globe, TrendingUp, Sparkles, Rocket, Database, Palette, Cloud, Terminal } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const communities = [
    { 
      name: "React Developers", 
      members: "125k", 
      posts: "450/day", 
      tags: ["Frontend", "JavaScript"],
      icon: Globe,
      gradient: "from-cyan-400 to-blue-500",
      bgStyle: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
    },
    { 
      name: "Next.js Masters", 
      members: "84k", 
      posts: "200/day", 
      tags: ["Fullstack", "React"],
      icon: Rocket,
      gradient: "from-purple-500 to-indigo-600",
      bgStyle: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
    },
    { 
      name: "Python Enthusiasts", 
      members: "210k", 
      posts: "800/day", 
      tags: ["Data Science", "Backend"],
      icon: Database,
      gradient: "from-yellow-400 to-orange-500",
      bgStyle: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
    { 
      name: "UI/UX Designers", 
      members: "65k", 
      posts: "150/day", 
      tags: ["Design", "Figma"],
      icon: Palette,
      gradient: "from-pink-400 to-rose-500",
      bgStyle: "bg-pink-500/10 text-pink-500 border-pink-500/20"
    },
    { 
      name: "DevOps Wizards", 
      members: "45k", 
      posts: "120/day", 
      tags: ["Docker", "AWS"],
      icon: Cloud,
      gradient: "from-blue-500 to-emerald-500",
      bgStyle: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    { 
      name: "Indie Hackers", 
      members: "150k", 
      posts: "500/day", 
      tags: ["Startups", "SaaS"],
      icon: Terminal,
      gradient: "from-violet-500 to-purple-500",
      bgStyle: "bg-violet-500/10 text-violet-500 border-violet-500/20"
    },
  ]

  const filteredCommunities = communities.filter(comm => 
    comm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    comm.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
  }

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header Section */}
      <div className="relative rounded-3xl overflow-hidden bg-background/40 border border-white/10 backdrop-blur-xl p-8 md:p-12 shadow-2xl shadow-primary/5">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(79,70,229,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-500 mb-2">
              <Sparkles className="mr-2 h-4 w-4" /> Global Tech Hubs
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Tribe</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Join specialized tech communities to network, share knowledge, and collaborate on exciting open-source projects.
            </p>
          </div>

          <div className="w-full md:w-80 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search communities..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background/50 border-white/10 focus-visible:ring-cyan-500 backdrop-blur-sm rounded-xl" 
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-background/50 backdrop-blur-sm border-white/10 rounded-xl h-10 hover:border-cyan-500/50 hover:text-cyan-500">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" className="flex-1 bg-background/50 backdrop-blur-sm border-white/10 rounded-xl h-10 hover:border-cyan-500/50 hover:text-cyan-500">
                Trending
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredCommunities.map((comm, i) => (
          <motion.div key={i} variants={item} className="h-full">
            <Card className="group h-full flex flex-col bg-background/40 backdrop-blur-md border-white/10 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] overflow-hidden relative">
              
              {/* Subtle background glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="relative">
                    <div className={`absolute -inset-1 rounded-full bg-gradient-to-br ${comm.gradient} opacity-0 group-hover:opacity-100 blur transition-opacity duration-500`} />
                    <div className={`relative h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg border ${comm.bgStyle} group-hover:scale-110 transition-transform duration-500`}>
                      <comm.icon className="h-7 w-7" />
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-md border-white/10">
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" /> Hot
                  </Badge>
                </div>
                <CardTitle className="text-xl mt-2 group-hover:text-cyan-500 transition-colors">{comm.name}</CardTitle>
                <CardDescription className="text-sm mt-1">A community dedicated to {comm.tags[0].toLowerCase()} development and discussions.</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 relative z-10">
                <div className="flex flex-wrap gap-2 mb-6">
                  {comm.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-muted/30 border-white/10 text-xs font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-6 text-sm text-muted-foreground mt-auto bg-muted/10 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-cyan-500" /> 
                    <span className="font-medium text-foreground">{comm.members}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-500" /> 
                    <span className="font-medium text-foreground">{comm.posts}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-white/5 gap-3 relative z-10">
                <Button className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all group-hover:shadow-cyan-500/40 border-0 font-semibold">
                  Join Community
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-20 bg-background/30 rounded-2xl border border-white/5 border-dashed">
          <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No communities found</h3>
          <p className="text-muted-foreground mt-2">We couldn&apos;t find any communities matching &quot;{searchQuery}&quot;</p>
          <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-6 border-cyan-500/30 text-cyan-500 hover:bg-cyan-500/10">Clear Filters</Button>
        </div>
      )}

    </div>
  )
}
