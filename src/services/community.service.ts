/**
 * Community Service
 * Handles community CRUD operations, membership management, and community statistics
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { FIRESTORE_COLLECTIONS } from '@/config/firestore.collections';
import { ClientEmailService } from '@/services/client-email.service';
import type {
  Community,
  CreateCommunityRequest,
  UpdateCommunityRequest,
  CommunityStats,
} from '@/types/community.types';
import type { User } from '@/types/user.types';
import { AppError } from '@/utils/errorHandling';

/**
 * CommunityService class - Manages community operations
 */
export class CommunityService {
  /**
   * Get all communities with optional filters
   * @param filters - Filter options (category, visibility, searchTerm, page, pageSize)
   * @param userId - Optional user ID to check membership for private communities
   * @returns Promise<{communities: Community[], total: number}>
   * @throws AppError if fetch fails
   */
  static async getAllCommunities(filters?: {
    category?: string;
    visibility?: 'public' | 'private';
    searchTerm?: string;
    page?: number;
    pageSize?: number;
  }, userId?: string): Promise<{ communities: Community[]; total: number }> {
    try {
      const pageSize = filters?.pageSize || 20;
      const currentPage = filters?.page || 1;
      const pageOffset = (currentPage - 1) * pageSize;

      let q = query(collection(db, FIRESTORE_COLLECTIONS.COMMUNITIES));

      // Apply filters
      const constraints = [];

      if (filters?.visibility) {
        constraints.push(where('visibility', '==', filters.visibility));
      }

      if (filters?.category) {
        constraints.push(where('category', '==', filters.category));
      }

      if (constraints.length > 0) {
        q = query(collection(db, FIRESTORE_COLLECTIONS.COMMUNITIES), ...constraints);
      }

      const snapshot = await getDocs(q);
      let communities = snapshot.docs.map((doc) => {
        const data = doc.data();
        const members = data.members ? Object.entries(data.members).reduce((acc, [userId, member]: [string, any]) => {
          acc[userId] = {
            ...member,
            joinedDate: member.joinedDate?.toDate?.().toISOString() || member.joinedDate || new Date().toISOString()
          };
          return acc;
        }, {} as Record<string, any>) : {};

        return {
          id: doc.id,
          ...data,
          members,
          createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
          lastActivityAt: data.lastActivityAt?.toDate?.().toISOString() || new Date().toISOString(),
        } as Community;
      });

      // Filter private communities - only show if user is a member
      communities = communities.filter((community) => {
        if (community.visibility === 'private') {
          // Show private communities only to members
          return userId && community.members && community.members[userId];
        }
        // Show all public communities
        return true;
      });

      // Apply search term filter (client-side)
      if (filters?.searchTerm) {
        const search = filters.searchTerm.toLowerCase();
        communities = communities.filter(
          (c) =>
            c.name.toLowerCase().includes(search) ||
            c.description.toLowerCase().includes(search)
        );
      }

      // Sort by last activity (newest first)
      communities.sort(
        (a, b) => {
          const dateA = a.lastActivityAt instanceof Timestamp ? a.lastActivityAt.toMillis() : new Date(a.lastActivityAt).getTime();
          const dateB = b.lastActivityAt instanceof Timestamp ? b.lastActivityAt.toMillis() : new Date(b.lastActivityAt).getTime();
          return dateB - dateA;
        }
      );

      // Apply pagination
      const total = communities.length;
      communities = communities.slice(pageOffset, pageOffset + pageSize);

      return { communities, total };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to fetch communities');
    }
  }

  /**
   * Get a single community by ID
   * @param communityId - Community document ID
   * @returns Promise<Community> - Community data
   * @throws AppError if community not found
   */
  static async getCommunity(communityId: string): Promise<Community> {
    try {
      if (!communityId) {
        throw new AppError(400, 'Community ID is required');
      }

      const communityDocRef = doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId);
      const communitySnapshot = await getDoc(communityDocRef);

      if (!communitySnapshot.exists()) {
        throw new AppError(404, 'Community not found');
      }

      const data = communitySnapshot.data();
      const members = data.members ? Object.entries(data.members).reduce((acc, [userId, member]: [string, any]) => {
        acc[userId] = {
          ...member,
          joinedDate: member.joinedDate?.toDate?.().toISOString() || member.joinedDate || new Date().toISOString()
        };
        return acc;
      }, {} as Record<string, any>) : {};

      return {
        id: communitySnapshot.id,
        ...data,
        members,
        createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
        lastActivityAt: data.lastActivityAt?.toDate?.().toISOString() || new Date().toISOString(),
      } as Community;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to fetch community');
    }
  }

  /**
   * Create a new community
   * @param createData - Community creation data
   * @param userId - Creator's user ID
   * @param userName - Creator's display name
   * @returns Promise<string> - New community ID
   * @throws AppError if validation fails
   */
  static async createCommunity(
    createData: CreateCommunityRequest,
    userId: string,
    userName: string
  ): Promise<string> {
    try {
      if (!userId || !userName) {
        throw new AppError(400, 'User ID and name are required');
      }

      // Validate required fields
      if (!createData.name || !createData.name.trim()) {
        throw new AppError(400, 'Community name is required');
      }

      if (createData.name.length < 3 || createData.name.length > 100) {
        throw new AppError(400, 'Community name must be between 3 and 100 characters');
      }

      if (!createData.description || !createData.description.trim()) {
        throw new AppError(400, 'Community description is required');
      }

      if (createData.description.length < 10 || createData.description.length > 1000) {
        throw new AppError(400, 'Community description must be between 10 and 1000 characters');
      }

      if (!createData.category) {
        throw new AppError(400, 'Community category is required');
      }

      if (!createData.iconColor) {
        throw new AppError(400, 'Community icon color is required');
      }

      // Create community document
      const now = Timestamp.now();
      const communityData = {
        name: createData.name.trim(),
        description: createData.description.trim(),
        category: createData.category,
        tags: createData.tags || [],
        visibility: createData.visibility || 'public',
        iconColor: createData.iconColor,
        ownerId: userId,
        ownerName: userName,
        moderatorIds: [],
        members: {
          [userId]: {
            joinedDate: now,
            role: 'admin' as const,
          },
        },
        memberCount: 1,
        stats: {
          postsCount: 0,
          commentsCount: 0,
          viewsCount: 0,
        },
        rules: createData.rules || [],
        guidelines: createData.guidelines || '',
        createdAt: now,
        updatedAt: now,
        lastActivityAt: now,
      };

      const communityRef = await addDoc(
        collection(db, FIRESTORE_COLLECTIONS.COMMUNITIES),
        communityData
      );

      // Send confirmation email to community creator
      try {
        // Get creator's profile to get email
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.email) {
            await ClientEmailService.sendCommunityCreationConfirmation(
              userData.email,
              userName,
              {
                name: createData.name.trim(),
                description: createData.description.trim(),
                category: createData.category,
              }
            );
          }
        }
      } catch (emailError) {
        console.error('Error sending community creation email:', emailError);
        // Don't fail community creation if email fails
      }

      return communityRef.id;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to create community');
    }
  }

  /**
   * Update a community
   * @param communityId - Community document ID
   * @param updateData - Data to update
   * @param userId - User ID (must be owner)
   * @returns Promise<void>
   * @throws AppError if validation fails or user unauthorized
   */
  static async updateCommunity(
    communityId: string,
    updateData: UpdateCommunityRequest,
    userId: string
  ): Promise<void> {
    try {
      if (!communityId || !userId) {
        throw new AppError(400, 'Community ID and user ID are required');
      }

      const communityDocRef = doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId);
      const communitySnapshot = await getDoc(communityDocRef);

      if (!communitySnapshot.exists()) {
        throw new AppError(404, 'Community not found');
      }

      const communityData = communitySnapshot.data() as Community;

      // Check authorization (owner only)
      if (communityData.ownerId !== userId) {
        throw new AppError(403, 'Only community owner can update community');
      }

      // Validate fields if provided
      if (updateData.name) {
        if (updateData.name.length < 3 || updateData.name.length > 100) {
          throw new AppError(400, 'Community name must be between 3 and 100 characters');
        }
      }

      if (updateData.description) {
        if (updateData.description.length < 10 || updateData.description.length > 1000) {
          throw new AppError(400, 'Community description must be between 10 and 1000 characters');
        }
      }

      // Prepare update payload
      const updatePayload = {
        ...updateData,
        updatedAt: Timestamp.now(),
      };

      // Don't allow updating certain fields
      delete (updatePayload as any).ownerId;
      delete (updatePayload as any).ownerName;
      delete (updatePayload as any).createdAt;
      delete (updatePayload as any).members;
      delete (updatePayload as any).stats;

      await updateDoc(communityDocRef, updatePayload);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to update community');
    }
  }

  /**
   * Delete a community
   * @param communityId - Community document ID
   * @param userId - User ID (must be owner)
   * @returns Promise<void>
   * @throws AppError if validation fails or user unauthorized
   */
  static async deleteCommunity(communityId: string, userId: string): Promise<void> {
    try {
      if (!communityId || !userId) {
        throw new AppError(400, 'Community ID and user ID are required');
      }

      const communityDocRef = doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId);
      const communitySnapshot = await getDoc(communityDocRef);

      if (!communitySnapshot.exists()) {
        throw new AppError(404, 'Community not found');
      }

      const communityData = communitySnapshot.data() as Community;

      // Check authorization (owner only)
      if (communityData.ownerId !== userId) {
        throw new AppError(403, 'Only community owner can delete community');
      }

      // Delete community document
      await deleteDoc(communityDocRef);

      // TODO: In production, also delete all posts, comments, and related data
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to delete community');
    }
  }

  /**
   * Join a community
   * @param userId - User ID
   * @param communityId - Community ID
   * @returns Promise<void>
   * @throws AppError if community not found or user already member
   */
  static async joinCommunity(userId: string, communityId: string): Promise<void> {
    try {
      if (!userId || !communityId) {
        throw new AppError(400, 'User ID and community ID are required');
      }

      const communityDocRef = doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId);
      const communitySnapshot = await getDoc(communityDocRef);

      if (!communitySnapshot.exists()) {
        throw new AppError(404, 'Community not found');
      }

      const communityData = communitySnapshot.data() as Community;

      if (communityData.members?.[userId]) {
        throw new AppError(400, 'User is already a member of this community');
      }

      // Add user to members
      const updatedMembers = {
        ...communityData.members,
        [userId]: {
          joinedDate: Timestamp.now(),
          role: 'member' as const,
        },
      };

      await updateDoc(communityDocRef, {
        members: updatedMembers,
        memberCount: (communityData.memberCount || 0) + 1,
        updatedAt: Timestamp.now(),
        lastActivityAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to join community');
    }
  }

  /**
   * Leave a community
   * @param userId - User ID
   * @param communityId - Community ID
   * @returns Promise<void>
   * @throws AppError if community not found or user not member
   */
  static async leaveCommunity(userId: string, communityId: string): Promise<void> {
    try {
      if (!userId || !communityId) {
        throw new AppError(400, 'User ID and community ID are required');
      }

      const communityDocRef = doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId);
      const communitySnapshot = await getDoc(communityDocRef);

      if (!communitySnapshot.exists()) {
        throw new AppError(404, 'Community not found');
      }

      const communityData = communitySnapshot.data() as Community;

      if (!communityData.members?.[userId]) {
        throw new AppError(400, 'User is not a member of this community');
      }

      // Prevent owner from leaving
      if (communityData.ownerId === userId) {
        throw new AppError(400, 'Community owner cannot leave the community');
      }

      // Remove user from members
      const updatedMembers = { ...communityData.members };
      delete updatedMembers[userId];

      await updateDoc(communityDocRef, {
        members: updatedMembers,
        memberCount: Math.max(0, (communityData.memberCount || 1) - 1),
        updatedAt: Timestamp.now(),
        lastActivityAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to leave community');
    }
  }

  /**
   * Get community members
   * @param communityId - Community ID
   * @returns Promise<User[]> - Array of community members
   * @throws AppError if community not found
   */
  static async getCommunityMembers(communityId: string): Promise<User[]> {
    try {
      if (!communityId) {
        throw new AppError(400, 'Community ID is required');
      }

      const communityDocRef = doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId);
      const communitySnapshot = await getDoc(communityDocRef);

      if (!communitySnapshot.exists()) {
        throw new AppError(404, 'Community not found');
      }

      const communityData = communitySnapshot.data() as Community;
      const memberIds = Object.keys(communityData.members || {});

      // Fetch member user data
      const members: User[] = [];
      for (const memberId of memberIds) {
        const userDocRef = doc(db, 'users', memberId);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          members.push({
            id: userSnapshot.id,
            ...userData,
          } as User);
        }
      }

      return members;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to fetch community members'
      );
    }
  }

  /**
   * Update community statistics
   * @param communityId - Community ID
   * @param stats - Statistics object with counts to update
   * @returns Promise<void>
   * @throws AppError if update fails
   */
  static async updateCommunityStats(
    communityId: string,
    stats: Partial<CommunityStats>
  ): Promise<void> {
    try {
      if (!communityId) {
        throw new AppError(400, 'Community ID is required');
      }

      const communityDocRef = doc(db, FIRESTORE_COLLECTIONS.COMMUNITIES, communityId);

      // Build update payload for nested stats object
      const updatePayload: Record<string, any> = {
        updatedAt: Timestamp.now(),
      };

      if (stats.postsCount !== undefined) {
        updatePayload['stats.postsCount'] = stats.postsCount;
      }

      if (stats.viewsCount !== undefined) {
        updatePayload['stats.viewsCount'] = stats.viewsCount;
      }

      if (Object.keys(updatePayload).length > 1) {
        await updateDoc(communityDocRef, updatePayload);
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to update community statistics'
      );
    }
  }
}
