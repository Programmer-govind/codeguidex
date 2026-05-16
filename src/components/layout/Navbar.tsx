'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Search, Sun, Moon, Bell, Menu, User, LayoutDashboard, Settings, LogOut, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUIStore } from '@/store/uiStore';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const CodeGuideXLogo = () => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="url(#paint0_linear)" />
    <path d="M14 12L8 20L14 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M26 12L32 20L26 28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22 10L18 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    <circle cx="20" cy="20" r="3" fill="#A855F7" />
    <defs>
      <linearGradient id="paint0_linear" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4F46E5" />
        <stop offset="1" stopColor="#9333EA" />
      </linearGradient>
    </defs>
  </svg>
);

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar } = useUIStore();
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsProfileOpen(false);
    await logout();
    router.push('/');
  };

  const userInitial = user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">

        <Button variant="ghost" size="icon" className="mr-2 text-muted-foreground" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/" className="flex items-center space-x-3 group mr-6">
          <div className="transition-transform group-hover:scale-105 group-active:scale-95">
            <CodeGuideXLogo />
          </div>
          <span className="hidden font-bold sm:inline-block text-xl tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            CodeGuideX
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-3">
          <div className="hidden w-full max-w-sm sm:flex items-center relative group">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="search"
              placeholder="Search CodeGuideX..."
              className="pl-9 bg-muted/50 w-full rounded-full border-transparent focus-visible:ring-primary focus-visible:bg-background"
            />
          </div>

          <nav className="flex items-center space-x-1">
            {isAuthenticated && (
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary" asChild>
                <Link href="/notifications">
                  <Bell className="h-5 w-5" />
                </Link>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="text-muted-foreground"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {isAuthenticated ? (
              <div className="relative ml-1" ref={profileRef}>
                <button
                  id="navbar-profile-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer hover:shadow-lg hover:shadow-primary/30 transition-all ring-2 ring-transparent focus:outline-none focus:ring-primary/50"
                >
                  {userInitial}
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card text-card-foreground shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-border bg-muted/30">
                        <p className="text-sm font-medium leading-none truncate">{user?.displayName || 'User'}</p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{user?.email}</p>
                        <span className="inline-flex items-center mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                          {user?.role || 'student'}
                        </span>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors group"
                        >
                          <User className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          My Profile
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors group"
                        >
                          <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          Dashboard
                        </Link>
                        <Link
                          href="/ai"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors group"
                        >
                          <Sparkles className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                          AI Assistant
                        </Link>
                        <Link
                          href="/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors group"
                        >
                          <Settings className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          Settings
                        </Link>
                      </div>
                      <div className="p-2 border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-3 py-2 text-sm text-red-500 rounded-md hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="mr-2 h-4 w-4" /> Log out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center ml-2 space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" className="text-sm font-medium">Log in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="text-sm font-medium rounded-full px-5">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
