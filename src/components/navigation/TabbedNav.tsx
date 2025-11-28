/**
 * Tabbed Navigation Component
 * Role-based sections displayed as tabs in navbar
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface NavTab {
  label: string;
  href: string;
  icon: string;
  roles?: string[]; // If specified, only show for these roles
  badge?: number;
}

interface TabbedNavProps {
  tabs: NavTab[];
  className?: string;
}

export const TabbedNav: React.FC<TabbedNavProps> = ({ tabs, className = '' }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Filter tabs based on user role
  const filteredTabs = tabs.filter(tab => {
    if (!tab.roles) return true;
    return tab.roles.includes(user?.role || 'student');
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Handle scroll event for future animations
    const element = e.currentTarget;
    const hasScroll = element.scrollLeft > 0;
    // Can be used for scroll indicators
    return hasScroll;
  };

  return (
    <div className={`tabs-container ${className}`}>
      <div
        className="tabs-list"
        onScroll={handleScroll}
      >
        {filteredTabs.map((tab) => {
          const isActive = pathname ? (pathname === tab.href || pathname.startsWith(tab.href + '/')) : false;

          return (
            <Link key={tab.href} href={tab.href}>
              <button
                className={`tab-trigger ${isActive ? 'active' : ''}`}
                data-state={isActive ? 'active' : 'inactive'}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {tab.badge && tab.badge > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-y-px bg-red-600 rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// Navigation sections configuration
export const MAIN_NAV_TABS: NavTab[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Communities', href: '/communities', icon: '👥' },
  { label: 'Posts', href: '/posts', icon: '📝' },
  { label: 'Mentors', href: '/mentors', icon: '👨‍🏫' },
];

export const STUDENT_NAV_TABS: NavTab[] = [
  { label: 'My Dashboard', href: '/dashboard', icon: '📊', roles: ['student', 'mentor'] },
  { label: 'Communities', href: '/communities', icon: '👥' },
  { label: 'Messages', href: '/notifications', icon: '💬' },
  { label: 'My Profile', href: '/profile', icon: '👤' },
];

export const MENTOR_NAV_TABS: NavTab[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊', roles: ['mentor'] },
  { label: 'Sessions', href: '/mentor/sessions', icon: '🎥', roles: ['mentor'] },
  { label: 'Students', href: '/mentor/students', icon: '👨‍🎓', roles: ['mentor'] },
  { label: 'Earnings', href: '/mentor/earnings', icon: '💰', roles: ['mentor'] },
];

export const ADMIN_NAV_TABS: NavTab[] = [
  { label: 'Dashboard', href: '/admin', icon: '📊', roles: ['admin'] },
  { label: 'Users', href: '/admin/users', icon: '👥', roles: ['admin'] },
  { label: 'Communities', href: '/admin/communities', icon: '🏢', roles: ['admin'] },
  { label: 'Reports', href: '/admin/reports', icon: '⚠️', roles: ['admin'] },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️', roles: ['admin'] },
];
