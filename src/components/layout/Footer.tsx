import Link from 'next/link';
import { ExternalLink, Mail, BookOpen } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background/60 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="font-bold text-lg bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-2">
              CodeGuideX
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered developer platform to learn, connect with communities, and get personalized mentorship.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="GitHub">
                <ExternalLink className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Docs">
                <BookOpen className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/communities" className="hover:text-primary transition-colors">Communities</Link></li>
              <li><Link href="/mentors" className="hover:text-primary transition-colors">Find Mentors</Link></li>
              <li><Link href="/marketplace" className="hover:text-primary transition-colors">Video Marketplace</Link></li>
              <li><Link href="/ai" className="hover:text-primary transition-colors">AI Assistant</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CodeGuideX. Major Project — 8th Semester.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js · Firebase · Google Gemini
          </p>
        </div>
      </div>
    </footer>
  );
}
