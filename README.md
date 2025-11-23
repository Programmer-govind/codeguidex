# CodeGuideX

A beginner-friendly community learning platform enabling users to post questions, join communities, interact with mentors, make payments, and attend live video sessions.

---

## 🚀 Getting Started

### Quick Start (2 minutes)

```bash
npm install
cp .env.example .env.local
# Edit .env.local with Firebase/Stripe credentials
npm run dev
```

Visit `http://localhost:3000`

---

## 📚 Documentation

**All documentation is in the `docs/` folder. Start here:**

### For New Developers
1. **[docs/PROJECT_SETUP_REFERENCE/SETUP.md](docs/PROJECT_SETUP_REFERENCE/SETUP.md)** - Development setup
2. **[docs/PROJECT_SETUP_REFERENCE/DEVELOPER_GUIDE.md](docs/PROJECT_SETUP_REFERENCE/DEVELOPER_GUIDE.md)** - Coding patterns
3. **[docs/README.md](docs/README.md)** - Complete documentation index

### For Project Overview
→ **[docs/PROJECT_SETUP_REFERENCE/README.md](docs/PROJECT_SETUP_REFERENCE/README.md)** - Project architecture and overview

### For Current Status
→ **[docs/PROJECT_SETUP_REFERENCE/PROJECT_STATUS.md](docs/PROJECT_SETUP_REFERENCE/PROJECT_STATUS.md)** - Progress and metrics

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS 4.1
- **State**: Redux Toolkit
- **Database**: Firebase Firestore
- **Auth**: Firebase Auth
- **Payments**: Stripe
- **Testing**: Jest

---

## 📊 Project Status

| Item | Status |
|------|--------|
| **Sprint 1**: Authentication | ✅ Complete |
| **Sprint 2**: Profiles, Communities, Posts | ✅ Complete |
| **Sprint 3 Phase 1**: Comments | ✅ Complete |
| **Sprint 3 Phase 2**: Notifications | ✅ Complete |
| **Sprint 3 Phase 3**: Advanced Search | ⏳ Ready |
| **Overall Progress** | 55% Complete |
| **TypeScript Errors** | 0 |

---

## 🎯 Key Commands

```bash
npm run dev              # Start development
npm run build            # Build for production
npm run type-check       # TypeScript check (verify 0 errors)
npm run lint             # Run linter
npm test                 # Run tests
```

---

## 📁 Project Structure

```
CodeGuideX/
├── src/                 # Source code
│   ├── app/             # Next.js pages
│   ├── components/      # React components
│   ├── services/        # Business logic
│   ├── hooks/           # Custom hooks
│   ├── store/           # Redux state
│   ├── types/           # TypeScript types
│   └── utils/           # Utilities
├── docs/                # 📖 DOCUMENTATION ← Start here
└── package.json
```

---

## ✨ Features

✅ User authentication with Firebase  
✅ User profiles with image upload  
✅ Community creation and management  
✅ Post creation with voting system  
✅ Nested comments with voting  
✅ Real-time notifications  
✅ Advanced search (ready to build)  

---

## 🔗 Quick Links

- **[Full Documentation Index](docs/README.md)** - All docs organized by topic
- **[Setup Instructions](docs/PROJECT_SETUP_REFERENCE/SETUP.md)** - How to get started
- **[Developer Guide](docs/PROJECT_SETUP_REFERENCE/DEVELOPER_GUIDE.md)** - Development patterns
- **[Project Status](docs/PROJECT_SETUP_REFERENCE/PROJECT_STATUS.md)** - Current metrics
- **[Sprint Documentation](docs/README.md#-sprint-documentation)** - By sprint/phase

---

## 💡 Learning Path

**New to project?**
1. Read this README (you're here!)
2. Go to `docs/PROJECT_SETUP_REFERENCE/SETUP.md`
3. Go to `docs/PROJECT_SETUP_REFERENCE/README.md`
4. Start coding!

**Already familiar?**
→ Go directly to `docs/README.md` for full index

---

## 🆘 Need Help?

- **Setup issues?** → See `docs/PROJECT_SETUP_REFERENCE/SETUP.md`
- **Development questions?** → See `docs/PROJECT_SETUP_REFERENCE/DEVELOPER_GUIDE.md`
- **Project overview?** → See `docs/PROJECT_SETUP_REFERENCE/PROJECT_STATUS.md`
- **Lost?** → See `docs/README.md`

**Key Modules:**
1. **Authentication** - User registration and login
2. **Posts & Comments** - Q&A system
3. **Communities** - Topic-based groups
4. **Mentorship** - Book and pay mentors
5. **Video Sessions** - Live interaction with Jitsi
6. **Admin Panel** - Content moderation and analytics

## Architecture

```
┌─────────────────────────────────────┐
│     Next.js Frontend (React)         │
│  ├─ Pages                            │
│  ├─ Components                       │
│  └─ Hooks                            │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│    Next.js API Routes               │
│  ├─ Auth                            │
│  ├─ Posts                           │
│  ├─ Mentors                         │
│  └─ Payments                        │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│     External Services               │
│  ├─ Firebase (Auth + Firestore)    │
│  ├─ Stripe (Payments)               │
│  ├─ Jitsi (Video)                   │
│  └─ SendGrid (Email)                │
└─────────────────────────────────────┘
```

## File Structure

- `src/app/` - Next.js app routes and layouts
- `src/pages/api/` - REST API endpoints
- `src/components/` - Reusable React components
- `src/services/` - Business logic and API integration
- `src/config/` - Configuration (Firebase, Stripe, etc.)
- `src/types/` - TypeScript type definitions
- `src/utils/` - Helper functions
- `src/hooks/` - Custom React hooks
- `src/store/` - Redux state management
- `docs/` - Documentation

## Development Workflow

### 1. Feature Branch
```bash
git checkout -b feature/feature-name
```

### 2. Make Changes
Follow the project structure and coding standards.

### 3. Test
```bash
npm test
npm run lint
npm run type-check
```

### 4. Commit
```bash
git commit -m "feat: add feature description"
```

### 5. Push & Create PR
```bash
git push origin feature/feature-name
```

## Environment Variables

```
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Jitsi
JITSI_API_KEY=

# SendGrid
SENDGRID_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Jitsi Meet API](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-jitsi-meet/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)

## Support & Contact

For issues, questions, or suggestions:
1. Check existing documentation in `docs/`
2. Create an issue on GitHub
3. Contact the development team

## License

MIT License - See LICENSE file for details
