'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useNotifications } from '@hooks/useNotifications';
import { useRealTimeNotifications } from '@hooks/useRealTimeNotifications';
import { useAppSelector } from '@store/hooks';
import { Notification } from '@services/notification.service';
import { formatDistanceToNow } from 'date-fns';
import { LoadingSpinner } from '@components/common/LoadingSpinner';

interface NotificationDropdownProps {
  maxItems?: number;
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationDropdown({
  maxItems = 5,
  onNotificationClick,
}: NotificationDropdownProps) {
  const { user } = useAppSelector((state) => state.auth);
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    deleteNotification,
  } = useNotifications();
  const { startListening } = useRealTimeNotifications(user?.id);

  useEffect(() => {
    if (user?.id) {
      startListening();
    }
  }, [user?.id, startListening]);

  if (!user?.id) return null;

  const recentNotifications = notifications.slice(0, maxItems);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const handleDelete = async (
    e: React.MouseEvent,
    notificationId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'post_comment':
      case 'comment_reply':
        return (
          <svg
            className="w-5 h-5 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
          </svg>
        );
      case 'upvote':
        return (
          <svg
            className="w-5 h-5 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v-7a1.5 1.5 0 00-3 0v7zM14.666 8.5a2 2 0 01.668 3.464l-8.34 4.602a2 2 0 01-2.668-1.88V2.5a2 2 0 012.668-1.88l8.34 4.602z" />
          </svg>
        );
      case 'mention':
        return (
          <svg
            className="w-5 h-5 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        );
      case 'community_activity':
        return (
          <svg
            className="w-5 h-5 text-orange-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-5 h-5 text-gray-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 8a1 1 0 11-2 0 1 1 0 012 0zm4 0a1 1 0 11-2 0 1 1 0 012 0z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Recent Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600">{unreadCount} unread</p>
          )}
        </div>
        <Link
          href="/notifications"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </Link>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSpinner />
          </div>
        ) : recentNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No notifications yet</p>
          </div>
        ) : (
          recentNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer last:border-b-0 ${
                !notification.isRead ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow min-w-0">
                  {notification.triggeredByProfilePic && (
                    <img
                      src={notification.triggeredByProfilePic}
                      alt={notification.triggeredByName || 'User'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(
                      notification.createdAt.toDate
                        ? notification.createdAt.toDate()
                        : new Date(notification.createdAt.seconds * 1000),
                      { addSuffix: true }
                    )}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(e, notification.id)}
                  className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                  aria-label="Delete notification"
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {recentNotifications.length > 0 && notifications.length > maxItems && (
        <div className="p-3 border-t border-gray-200 text-center">
          <Link
            href="/notifications"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View {notifications.length - maxItems} more notifications
          </Link>
        </div>
      )}
    </div>
  );
}
