"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { motion } from "framer-motion"
import { Activity, MessageSquare, Users, Bookmark, ArrowUpRight, TrendingUp, Calendar, Code2, Sparkles, ChevronRight } from "lucide-react"

import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

export default function DashboardPage() {
  const stats = [
    { 
      title: "Active Discussions", 
      value: "24", 
      icon: MessageSquare, 
      change: "+3 this week",
      gradient: "from-blue-500 to-cyan-500",
      bgStyle: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    { 
      title: "Upcoming Sessions", 
      value: "2", 
      icon: Users, 
      change: "Next: Tomorrow 2PM",
      gradient: "from-purple-500 to-pink-500",
      bgStyle: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    { 
      title: "Resources Saved", 
      value: "48", 
      icon: Bookmark, 
      change: "+12 this month",
      gradient: "from-emerald-400 to-teal-500",
      bgStyle: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    { 
      title: "AI Generations", 
      value: "156", 
      icon: Sparkles, 
      change: "+45 this week",
      gradient: "from-orange-400 to-red-500",
      bgStyle: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
  ]

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
    <ProtectedRoute>
      <div className="space-y-8 pb-16 max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="relative rounded-3xl overflow-hidden bg-background/40 border border-white/10 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-primary/5">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_50%)] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
                <Activity className="mr-2 h-4 w-4" /> Welcome back, Developer
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Workspace</span>
              </h1>
              <p className="text-muted-foreground text-lg">
                Here&apos;s an overview of your progress, upcoming sessions, and recent community activity.
              </p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none bg-background/50 backdrop-blur-sm border-white/10 hover:border-primary/50 hover:text-primary">
                View Profile
              </Button>
              <Button className="flex-1 md:flex-none bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 border-0">
                <Sparkles className="mr-2 h-4 w-4" /> New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={item}>
              <Card className="relative overflow-hidden group bg-background/40 backdrop-blur-md border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Decorative background icon */}
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-300 group-hover:scale-110">
                  <stat.icon className="h-32 w-32" />
                </div>

                <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.title}
                  </CardTitle>
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${stat.bgStyle}`}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                  <p className="text-xs font-medium mt-2 flex items-center text-muted-foreground group-hover:text-primary transition-colors">
                    <TrendingUp className="h-3 w-3 mr-1" /> {stat.change}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Complex Components Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Activity Chart Placeholder */}
          <Card className="lg:col-span-2 bg-background/40 backdrop-blur-md border-white/10 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-50" />
            <CardHeader className="relative z-10 flex flex-row items-center justify-between">
              <div>
                <CardTitle>Learning Activity</CardTitle>
                <CardDescription>Your engagement over the past 30 days</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="bg-background/50 border-white/10">This Month <ChevronRight className="ml-1 h-3 w-3" /></Button>
            </CardHeader>
            <CardContent className="relative z-10 h-[300px] flex flex-col items-center justify-center text-muted-foreground border-t border-white/5 mt-4">
              {/* Faux Chart UI */}
              <div className="w-full h-full flex items-end justify-between px-4 pb-4 pt-10 gap-2 opacity-60">
                {[40, 70, 45, 90, 65, 85, 100, 50, 75, 60, 30, 80].map((height, i) => (
                  <div key={i} className="w-full relative group cursor-pointer">
                    <div 
                      className="absolute bottom-0 w-full rounded-t-sm bg-gradient-to-t from-primary to-cyan-400 group-hover:opacity-80 transition-opacity"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                ))}
              </div>
              <p className="absolute text-sm font-medium">Activity Chart (Data Integrated)</p>
            </CardContent>
          </Card>

          {/* Upcoming Schedule */}
          <Card className="bg-background/40 backdrop-blur-md border-white/10 flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-purple-500" /> 
                Upcoming Schedule
              </CardTitle>
              <CardDescription>Your next mentorship sessions</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500" />
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-purple-500 text-white hover:bg-purple-600 border-0">Tomorrow</Badge>
                  <span className="text-xs font-medium text-muted-foreground">2:00 PM EST</span>
                </div>
                <h4 className="font-semibold text-sm mt-1">System Design Interview Prep</h4>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <div className="h-5 w-5 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold">A</div>
                  <span>Alex Chen (Vercel)</span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/30 border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="bg-background/50">Oct 24</Badge>
                  <span className="text-xs font-medium text-muted-foreground">10:00 AM EST</span>
                </div>
                <h4 className="font-semibold text-sm mt-1">Next.js Architecture Review</h4>
                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <div className="h-5 w-5 rounded-full bg-cyan-500/20 text-cyan-500 flex items-center justify-center font-bold">S</div>
                  <span>Sarah Drasner</span>
                </div>
              </div>
            </CardContent>
            <div className="p-4 border-t border-white/5 mt-auto">
              <Button variant="ghost" className="w-full text-muted-foreground hover:text-foreground">View Full Calendar</Button>
            </div>
          </Card>
          
        </div>
      </div>
    </ProtectedRoute>
  )
}
