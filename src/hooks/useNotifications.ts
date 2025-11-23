'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteMultipleNotifications,
  clearOldNotifications,
  setFilter,
  clearFilter,
  clearNotifications,
  addNotificationLocal,
  updateNotificationLocal,
} from '@store/slices/notificationSlice';
import { Notification, NotificationType } from '@services/notification.service';

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  operationInProgress: string | null;
  loadNotifications: (
    pageSize?: number,
    filters?: { isRead?: boolean; type?: NotificationType }
  ) => Promise<void>;
  loadMoreNotifications: () => Promise<void>;
  loadUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteMultiple: (notificationIds: string[]) => Promise<void>;
  clearOld: () => Promise<void>;
  setReadFilter: () => void;
  setUnreadFilter: () => void;
  clearFilter: () => void;
  addNotification: (notification: Notification) => void;
  updateNotification: (notification: Notification) => void;
  clearAll: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const state = useAppSelector((state) => state.notifications);
  const loadingRef = useRef(false);

  // Load initial notifications and unread count
  useEffect(() => {
    if (!user?.id) return;

    const loadInitial = async () => {
      if (loadingRef.current) return;
      loadingRef.current = true;

      try {
        await Promise.all([
          dispatch(
            fetchNotifications({
              userId: user.id,
              pageSize: 20,
            })
          ),
          dispatch(fetchUnreadCount({ userId: user.id })),
        ]);
      } finally {
        loadingRef.current = false;
      }
    };

    loadInitial();
  }, [user?.id, dispatch]);

  const loadNotifications = useCallback(
    async (
      pageSize: number = 20,
      filters?: { isRead?: boolean; type?: NotificationType }
    ) => {
      if (!user?.id) return;

      if (filters) {
        dispatch(setFilter(filters));
      }

      await dispatch(
        fetchNotifications({
          userId: user.id,
          pageSize,
          filters,
        })
      );
    },
    [user?.id, dispatch]
  );

  const loadMoreNotifications = useCallback(async () => {
    if (!user?.id || !state.lastDoc || state.loading) return;

    await dispatch(
      fetchNotifications({
        userId: user.id,
        pageSize: 20,
        startAfterDoc: state.lastDoc,
        filters: state.filter,
      })
    );
  }, [user?.id, state.lastDoc, state.loading, state.filter, dispatch]);

  const loadUnreadCount = useCallback(async () => {
    if (!user?.id) return;

    await dispatch(fetchUnreadCount({ userId: user.id }));
  }, [user?.id, dispatch]);

  const handleMarkAsRead = useCallback(
    async (notificationId: string) => {
      if (!user?.id) return;

      await dispatch(
        markAsRead({
          userId: user.id,
          notificationId,
        })
      );
    },
    [user?.id, dispatch]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    if (!user?.id) return;

    await dispatch(markAllAsRead({ userId: user.id }));
  }, [user?.id, dispatch]);

  const handleDeleteNotification = useCallback(
    async (notificationId: string) => {
      if (!user?.id) return;

      await dispatch(
        deleteNotification({
          userId: user.id,
          notificationId,
        })
      );
    },
    [user?.id, dispatch]
  );

  const handleDeleteMultiple = useCallback(
    async (notificationIds: string[]) => {
      if (!user?.id) return;

      await dispatch(
        deleteMultipleNotifications({
          userId: user.id,
          notificationIds,
        })
      );
    },
    [user?.id, dispatch]
  );

  const handleClearOld = useCallback(async () => {
    if (!user?.id) return;

    await dispatch(clearOldNotifications({ userId: user.id }));
    // Refresh after clearing
    await loadNotifications();
  }, [user?.id, dispatch, loadNotifications]);

  const handleSetReadFilter = useCallback(() => {
    dispatch(setFilter({ isRead: true }));
  }, [dispatch]);

  const handleSetUnreadFilter = useCallback(() => {
    dispatch(setFilter({ isRead: false }));
  }, [dispatch]);

  const handleClearFilter = useCallback(() => {
    dispatch(clearFilter());
  }, [dispatch]);

  const handleAddNotification = useCallback(
    (notification: Notification) => {
      dispatch(addNotificationLocal(notification));
    },
    [dispatch]
  );

  const handleUpdateNotification = useCallback(
    (notification: Notification) => {
      dispatch(updateNotificationLocal(notification));
    },
    [dispatch]
  );

  const handleClearAll = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return {
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    loading: state.loading,
    error: state.error,
    hasMore: state.hasMore,
    operationInProgress: state.operationInProgress,
    loadNotifications,
    loadMoreNotifications,
    loadUnreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead: handleMarkAllAsRead,
    deleteNotification: handleDeleteNotification,
    deleteMultiple: handleDeleteMultiple,
    clearOld: handleClearOld,
    setReadFilter: handleSetReadFilter,
    setUnreadFilter: handleSetUnreadFilter,
    clearFilter: handleClearFilter,
    addNotification: handleAddNotification,
    updateNotification: handleUpdateNotification,
    clearAll: handleClearAll,
  };
}
