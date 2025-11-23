'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@hooks/useNotifications';
import { useRealTimeNotifications } from '@hooks/useRealTimeNotifications';
import { useAppSelector } from '@store/hooks';
import { Notification } from '@services/notification.service';
import { formatDistanceToNow } from 'date-fns';
import { LoadingSpinner } from '@components/common/LoadingSpinner';

export function NotificationList() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading,
    hasMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteMultiple,
    loadMoreNotifications,
    setUnreadFilter,
    clearFilter,
  } = useNotifications();
  const { startListening } = useRealTimeNotifications(user?.id);
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>(
    []
  );
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (user?.id) {
      startListening();
    }
  }, [user?.id, startListening]);

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map((n) => n.id));
    }
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((nid) => nid !== id) : [...prev, id]
    );
  };

  const handleMarkSelectedAsRead = async () => {
    for (const id of selectedNotifications) {
      await markAsRead(id);
    }
    setSelectedNotifications([]);
  };

  const handleDeleteSelected = async () => {
    if (selectedNotifications.length === 0) return;

    if (
      confirm(
        `Delete ${selectedNotifications.length} notification(s)? This action cannot be undone.`
      )
    ) {
      await deleteMultiple(selectedNotifications);
      setSelectedNotifications([]);
    }
  };

  const handleFilterChange = (type: 'all' | 'unread') => {
    setFilterType(type);
    if (type === 'all') {
      clearFilter();
    } else {
      setUnreadFilter();
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    if (notification.actionUrl) {
      // Use Next.js router for client-side navigation
      router.push(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'post_comment':
      case 'comment_reply':
        return (
          <svg
            className="w-6 h-6 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
          </svg>
        );
      case 'upvote':
        return (
          <svg
            className="w-6 h-6 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M2 10.5a1.5 1.5 0 113 0v-7a1.5 1.5 0 00-3 0v7zM14.666 8.5a2 2 0 01.668 3.464l-8.34 4.602a2 2 0 01-2.668-1.88V2.5a2 2 0 012.668-1.88l8.34 4.602z" />
          </svg>
        );
      case 'mention':
        return (
          <svg
            className="w-6 h-6 text-purple-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
        );
      case 'community_activity':
        return (
          <svg
            className="w-6 h-6 text-orange-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6 text-gray-600"
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

  if (!user?.id) {
    return <div className="text-center py-8">Please log in to view notifications</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Notifications</h1>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('unread')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterType === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Unread {unreadCount > 0 && `(${unreadCount})`}
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="flex gap-2 mb-4 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              {selectedNotifications.length} selected
            </span>
            <button
              onClick={handleMarkSelectedAsRead}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Mark as read
            </button>
            <button
              onClick={handleDeleteSelected}
              className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {selectedNotifications.length === notifications.length
              ? 'Deselect All'
              : 'Select All'}
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {loading && notifications.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="text-lg font-medium">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer ${
                !notification.isRead ? 'bg-blue-50 border-blue-300' : 'bg-white'
              }`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex gap-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedNotifications.includes(notification.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleSelectNotification(notification.id);
                  }}
                  className="w-5 h-5 rounded border-gray-300 cursor-pointer mt-1"
                />

                {/* Icon */}
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <div className="flex items-start justify-between">
                    <div className="flex-grow">
                      <h3
                        className={`font-semibold ${
                          !notification.isRead
                            ? 'text-gray-900'
                            : 'text-gray-700'
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDistanceToNow(
                          notification.createdAt.toDate
                            ? notification.createdAt.toDate()
                            : new Date(notification.createdAt.seconds * 1000),
                          { addSuffix: true }
                        )}
                      </p>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors ml-2"
                      aria-label="Delete notification"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMoreNotifications}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
