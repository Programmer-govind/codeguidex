"use client"

import { motion } from "framer-motion"
import { Award, Code, Star, MapPin, Link as LinkIcon, Calendar, BookOpen } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header Section */}
        <div className="relative mt-8">
          <div className="h-48 w-full rounded-2xl bg-gradient-to-r from-purple-600 via-primary to-cyan-500 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />
          </div>
          
          <div className="px-6 sm:px-10 flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20 gap-6 relative z-10">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-background bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl shadow-primary/20">
              U
            </div>
            
            <div className="flex-1 text-center sm:text-left mb-2">
              <h1 className="text-3xl font-bold tracking-tight">John Doe</h1>
              <p className="text-lg text-muted-foreground">Full Stack Developer</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> San Francisco, CA</span>
                <span className="flex items-center"><LinkIcon className="h-4 w-4 mr-1" /> johndoe.dev</span>
                <span className="flex items-center"><Calendar className="h-4 w-4 mr-1" /> Joined Sept 2023</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-0 mt-8">
          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="bg-background/40 backdrop-blur-md border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Passionate software engineer focused on building beautiful, scalable web applications. Always eager to learn new technologies and mentor aspiring developers.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">React</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Next.js</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">TypeScript</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Node.js</Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Python</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/40 backdrop-blur-md border-white/5">
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Top Mentor</p>
                    <p className="text-xs text-muted-foreground">50+ sessions completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Code className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bug Squasher</p>
                    <p className="text-xs text-muted-foreground">Resolved 100 community issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Activity</h2>
            
            {[1, 2, 3].map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="bg-background/40 backdrop-blur-md border-white/5 hover:border-white/10 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="mt-1">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-semibold text-foreground">You</span> answered a question in <span className="text-primary hover:underline cursor-pointer">React Beginners</span>
                        </p>
                        <p className="text-sm text-muted-foreground mt-2 border-l-2 border-white/10 pl-3">
                          &quot;To fix that hydration error, make sure you aren&apos;t using random variables like Date.now() during the initial server render...&quot;
                        </p>
                        <p className="text-xs text-muted-foreground mt-3">2 days ago</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
