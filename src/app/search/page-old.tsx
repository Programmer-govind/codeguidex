'use client';

import { Suspense } from 'react';
import SearchPageContent from './search-content';
import { LoadingSpinner } from '@components/common/LoadingSpinner';

/**
 * Search Results Page
 * Main search interface with results, filters, and sorting
 */
export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><LoadingSpinner /></div>}>
      <SearchPageContent />
    </Suspense>
  );
}
