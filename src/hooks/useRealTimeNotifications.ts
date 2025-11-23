'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { collection, query, where, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from '@config/firebase.config';
import { useNotifications } from './useNotifications';
import { Notification } from '@services/notification.service';

export interface UseRealTimeNotificationsReturn {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export function useRealTimeNotifications(
  userId?: string,
  onNewNotification?: (notification: Notification) => void
): UseRealTimeNotificationsReturn {
  const { addNotification, loadUnreadCount } = useNotifications();
  const unsubscribeRef = useRef<Unsubscribe | null>(null);
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    if (!userId || isListening) return;

    setIsListening(true);

    try {
      const notificationsRef = collection(db, 'users', userId, 'notifications');
      const q = query(notificationsRef, where('isRead', '==', false));

      unsubscribeRef.current = onSnapshot(
        q,
        (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const notification = {
                id: change.doc.id,
                userId,
                ...change.doc.data(),
              } as Notification;

              // Add to Redux store
              addNotification(notification);

              // Call optional callback
              if (onNewNotification) {
                onNewNotification(notification);
              }

              // Refresh unread count
              loadUnreadCount();
            }
          });
        },
        (error) => {
          console.error('Error listening to notifications:', error);
          setIsListening(false);
        }
      );
    } catch (error) {
      console.error('Error setting up notification listener:', error);
      setIsListening(false);
    }
  }, [userId, isListening, addNotification, loadUnreadCount, onNewNotification]);

  const stopListening = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
      setIsListening(false);
    }
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    startListening,
    stopListening,
  };
}
