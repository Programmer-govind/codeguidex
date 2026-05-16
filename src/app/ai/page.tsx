"use client"

import { Card, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { Sparkles, Send, Code2, Copy, Check, Bot, User, Zap, Terminal } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { useState } from "react"
import { motion } from "framer-motion"

export default function AIGeneratorPage() {
  const [copied, setCopied] = useState(false)
  
  const mockCode = `function calculateTotal(items) {
  return items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}

// Example usage:
const cart = [
  { price: 10, quantity: 2 },
  { price: 5, quantity: 4 }
];

console.log(calculateTotal(cart)); // 40`

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6 max-w-[1600px] mx-auto pb-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Assistant</h1>
            <p className="text-sm text-muted-foreground">Powered by CodeGuideX-7B</p>
          </div>
        </div>
        <div className="hidden sm:flex gap-2">
          <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm border-white/10">
            <Terminal className="mr-2 h-4 w-4" /> Open in Editor
          </Button>
          <Button variant="outline" size="sm" className="bg-background/50 backdrop-blur-sm border-white/10 text-cyan-500 border-cyan-500/20 hover:bg-cyan-500/10">
            <Zap className="mr-2 h-4 w-4" /> Upgrade to GPT-4
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Chat Section */}
        <Card className="flex-1 flex flex-col h-full border-white/10 bg-background/40 backdrop-blur-xl shadow-2xl shadow-cyan-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-[200px] bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none" />
          
          <CardContent className="flex-1 flex flex-col p-0 relative z-10">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 max-w-[90%]">
                <div className="h-8 w-8 shrink-0 rounded-full bg-muted/50 flex items-center justify-center border border-white/10 mt-1">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <div className="font-medium text-sm">You</div>
                  <div className="bg-white/5 border border-white/10 text-foreground rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
                    Write a JavaScript function to calculate the total price of items in a shopping cart. It should handle an array of objects containing price and quantity.
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-4 max-w-[95%]">
                <div className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 mt-1">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="space-y-2 w-full">
                  <div className="font-medium text-sm flex items-center gap-2">
                    CodeGuideX <Badge variant="secondary" className="text-[10px] h-4 px-1.5 bg-cyan-500/10 text-cyan-500 border-cyan-500/20">AI</Badge>
                  </div>
                  <div className="bg-cyan-500/5 border border-cyan-500/20 text-foreground rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
                    Here is the JavaScript function you requested. It uses the <code className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded text-xs">reduce</code> method to cleanly and efficiently calculate the total without mutating any arrays.
                  </div>
                </div>
              </motion.div>

            </div>
            
            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-background/50 backdrop-blur-md">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                <div className="relative flex items-center">
                  <Input 
                    placeholder="Ask the AI mentor to write code, explain concepts, or debug..." 
                    className="pr-12 h-14 bg-background/80 border-white/10 focus-visible:ring-0 focus-visible:border-cyan-500/50 rounded-xl shadow-inner text-sm"
                  />
                  <Button size="icon" className="absolute right-1.5 h-11 w-11 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all group-hover:shadow-cyan-500/40 border-0 text-white">
                    <Send className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
              </div>
              <div className="text-center mt-2 text-[10px] text-muted-foreground">
                AI generations can make mistakes. Always verify the output before using in production.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Code Output Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex-1 h-full">
          <Card className="h-full flex flex-col border-white/10 bg-[#0A0A0B] text-slate-50 overflow-hidden shadow-2xl relative">
            
            {/* Glassy Mac-like Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111113] border-b border-white/5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-md border border-white/5">
                  <Code2 className="h-3.5 w-3.5 text-cyan-400" /> calculateTotal.js
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-slate-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }}
              >
                {copied ? <><Check className="h-3.5 w-3.5 mr-1.5 text-emerald-400" /> Copied</> : <><Copy className="h-3.5 w-3.5 mr-1.5" /> Copy Code</>}
              </Button>
            </div>

            {/* Code Body */}
            <CardContent className="flex-1 p-0 overflow-y-auto relative">
              {/* Subtle grid background for code editor vibe */}
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />
              
              <div className="p-6 font-mono text-[13px] leading-relaxed relative z-10">
                <pre className="text-slate-300">
                  <code dangerouslySetInnerHTML={{ __html: mockCode
                    .replace(/function/g, '<span class="text-pink-400">function</span>')
                    .replace(/return/g, '<span class="text-pink-400">return</span>')
                    .replace(/const/g, '<span class="text-pink-400">const</span>')
                    .replace(/console/g, '<span class="text-cyan-400">console</span>')
                    .replace(/log/g, '<span class="text-blue-400">log</span>')
                    .replace(/\/\/.*/g, match => `<span class="text-slate-500">${match}</span>`)
                    .replace(/([0-9]+)/g, '<span class="text-orange-400">$1</span>')
                  }} />
                </pre>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </div>
  )
}
