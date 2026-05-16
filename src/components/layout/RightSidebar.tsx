"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Flame, ArrowUpRight } from "lucide-react"
import Link from "next/link"

const trendingTopics = [
  { name: "React Server Components", posts: 124 },
  { name: "Tailwind v4", posts: 89 },
  { name: "AI Integration", posts: 256 },
  { name: "Next.js App Router", posts: 145 },
]

const suggestedMentors = [
  { name: "Alex Chen", role: "Senior Frontend Engineer", match: "98%" },
  { name: "Sarah Drasner", role: "Vue/React Expert", match: "95%" },
  { name: "Dan Abramov", role: "React Core Team", match: "92%" },
]

export function RightSidebar() {
  return (
    <aside className="hidden xl:block w-80 shrink-0 border-l bg-background/50 backdrop-blur-md h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto p-4 space-y-6">
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 flex flex-wrap gap-2">
          {trendingTopics.map((topic) => (
            <Badge key={topic.name} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
              {topic.name} <span className="ml-1 text-muted-foreground">({topic.posts})</span>
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-transparent border-0 shadow-none mt-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-sm">Suggested Mentors</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          {suggestedMentors.map((mentor) => (
            <div key={mentor.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                  {mentor.name.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                    {mentor.name}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1">
                    {mentor.role}
                  </span>
                </div>
              </div>
              <Link href="/mentors" className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                Connect <ArrowUpRight className="h-3 w-3 ml-1" />
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  )
}
