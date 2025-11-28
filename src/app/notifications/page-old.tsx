'use client';

import { NotificationList } from '@components/notifications/NotificationList';
import { ProtectedRoute } from '@components/common/ProtectedRoute';

export default function NotificationsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <NotificationList />
      </div>
    </ProtectedRoute>
  );
}
