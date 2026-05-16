"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, Lock, Eye, FileText, ArrowLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function PrivacyPolicyPage() {
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
      title: "1. Introduction",
      icon: Shield,
      content: "Welcome to CodeGuideX. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform."
    },
    {
      title: "2. Information We Collect",
      icon: Eye,
      content: "We collect information that you provide directly to us, such as your name, email address, and profile details. We also automatically collect usage data, device information, and IP addresses to improve our services."
    },
    {
      title: "3. How We Use Your Information",
      icon: Lock,
      content: "Your data is used to provide and maintain our platform, facilitate connections between students and mentors, and send important updates. We never sell your personal information to third parties."
    },
    {
      title: "4. Data Security",
      icon: Lock,
      content: "We implement industry-standard technical and organizational measures to protect your data. While we strive for absolute security, no method of transmission over the internet is 100% secure."
    }
  ]

  return (
    <div className="min-h-screen py-12 md:py-20 px-4">
      {/* Background Accents */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Privacy <span className="text-primary">Policy</span></h1>
            <p className="text-muted-foreground">Last updated: May 16, 2026</p>
          </div>
          <div className="hidden md:block">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 rotate-3">
              <Shield className="h-10 w-10 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* Core Sections Grid */}
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

        {/* Detailed Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-background/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 shadow-2xl space-y-10"
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              5. Information Sharing
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except in the following circumstances:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {[
                "Service providers assisting platform operations",
                "Compliance with legal obligations",
                "Business transfers or acquisitions",
                "Explicit user-granted consent"
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
                <Lock className="h-4 w-4 text-primary" />
              </div>
              6. Your Rights
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Depending on your location, you have rights regarding access, correction, deletion, and portability of your data. You can exercise these rights through your account settings or by contacting our support team.
            </p>
          </section>

          <section className="p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center space-y-4">
            <h2 className="text-2xl font-bold">Have questions?</h2>
            <p className="text-muted-foreground">Our privacy team is here to help you understand how we protect your data.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 rounded-full">
                Contact Privacy Team
              </Button>
              <a href="mailto:privacy@codeguidex.com" className="text-sm font-medium hover:text-primary transition-colors">
                privacy@codeguidex.com
              </a>
            </div>
          </section>
        </motion.div>

        {/* Footer Link */}
        <div className="text-center pt-8">
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Read our Terms of Service instead?
          </Link>
        </div>
      </div>
    </div>
  )
}