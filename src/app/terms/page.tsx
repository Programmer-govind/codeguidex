"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Gavel, Scale, FileCheck, AlertCircle, ArrowLeft, ChevronRight, Globe, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function TermsOfServicePage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  const sections = [
    {
      title: "1. Acceptance",
      icon: FileCheck,
      content: "By accessing or using CodeGuideX, you agree to be bound by these Terms. If you do not agree, please do not use our platform."
    },
    {
      title: "2. User Conduct",
      icon: Scale,
      content: "You agree to use our platform responsibly. Harassment, harmful content, and violation of intellectual property rights are strictly prohibited."
    },
    {
      title: "3. Content Rights",
      icon: ShieldCheck,
      content: "You retain ownership of your content but grant us a license to host and distribute it. Our platform content remains our property."
    },
    {
      title: "4. Liability",
      icon: AlertCircle,
      content: "CodeGuideX is provided 'as is'. We are not liable for indirect damages arising from your use of the platform."
    }
  ]

  return (
    <div className="min-h-screen py-12 md:py-20 px-4">
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors group mb-4">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Terms of <span className="text-primary">Service</span></h1>
            <p className="text-muted-foreground">Last updated: May 16, 2026</p>
          </div>
          <div className="hidden md:block">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 -rotate-3">
              <Gavel className="h-10 w-10 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Quick Summary Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {sections.map((section, index) => (
            <motion.div key={index} variants={item}>
              <div className="h-full p-6 rounded-2xl bg-background/40 backdrop-blur-md border border-white/10 hover:border-primary/30 transition-all group">
                <section.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">{section.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed Content Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-background/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 shadow-2xl space-y-10"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Globe className="h-4 w-4 text-primary" />
              </div>
              5. Service Description
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              CodeGuideX is a learning ecosystem that facilitates connections between developers through:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {[
                "1-on-1 Mentoring Sessions",
                "Community Discussion Boards",
                "AI-Powered Code Assistance",
                "Technical Learning Resources"
              ].map((text, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-sm">
                  <ChevronRight className="h-4 w-4 text-primary shrink-0" /> {text}
                </li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-primary" />
              </div>
              6. Termination
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to suspend or terminate your account at our discretion for violations of these Terms. You may also close your account at any time through your dashboard settings.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center space-y-4">
            <h2 className="text-2xl font-bold">Legal Questions?</h2>
            <p className="text-muted-foreground">For any inquiries regarding our legal terms or user agreements, please contact our legal team.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 rounded-full">
                Contact Legal Team
              </Button>
              <a href="mailto:legal@codeguidex.com" className="text-sm font-medium hover:text-primary transition-colors">
                legal@codeguidex.com
              </a>
            </div>
          </section>
        </motion.div>

        {/* Footer Link */}
        <div className="text-center pt-8">
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Read our Privacy Policy instead?
          </Link>
        </div>
      </div>
    </div>
  )
}