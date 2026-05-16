"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  FolderGit2, 
  Sparkles, 
  LayoutTemplate, 
  Bookmark, 
  Settings,
  CreditCard,
  Video,
  X,
  Users,
  MessageSquare,
  GraduationCap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/uiStore"
import { Button } from "@/components/ui/Button"

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Communities", href: "/communities", icon: Users },
  { name: "Posts", href: "/posts", icon: MessageSquare },
  { name: "Mentors", href: "/mentors", icon: GraduationCap },
  { name: "AI Generator", href: "/ai", icon: Sparkles },
  { name: "Templates", href: "/templates", icon: LayoutTemplate },
  { name: "Video Marketplace", href: "/marketplace", icon: Video },
  { name: "Saved Items", href: "/saved", icon: Bookmark },
  { name: "Pricing", href: "/pricing", icon: CreditCard },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isSidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <>
      {/* Backdrop for overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-md z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-background/60 backdrop-blur-md transform transition-transform duration-300 ease-out shadow-[0_0_40px_rgba(0,0,0,0.5)] will-change-transform",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <span className="font-bold text-xl tracking-tight text-gradient">Menu</span>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col gap-2 p-4 overflow-y-auto h-[calc(100vh-5rem)]">
          <nav className="flex flex-col gap-1.5 mt-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || pathname?.startsWith(link.href + "/")
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-primary/15 text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-primary/20"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-md shadow-[0_0_10px_var(--primary)]" />
                  )}
                  <Icon className={cn("h-5 w-5 transition-transform duration-200 group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
