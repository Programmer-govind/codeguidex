# CodeGuideX - Development Setup Guide

Complete instructions for setting up the CodeGuideX development environment.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js** 16+ (preferably 18 or higher)
- **npm** or yarn
- **Git**
- **Firebase Account** (free tier sufficient)
- **Stripe Account** (for payment testing)
- Code editor (VS Code recommended)

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CodeGuideX
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Copy the environment template:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
```

---

## Firebase Setup

### Create Firebase Project

1. Visit [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Name it "CodeGuideX"
4. Continue through setup

### Enable Required Services

#### Authentication
1. Go to **Authentication**
2. Click **Get started**
3. Enable **Email/Password**
4. Enable **Google** (sign in with Google)

#### Firestore Database
1. Go to **Cloud Firestore**
2. Click **Create Database**
3. Start in **production mode**
4. Choose location (e.g., us-central1)

#### Storage
1. Go to **Storage**
2. Click **Get started**
3. Start in **production mode**
4. Choose location matching Firestore

### Get Your Credentials

1. Go to **Project Settings** (gear icon)
2. Click **Service Accounts** tab
3. Select **Node.js**
4. Copy the credentials to `.env.local`

---

## Stripe Setup

### Create Stripe Account

1. Visit [Stripe](https://stripe.com)
2. Sign up for an account
3. Complete business verification

### Get API Keys

1. Go to **Developers** → **API keys**
2. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Copy **Secret key** → `STRIPE_SECRET_KEY`

---

## Start Development Server

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Initial Access

- First load may take a few seconds while Next.js compiles
- Check browser console for any errors
- Verify Firebase connection in Network tab

---

## Available Commands

```bash
# Development
npm run dev              # Start development server

# Building
npm run build            # Build for production
npm start                # Start production server

# Quality Checks
npm run type-check       # Run TypeScript compiler (should be 0 errors)
npm run lint             # Run ESLint
npm test                 # Run Jest tests
npm run test:watch       # Run tests in watch mode

# Utilities
npm run clean            # Clean build artifacts
```

---

## Project Structure

```
src/
├── app/                 # Next.js app directory (pages)
├── components/          # React components by feature
├── config/              # Configuration files (Firebase, Stripe, API)
├── hooks/               # Custom React hooks
├── pages/api/           # API routes
├── services/            # Business logic services
├── store/               # Redux state management
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

---

## Path Aliases

All imports use convenient aliases defined in `tsconfig.json`:

```typescript
// Instead of relative imports:
import { AuthService } from '../../../services/auth.service';

// Use aliases:
import { AuthService } from '@services/auth.service';
```

### Available Aliases
- `@/` → `src/`
- `@components` → `src/components`
- `@services` → `src/services`
- `@hooks` → `src/hooks`
- `@store` → `src/store`
- `@types` → `src/types`
- `@utils` → `src/utils`
- `@config` → `src/config`

---

## Verify Installation

Run this to verify everything is set up correctly:

```bash
# Check TypeScript compilation
npm run type-check

# Should output: "0 error found"
```

---

## Common Issues

### Port 3000 Already in Use

```bash
# Use a different port
npm run dev -- -p 3001
```

### Firebase Connection Error

- Verify `.env.local` has correct Firebase credentials
- Check Firebase project exists and is active
- Ensure Firestore and Storage are enabled
- Verify CORS is not blocking requests

### Node Modules Issues

```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors

```bash
# Verify TypeScript is working
npm run type-check

# Check specific file
npx tsc --noEmit src/services/auth.service.ts
```

---

## Database Setup

### Create Firestore Collections

The app expects these collections:

```
users/                    User profiles and account data
communities/              Community metadata
posts/                    Post content
comments/                 Comment threads
notifications/            User notifications
```

These are created automatically by the application on first use via service layer.

### Security Rules

Default Firestore security rules are configured in the app. Update them based on your security requirements:

1. Go to **Firestore** → **Rules**
2. Implement authentication checks
3. Verify user ownership before operations

---

## Environment Variables

### Required Variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Console | Connect to Firebase |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard | Stripe frontend |
| `STRIPE_SECRET_KEY` | Stripe Dashboard | Stripe backend |

### Optional Variables

- API timeout configurations
- Feature flags
- Analytics keys

---

## First Time Running

### Step-by-Step

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

3. **Verify setup**
   ```bash
   npm run type-check
   ```

4. **Start development**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

6. **Sign up with a test account**

---

## Next Steps

Once running:

1. **Explore the app** - Sign up, create a profile, join a community
2. **Read DEVELOPER_GUIDE.md** - Learn development patterns
3. **Review architecture** - Understand Service → Redux → Hook → Component flow
4. **Start developing** - Follow the same patterns for new features

---

## Getting Help

### Debugging

Enable debug logging:

```typescript
// In browser console
localStorage.setItem('debug', '*');
```

### Logs

- **Server logs** - Terminal running `npm run dev`
- **Client logs** - Browser DevTools Console
- **Firebase logs** - Firebase Console Logs tab

### Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

## Development Workflow

### Creating a Feature

1. Create service layer (business logic)
2. Create Redux slice (state management)
3. Create custom hook (abstraction layer)
4. Create React components (UI)
5. Add to appropriate page
6. Test thoroughly
7. Verify: `npm run type-check` = 0 errors

### Committing Code

```bash
# Verify everything passes
npm run type-check
npm run lint
npm test

# Commit with clear message
git commit -m "feat: add feature description"
```

---

## Troubleshooting Checklist

- [ ] Node.js version 16+ installed
- [ ] Dependencies installed: `npm install`
- [ ] `.env.local` created with Firebase/Stripe keys
- [ ] Firebase project created and enabled
- [ ] Firestore database created
- [ ] Storage bucket created
- [ ] `npm run type-check` = 0 errors
- [ ] Development server starts: `npm run dev`
- [ ] Can access http://localhost:3000
- [ ] Can sign up for an account

---

## Production Deployment

See **DEVELOPER_GUIDE.md** → Deployment section for production setup instructions.

---

**Setup Guide**: Complete  
**Status**: Ready for development  
**Last Updated**: Current Sprint
