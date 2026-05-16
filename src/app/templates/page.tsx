"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, LayoutTemplate, Download, Star, Filter, Eye, ArrowRight, Code2, MonitorSmartphone } from "lucide-react"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const templates = [
    { 
      title: "SaaS Starter Kit Pro", 
      desc: "Complete Next.js 14 App Router starter with Supabase Auth, Stripe billing, and dashboard UI.", 
      downloads: "12.4k", 
      tags: ["Next.js", "Fullstack", "Stripe"],
      gradient: "from-blue-500 via-indigo-500 to-purple-600",
      icon: Code2,
      price: "Free"
    },
    { 
      title: "Portfolio Minimal", 
      desc: "Clean, responsive portfolio for developers featuring Framer Motion page transitions.", 
      downloads: "8.2k", 
      tags: ["React", "Framer Motion", "Tailwind"],
      gradient: "from-emerald-400 to-cyan-500",
      icon: LayoutTemplate,
      price: "Free"
    },
    { 
      title: "E-Commerce Storefront", 
      desc: "High-performance shopping cart, dynamic product grid, and optimized checkout UI.", 
      downloads: "5.1k", 
      tags: ["Vue 3", "Nuxt", "Tailwind"],
      gradient: "from-orange-400 to-rose-500",
      icon: MonitorSmartphone,
      price: "$29"
    },
    { 
      title: "Admin Dashboard UI", 
      desc: "Data-heavy dashboard with integrated Recharts, data tables, and nested routing sidebar.", 
      downloads: "15k", 
      tags: ["React", "Material-UI", "Charts"],
      gradient: "from-fuchsia-500 to-pink-600",
      icon: LayoutTemplate,
      price: "Free"
    },
    { 
      title: "DevBlog Template", 
      desc: "Lightning fast static blog with MDX support, syntax highlighting, and SEO optimization.", 
      downloads: "3.2k", 
      tags: ["Astro", "MDX", "Content Collections"],
      gradient: "from-violet-500 to-purple-500",
      icon: Code2,
      price: "Free"
    },
    { 
      title: "Convert SaaS Landing", 
      desc: "High-converting SaaS landing page with dark mode, bento grids, and micro-interactions.", 
      downloads: "10k", 
      tags: ["Next.js", "Tailwind", "GSAP"],
      gradient: "from-cyan-400 to-blue-500",
      icon: MonitorSmartphone,
      price: "$19"
    },
  ]

  const filteredTemplates = templates.filter(tpl => 
    tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tpl.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.1),transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.1),transparent_50%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-2">
              <Star className="mr-2 h-4 w-4" /> Over 100+ Premium Resources
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Production-Ready <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">Templates</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Stop reinventing the wheel. Kickstart your next big idea with beautifully crafted, accessible, and scalable starter kits.
            </p>
          </div>

          <div className="w-full md:w-80 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search templates or tags..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-background/50 border-white/10 focus-visible:ring-primary backdrop-blur-sm rounded-xl" 
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 bg-background/50 backdrop-blur-sm border-white/10 rounded-xl h-10">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" className="flex-1 bg-background/50 backdrop-blur-sm border-white/10 rounded-xl h-10">
                Most Popular
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
        {filteredTemplates.map((tpl, i) => (
          <motion.div key={i} variants={item} className="h-full">
            <Card className="group h-full flex flex-col bg-background/40 backdrop-blur-md border-white/10 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] overflow-hidden">
              
              {/* Graphic Header */}
              <div className={`h-40 relative overflow-hidden bg-gradient-to-br ${tpl.gradient}`}>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500">
                  <tpl.icon className="h-16 w-16 text-white drop-shadow-lg" />
                </div>
                
                {/* Overlay actions on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full shadow-lg">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="icon" className="h-10 w-10 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>

                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-md border-white/10 font-medium">
                    {tpl.price}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3 pt-5">
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{tpl.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2 leading-relaxed">{tpl.desc}</CardDescription>
              </CardHeader>
              
              <CardContent className="pb-4 flex-1">
                <div className="flex flex-wrap gap-2">
                  {tpl.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="bg-primary/5 border-primary/20 text-xs font-medium">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter className="pt-4 pb-5 border-t border-white/5 flex justify-between items-center bg-muted/10 mt-auto">
                <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  <Download className="h-4 w-4 text-primary" /> {tpl.downloads}
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                  View Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {filteredTemplates.length === 0 && (
        <div className="text-center py-20 bg-background/30 rounded-2xl border border-white/5 border-dashed">
          <LayoutTemplate className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold">No templates found</h3>
          <p className="text-muted-foreground mt-2">We couldn&apos;t find any templates matching &quot;{searchQuery}&quot;</p>
          <Button variant="outline" onClick={() => setSearchQuery("")} className="mt-6">Clear Filters</Button>
        </div>
      )}

    </div>
  )
}
