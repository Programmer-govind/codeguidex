"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User, Bell, Shield, Key, Moon, Sun, Monitor, Save } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { useTheme } from "next-themes"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Monitor },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { theme, setTheme } = useTheme()

  return (
    <ProtectedRoute>
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 min-h-[calc(100vh-4rem)]">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <nav className="flex flex-row md:flex-col gap-1 md:gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* Settings Content */}
          <div className="flex-1 max-w-3xl">
            {activeTab === "profile" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="bg-background/40 backdrop-blur-md border-white/5">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and public profile details.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/20">
                        U
                      </div>
                      <Button variant="outline" className="bg-background/50">Change Avatar</Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input defaultValue="John" className="bg-background/50 border-white/10" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input defaultValue="Doe" className="bg-background/50 border-white/10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input defaultValue="user@example.com" type="email" className="bg-background/50 border-white/10" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bio</label>
                      <textarea 
                        className="w-full min-h-[100px] rounded-md border border-white/10 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                        defaultValue="Passionate software engineer focused on building beautiful web apps."
                      />
                    </div>
                    <div className="pt-4 flex justify-end">
                      <Button className="bg-primary text-white"><Save className="mr-2 h-4 w-4" /> Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeTab === "appearance" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <Card className="bg-background/40 backdrop-blur-md border-white/5">
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how CodeGuideX looks on your device.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-sm font-medium">Theme Preference</label>
                      <div className="grid grid-cols-3 gap-4">
                        <button 
                          onClick={() => setTheme("light")}
                          className={cn("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all", theme === "light" ? "border-primary bg-primary/5" : "border-white/5 bg-background/50 hover:border-white/20")}
                        >
                          <Sun className="h-6 w-6 mb-2" />
                          <span className="text-sm font-medium">Light</span>
                        </button>
                        <button 
                          onClick={() => setTheme("dark")}
                          className={cn("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all", theme === "dark" ? "border-primary bg-primary/5" : "border-white/5 bg-background/50 hover:border-white/20")}
                        >
                          <Moon className="h-6 w-6 mb-2" />
                          <span className="text-sm font-medium">Dark</span>
                        </button>
                        <button 
                          onClick={() => setTheme("system")}
                          className={cn("flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all", theme === "system" ? "border-primary bg-primary/5" : "border-white/5 bg-background/50 hover:border-white/20")}
                        >
                          <Monitor className="h-6 w-6 mb-2" />
                          <span className="text-sm font-medium">System</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {(activeTab === "notifications" || activeTab === "security") && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="bg-background/40 backdrop-blur-md border-white/5">
                  <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Shield className="h-8 w-8 text-primary opacity-50" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
                    <p className="text-muted-foreground max-w-sm">These settings are currently under development. Check back later!</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
