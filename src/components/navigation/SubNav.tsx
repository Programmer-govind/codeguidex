/**
 * SubNavigation Component
 * Tabbed navigation for role-based sections.
 * Tabs are layout-stable: active/inactive state only changes colour, never size.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface SubNavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: number | string;
}

interface SubNavProps {
  items: SubNavItem[];
  className?: string;
  showBorder?: boolean;
}

export const SubNav: React.FC<SubNavProps> = ({
  items,
  className = '',
  showBorder = true,
}) => {
  const pathname = usePathname() ?? '';

  return (
    <nav
      className={`sticky top-0 z-20 bg-white dark:bg-background shrink-0 ${
        showBorder ? 'border-b border-gray-200 dark:border-border' : ''
      } mb-6 rounded-lg ${className}`}
    >
      {/* Scrollable wrapper — height never changes */}
      <div className="flex overflow-x-auto">
        {items.map((item) => {
          // Root-level tabs need exact match; child tabs use prefix match
          const isExactRoot = ['/dashboard', '/admin', '/communities', '/posts', '/mentors'].includes(item.href);
          const isActive = pathname === item.href || (!isExactRoot && pathname.startsWith(item.href + '/'));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                // Fixed height — identical for active and inactive, so no layout shift
                'inline-flex items-center gap-2 whitespace-nowrap',
                'h-12 px-4 text-sm font-medium',
                'transition-colors duration-150',
                // Border always present; only colour changes (no size change)
                'border-b-2',
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 dark:text-muted-foreground dark:hover:text-foreground',
              ].join(' ')}
            >
              {item.icon && (
                <span className="text-base leading-none">{item.icon}</span>
              )}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full leading-none">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

// ─── Pre-configured nav items for different sections ───────────────────────────

export const DASHBOARD_NAV_ITEMS: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: '📊' },
  { label: 'My Communities', href: '/dashboard/communities', icon: '👥' },
  { label: 'My Posts', href: '/dashboard/posts', icon: '📝' },
  { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: '🔖' },
];

export const STUDENT_DASHBOARD_NAV: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: '📊' },
  { label: 'My Communities', href: '/dashboard/communities', icon: '👥' },
  { label: 'My Sessions', href: '/dashboard/student/bookings', icon: '🎥' },
  { label: 'My Learning', href: '/dashboard/learning', icon: '📚' },
  { label: 'Messages', href: '/dashboard/messages', icon: '💬' },
  { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: '🔖' },
];

export const MENTOR_DASHBOARD_NAV: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: '📊' },
  { label: 'My Sessions', href: '/mentor/sessions', icon: '🎥' },
  { label: 'Videos', href: '/dashboard/mentor/videos', icon: '🎬' },
  { label: 'Students', href: '/mentor/students', icon: '👨‍🎓' },
  { label: 'Earnings', href: '/mentor/earnings', icon: '💰' },
  { label: 'Reviews', href: '/mentor/reviews', icon: '⭐' },
];

export const ADMIN_DASHBOARD_NAV: SubNavItem[] = [
  { label: 'Overview', href: '/admin', icon: '📊' },
  { label: 'Users', href: '/admin/users', icon: '👥' },
  { label: 'Communities', href: '/admin/communities', icon: '🏢' },
  { label: 'Reports', href: '/admin/reports', icon: '⚠️' },
  { label: 'Analytics', href: '/admin/analytics', icon: '📈' },
];

export const COMMUNITIES_NAV_ITEMS: SubNavItem[] = [
  { label: 'Explore All', href: '/communities', icon: '🌍' },
  { label: 'My Communities', href: '/communities/my', icon: '⭐' },
  { label: 'Trending', href: '/communities/trending', icon: '🔥' },
  { label: 'New', href: '/communities/new', icon: '✨' },
];

export const POSTS_NAV_ITEMS: SubNavItem[] = [
  { label: 'All Posts', href: '/posts', icon: '📝' },
  { label: 'Questions', href: '/posts?filter=question', icon: '❓' },
  { label: 'Discussions', href: '/posts?filter=discussion', icon: '💬' },
  { label: 'Resources', href: '/posts?filter=resource', icon: '📚' },
];

export const MENTORSHIP_NAV_ITEMS: SubNavItem[] = [
  { label: 'Find Mentors', href: '/mentors', icon: '🔍' },
  { label: 'My Mentor', href: '/mentors/my-mentor', icon: '👨‍🏫' },
  { label: 'Sessions', href: '/mentor/sessions', icon: '🎥' },
  { label: 'Progress', href: '/mentor/progress', icon: '📈' },
];
