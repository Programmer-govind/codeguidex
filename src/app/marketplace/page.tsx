"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Input } from "@/components/ui/Input"
import { PlayCircle, Star, Search, Filter, Clock, Play, Video, Crown } from "lucide-react"
import { motion } from "framer-motion"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const videos = [
    {
      title: "Advanced Next.js App Router Patterns",
      creator: "Lee Robinson",
      price: "₹1,499",
      rating: 4.9,
      reviews: 128,
      duration: "2h 45m",
      category: "Frontend",
      gradient: "from-rose-500 to-red-600",
      premium: true
    },
    {
      title: "Mastering Postgres Triggers & Functions",
      creator: "Supabase Team",
      price: "₹999",
      rating: 4.8,
      reviews: 84,
      duration: "1h 30m",
      category: "Database",
      gradient: "from-emerald-500 to-teal-600",
      premium: false
    },
    {
      title: "Building Microservices with Go",
      creator: "Matt Layher",
      price: "₹1,999",
      rating: 4.7,
      reviews: 215,
      duration: "4h 15m",
      category: "Backend",
      gradient: "from-blue-500 to-cyan-600",
      premium: true
    },
    {
      title: "Framer Motion Animations for React",
      creator: "Matt Perry",
      price: "₹1,299",
      rating: 5.0,
      reviews: 432,
      duration: "3h 00m",
      category: "Design",
      gradient: "from-fuchsia-500 to-purple-600",
      premium: false
    },
    {
      title: "System Design Interview Prep",
      creator: "Alex Xu",
      price: "₹2,499",
      rating: 4.9,
      reviews: 890,
      duration: "6h 20m",
      category: "Architecture",
      gradient: "from-slate-700 to-slate-900",
      premium: true
    },
    {
      title: "Docker & Kubernetes from Scratch",
      creator: "Nana Janashia",
      price: "₹1,799",
      rating: 4.8,
      reviews: 560,
      duration: "5h 10m",
      category: "DevOps",
      gradient: "from-indigo-500 to-blue-700",
      premium: false
    }
  ]

  const categories = ["All", "Frontend", "Backend", "Database", "DevOps", "Design", "Architecture"]

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          video.creator.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "All" || video.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } as any }
  }

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4 md:px-0">
      
      {/* Cinematic Header Section */}
      <div className="relative rounded-3xl overflow-hidden bg-background/40 border border-white/10 backdrop-blur-xl p-8 md:p-12 shadow-2xl shadow-rose-500/5">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,rgba(225,29,72,0.15),transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,rgba(190,18,60,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-sm font-medium text-rose-500 mb-2">
              <Video className="mr-2 h-4 w-4" /> Premium Video Courses
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Master classes for <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-red-600">Engineers</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Level up your skills with high-quality, deeply technical video courses created by industry experts.
            </p>
          </div>

          <div className="w-full md:w-80 space-y-4">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-red-600 rounded-xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
              <div className="relative flex items-center">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search courses or creators..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-background/80 border-white/10 focus-visible:ring-rose-500 backdrop-blur-sm rounded-xl text-sm" 
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-background/50 backdrop-blur-sm border-white/10 rounded-xl h-10 hover:border-rose-500/50 hover:text-rose-500">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-md shadow-rose-500/20 border-0 rounded-xl h-10">
                Explore Pro
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex overflow-x-auto pb-4 gap-3 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                isActive 
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25 border border-rose-400" 
                  : "bg-background/50 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Grid Section */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredVideos.map((video, index) => (
          <motion.div key={video.title} variants={item} className="h-full">
            <Card className="overflow-hidden h-full flex flex-col group cursor-pointer bg-background/40 backdrop-blur-md border-white/10 hover:border-rose-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(225,29,72,0.15)] relative">
              
              {/* Thumbnail Container */}
              <div className={`h-48 relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${video.gradient}`}>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                
                {/* Cinematic Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
                
                {/* Play Button Animation */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-rose-500 group-hover:border-rose-400 group-hover:scale-110 transition-all duration-500 shadow-xl shadow-black/20">
                  <Play className="h-6 w-6 text-white ml-1 fill-white" />
                </div>

                {/* Overlays */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {video.premium && (
                    <Badge variant="secondary" className="bg-amber-500/90 text-white hover:bg-amber-500 border-0 backdrop-blur-md font-semibold">
                      <Crown className="h-3 w-3 mr-1" /> PRO
                    </Badge>
                  )}
                </div>
                
                <div className="absolute bottom-3 right-3">
                  <Badge className="bg-black/70 text-white hover:bg-black/80 border border-white/10 backdrop-blur-md font-medium">
                    <Clock className="h-3 w-3 mr-1 text-rose-400" /> {video.duration}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="p-5 flex-1 relative z-10">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1.5">
                    <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-rose-500 transition-colors">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-sm font-medium">by {video.creator}</CardDescription>
                  </div>
                  <div className="font-bold text-lg text-foreground bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                    {video.price}
                  </div>
                </div>
              </CardHeader>
              
              <CardFooter className="p-5 pt-0 flex justify-between items-center border-t border-white/5 mt-auto bg-muted/5 relative z-10">
                <div className="flex items-center text-sm font-medium pt-4">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1.5 drop-shadow-sm" />
                  <span className="text-foreground">{video.rating}</span> 
                  <span className="text-muted-foreground font-normal ml-1.5">({video.reviews})</span>
                </div>
                <div className="pt-4">
                  <Badge variant="outline" className="bg-rose-500/5 text-rose-500 border-rose-500/20">{video.category}</Badge>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-20 bg-background/30 rounded-2xl border border-white/5 border-dashed">
          <Video className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No courses found</h3>
          <p className="text-muted-foreground mt-2">We couldn&apos;t find any courses matching your criteria</p>
          <Button variant="outline" onClick={() => {setSearchQuery(""); setActiveCategory("All")}} className="mt-6 border-rose-500/30 text-rose-500 hover:bg-rose-500/10">Clear Filters</Button>
        </div>
      )}

    </div>
  )
}
