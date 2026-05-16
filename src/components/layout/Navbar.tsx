"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Search, Sun, Moon, Bell, Menu, User, LayoutDashboard, Settings, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/uiStore"

import { useAuthStore } from "@/store/authStore"

// Custom SVG Logo Component
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
)

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { toggleSidebar } = useUIStore()
  const { isAuthenticated, logout } = useAuthStore()
  const [isProfileOpen, setIsProfileOpen] = React.useState(false)
  const profileRef = React.useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        
        {/* Menu Toggle */}
        <Button variant="ghost" size="icon" className="mr-2" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="transition-transform group-hover:scale-105 group-active:scale-95">
              <CodeGuideXLogo />
            </div>
            <span className="hidden font-bold sm:inline-block text-xl tracking-tight text-gradient">
              CodeGuideX
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
          <div className="hidden w-full max-w-sm sm:flex items-center relative group">
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="search"
              placeholder="Search CodeGuideX..."
              className="pl-9 bg-muted/50 w-full rounded-full border-transparent focus-visible:ring-primary focus-visible:bg-background transition-all"
            />
          </div>
          
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Bell className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-muted-foreground" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-muted-foreground" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Auth / Profile Area */}
            {isAuthenticated ? (
              <div className="relative ml-2" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all ring-2 ring-transparent focus:outline-none focus:ring-primary/50"
                >
                  U
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border bg-card text-card-foreground shadow-xl z-50 overflow-hidden"
                    >
                      <div className="p-4 border-b bg-muted/30">
                        <p className="text-sm font-medium leading-none">User Name</p>
                        <p className="text-xs text-muted-foreground mt-1">user@example.com</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted hover:text-foreground transition-colors group">
                          <User className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> My Profile
                        </Link>
                        <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted hover:text-foreground transition-colors group">
                          <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> Dashboard
                        </Link>
                        <Link href="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-muted hover:text-foreground transition-colors group">
                          <Settings className="mr-2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" /> Settings
                        </Link>
                      </div>
                      <div className="p-2 border-t">
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false)
                            logout()
                          }}
                          className="flex w-full items-center px-3 py-2 text-sm text-destructive rounded-md hover:bg-destructive/10 transition-colors"
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
                  <Button className="text-sm font-medium bg-primary hover:bg-primary/90 text-white rounded-full px-5">Sign up</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
