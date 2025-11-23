# 📖 Project Setup Reference - Documentation Guide

Welcome! This folder contains all setup, configuration, and reference documentation.

---

## 📂 Contents

- **README.md** - Project overview
- **SETUP.md** - Development environment setup
- **DEVELOPER_GUIDE.md** - Developer quick reference
- **PROJECT_STATUS.md** - Current project status
- This file - Documentation guide

---

## 🚀 Getting Started Path

### 1. First Time? (30 minutes)
```
README.md → SETUP.md → DEVELOPER_GUIDE.md (skim)
```

### 2. Ready to Code? (5 minutes)
```
DEVELOPER_GUIDE.md → Jump to specific section
```

### 3. Need Project Status? (5 minutes)
```
PROJECT_STATUS.md → Current metrics & progress
```

---

## 📚 Other Documentation

### Sprint-Specific Docs
See `../` parent directory for sprint folders:
- `SPRINT1_AUTH/` - Authentication details
- `SPRINT2_*/` - Core features (profiles, communities, posts)
- `SPRINT3_ADVANCED_FEATURES/` - Comments, notifications, search

### Current Phase
You're likely interested in:
- **Phase 1 (Comments)**: `../SPRINT3_ADVANCED_FEATURES/PHASE1_COMMENTS/`
- **Phase 2 (Notifications)**: `../SPRINT3_ADVANCED_FEATURES/PHASE2_NOTIFICATIONS/`
- **Phase 3 (Search)**: `../SPRINT3_ADVANCED_FEATURES/PHASE3_SEARCH/`

---

## 🗂️ Full Documentation Structure

```
docs/
├── PROJECT_SETUP_REFERENCE/          ← YOU ARE HERE
│   ├── README.md (project overview)
│   ├── SETUP.md (setup guide)
│   ├── DEVELOPER_GUIDE.md (dev reference)
│   ├── PROJECT_STATUS.md (current status)
│   └── THIS FILE
│
├── SPRINT1_AUTH/                     (Authentication system)
│   ├── README.md
│   └── progress documents
│
├── SPRINT2_PROFILES_COMMUNITIES_POSTS/  (Core features)
│   ├── README.md
│   └── planning documents
│
└── SPRINT3_ADVANCED_FEATURES/        (Advanced features)
    ├── README.md (overview)
    ├── PHASE1_COMMENTS/
    │   └── README.md
    ├── PHASE2_NOTIFICATIONS/
    │   └── README.md
    └── PHASE3_SEARCH/
        ├── README.md
        └── SETUP.md (detailed phase 3 guide)
```

---

## ✨ Quick Links

### Essential Reading
- 📖 [README.md](./README.md) - Project overview (5 min)
- 🔧 [SETUP.md](./SETUP.md) - Setup guide (15 min)
- 👨‍💻 [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Dev reference (20 min)

### Reference Information
- 📊 [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Current progress
- 🏗️ [Architecture Overview](#architecture)
- 🛠️ [Technology Stack](#tech-stack)

### Sprint Information
- 🔐 [Sprint 1: Authentication](../SPRINT1_AUTH/)
- 👥 [Sprint 2: Profiles, Communities, Posts](../SPRINT2_PROFILES_COMMUNITIES_POSTS/)
- 💬 [Sprint 3 Phase 1: Comments](../SPRINT3_ADVANCED_FEATURES/PHASE1_COMMENTS/)
- 🔔 [Sprint 3 Phase 2: Notifications](../SPRINT3_ADVANCED_FEATURES/PHASE2_NOTIFICATIONS/)
- 🔍 [Sprint 3 Phase 3: Search](../SPRINT3_ADVANCED_FEATURES/PHASE3_SEARCH/)

---

## 🏗️ Architecture

CodeGuideX follows a consistent architecture pattern across all features:

```
┌─────────────────────────────────────────┐
│           React Components              │
│      (UI Layer - .tsx files)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Custom Hooks                    │
│  (Logic Layer - useXxx.ts files)        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Redux Toolkit                      │
│  (State Management - slices)            │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Services                        │
│  (Firebase - service.ts files)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Firestore Database                 │
│  (Data Persistence)                     │
└─────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR
- **React 18** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **TailwindCSS 4** - Utility-first CSS

### State Management
- **Redux Toolkit** - State management
- **Redux Thunk** - Async operations

### Backend/Database
- **Firebase** - Authentication & database
- **Firestore** - NoSQL database
- **Firebase Auth** - User authentication

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

---

## 📋 Common Tasks

### Setting Up the Project
→ [SETUP.md](./SETUP.md)

### Adding a New Component
→ [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) → Creating Components

### Using Redux
→ [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) → Redux

### Working with Firebase
→ [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) → Firebase

### Debugging Issues
→ [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) → Troubleshooting

### Understanding the Database
→ Related sprint folder (e.g., SPRINT2_* for schema)

---

## 🎯 By Role

### New Developers
Start here:
1. [README.md](./README.md) - Understand the project
2. [SETUP.md](./SETUP.md) - Set up your environment
3. [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Learn conventions

### Frontend Developers
Focus on:
1. [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Components section
2. Component files in `src/components/`
3. Relevant sprint folders

### Backend/Firebase Developers
Focus on:
1. [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) - Firebase section
2. Service files in `src/services/`
3. Related sprint folders for schema

### Project Managers
Focus on:
1. [PROJECT_STATUS.md](./PROJECT_STATUS.md) - Current progress
2. [README.md](./README.md) - Project overview
3. Sprint folders for delivery tracking

---

## ✅ Onboarding Checklist

- [ ] Read README.md
- [ ] Run SETUP.md steps
- [ ] Read DEVELOPER_GUIDE.md
- [ ] Skim relevant sprint folder
- [ ] Read PROJECT_STATUS.md
- [ ] Ask questions on team Slack
- [ ] Ready to code!

---

## 🔍 Finding Information

### "How do I...?"
→ Check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

### "What is the status?"
→ Check [PROJECT_STATUS.md](./PROJECT_STATUS.md)

### "What's the tech stack?"
→ Check [README.md](./README.md) or Tech Stack section above

### "How do I set this up?"
→ Check [SETUP.md](./SETUP.md)

### "What was done in Sprint X?"
→ Check `../SPRINTX_*/` folder

### "How do I use authentication?"
→ Check `../SPRINT1_AUTH/` folder

### "How do I work with notifications?"
→ Check `../SPRINT3_ADVANCED_FEATURES/PHASE2_NOTIFICATIONS/` folder

---

## 📞 Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Type check
npm run type-check

# Build
npm run build

# Run tests
npm test
```

See [SETUP.md](./SETUP.md) for more commands.

---

## 🎓 Learning Resources

### Official Docs
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Redux Documentation](https://redux.js.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### Project-Specific
- See relevant sprint folder for feature-specific docs
- See [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md) for patterns
- Review code in `src/` - it's well-documented

---

## 💡 Pro Tips

1. **Use Path Aliases** - Import with `@components`, `@services`, etc.
2. **Follow the Pattern** - Service → Redux → Hooks → Components
3. **Keep Components Pure** - UI logic separate from business logic
4. **Type Everything** - Use TypeScript for safety
5. **Read Existing Code** - Best way to understand patterns
6. **Check Related Docs** - Multiple docs might have answers
7. **Ask Team First** - Faster than searching

---

## 🎯 Your Next Step

### If you're new to the project:
→ Start with [README.md](./README.md)

### If you need to set up:
→ Follow [SETUP.md](./SETUP.md)

### If you're ready to code:
→ Check [DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)

### If you need status:
→ See [PROJECT_STATUS.md](./PROJECT_STATUS.md)

### If you're working on a feature:
→ Jump to relevant sprint folder (e.g., `../SPRINT3_ADVANCED_FEATURES/`)

---

**Documentation Status**: ✅ Complete & Organized  
**Last Updated**: November 21, 2025  
**Maintained By**: Development Team

*All documentation is organized, indexed, and easy to navigate. Happy coding!* 🚀
