'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Send, Bot, User, Copy, Check, Code2, Loader2,
  Terminal, RotateCcw, Download,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { sendChatMessage, generateCodeStream } from '@/services/ai.service';
import type { AICodeGenResponse, AIMessage } from '@/types/ai.types';

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'SQL', 'HTML/CSS', 'Bash'];

const QUICK_PROMPTS = [
  'Write a debounce function in JavaScript',
  'Create a Python class for a binary search tree',
  'Build a REST API endpoint in TypeScript',
  'Write a SQL query to find duplicate records',
];

const STARTER_QUESTIONS = [
  'Explain Big O notation with examples',
  'What is a closure in JavaScript?',
  'Difference between == and ===',
  'How does async/await work?',
];

export default function AIPage() {
  const { isAuthenticated } = useAuth();

  // ── Chat state (independent from widget, streaming-capable) ──
  const [chatMessages, setChatMessages] = useState<AIMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [streamingResponse, setStreamingResponse] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // ── Code Gen state ──
  const [codePrompt, setCodePrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [streamingCode, setStreamingCode] = useState('');
  const [codeResult, setCodeResult] = useState<AICodeGenResponse | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Scroll the chat panel (not the whole page) when messages update
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, streamingResponse]);

  // ── Streaming chat send ──
  const handleChatSend = useCallback(async (text?: string) => {
    const messageText = (text ?? chatInput).trim();
    if (!messageText || isChatLoading) return;
    setChatInput('');
    setChatError(null);

    const userMsg: AIMessage = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsChatLoading(true);
    setStreamingResponse('');

    try {
      // Build history without the message we just added
      const history = chatMessages.map((m) => ({ role: m.role as 'user' | 'model', content: m.content }));
      const fullResponse = await sendChatMessage(messageText, history);

      // Simulate token-by-token streaming for chat by chunking the response
      const words = fullResponse.split(' ');
      let displayed = '';
      for (let i = 0; i < words.length; i++) {
        displayed += (i === 0 ? '' : ' ') + words[i];
        setStreamingResponse(displayed);
        await new Promise((r) => setTimeout(r, 18)); // ~18ms per word ≈ natural reading speed
      }

      const aiMsg: AIMessage = {
        id: `a_${Date.now()}`,
        role: 'model',
        content: fullResponse,
        timestamp: new Date().toISOString(),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      setStreamingResponse('');
    } catch (err: any) {
      setChatError(err.message || 'Failed to get response');
    } finally {
      setIsChatLoading(false);
    }
  }, [chatInput, chatMessages, isChatLoading]);

  // ── Code generation (true SSE streaming) ──
  const handleGenerate = useCallback(async () => {
    if (!codePrompt.trim() || isGenerating) return;
    setStreamingCode('');
    setCodeResult(null);
    setIsGenerating(true);

    try {
      const gen = generateCodeStream(
        codePrompt,
        selectedLanguage,
        undefined,
        (result) => {
          setCodeResult(result);
          setStreamingCode('');
        }
      );
      for await (const chunk of gen) {
        setStreamingCode((prev) => prev + chunk);
      }
    } catch (err: any) {
      setStreamingCode(`// Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [codePrompt, selectedLanguage, isGenerating]);

  const handleCopy = () => {
    const code = codeResult?.code || streamingCode;
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = codeResult?.code;
    if (!code) return;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = codeResult?.filename || 'output.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    setChatMessages([]);
    setStreamingResponse('');
    setChatError(null);
  };

  const displayCode = codeResult?.code || streamingCode;
  const allMessages = [...chatMessages];

  return (
    <div className="flex flex-col gap-4" style={{ height: 'calc(100vh - 9rem)' }}>
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Studio</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
              Your intelligent coding companion
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clearChat} className="gap-2 text-xs">
            <RotateCcw className="h-3 w-3" /> New Chat
          </Button>
          {!isAuthenticated && (
            <Badge variant="warning" className="text-xs">Log in to save chats</Badge>
          )}
        </div>
      </div>

      {/* Two-panel layout — fills remaining height */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">

        {/* ── LEFT: Chat Panel ── */}
        <Card className="flex flex-col overflow-hidden border-border/50 relative">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
          <CardHeader className="pb-3 border-b border-border shrink-0 py-3 px-4">
            <CardTitle className="text-sm flex items-center gap-2">
              <Bot className="h-4 w-4 text-cyan-500" /> AI Doubt Helper
            </CardTitle>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            {/* Messages scroll area — uses chatScrollRef so only THIS panel scrolls */}
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {allMessages.length === 0 && !streamingResponse && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-8">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Bot className="h-7 w-7 text-cyan-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Start a conversation</p>
                    <p className="text-sm text-muted-foreground mt-1">Ask about algorithms, debug code, or explain concepts</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                    {STARTER_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleChatSend(q)}
                        className="text-xs text-left px-3 py-2.5 rounded-lg border border-border hover:border-primary/30 hover:bg-muted transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {allMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`h-7 w-7 shrink-0 rounded-full flex items-center justify-center mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gradient-to-br from-cyan-500 to-blue-600'
                  }`}>
                    {msg.role === 'user'
                      ? <User className="h-3.5 w-3.5" />
                      : <Bot className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted border border-border rounded-tl-sm text-foreground'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {/* Streaming response — word by word */}
              {streamingResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2.5"
                >
                  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-relaxed bg-muted border border-border text-foreground whitespace-pre-wrap break-words">
                    {streamingResponse}
                    <span className="inline-block w-0.5 h-4 bg-cyan-500 animate-pulse ml-0.5 align-middle" />
                  </div>
                </motion.div>
              )}

              {/* Loading bouncing dots */}
              {isChatLoading && !streamingResponse && (
                <div className="flex gap-2.5">
                  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-muted border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '120ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '240ms' }} />
                  </div>
                </div>
              )}

              {chatError && (
                <div className="text-xs text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {chatError}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border shrink-0">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl blur opacity-0 group-focus-within:opacity-20 transition duration-300" />
                <div className="relative flex items-center gap-2">
                  <Input
                    id="ai-chat-input"
                    placeholder="Ask about code, algorithms, debugging..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleChatSend(); }}}
                    disabled={isChatLoading}
                    className="flex-1 bg-background border-border text-sm h-10"
                  />
                  <Button
                    id="ai-chat-send-btn"
                    onClick={() => handleChatSend()}
                    size="icon"
                    disabled={!chatInput.trim() || isChatLoading}
                    className="h-10 w-10 shrink-0 bg-gradient-to-r from-cyan-500 to-blue-600 border-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── RIGHT: Code Generator ── */}
        <div className="flex flex-col gap-3 overflow-hidden">
          {/* Prompt card */}
          <Card className="shrink-0">
            <CardHeader className="pb-2 border-b border-border py-3 px-4">
              <CardTitle className="text-sm flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" /> Code Generator
                <span className="ml-auto text-[10px] text-muted-foreground font-normal">Token-by-token SSE streaming</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 pb-3 px-4 space-y-2.5">
              {/* Language pills */}
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border hover:border-primary/40 hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              {/* Quick prompts */}
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setCodePrompt(p)}
                    className="text-left text-xs px-2.5 py-2 rounded-lg border border-border hover:border-primary/30 hover:bg-muted transition-colors text-muted-foreground truncate"
                    title={p}
                  >
                    {p}
                  </button>
                ))}
              </div>
              {/* Input + generate */}
              <div className="flex gap-2">
                <Input
                  id="code-gen-input"
                  placeholder={`Describe what to build in ${selectedLanguage}...`}
                  value={codePrompt}
                  onChange={(e) => setCodePrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleGenerate(); }}
                  disabled={isGenerating}
                  className="flex-1 text-sm"
                />
                <Button
                  id="code-gen-btn"
                  onClick={handleGenerate}
                  disabled={!codePrompt.trim() || isGenerating}
                  className="shrink-0 gap-1.5 text-sm"
                >
                  {isGenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                  {isGenerating ? 'Generating...' : 'Generate'}
                </Button>
              </div>
              {codeResult?.explanation && (
                <p className="text-xs text-muted-foreground bg-muted rounded-lg px-3 py-2 border border-border leading-relaxed">
                  💡 {codeResult.explanation}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Code output — takes ALL remaining height */}
          <div className="flex-1 flex flex-col overflow-hidden rounded-2xl border border-border bg-[#0d1117] min-h-0">
            {/* Mac-style titlebar */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded border border-white/5">
                  <Code2 className="h-3 w-3 text-cyan-400" />
                  {codeResult?.filename || `output.${selectedLanguage.toLowerCase().replace(/\//g, '_')}`}
                </div>
              </div>
              <div className="flex gap-1.5">
                {codeResult && (
                  <Button variant="ghost" size="sm" onClick={handleDownload}
                    className="h-6 text-[11px] text-slate-400 hover:text-white hover:bg-white/10 px-2">
                    <Download className="h-3 w-3 mr-1" /> Download
                  </Button>
                )}
                <Button
                  id="copy-code-btn"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!displayCode}
                  className="h-6 text-[11px] text-slate-400 hover:text-white hover:bg-white/10 px-2"
                >
                  {copied
                    ? <><Check className="h-3 w-3 mr-1 text-emerald-400" /> Copied</>
                    : <><Copy className="h-3 w-3 mr-1" /> Copy</>}
                </Button>
              </div>
            </div>

            {/* Scrollable code area — key fix: explicit overflow-y-auto + no min-h */}
            <div className="flex-1 overflow-y-auto overflow-x-auto p-4">
              {!displayCode && !isGenerating && (
                <div className="h-full flex items-center justify-center min-h-[200px]">
                  <div className="text-center">
                    <Code2 className="h-10 w-10 text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Generated code appears here</p>
                    <p className="text-slate-600 text-xs mt-1">Streams token-by-token ✨</p>
                  </div>
                </div>
              )}
              {isGenerating && !displayCode && (
                <div className="flex items-center gap-2 text-slate-400 p-2">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-500 shrink-0" />
                  <span className="text-sm">Generating code, streaming tokens...</span>
                </div>
              )}
              {displayCode && (
                <pre className="font-mono text-[13px] leading-6 text-slate-300 whitespace-pre break-normal m-0">
                  <code>{displayCode}</code>
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
