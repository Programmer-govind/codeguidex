"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Check, Star, Zap, Crown, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function PricingPage() {
  const router = useRouter()

  const tiers = [
    {
      name: "Starter",
      desc: "Perfect for getting started with the platform.",
      price: "Free",
      icon: Star,
      features: [
        "Access to public communities",
        "Read-only access to templates",
        "Save up to 50 items",
        "Community support"
      ],
      button: "Start for free",
      variant: "default",
      color: "text-slate-400",
      bgStyle: "bg-background/40 hover:border-slate-500/50"
    },
    {
      name: "Pro",
      desc: "For serious developers looking to accelerate their career.",
      price: "$19",
      period: "/month",
      icon: Zap,
      features: [
        "Everything in Starter",
        "Unlimited AI Code Generations",
        "Download all premium templates",
        "1 Free Mentorship Session/mo",
        "Priority support"
      ],
      button: "Upgrade to Pro",
      variant: "primary",
      color: "text-purple-500",
      bgStyle: "bg-background/40 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.15)] transform md:-translate-y-4 relative"
    },
    {
      name: "Enterprise",
      desc: "For teams that need maximum performance and support.",
      price: "$99",
      period: "/month",
      icon: Crown,
      features: [
        "Everything in Pro",
        "Unlimited Mentorship Sessions",
        "Custom AI model fine-tuning",
        "Team analytics dashboard",
        "Dedicated success manager"
      ],
      button: "Contact Sales",
      variant: "outline",
      color: "text-amber-500",
      bgStyle: "bg-background/40 hover:border-amber-500/50"
    }
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } as any }
  }

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto px-4 md:px-0">
      
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-8">
        <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-500 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <Crown className="mr-2 h-4 w-4" /> Simple, Transparent Pricing
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
          Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-amber-500">Career</span>
        </h1>
        <p className="text-xl text-muted-foreground pt-2">
          Choose the plan that best fits your needs. Upgrade, downgrade, or cancel at any time.
        </p>
      </div>

      {/* Pricing Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-8"
      >
        {tiers.map((tier, i) => (
          <motion.div key={i} variants={item} className="h-full">
            <Card className={`h-full flex flex-col backdrop-blur-xl transition-all duration-500 ${tier.bgStyle}`}>
              
              {/* Pro Tier Special Effects */}
              {tier.name === "Pro" && (
                <>
                  <div className="absolute -inset-[1px] bg-gradient-to-b from-purple-500 to-pink-600 rounded-xl z-[-1] opacity-50 blur-[2px]" />
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 px-3 py-1 shadow-lg font-bold tracking-wider">
                      MOST POPULAR
                    </Badge>
                  </div>
                </>
              )}

              <CardHeader className="text-center pb-8 pt-10">
                <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center bg-muted/20 mb-6 border border-white/10 ${tier.name === 'Pro' ? 'shadow-[0_0_30px_rgba(168,85,247,0.3)]' : ''}`}>
                  <tier.icon className={`h-8 w-8 ${tier.color}`} />
                </div>
                <CardTitle className="text-2xl font-bold mb-2">{tier.name}</CardTitle>
                <CardDescription className="h-10">{tier.desc}</CardDescription>
                
                <div className="mt-8 flex items-baseline justify-center gap-1">
                  <span className="text-5xl font-extrabold tracking-tight">{tier.price}</span>
                  {tier.period && <span className="text-muted-foreground font-medium">{tier.period}</span>}
                </div>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-emerald-500" />
                      </div>
                      <span className="text-muted-foreground text-sm leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-8 pb-8">
                <Button 
                  onClick={() => router.push('/auth/signup')}
                  className={`w-full h-12 text-sm font-semibold ${
                    tier.name === 'Pro' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 border-0' 
                      : 'bg-muted text-foreground hover:bg-muted/80 border border-border/50'
                  }`}
                  variant={tier.variant as any}
                >
                  {tier.button} {tier.name === 'Pro' && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Enterprise CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-16 rounded-2xl bg-gradient-to-r from-muted/50 to-muted/20 border border-white/10 p-8 md:p-12 text-center max-w-4xl mx-auto backdrop-blur-sm"
      >
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          We offer tailored plans for large teams, educational institutions, and bootcamps. Get in touch with our sales team to build a package that fits your exact requirements.
        </p>
        <Button variant="outline" className="bg-background/50 border-white/20 h-12 px-8">
          Contact our Sales Team
        </Button>
      </motion.div>

    </div>
  )
}
