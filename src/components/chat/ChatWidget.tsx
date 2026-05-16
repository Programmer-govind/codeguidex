'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAI } from '@/hooks/useAI';
import { useAuth } from '@/hooks/useAuth';

export function ChatWidget() {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    isWidgetOpen,
    currentMessages,
    isLoading,
    error,
    openAIWidget,
    closeAIWidget,
    sendMessage,
    newConversation,
  } = useAI();
  const { isAuthenticated } = useAuth();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue('');
    await sendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isWidgetOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Button
                id="ai-chat-widget-btn"
                onClick={openAIWidget}
                size="icon"
                className="h-14 w-14 rounded-full shadow-xl bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-300 border-0"
              >
                <Bot className="h-6 w-6 text-white" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Panel */}
        <AnimatePresence>
          {isWidgetOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute bottom-0 right-0 origin-bottom-right w-[360px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border bg-white dark:bg-[#0f1420]"
              style={{ height: '520px' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">CodeGuideX AI</p>
                    <div className="flex items-center gap-1 text-white/70 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      {isLoading ? 'Processing your question...' : 'Your AI Study Buddy ✦'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={newConversation}
                    className="text-white/70 hover:text-white hover:bg-white/20 h-8 w-8"
                    title="New conversation"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeAIWidget}
                    className="text-white/70 hover:text-white hover:bg-white/20 h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-[#0f1420]">
                {currentMessages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-cyan-500" />
                    </div>
                    <p className="text-sm font-medium">Ask me anything!</p>
                    <p className="text-xs text-muted-foreground">Debug code, explain concepts, or get architecture advice.</p>
                    {!isAuthenticated && (
                      <p className="text-xs text-amber-500 bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20">
                        Log in to save your conversations
                      </p>
                    )}
                  </div>
                )}

                {currentMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted text-foreground rounded-tl-sm border border-border'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 dark:bg-white/5 border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2.5">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      <span className="text-xs text-muted-foreground">Hold on, cooking up an answer 👨‍🍳</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2 border border-red-500/20">
                    {error}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-border bg-white dark:bg-[#0f1420] shrink-0">
                <form
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex items-center gap-2"
                >
                  <Input
                    id="ai-widget-input"
                    placeholder="Ask a coding question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                    className="flex-1 border-border bg-muted/50 focus-visible:ring-cyan-500/50 text-sm h-9"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim() || isLoading}
                    className="h-9 w-9 shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 border-0"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
