'use client';

import { SubNav } from '@/components/navigation/SubNav';
import { DASHBOARD_NAV_ITEMS } from '@/components/navigation/SubNav';

export default function BookmarksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <div className="section">
        <div className="section-container">
          <SubNav items={DASHBOARD_NAV_ITEMS} showBorder={true} />
          
          <div className="section-header mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">🔖 Bookmarks</h1>
            <p className="section-subtitle">Your saved posts and communities</p>
          </div>

          <div className="card-lg border-2 border-blue-200 bg-blue-50 p-12 text-center rounded-lg">
            <div className="text-4xl mb-3">🔖</div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">No Bookmarks Yet</h3>
            <p className="text-blue-700 mb-6">
              Bookmark posts and communities to save them for later
            </p>
            <a href="/posts" className="button-primary inline-block">
              Browse Posts
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
