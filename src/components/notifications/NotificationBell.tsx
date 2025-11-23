'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useNotifications } from '@hooks/useNotifications';
import { useRealTimeNotifications } from '@hooks/useRealTimeNotifications';
import { useAppSelector } from '@store/hooks';

export function NotificationBell() {
  const { user } = useAppSelector((state) => state.auth);
  const { unreadCount, loadUnreadCount } = useNotifications();
  const { startListening } = useRealTimeNotifications(user?.id);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user?.id) {
      startListening();
      loadUnreadCount();
    }
  }, [user?.id, startListening, loadUnreadCount]);

  if (!user?.id) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <Link
              href="/notifications"
              className="block p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
              onClick={() => setShowDropdown(false)}
            >
              <p className="text-sm font-medium">View all notifications</p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
