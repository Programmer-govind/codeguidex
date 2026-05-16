"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { MessageCircle, X, Send, Bot, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your CodeGuideX AI Assistant. How can I help you with your code today?", isBot: true },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    if (!inputValue.trim()) return
    
    // Add user message
    setMessages(prev => [...prev, { id: Date.now(), text: inputValue, isBot: false }])
    const currentInput = inputValue
    setInputValue("")
    
    // Simulate AI reply
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: `I can certainly help you with "${currentInput}". Let me analyze your request and generate some code snippets for you.`, 
        isBot: true 
      }])
    }, 1000)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <Button 
                onClick={() => setIsOpen(true)}
                size="icon" 
                className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-500/50 hover:scale-105 transition-all duration-300"
              >
                <Bot className="h-6 w-6 text-white" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-0 right-0 origin-bottom-right"
            >
              <Card className="w-[350px] shadow-2xl border-primary/20 flex flex-col h-[500px]">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-t-xl p-4 flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-md">AI Assistant</CardTitle>
                      <div className="text-xs text-white/80 flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></span> Online
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsOpen(false)}
                    className="text-white hover:bg-white/20 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/10">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                          msg.isBot 
                            ? 'bg-muted text-foreground rounded-tl-sm' 
                            : 'bg-primary text-primary-foreground rounded-tr-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="p-3 border-t bg-background">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex w-full items-center space-x-2"
                  >
                    <Input 
                      placeholder="Type a message..." 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="flex-1 border-0 focus-visible:ring-1 focus-visible:ring-primary bg-muted/50"
                    />
                    <Button type="submit" size="icon" className="h-9 w-9 shrink-0 bg-primary hover:bg-primary/90">
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
