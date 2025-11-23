# ⏳ Sprint 3 Phase 3 - Advanced Search (Ready to Begin)

**Status**: Design Complete, Ready to Build ⏳  
**Estimated Timeline**: Days 7-10 (4 days)  
**Priority**: High  
**Dependencies**: Posts, Communities, Users systems complete

---

## 🎯 Objectives

### Search Capabilities
- Multi-type search (posts, communities, users)
- Full-text search
- Advanced filtering
- Sorting options
- Autocomplete suggestions

### Filter Types
- **Date Range** - Created within date range
- **Category/Tags** - Filter by tags
- **Author** - Posts by specific user
- **Vote Range** - Upvote counts
- **View Count** - Popularity
- **Communities** - Posts in specific communities

### Sort Options
- **Relevance** - Search score
- **Newest** - Most recent first
- **Trending** - Currently popular
- **Most Voted** - Highest upvotes
- **Most Viewed** - Highest views

---

## 📦 Deliverables

### Service Layer (Day 7 AM)
- [ ] **search.service.ts** - Core search operations
  - [ ] searchPosts(query, filters, sort)
  - [ ] searchCommunities(query, filters, sort)
  - [ ] searchUsers(query, filters, sort)
  - [ ] getSuggestions(query)
  - [ ] saveSearchHistory(userId, query)

### Redux State (Day 7 PM)
- [ ] **searchSlice.ts** - Redux state management
  - [ ] fetchSearchResults thunk
  - [ ] fetchSuggestions thunk
  - [ ] setFilter, setSort actions

### Hooks (Day 8 AM)
- [ ] **useSearch.ts** - Custom search hook
  - [ ] search(query, type, filters)
  - [ ] loadMore()
  - [ ] getSuggestions()
  - [ ] History management

### Components (Day 8 PM - 9 AM)
- [ ] **SearchBar.tsx** - Header search input
  - [ ] Autocomplete dropdown
  - [ ] Recent searches
  - [ ] Filter toggle

- [ ] **SearchResults.tsx** - Results page
  - [ ] Tab navigation
  - [ ] Result cards
  - [ ] Pagination

- [ ] **AdvancedFiltersForm.tsx** - Filter UI
  - [ ] Date range picker
  - [ ] Category selector
  - [ ] Sliders for ranges

- [ ] **SearchResultCard.tsx** - Individual result
  - [ ] Preview with metadata
  - [ ] Click to navigate

### Pages & Integration (Day 9-10)
- [ ] **/search page.tsx** - Search results page
- [ ] Update layout header - Add SearchBar
- [ ] Update store - Register searchReducer

---

## 🏗️ Architecture

```
search.service.ts (Firestore queries)
  ↓
searchSlice.ts (Redux async thunks)
  ↓
useSearch.ts (Custom hook)
  ↓
Components:
  - SearchBar (header)
  - SearchResults (page)
  - AdvancedFiltersForm
  - SearchResultCard
```

---

## 🔍 Firestore Queries

### Posts Search
```typescript
// Full-text style using startsWith
posts.where('title', '>=', query)
     .where('title', '<=', query + '\uf8ff')
     .where('createdAt', '>=', startDate)
     .orderBy('createdAt', 'desc')
     .limit(pageSize)
```

### Communities Search
```typescript
communities.where('name', '>=', query)
           .where('name', '<=', query + '\uf8ff')
           .orderBy('memberCount', 'desc')
```

### Users Search
```typescript
users.where('displayName', '>=', query)
     .where('displayName', '<=', query + '\uf8ff')
     .orderBy('username', 'asc')
```

---

## 📁 File Locations

All files will be in `src/`:
```
services/search.service.ts (NEW)
store/slices/searchSlice.ts (NEW)
hooks/useSearch.ts (NEW)
components/search/
  ├── SearchBar.tsx (NEW)
  ├── SearchResults.tsx (NEW)
  ├── AdvancedFiltersForm.tsx (NEW)
  └── SearchResultCard.tsx (NEW)
app/search/page.tsx (NEW)
types/search.types.ts (NEW or UPDATE)
```

---

## 🎨 UI Mockups

### SearchBar Location
```
┌─ CodeGuideX | Home | Communities | Dashboard | [🔍 Search...] [🔔 Notifications]
```

### Search Results Page
```
/search?q=react

┌─────────────────────────────────────┐
│ [🔍 Search...] [Filters ⬇️ Advanced]  │
└─────────────────────────────────────┘

Posts  Communities  Users
│
├─ Filters
│  📅 Date Range
│  🏷️  Tags
│  etc...
│
└─ Results
   1. Post title [⭐ 42] [👁️ 120]
   2. Post title [⭐ 38] [👁️ 95]
   ...
   [Load More]
```

---

## 📋 Implementation Checklist

### Service Layer
- [ ] Create search.service.ts
- [ ] Implement searchPosts
- [ ] Implement searchCommunities
- [ ] Implement searchUsers
- [ ] Implement getSuggestions
- [ ] Add history management
- [ ] Test 0 errors

### Redux
- [ ] Create searchSlice.ts
- [ ] Add async thunks
- [ ] Add synchronous actions
- [ ] Register in store
- [ ] Test 0 errors

### Hooks
- [ ] Create useSearch.ts
- [ ] Implement all methods
- [ ] Auto-load on mount
- [ ] Test debouncing
- [ ] Test 0 errors

### Components
- [ ] SearchBar.tsx
- [ ] SearchResults.tsx
- [ ] AdvancedFiltersForm.tsx
- [ ] SearchResultCard.tsx
- [ ] Test rendering
- [ ] Test interactions
- [ ] Test 0 errors

### Integration
- [ ] Create /search page
- [ ] Add SearchBar to layout
- [ ] Register searchReducer
- [ ] Test full flow
- [ ] Mobile responsive
- [ ] Final 0 errors

---

## 🚀 Getting Started

1. **Read This File** - Understand the scope
2. **Create search.service.ts** - Start with Firestore queries
3. **Build searchSlice.ts** - Redux state
4. **Create useSearch.ts** - Custom hook
5. **Build Components** - UI layer
6. **Integrate** - Add to app
7. **Test** - Full QA

See detailed [PHASE3_SEARCH_SETUP.md](./SETUP.md) for step-by-step guide.

---

## 📞 Quick Reference

### Commands
```bash
npm run type-check    # After each step
npm run dev          # Test in browser
```

### Key Files Modified
- src/store/store.ts (add searchReducer)
- src/app/layout.tsx (add SearchBar)

### Key Files Created
- 8 new files (~1,500 lines)
- 1 new type definition file

---

## ✅ Success Criteria

- [ ] Search 20+ posts successfully
- [ ] Filters reduce results correctly
- [ ] Sorting changes order correctly
- [ ] Pagination works (25 items/page)
- [ ] Autocomplete suggests content
- [ ] Search history saves
- [ ] Mobile responsive
- [ ] 0 TypeScript errors
- [ ] Component renders without errors
- [ ] Real-time search <500ms

---

## 🎯 Next Steps

1. ✅ Read this setup guide
2. ✅ Review PHASE3_SEARCH_SETUP.md
3. 👉 Begin with search.service.ts
4. Then: searchSlice.ts
5. Then: useSearch.ts
6. Then: Components
7. Finally: Integration & testing

---

**Ready to begin Phase 3 Advanced Search!**

See [PHASE3_SEARCH_SETUP.md](./SETUP.md) for detailed implementation guide.

---

See parent folder for organization overview.
