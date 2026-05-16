"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Badge } from "@/components/ui/Badge"
import { ArrowRight, MessageSquare, ArrowUp, Sparkles, Terminal, Rocket, Search, ArrowUpRight, TrendingUp, Flame, PlayCircle, Star, Calendar } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  const feedPosts = [
    { title: "Best architecture for Next.js 14 App Router?", author: "alex_dev", upvotes: 342, comments: 89, tags: ["Next.js", "Architecture"] },
    { title: "How to handle global state in 2024? Zustand vs Redux", author: "sarah_codes", upvotes: 215, comments: 142, tags: ["React", "State Management"] },
  ]

  const trendingTopics = [
    { name: "React Compiler", posts: "2.4k", icon: Flame, color: "text-orange-500" },
    { name: "Next.js 15 RC", posts: "1.8k", icon: Rocket, color: "text-blue-500" },
    { name: "Tailwind v4", posts: "950", icon: Sparkles, color: "text-teal-500" },
    { name: "Cursor AI", posts: "3.2k", icon: Terminal, color: "text-purple-500" },
  ]

  const suggestedMentors = [
    { name: "Sarah Drasner", role: "VP Engineering", rating: 5.0, tags: ["Vue", "Architecture"] },
    { name: "Dan Abramov", role: "Software Engineer", rating: 4.9, tags: ["React", "JavaScript"] },
    { name: "Theo Browne", role: "CEO & Founder", rating: 4.8, tags: ["Next.js", "T3 Stack"] },
  ]



  return (
    <div className="flex flex-col gap-16">
      {/* HERO SECTION */}
      <section className="relative text-center space-y-8 pt-12 lg:pt-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block">
          <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/30 bg-primary/5 text-primary text-sm font-medium backdrop-blur-md">
            <Sparkles className="h-4 w-4 mr-2 inline-block" />
            CodeGuideX 2.0 is now live
          </Badge>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mx-auto leading-tight"
        >
          Master Coding with <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-cyan-400">
            support and mentorship
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          The ultimate AI-powered developer platform to generate ideas, connect with elite communities, and get 1-on-1 coding guidance.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-primary to-purple-600 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all border-0 text-white w-full">
              Start learning <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/mentors" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full backdrop-blur-md bg-background/30 hover:bg-background/50 border-white/10 w-full">
              View Mentors
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* DETAILS / FEATURES SECTION */}
      <section className="py-12 mt-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Everything you need to level up</h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">CodeGuideX provides a complete ecosystem designed to accelerate your learning and help you build better software, faster.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* AI Assistant - Spans 2 columns */}
          <Card className="md:col-span-2 bg-background/40 backdrop-blur-md border-white/5 hover:border-primary/50 transition-all duration-500 group overflow-hidden relative min-h-[320px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-30 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden hidden md:block">
              <div className="absolute right-[-10%] top-[10%] w-[120%] h-[80%] rounded-xl border border-white/10 bg-background/80 shadow-2xl flex flex-col p-4 transform rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <div className="flex gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20" />
                  <div className="w-3/4 h-8 rounded-lg bg-white/5" />
                </div>
                <div className="flex gap-2 justify-end mb-4">
                  <div className="w-1/2 h-16 rounded-lg bg-primary/10 border border-primary/20" />
                </div>
                <div className="w-full h-10 mt-auto rounded-lg bg-white/5 border border-white/10" />
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col justify-center p-8 md:w-1/2 h-full">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-primary/20">
                <Terminal className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold mb-4">AI Pair Programmer</CardTitle>
              <p className="text-base text-muted-foreground leading-relaxed">
                Generate starter code, debug tricky errors, and learn new architectures instantly with our specialized coding AI model.
              </p>
            </div>
          </Card>

          {/* Mentorship - Spans 1 column */}
          <Card className="bg-background/40 backdrop-blur-md border-white/5 hover:border-purple-500/50 transition-all duration-500 group relative min-h-[320px] flex flex-col items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 p-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                <Star className="h-8 w-8 text-white fill-white" />
              </div>
              <CardTitle className="text-2xl font-bold mb-3">Elite Mentorship</CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Book 1-on-1 sessions with senior engineers from top tech companies to get unblocked instantly.
              </p>
            </div>
          </Card>

          {/* Community - Spans 1 column */}
          <Card className="bg-background/40 backdrop-blur-md border-white/5 hover:border-cyan-500/50 transition-all duration-500 group relative min-h-[320px] flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.1),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 p-8 pb-0">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner border border-cyan-500/20">
                <MessageSquare className="h-7 w-7 text-cyan-500" />
              </div>
              <CardTitle className="text-2xl font-bold mb-3">Vibrant Community</CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Join specialized discussion boards, share projects, and collaborate globally.
              </p>
            </div>
            
            {/* Faux UI Bubbles */}
            <div className="relative h-32 mt-4 overflow-hidden w-full px-6 opacity-40 group-hover:opacity-100 transition-opacity duration-500 flex flex-col gap-3 pb-4">
              <div className="w-3/4 h-10 rounded-2xl rounded-tl-sm bg-white/5 border border-white/10 self-start" />
              <div className="w-2/3 h-10 rounded-2xl rounded-tr-sm bg-cyan-500/10 border border-cyan-500/20 self-end" />
            </div>
          </Card>

          {/* Resources - Spans 2 columns */}
          <Card className="md:col-span-2 bg-background/40 backdrop-blur-md border-white/5 hover:border-orange-500/50 transition-all duration-500 group overflow-hidden relative min-h-[320px] flex flex-col md:flex-row">
            <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex flex-col justify-center p-8 md:w-1/2 h-full order-2 md:order-1">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner border border-orange-500/20">
                <Rocket className="h-7 w-7 text-orange-500" />
              </div>
              <CardTitle className="text-3xl font-bold mb-4">Premium Resources</CardTitle>
              <p className="text-base text-muted-foreground leading-relaxed">
                Access a massive curated library of high-quality templates, video tutorials, and deep-dive technical architecture articles.
              </p>
            </div>

            <div className="w-full md:w-1/2 h-48 md:h-full relative opacity-50 group-hover:opacity-100 transition-opacity duration-500 order-1 md:order-2 flex items-center justify-center p-8">
               <div className="w-full h-full max-h-[200px] rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-white/10 shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                  <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                    <PlayCircle className="h-8 w-8 text-white ml-1" />
                  </div>
               </div>
            </div>
          </Card>

        </div>
      </section>

      {/* SUGGESTED MENTORS (Below Hero) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Suggested Mentors</h2>
          <Button variant="ghost" className="text-primary">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestedMentors.map((mentor, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}>
              <Card className="group overflow-hidden">
                <CardHeader className="flex flex-row gap-4 items-start pb-2">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold shadow-md shrink-0 group-hover:scale-110 transition-transform">
                    {mentor.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{mentor.name}</CardTitle>
                    <CardDescription className="text-sm mt-0.5 truncate">{mentor.role}</CardDescription>
                    <div className="flex items-center text-xs font-medium mt-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
                      {mentor.rating}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-3 pt-1">
                  <div className="flex flex-wrap gap-2">
                    {mentor.tags.map(tag => <Badge key={tag} variant="secondary" className="bg-muted text-xs px-2 py-0.5">{tag}</Badge>)}
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t border-white/5 bg-muted/10">
                  <Button variant="ghost" size="sm" className="w-full text-xs hover:bg-primary hover:text-white transition-colors">
                    <Calendar className="mr-2 h-3.5 w-3.5" /> Book Session
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TWO COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="lg:col-span-3 space-y-16">
          
          {/* FEED SECTION */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Community Feed</h2>
            <div className="space-y-4">
              {feedPosts.map((post, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card className="cursor-pointer group">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex sm:flex-col items-center sm:p-4 p-2 sm:bg-muted/10 bg-transparent rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none border-b sm:border-b-0 sm:border-r border-white/5 gap-2 sm:gap-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary"><ArrowUp className="h-5 w-5" /></Button>
                        <span className="font-bold text-sm sm:my-1">{post.upvotes}</span>
                      </div>
                      <div className="flex-1 p-4 sm:p-5">
                        <div className="flex items-center text-xs text-muted-foreground mb-2">
                          <span className="font-medium text-foreground hover:text-primary transition-colors">@{post.author}</span>
                          <span className="mx-2">•</span> 2 hours ago
                        </div>
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors leading-snug">{post.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {post.tags.map(tag => <Badge key={tag} variant="secondary" className="bg-muted/50 border-white/5">{tag}</Badge>)}
                          <div className="ml-auto flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                            <MessageSquare className="h-4 w-4 mr-1.5" /> {post.comments}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* AI TOOL SECTION */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">AI Code Assistant</h2>
            <Card className="overflow-hidden border-primary/20 shadow-[0_0_30px_rgba(79,70,229,0.1)]">
              <div className="h-2 bg-gradient-to-r from-primary via-purple-500 to-cyan-400" />
              <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center space-y-6 bg-gradient-to-b from-background/50 to-muted/20">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/20 shadow-inner">
                  <Terminal className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">What are you building today?</h3>
                  <p className="text-muted-foreground max-w-lg mx-auto">Describe your idea, and our AI will generate starter code, suggest architectures, and guide you step-by-step.</p>
                </div>
                <div className="w-full max-w-xl relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative flex w-full items-center">
                    <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
                    <Input 
                      className="w-full h-14 pl-12 pr-32 rounded-xl border-white/10 bg-background/80 backdrop-blur-md focus-visible:ring-primary shadow-inner text-base"
                      placeholder="e.g. Create a Next.js landing page..."
                    />
                    <Link href="/auth/login" className="absolute right-1.5 h-11">
                      <Button className="h-full rounded-lg bg-primary hover:bg-primary/90 text-white font-medium px-6">
                        Generate
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>

        {/* RIGHT COLUMN: Trending Topics (Sidebar) */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card className="bg-background/40">
              <CardHeader className="pb-3 border-b border-white/5">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" /> Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                {trendingTopics.map((topic, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-md bg-muted/50 group-hover:bg-background transition-colors ${topic.color}`}>
                        <topic.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">{topic.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{topic.posts} posts</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <Button variant="link" className="w-full text-muted-foreground hover:text-primary p-0 h-auto">View all topics</Button>
              </CardFooter>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-purple-600/10 border-primary/20 overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg">Pro Membership</CardTitle>
                <CardDescription className="text-foreground/80 mt-1">Unlock unlimited AI generations and 1-on-1 mentorship.</CardDescription>
              </CardHeader>
              <CardFooter className="relative z-10 pt-2">
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full bg-white text-black hover:bg-white/90 font-semibold shadow-lg">Upgrade Now</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}
