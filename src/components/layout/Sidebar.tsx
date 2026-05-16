'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  Bookmark,
  Settings,
  CreditCard,
  Video,
  X,
  Users,
  MessageSquare,
  GraduationCap,
  Home,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/uiStore';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const studentLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Communities', href: '/communities', icon: Users },
  { name: 'Posts', href: '/posts', icon: MessageSquare },
  { name: 'Mentors', href: '/mentors', icon: GraduationCap },
  { name: 'AI Assistant', href: '/ai', icon: Sparkles },
  { name: 'Video Marketplace', href: '/marketplace', icon: Video },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
  { name: 'Saved Items', href: '/saved', icon: Bookmark },
  { name: 'Pricing', href: '/pricing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const mentorLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Communities', href: '/communities', icon: Users },
  { name: 'Posts', href: '/posts', icon: MessageSquare },
  { name: 'My Students', href: '/dashboard/mentor', icon: GraduationCap },
  { name: 'AI Assistant', href: '/ai', icon: Sparkles },
  { name: 'My Videos', href: '/marketplace', icon: Video },
  { name: 'Messages', href: '/dashboard/messages', icon: MessageCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { user } = useAuth();

  const links = user?.role === 'mentor' ? mentorLinks : studentLinks;

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Panel */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-background/95 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.15)]"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Menu
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex flex-col gap-1 p-4 overflow-y-auto h-[calc(100vh-5rem)]">
              <nav className="flex flex-col gap-1">
                {links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative',
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/20'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent'
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-primary rounded-r-full" />
                      )}
                      <Icon className={cn('h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110', isActive ? 'text-primary' : '')} />
                      {link.name}
                      {link.name === 'AI Assistant' && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 font-semibold">
                          NEW
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
