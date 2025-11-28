/**
 * SubNavigation Component
 * Tabbed navigation for role-based sections
 * Used in Dashboard, Communities, and other main sections
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
    <nav className={`${showBorder ? 'border-b border-gray-200' : ''} bg-white mb-6 rounded-lg ${className}`}>
      <div className="flex overflow-x-auto gap-0 -mx-6 px-6 lg:gap-0 lg:mx-0 lg:px-0">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                px-4 py-4 text-sm font-medium whitespace-nowrap
                transition-all duration-200 ease-out
                border-b-2 -mb-px
                flex items-center gap-2
                ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-2 text-xs font-bold text-white bg-red-500 rounded-full">
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

// Pre-configured nav items for different sections

export const DASHBOARD_NAV_ITEMS: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: '📊' },
  { label: 'My Communities', href: '/dashboard/communities', icon: '👥' },
  { label: 'My Posts', href: '/dashboard/posts', icon: '📝' },
  { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: '🔖' },
];

export const STUDENT_DASHBOARD_NAV: SubNavItem[] = [
  { label: 'Overview', href: '/dashboard', icon: '📊' },
  { label: 'My Communities', href: '/dashboard/communities', icon: '👥' },
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
