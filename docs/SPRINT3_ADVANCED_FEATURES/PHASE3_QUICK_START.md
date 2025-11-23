# Phase 3 Quick Start: Adding Header to Layout

## Overview
The Header component has been created and is ready to be integrated into your application layout. This guide walks you through the integration process.

## Components Ready for Integration

### 1. Header Component
- **Location**: `src/components/common/Header.tsx`
- **Features**: Search bar, notifications, user menu
- **Props**: 
  - `showSearch?: boolean` (default: true)
  - `showNotifications?: boolean` (default: true)
  - `showUserMenu?: boolean` (default: true)

### 2. Search Results Page
- **Location**: `src/app/search/page.tsx`
- **Route**: `/search`
- **Features**: Full-page search interface with filters and sorting

### 3. SearchBar Component
- **Location**: `src/components/search/SearchBar.tsx`
- **Features**: Autocomplete, debounced suggestions, keyboard navigation

---

## Integration Steps

### Step 1: Update Root Layout

Edit `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from './providers';
import Header from '@components/common/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CodeGuideX - Learn, Connect, Grow',
  description:
    'A beginner-friendly platform to post doubts, join communities, interact with mentors, and attend live video sessions.',
  keywords: ['learning', 'mentoring', 'community', 'video sessions', 'coding'],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          <Header 
            showSearch={true} 
            showNotifications={true} 
            showUserMenu={true} 
          />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
```

### Step 2: Verify TypeScript Compilation

```bash
npm run type-check
```

Expected output: No errors ✅

### Step 3: Test in Development

```bash
npm run dev
```

Then visit: `http://localhost:3000`

---

## Features Available

### Search Bar (Desktop)
- Located in header center
- Type to search posts, communities, users
- See suggestions dropdown
- Press Enter or click result to search

### Search Bar (Mobile)
- Search button in header
- Tap to navigate to `/search` page
- Full-screen search interface

### Search Results Page (`/search`)
- Type-based filtering (Posts, Communities, People)
- Sort options (Relevance, Newest, Popular)
- Advanced filters button
- Filter panel on desktop, collapsible on mobile

### Notification Bell
- Integrated in header
- Shows unread count
- Click to open dropdown

### User Menu
- Placeholder button in header
- Ready for user profile/logout actions

---

## Configuration Options

### Disable Components
If you want to hide certain components from the header:

```tsx
<Header 
  showSearch={true}          // Hide search bar
  showNotifications={false}  // Hide notification bell
  showUserMenu={false}       // Hide user menu
/>
```

### Customization
The Header uses Tailwind CSS with dark mode support. Customize by editing `src/components/common/Header.tsx`:

```tsx
// Change colors
className="bg-white dark:bg-gray-900"

// Change spacing
className="h-16"  // Change header height

// Change responsive behavior
className="hidden md:flex"  // Hide on mobile
```

---

## Search Service Integration

The search functionality is powered by `SearchService` which queries Firestore for:
- Posts (title, content, tags)
- Communities (name, description, tags)
- Users (display name, bio, skills)

### Example: Custom Search Usage

```tsx
import { useSearch } from '@hooks/useSearch';

export function MyComponent() {
  const { performSearch, results, loading } = useSearch();

  const handleClick = async () => {
    await performSearch('react hooks', {
      communityId: 'react-community',
      minVotes: 5
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Search</button>
      {loading && <p>Loading...</p>}
      {results.map(r => <div key={r.id}>{r.title}</div>)}
    </div>
  );
}
```

---

## Testing Checklist

After adding the Header to your layout:

- [ ] Header appears at top of all pages
- [ ] Logo/branding visible and clickable
- [ ] Desktop: SearchBar visible in center
- [ ] Mobile: Search button visible in header
- [ ] Desktop: Notification bell visible
- [ ] Mobile: Notification bell hidden (toggle with showNotifications prop)
- [ ] Click search suggestion navigates to `/search`
- [ ] Type in search field shows autocomplete
- [ ] `/search` page loads with empty state
- [ ] Search page displays results properly
- [ ] Filters work on search page
- [ ] Sorting changes result order
- [ ] No TypeScript errors: `npm run type-check`

---

## Troubleshooting

### Issue: Header doesn't appear
**Solution**: Ensure `Header` component is imported and placed inside `ReduxProvider`

### Issue: Search not working
**Solution**: Verify `useSearch` hook is accessing Redux store correctly. Check Redux DevTools.

### Issue: Notification bell errors
**Solution**: Ensure `useNotifications` and `useRealTimeNotifications` hooks are implemented in `src/hooks/`

### Issue: TypeScript errors
**Solution**: Run `npm run type-check` to see specific errors. Most common: missing prop types.

---

## Performance Notes

- **SearchBar** debounces input at 300ms to prevent excessive queries
- **Suggestions** cached in Redux for fast recall
- **Search** results limited to 20 per query (configurable)
- **Header** is sticky and may impact mobile performance if too complex

---

## Next Steps After Integration

1. **Implement User Menu**
   - Add profile, settings, logout options
   - See `src/components/auth/` for auth patterns

2. **Customize Styling**
   - Match your brand colors in Header
   - Update logo/branding text

3. **Setup Analytics**
   - Track search queries using `SearchService.trackSearch()`
   - Monitor popular searches

4. **Performance Monitoring**
   - Use React Profiler to check render times
   - Monitor Firestore query costs

5. **Production Deployment**
   - Test on staging environment
   - Monitor error logs
   - Collect user feedback

---

## Documentation References

- **Phase 3 Plan**: `docs/SPRINT3_ADVANCED_FEATURES/PHASE3_PLAN.md`
- **Search Implementation**: `docs/SPRINT3_ADVANCED_FEATURES/PHASE3_IMPLEMENTATION_COMPLETE.md`
- **Developer Guide**: `docs/PROJECT_SETUP_REFERENCE/DEVELOPER_GUIDE.md`

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review component comments in source files
3. Check Redux store state with Redux DevTools
4. Review test suite for usage examples in `__tests__/phase3-search.test.ts`
