import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp,
  QueryConstraint,
} from 'firebase/firestore';
import { db } from '@config/firebase.config';

export type NotificationType =
  | 'post_comment'
  | 'comment_reply'
  | 'mention'
  | 'upvote'
  | 'bookmark'
  | 'community_activity'
  | 'system';

export type NotificationRelatedType = 'post' | 'comment' | 'community' | 'user';

export interface CreateNotificationInput {
  type: NotificationType;
  title: string;
  message: string;
  relatedId: string;
  relatedType: NotificationRelatedType;
  communityId?: string;
  postId?: string;
  commentId?: string;
  triggeredById?: string;
  triggeredByName?: string;
  triggeredByProfilePic?: string;
  priority?: 'low' | 'medium' | 'high';
  actionUrl?: string;
  actionLabel?: string;
}

export interface Notification extends CreateNotificationInput {
  id: string;
  userId: string;
  isRead: boolean;
  readAt?: Timestamp;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
}

class NotificationService {
  /**
   * Create a new notification for a user
   */
  async createNotification(
    userId: string,
    notificationData: CreateNotificationInput
  ): Promise<Notification> {
    try {
      const notificationsRef = collection(db, 'users', userId, 'notifications');

      const notificationToCreate = {
        ...notificationData,
        isRead: false,
        createdAt: Timestamp.now(),
        priority: notificationData.priority || 'medium',
        // Auto-expire after 30 days
        expiresAt: new Timestamp(
          Timestamp.now().seconds + 30 * 24 * 60 * 60,
          0
        ),
      };

      const docRef = await addDoc(notificationsRef, notificationToCreate);

      return {
        id: docRef.id,
        userId,
        ...notificationToCreate,
      } as Notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  }

  /**
   * Get notifications for a user (paginated)
   */
  async getNotifications(
    userId: string,
    pageSize: number = 20,
    startAfterDoc?: any,
    filters?: {
      isRead?: boolean;
      type?: NotificationType;
    }
  ): Promise<{ notifications: Notification[]; lastDoc: any }> {
    try {
      const notificationsRef = collection(db, 'users', userId, 'notifications');

      const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc')];

      if (filters?.isRead !== undefined) {
        constraints.push(where('isRead', '==', filters.isRead));
      }

      if (filters?.type) {
        constraints.push(where('type', '==', filters.type));
      }

      constraints.push(limit(pageSize + 1));

      if (startAfterDoc) {
        constraints.push(startAfter(startAfterDoc));
      }

      const q = query(notificationsRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const notifications: Notification[] = [];
      let lastDoc = null;
      let index = 0;

      querySnapshot.forEach((doc) => {
        if (index < pageSize) {
          notifications.push({
            id: doc.id,
            userId,
            ...doc.data(),
          } as Notification);
        }
        if (index === pageSize - 1) {
          lastDoc = doc;
        }
        index++;
      });

      return { notifications, lastDoc };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notificationsRef = collection(db, 'users', userId, 'notifications');
      const q = query(notificationsRef, where('isRead', '==', false));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw new Error('Failed to get unread count');
    }
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(
        db,
        'users',
        userId,
        'notifications',
        notificationId
      );

      await updateDoc(notificationRef, {
        isRead: true,
        readAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const notificationsRef = collection(db, 'users', userId, 'notifications');
      const q = query(notificationsRef, where('isRead', '==', false));
      const querySnapshot = await getDocs(q);

      const batch = await import('firebase/firestore').then(
        (module) => module.writeBatch(db)
      );

      querySnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, {
          isRead: true,
          readAt: Timestamp.now(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  /**
   * Delete a notification
   */
  async deleteNotification(
    userId: string,
    notificationId: string
  ): Promise<void> {
    try {
      const notificationRef = doc(
        db,
        'users',
        userId,
        'notifications',
        notificationId
      );

      await deleteDoc(notificationRef);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw new Error('Failed to delete notification');
    }
  }

  /**
   * Delete multiple notifications
   */
  async deleteMultiple(
    userId: string,
    notificationIds: string[]
  ): Promise<void> {
    try {
      const batch = await import('firebase/firestore').then(
        (module) => module.writeBatch(db)
      );

      notificationIds.forEach((id) => {
        const ref = doc(db, 'users', userId, 'notifications', id);
        batch.delete(ref);
      });

      await batch.commit();
    } catch (error) {
      console.error('Error deleting multiple notifications:', error);
      throw new Error('Failed to delete notifications');
    }
  }

  /**
   * Clear old notifications (older than 30 days)
   */
  async clearOldNotifications(userId: string): Promise<number> {
    try {
      const notificationsRef = collection(db, 'users', userId, 'notifications');
      const thirtyDaysAgo = new Timestamp(
        Timestamp.now().seconds - 30 * 24 * 60 * 60,
        0
      );

      const q = query(
        notificationsRef,
        where('createdAt', '<', thirtyDaysAgo)
      );

      const querySnapshot = await getDocs(q);

      const batch = await import('firebase/firestore').then(
        (module) => module.writeBatch(db)
      );

      let deletedCount = 0;
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        deletedCount++;
      });

      await batch.commit();
      return deletedCount;
    } catch (error) {
      console.error('Error clearing old notifications:', error);
      throw new Error('Failed to clear old notifications');
    }
  }

  /**
   * Bulk create notifications (for multi-user scenarios)
   */
  async bulkCreateNotifications(
    userIds: string[],
    notificationData: CreateNotificationInput
  ): Promise<void> {
    try {
      const batch = await import('firebase/firestore').then(
        (module) => module.writeBatch(db)
      );

      userIds.forEach((userId) => {
        const notificationsRef = collection(
          db,
          'users',
          userId,
          'notifications'
        );

        const docRef = doc(notificationsRef);

        batch.set(docRef, {
          ...notificationData,
          isRead: false,
          createdAt: Timestamp.now(),
          priority: notificationData.priority || 'medium',
          expiresAt: new Timestamp(
            Timestamp.now().seconds + 30 * 24 * 60 * 60,
            0
          ),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error bulk creating notifications:', error);
      throw new Error('Failed to create notifications');
    }
  }

  /**
   * Get a single notification
   */
  async getNotification(
    userId: string,
    notificationId: string
  ): Promise<Notification | null> {
    try {
      const notificationRef = doc(
        db,
        'users',
        userId,
        'notifications',
        notificationId
      );

      const docSnapshot = await getDoc(notificationRef);

      if (!docSnapshot.exists()) {
        return null;
      }

      return {
        id: docSnapshot.id,
        userId,
        ...docSnapshot.data(),
      } as Notification;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw new Error('Failed to fetch notification');
    }
  }
}

export default new NotificationService();
