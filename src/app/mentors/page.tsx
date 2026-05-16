"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, Star, Calendar, Filter, GraduationCap, Building2, ExternalLink, MessageCircle } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function MentorsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const mentors = [
    { 
      name: "Alex Chen", 
      role: "Senior Frontend Engineer", 
      company: "Vercel", 
      rating: 4.9, 
      reviews: 124, 
      rate: "$80/hr", 
      tags: ["React", "Next.js", "TypeScript"],
      gradient: "from-blue-500 to-indigo-600",
      avatarBg: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    { 
      name: "Sarah Drasner", 
      role: "VP of Engineering", 
      company: "Netlify", 
      rating: 5.0, 
      reviews: 312, 
      rate: "$120/hr", 
      tags: ["Vue", "Architecture", "Career"],
      gradient: "from-emerald-400 to-teal-500",
      avatarBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    { 
      name: "Dan Abramov", 
      role: "Software Engineer", 
      company: "Meta", 
      rating: 4.9, 
      reviews: 450, 
      rate: "$150/hr", 
      tags: ["React", "Redux", "JavaScript"],
      gradient: "from-blue-400 to-cyan-500",
      avatarBg: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
    },
    { 
      name: "Emma Bostian", 
      role: "Software Engineer", 
      company: "Spotify", 
      rating: 4.8, 
      reviews: 89, 
      rate: "$90/hr", 
      tags: ["Frontend", "Interview Prep"],
      gradient: "from-green-400 to-emerald-500",
      avatarBg: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    { 
      name: "Kelsey Hightower", 
      role: "Principal Engineer", 
      company: "Google", 
      rating: 5.0, 
      reviews: 520, 
      rate: "$200/hr", 
      tags: ["Kubernetes", "Go", "Cloud"],
      gradient: "from-orange-400 to-red-500",
      avatarBg: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
    { 
      name: "Theo Browne", 
      role: "CEO & Founder", 
      company: "Ping", 
      rating: 4.7, 
      reviews: 210, 
      rate: "$100/hr", 
      tags: ["T3 Stack", "Startups", "Next.js"],
      gradient: "from-purple-400 to-pink-500",
      avatarBg: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
  ]

  const filteredMentors = mentors.filter(mentor => 
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-500 mb-2">
              <GraduationCap className="mr-2 h-4 w-4" /> 1-on-1 Mentorship
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Learn from <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">Industry Leaders</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Get unblocked, accelerate your career, and master new technologies by booking personalized sessions with elite engineers.
            </p>
          </div>

          <div className="w-full md:w-80 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search mentors or skills..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background/50 border-white/10 focus-visible:ring-purple-500 backdrop-blur-sm rounded-xl" 
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-background/50 backdrop-blur-sm border-white/10 rounded-xl h-10 hover:border-purple-500/50 hover:text-purple-500">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" className="flex-1 bg-background/50 backdrop-blur-sm border-white/10 rounded-xl h-10 hover:border-purple-500/50 hover:text-purple-500">
                Highest Rated
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
        {filteredMentors.map((mentor, i) => (
          <motion.div key={i} variants={item} className="h-full">
            <Card className="group h-full flex flex-col bg-background/40 backdrop-blur-md border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden relative">
              
              {/* Subtle background glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="flex flex-row gap-5 items-start pb-4 relative z-10">
                <div className="relative">
                  <div className={`absolute -inset-1 rounded-full bg-gradient-to-br ${mentor.gradient} opacity-0 group-hover:opacity-100 blur transition-opacity duration-500`} />
                  <div className={`relative h-16 w-16 rounded-full flex items-center justify-center text-xl font-bold shadow-lg border ${mentor.avatarBg}`}>
                    {mentor.name.charAt(0)}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg flex items-center justify-between group-hover:text-purple-500 transition-colors">
                    <span className="truncate pr-2">{mentor.name}</span>
                    <Badge variant="secondary" className="font-medium bg-background/80 backdrop-blur-md border-white/10 shrink-0">
                      {mentor.rate}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-sm mt-1 truncate">{mentor.role}</CardDescription>
                  <div className="flex items-center text-sm font-medium mt-1.5 text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                    {mentor.company}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 relative z-10">
                <div className="flex items-center space-x-1 mb-4">
                  <div className="flex items-center bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded text-sm font-medium border border-yellow-500/20">
                    <Star className="h-3.5 w-3.5 fill-current mr-1" />
                    {mentor.rating}
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">({mentor.reviews} reviews)</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {mentor.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-muted/30 border-white/10 text-xs font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-4 border-t border-white/5 gap-3 relative z-10 bg-muted/5">
                <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 bg-background/50 hover:bg-purple-500/10 hover:text-purple-500 hover:border-purple-500/50 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button className="w-full h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-purple-500/20 transition-all group-hover:shadow-purple-500/40 border-0">
                  <Calendar className="mr-2 h-4 w-4" /> Book Session
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-20 bg-background/30 rounded-2xl border border-white/5 border-dashed">
          <GraduationCap className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No mentors found</h3>
          <p className="text-muted-foreground mt-2">We couldn&apos;t find any mentors matching &quot;{searchQuery}&quot;</p>
          <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-6 border-purple-500/30 text-purple-500 hover:bg-purple-500/10">Clear Filters</Button>
        </div>
      )}

    </div>
  )
}
