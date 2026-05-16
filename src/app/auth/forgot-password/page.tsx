"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { useState } from "react"

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate sending email
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 bg-background/60 backdrop-blur-2xl shadow-[0_0_50px_rgba(79,70,229,0.15)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-primary to-purple-500" />
          
          <CardHeader className="space-y-3 pb-6 text-center pt-8">
            <div className="mx-auto bg-cyan-500/10 w-12 h-12 rounded-full flex items-center justify-center mb-2 ring-1 ring-cyan-500/30">
              <ShieldCheck className="h-6 w-6 text-cyan-500" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Reset Password</CardTitle>
            <CardDescription className="text-base">
              {isSubmitted 
                ? "Check your email for a reset link." 
                : "Enter your email address and we'll send you a link to reset your password."}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {isSubmitted ? (
              <div className="flex flex-col space-y-4">
                <Button variant="outline" className="w-full h-11 bg-background/50 hover:bg-background/80" onClick={() => setIsSubmitted(false)}>
                  Didn&apos;t receive it? Try again
                </Button>
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full h-11 bg-gradient-to-r from-primary to-purple-600 text-white">
                    Return to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="email" 
                      placeholder="name@example.com" 
                      required
                      className="pl-10 h-11 bg-background/50 border-white/10 focus-visible:ring-primary"
                    />
                  </div>
                </div>
                
                <Button type="submit" className="w-full h-11 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg shadow-primary/25 mt-2">
                  Send Reset Link <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center border-t border-white/5 pt-6 pb-8">
            <Link href="/auth/login" className="flex items-center text-sm text-muted-foreground hover:text-primary font-medium transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
