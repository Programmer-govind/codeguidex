'use client';

import { NotificationList } from '@components/notifications/NotificationList';
import { ProtectedRoute } from '@components/common/ProtectedRoute';
import { SubNav } from '@/components/navigation/SubNav';

const NOTIFICATIONS_NAV = [
  { label: 'All Notifications', href: '/notifications', icon: '🔔' },
  { label: 'Messages', href: '/notifications/messages', icon: '💬' },
  { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: '🔖' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <div className="section">
        <div className="section-container">
          {/* Navigation Tabs */}
          <SubNav items={NOTIFICATIONS_NAV} showBorder={true} />

          {/* Header */}
          <div className="section-header mb-8">
            <h1>Notifications</h1>
            <p className="section-subtitle">Stay updated with all your activities</p>
          </div>

          {/* Notifications List */}
          <NotificationList />
        </div>
      </div>
    </ProtectedRoute>
  );
}
