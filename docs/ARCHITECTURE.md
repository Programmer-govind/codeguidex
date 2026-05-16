# CodeGuideX — Project Architecture

## Tech Stack
- **Framework**: Next.js 15 (App Router, full-stack)
- **Database**: Firebase Firestore + Firebase Realtime Database
- **Auth**: Firebase Authentication
- **Storage**: Firebase Storage
- **Payments**: Stripe
- **Video Sessions**: Jitsi Meet API (JaaS)
- **AI**: Google Gemini 1.5 Flash
- **Email**: SendGrid
- **Deployment**: Vercel

---

## ⚠️ Important: Next.js is Full-Stack

Unlike a traditional project with a separate `frontend/` and `backend/` folder,  
**Next.js combines both in a single repo**. The separation is by folder name convention:

```
src/
│
├── app/
│   ├── api/                  ← 🔧 BACKEND — Server-side API route handlers
│   │   ├── ai/               ← AI endpoints (Gemini calls happen here, key is secret)
│   │   ├── complete-booking/ ← Booking finalization
│   │   ├── create-payment-intent/ ← Stripe payment creation
│   │   ├── generate-jitsi-token/  ← Jitsi JWT signing
│   │   └── send-email/       ← SendGrid email sending
│   │
│   └── (page routes)         ← 🎨 FRONTEND — React page components (rendered in browser)
│       ├── page.tsx           ← Landing page
│       ├── auth/              ← Login, signup, forgot-password
│       ├── dashboard/         ← User dashboard
│       ├── communities/       ← Community listing
│       ├── posts/             ← Community posts
│       ├── mentors/           ← Mentor discovery
│       ├── ai/                ← AI Studio page
│       ├── marketplace/       ← Video marketplace
│       └── saved/             ← Bookmarks
│
├── components/               ← 🎨 FRONTEND — Reusable React UI components
│   ├── ui/                   ← Design primitives (Button, Card, Input, Badge)
│   ├── layout/               ← Navbar, Sidebar, Footer, MainLayout
│   ├── providers/            ← ThemeProvider, ReduxProvider
│   ├── auth/                 ← ProtectedRoute
│   ├── community/            ← Community-specific components
│   ├── mentor/               ← Mentor-specific components
│   ├── chat/                 ← AI Chat Widget
│   └── ai/                   ← AI code generator modal, message bubbles
│
├── hooks/                    ← 🎨 FRONTEND — Custom React hooks (client-side state)
│   ├── useAuth.ts
│   ├── useCommunity.ts
│   ├── usePost.ts
│   ├── useAI.ts              ← NEW
│   └── ...
│
├── store/                    ← 🎨 FRONTEND — State management
│   ├── store.ts              ← Redux store
│   ├── uiStore.ts            ← Zustand (sidebar/modal state only)
│   └── slices/               ← Redux slices per feature
│
├── services/                 ← 🔧/🎨 SHARED — Firebase client SDK calls
│   │                            (Run in browser, use client Firebase SDK)
│   │                            (NOT server-only — don't put secrets here)
│   ├── auth.service.ts
│   ├── community.service.ts
│   ├── post.service.ts
│   ├── mentor.service.ts
│   ├── ai.service.ts         ← NEW
│   └── ...
│
├── config/                   ← 🔧/🎨 SHARED — Configuration
│   ├── firebase.config.ts    ← Firebase CLIENT config (safe to expose)
│   ├── firestore.collections.ts ← Collection name constants
│   ├── stripe.config.ts      ← Stripe publishable key only
│   └── api.config.ts         ← API endpoint URLs
│
├── lib/                      ← 🎨 FRONTEND — Utility functions
│   └── utils.ts              ← cn() class merge utility
│
└── types/                    ← 📋 SHARED — TypeScript interfaces (no runtime code)
    ├── user.types.ts
    ├── community.types.ts
    ├── mentor.types.ts
    └── ai.types.ts           ← NEW

functions/                    ← 🔧 BACKEND — Firebase Cloud Functions
│                                (Separate deploy target: firebase deploy --only functions)
└── src/
    └── index.ts              ← Cloud Functions entry (background jobs, triggers)

docs/                         ← 📄 DOCUMENTATION — All markdown docs
```

---

## Secret Keys Rule

| Location | Can access secret env vars? |
|---|---|
| `src/app/api/**` (API routes) | ✅ YES — runs on server |
| `functions/` (Cloud Functions) | ✅ YES — runs on server |
| `src/services/**` | ❌ NO — runs in browser |
| `src/components/**` | ❌ NO — runs in browser |
| `src/hooks/**` | ❌ NO — runs in browser |

**Rule**: `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`, `FIREBASE_PRIVATE_KEY` etc.  
**must only** be used in `src/app/api/` or `functions/`.  
Only `NEXT_PUBLIC_*` variables are safe for browser code.
