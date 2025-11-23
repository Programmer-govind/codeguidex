# CodeGuideX - Developer Quick Reference

Quick reference guide for common development tasks and patterns.

---

## 🚀 Quick Start

### Start Development
```bash
npm run dev
# Open http://localhost:3000
```

### Build for Production
```bash
npm run build
npm start
```

### Verify Setup
```bash
npm run type-check       # Should output: 0 errors
npm run lint             # Check code style
npm test                 # Run tests
```

---

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory (pages and layouts)
├── components/          # React components organized by feature
├── config/              # Configuration files
├── hooks/               # Custom React hooks
├── pages/api/           # API routes
├── services/            # Business logic services
├── store/               # Redux state management
├── types/               # TypeScript type definitions
└── utils/               # Utility functions (validators, formatters, etc)
```

---

## 🔑 Path Aliases

Use aliases for clean imports:

```typescript
// ❌ Don't do this
import { AuthService } from '../../../services/auth.service';

// ✅ Do this
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

## 🏗️ Architecture Pattern

All features follow this consistent pattern:

```
Firestore Database
       ↓
Service Layer (Business Logic)
       ↓
Redux Async Thunks (State Management)
       ↓
Custom Hooks (Abstraction)
       ↓
React Components (UI)
```

### Example: Authentication

```typescript
// 1. Service: src/services/auth.service.ts
export class AuthService {
  async login(email: string, password: string) {
    // Firebase Auth logic
  }
}

// 2. Redux: src/store/slices/authSlice.ts
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials) => {
    return AuthService.login(credentials);
  }
);

// 3. Hook: src/hooks/useAuth.ts
export function useAuth() {
  const dispatch = useAppDispatch();
  return {
    login: (email, password) => 
      dispatch(loginAsync({email, password}))
  };
}

// 4. Component: src/components/auth/LoginForm.tsx
export function LoginForm() {
  const { login } = useAuth();
  return <form onSubmit={() => login(...)} />
}
```

---

## 🔐 Authentication

### Using Auth in Components

```typescript
'use client';

import { useAuth } from '@hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <p>Hello, {user?.displayName}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Auth Hook Returns

```typescript
{
  user: User | null            // Current user object
  isAuthenticated: boolean     // Is user logged in
  isLoading: boolean          // Loading state
  login: (email, password)    // Email login
  logout: ()                   // Sign out
  signup: (data)              // Register new user
  resetPassword: (email)      // Send reset email
}
```

---

## 📦 Redux Usage

### Creating a New Redux Slice

```typescript
// src/store/slices/featureSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFeatureAsync = createAsyncThunk(
  'feature/fetchData',
  async (params) => {
    return await featureService.fetch(params);
  }
);

const featureSlice = createSlice({
  name: 'feature',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatureAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeatureAsync.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeatureAsync.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default featureSlice.reducer;
```

### Using Redux in Components

```typescript
'use client';

import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchFeatureAsync } from '@store/slices/featureSlice';

export function MyComponent() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(state => state.feature);

  useEffect(() => {
    dispatch(fetchFeatureAsync());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{JSON.stringify(data)}</div>;
}
```

---

## 🎣 Custom Hooks

### Creating a Custom Hook

```typescript
// src/hooks/useMyFeature.ts
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { fetchFeatureAsync } from '@store/slices/featureSlice';

export function useMyFeature() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(
    state => state.feature
  );

  const fetch = useCallback(() => {
    dispatch(fetchFeatureAsync());
  }, [dispatch]);

  return { data, loading, error, fetch };
}
```

### Using Custom Hooks in Components

```typescript
'use client';

import { useMyFeature } from '@hooks/useMyFeature';

export function MyComponent() {
  const { data, loading, error, fetch } = useMyFeature();

  useEffect(() => {
    fetch();
  }, [fetch]);

  if (loading) return <div>Loading...</div>;
  return <div>{data}</div>;
}
```

---

## 🧩 Creating Components

### Component Structure

```typescript
// src/components/myFeature/MyComponent.tsx
'use client';

import { ReactNode } from 'react';

interface MyComponentProps {
  title: string;
  children: ReactNode;
  onClick?: () => void;
}

/**
 * MyComponent description
 * @param title - Component title
 * @param children - Content to display
 * @param onClick - Click handler
 */
export function MyComponent({ 
  title, 
  children, 
  onClick 
}: MyComponentProps) {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">{title}</h2>
      <div>{children}</div>
      {onClick && (
        <button onClick={onClick}>Click me</button>
      )}
    </div>
  );
}
```

### Best Practices

- ✅ Define TypeScript interfaces for props
- ✅ Add JSDoc comments on components
- ✅ Use `'use client'` for client components
- ✅ Keep components focused and small
- ✅ Lift state up to custom hooks
- ✅ Use TailwindCSS for styling

---

## 🗄️ Working with Firestore

### Service Layer Example

```typescript
// src/services/post.service.ts
import { db } from '@config/firebase.config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export class PostService {
  async getPosts() {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async createPost(data: PostData) {
    const docRef = await addDoc(collection(db, 'posts'), {
      ...data,
      createdAt: new Date(),
    });
    return docRef.id;
  }
}
```

### In Redux Thunk

```typescript
export const getPostsAsync = createAsyncThunk(
  'posts/getPosts',
  async () => {
    return await PostService.getPosts();
  }
);
```

### In Hook

```typescript
export function usePosts() {
  const dispatch = useAppDispatch();
  const { data: posts } = useAppSelector(state => state.posts);

  useEffect(() => {
    dispatch(getPostsAsync());
  }, [dispatch]);

  return { posts };
}
```

---

## 🧪 Testing

### Running Tests

```bash
npm test                 # Run tests once
npm run test:watch      # Run tests in watch mode
```

### Test Structure

```typescript
// src/services/__tests__/auth.service.test.ts
describe('AuthService', () => {
  it('should login user with valid credentials', async () => {
    const result = await AuthService.login('user@example.com', 'password');
    expect(result).toBeDefined();
  });
});
```

---

## ✨ Code Quality

### TypeScript Check

```bash
npm run type-check
# Should output: 0 error found
```

### Linting

```bash
npm run lint
```

### Pre-commit Checklist

Before committing:
- [ ] TypeScript: `npm run type-check` = 0 errors
- [ ] Linting: `npm run lint` = passing
- [ ] Tests: `npm test` = passing
- [ ] Components: Properly typed and documented
- [ ] Imports: Using path aliases
- [ ] Code: Follows project patterns

---

## 🚀 Common Tasks

### Add a New Page

1. Create folder: `src/app/feature-name/`
2. Create: `src/app/feature-name/page.tsx`
3. Add to layout if needed
4. Import components and use hooks

### Add a New Service

1. Create: `src/services/feature.service.ts`
2. Export class with methods
3. Use in Redux thunks
4. Export from `@services/feature.service`

### Add a New Redux Slice

1. Create: `src/store/slices/featureSlice.ts`
2. Define initial state
3. Create async thunk
4. Add cases to handle pending/fulfilled/rejected
5. Add to store

### Add a New Hook

1. Create: `src/hooks/useFeature.ts`
2. Use Redux dispatch/selector
3. Return interface matching usage
4. Export from `@hooks/useFeature`

---

## 🔍 Debugging

### Enable Debug Mode

```typescript
// In browser console
localStorage.setItem('debug', '*');
```

### Check Firebase Connection

```typescript
import { db } from '@config/firebase.config';
console.log('Firebase DB:', db);
```

### Redux DevTools

Install Redux DevTools browser extension to inspect state changes.

---

## 📱 Responsive Design

Use TailwindCSS breakpoints:

```tsx
<div className="
  px-4 sm:px-6 md:px-8 lg:px-10
  text-sm sm:text-base md:text-lg
  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
">
  Responsive content
</div>
```

### Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

---

## 🌙 Dark Mode (if implemented)

Use TailwindCSS dark mode:

```tsx
<div className="bg-white dark:bg-gray-900">
  Content
</div>
```

---

## 🔑 Environment Variables

Access in code:

```typescript
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
const secretKey = process.env.STRIPE_SECRET_KEY;
```

Only use `NEXT_PUBLIC_*` in browser code.

---

## 📚 Performance Tips

- Use `React.memo` for expensive components
- Implement pagination for large lists
- Use Firestore indexes for complex queries
- Enable compression in production
- Use CDN for static assets
- Profile with DevTools Profiler tab

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Deploy Elsewhere

```bash
# Build static export
npm run build

# Deploy the `.next` folder
```

---

## 📞 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## 🆘 Troubleshooting

### Port Already in Use

```bash
npm run dev -- -p 3001
```

### Module Not Found

- Check path alias is spelled correctly
- Verify file exists at that location
- Check `tsconfig.json` paths configuration

### TypeScript Errors

```bash
npm run type-check
```

Review errors and fix type issues.

### Build Fails

```bash
npm run clean
npm install
npm run build
```

---

**Developer Guide**: Complete  
**Status**: Current and maintained  
**Last Updated**: Current Sprint
