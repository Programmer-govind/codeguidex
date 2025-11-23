/**
 * Admin Service
 * Handles administrative operations including dashboard stats, user management, and content moderation
 */

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collectionGroup
} from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { AppError } from '@/utils/errorHandling';
import { FIRESTORE_COLLECTIONS } from '@/config/firestore.collections';

export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalCommunities: number;
  totalComments: number;
  activeUsers: number;
  suspendedUsers: number;
  pendingReports: number;
}

export interface RecentActivity {
  id: string;
  type: 'user_registered' | 'post_created' | 'comment_added' | 'report_submitted';
  title: string;
  description: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: string;
  joinedDate: string;
  lastActive: string;
  isSuspended: boolean;
  profilePicture?: string;
}

export interface AdminPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  communityId: string;
  communityName: string;
  createdAt: string;
  status: 'published' | 'draft' | 'archived';
  votes: {
    upVotes: number;
    downVotes: number;
    totalVotes: number;
  };
}

export interface AdminCommunity {
  id: string;
  name: string;
  description: string;
  category: string;
  visibility: 'public' | 'private';
  memberCount: number;
  postCount: number;
  createdAt: string;
  createdBy: string;
  creatorName: string;
  isSuspended?: boolean;
}

/**
 * AdminService class - Manages administrative operations
 */
export class AdminService {
  /**
   * Get dashboard statistics
   * @returns Promise<AdminStats>
   */
  static async getDashboardStats(): Promise<AdminStats> {
    try {
      // Get total users
      const usersQuery = query(collection(db, FIRESTORE_COLLECTIONS.USERS));
      const usersSnapshot = await getDocs(usersQuery);
      const totalUsers = usersSnapshot.size;

      // Get active users (active in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsersQuery = query(
        collection(db, FIRESTORE_COLLECTIONS.USERS),
        where('lastActive', '>=', Timestamp.fromDate(thirtyDaysAgo))
      );
      const activeUsersSnapshot = await getDocs(activeUsersQuery);
      const activeUsers = activeUsersSnapshot.size;

      // Get suspended users
      const suspendedUsersQuery = query(
        collection(db, FIRESTORE_COLLECTIONS.USERS),
        where('isSuspended', '==', true)
      );
      const suspendedUsersSnapshot = await getDocs(suspendedUsersQuery);
      const suspendedUsers = suspendedUsersSnapshot.size;

      // Get total communities
      const communitiesQuery = query(collection(db, FIRESTORE_COLLECTIONS.COMMUNITIES));
      const communitiesSnapshot = await getDocs(communitiesQuery);
      const totalCommunities = communitiesSnapshot.size;

      // Get total posts (from all communities)
      const postsQuery = query(collectionGroup(db, FIRESTORE_COLLECTIONS.POSTS));
      const postsSnapshot = await getDocs(postsQuery);
      const totalPosts = postsSnapshot.size;

      // Get total comments (from all posts)
      const commentsQuery = query(collectionGroup(db, FIRESTORE_COLLECTIONS.COMMENTS));
      const commentsSnapshot = await getDocs(commentsQuery);
      const totalComments = commentsSnapshot.size;

      // For now, set pending reports to 0 (reports system not implemented yet)
      const pendingReports = 0;

      return {
        totalUsers,
        totalPosts,
        totalCommunities,
        totalComments,
        activeUsers,
        suspendedUsers,
        pendingReports,
      };
    } catch (error) {
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
      );
    }
  }

  /**
   * Get recent activity
   * @param limitCount - Number of activities to fetch
   * @returns Promise<RecentActivity[]>
   */
  static async getRecentActivity(limitCount: number = 10): Promise<RecentActivity[]> {
    try {
      const activities: RecentActivity[] = [];

      // Get recent users
      const recentUsersQuery = query(
        collection(db, FIRESTORE_COLLECTIONS.USERS),
        orderBy('joinedDate', 'desc'),
        limit(limitCount)
      );
      const recentUsersSnapshot = await getDocs(recentUsersQuery);

      recentUsersSnapshot.forEach((doc) => {
        const userData = doc.data();
        activities.push({
          id: `user_${doc.id}`,
          type: 'user_registered',
          title: 'New user registered',
          description: `${userData.email} joined the platform`,
          timestamp: userData.joinedDate?.toDate?.().toISOString() || new Date().toISOString(),
          userId: doc.id,
          userEmail: userData.email,
        });
      });

      // Get recent posts
      const recentPostsQuery = query(
        collectionGroup(db, FIRESTORE_COLLECTIONS.POSTS),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const recentPostsSnapshot = await getDocs(recentPostsQuery);

      for (const postDoc of recentPostsSnapshot.docs) {
        const postData = postDoc.data();

        // Get community info
        const communityId = postDoc.ref.parent.parent?.id;
        if (communityId) {
          const communityDoc = await getDoc(doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId));
          const communityData = communityDoc.data();

          activities.push({
            id: `post_${postDoc.id}`,
            type: 'post_created',
            title: 'New post created',
            description: `"${postData.title}" in ${communityData?.name || 'Unknown Community'}`,
            timestamp: postData.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
            userId: postData.authorId,
          });
        }
      }

      // Sort activities by timestamp and limit
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return activities.slice(0, limitCount);
    } catch (error) {
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to fetch recent activity'
      );
    }
  }

  /**
   * Get all users for admin management
   * @returns Promise<AdminUser[]>
   */
  static async getAllUsers(): Promise<AdminUser[]> {
    try {
      const usersQuery = query(
        collection(db, FIRESTORE_COLLECTIONS.USERS),
        orderBy('joinedDate', 'desc')
      );
      const usersSnapshot = await getDocs(usersQuery);

      const users: AdminUser[] = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push({
          id: doc.id,
          email: userData.email || '',
          displayName: userData.displayName || 'Unknown User',
          role: userData.role || 'student',
          joinedDate: userData.joinedDate?.toDate?.().toISOString() || new Date().toISOString(),
          lastActive: userData.lastActive?.toDate?.().toISOString() || new Date().toISOString(),
          isSuspended: userData.isSuspended || false,
          profilePicture: userData.profilePicture,
        });
      });

      return users;
    } catch (error) {
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to fetch users'
      );
    }
  }

  /**
   * Suspend or unsuspend a user
   * @param userId - User ID to suspend/unsuspend
   * @param suspend - Whether to suspend (true) or unsuspend (false)
   * @returns Promise<void>
   */
  static async toggleUserSuspension(userId: string, suspend: boolean): Promise<void> {
    try {
      const userDocRef = doc(db, FIRESTORE_COLLECTIONS.USERS, userId);
      await updateDoc(userDocRef, {
        isSuspended: suspend,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to update user suspension status'
      );
    }
  }

  /**
   * Delete a user account
   * @param userId - User ID to delete
   * @returns Promise<void>
   */
  static async deleteUser(userId: string): Promise<void> {
    try {
      const userDocRef = doc(db, FIRESTORE_COLLECTIONS.USERS, userId);
      await deleteDoc(userDocRef);
    } catch (error) {
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to delete user'
      );
    }
  }

  /**
   * Get all posts for admin management
   * @returns Promise<AdminPost[]>
   */
  static async getAllPosts(): Promise<AdminPost[]> {
    try {
      const postsQuery = query(collectionGroup(db, FIRESTORE_COLLECTIONS.POSTS));
      const postsSnapshot = await getDocs(postsQuery);

      const posts: AdminPost[] = [];

      for (const postDoc of postsSnapshot.docs) {
        const postData = postDoc.data();
        const communityId = postDoc.ref.parent.parent?.id;

        if (communityId) {
          // Get community info
          const communityDoc = await getDoc(doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId));
          const communityData = communityDoc.data();

          // Get author info
          const authorDoc = await getDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, postData.authorId));
          const authorData = authorDoc.data();

          posts.push({
            id: postDoc.id,
            title: postData.title || 'Untitled Post',
            content: postData.content || '',
            authorId: postData.authorId,
            authorName: authorData?.displayName || 'Unknown Author',
            communityId,
            communityName: communityData?.name || 'Unknown Community',
            createdAt: postData.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
            status: postData.status || 'published',
            votes: postData.votes || { upVotes: 0, downVotes: 0, totalVotes: 0 },
          });
        }
      }

      return posts;
    } catch (error) {
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to fetch posts'
      );
    }
  }

  /**
   * Get all communities for admin management
   * @returns Promise<AdminCommunity[]>
   */
  static async getAllCommunities(): Promise<AdminCommunity[]> {
    try {
      const communitiesQuery = query(collection(db, FIRESTORE_COLLECTIONS.COMMUNITIES));
      const communitiesSnapshot = await getDocs(communitiesQuery);

      const communities: AdminCommunity[] = [];

      for (const communityDoc of communitiesSnapshot.docs) {
        const communityData = communityDoc.data();

        // Get creator info
        let creatorName = 'Unknown Creator';
        if (communityData.createdBy) {
          try {
            const creatorDoc = await getDoc(doc(db, FIRESTORE_COLLECTIONS.USERS, communityData.createdBy));
            if (creatorDoc.exists()) {
              creatorName = creatorDoc.data().displayName || 'Unknown Creator';
            }
          } catch (err) {
            console.warn(`Failed to fetch creator for community ${communityDoc.id}`, err);
          }
        }

        // Get post count for this community
        const postsQuery = query(collection(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityDoc.id, FIRESTORE_COLLECTIONS.POSTS));
        const postsSnapshot = await getDocs(postsQuery);

        communities.push({
          id: communityDoc.id,
          name: communityData.name || 'Unnamed Community',
          description: communityData.description || '',
          category: communityData.category || 'General',
          visibility: communityData.visibility || 'public',
          memberCount: communityData.memberCount || 0,
          postCount: postsSnapshot.size,
          createdAt: communityData.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
          createdBy: communityData.createdBy || '',
          creatorName: creatorName,
          isSuspended: communityData.isSuspended || false,
        });
      }

      return communities;
    } catch (error) {
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to fetch communities'
      );
    }
  }

  /**
   * Suspend a community
   * @param communityId - The ID of the community to suspend
   * @returns Promise<void>
   */
  static async suspendCommunity(communityId: string): Promise<void> {
    try {
      const communityRef = doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId);
      await updateDoc(communityRef, {
        isSuspended: true,
        suspendedAt: Timestamp.now(),
      });
    } catch (error) {
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to suspend community'
      );
    }
  }

  /**
   * Unsuspend a community
   * @param communityId - The ID of the community to unsuspend
   * @returns Promise<void>
   */
  static async unsuspendCommunity(communityId: string): Promise<void> {
    try {
      const communityRef = doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId);
      await updateDoc(communityRef, {
        isSuspended: false,
        suspendedAt: null,
      });
    } catch (error) {
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to unsuspend community'
      );
    }
  }

  /**
   * Delete a community
   * @param communityId - The ID of the community to delete
   * @returns Promise<void>
   */
  static async deleteCommunity(communityId: string): Promise<void> {
    try {
      const communityRef = doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId);
      await deleteDoc(communityRef);
    } catch (error) {
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to delete community'
      );
    }
  }
}