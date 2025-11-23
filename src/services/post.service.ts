/**
 * Post Service
 * Handles post CRUD operations, voting, and post statistics
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
  collectionGroup,
} from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import { FIRESTORE_COLLECTIONS } from '@/config/firestore.collections';
import type {
  Post,
  CreatePostRequest,
  UpdatePostRequest,
} from '@/types/community.types';
import { AppError } from '@/utils/errorHandling';
import { serializePost, serializePosts } from '@/utils/firestore.utils';

/**
 * PostService class - Manages post operations
 */
export class PostService {
  /**
   * Create a new post in a community
   * @param communityId - Community ID
   * @param createData - Post creation data
   * @param userId - Post author's ID
   * @param authorName - Post author's name
   * @returns Promise<string> - New post ID
   * @throws AppError if validation fails
   */
  static async createPost(
    communityId: string,
    createData: CreatePostRequest,
    userId: string,
    authorName: string
  ): Promise<string> {
    try {
      if (!communityId || !userId || !authorName) {
        throw new AppError(400, 'Community ID, user ID, and author name are required');
      }

      // Validate required fields
      if (!createData.title || !createData.title.trim()) {
        throw new AppError(400, 'Post title is required');
      }

      if (createData.title.length < 5 || createData.title.length > 200) {
        throw new AppError(400, 'Post title must be between 5 and 200 characters');
      }

      if (!createData.description || !createData.description.trim()) {
        throw new AppError(400, 'Post description is required');
      }

      if (createData.description.length < 10 || createData.description.length > 500) {
        throw new AppError(400, 'Post description must be between 10 and 500 characters');
      }

      if (!createData.content || !createData.content.trim()) {
        throw new AppError(400, 'Post content is required');
      }

      if (createData.content.length > 10000) {
        throw new AppError(400, 'Post content cannot exceed 10000 characters');
      }

      if (!createData.type) {
        throw new AppError(400, 'Post type is required');
      }

      // Create post document
      const now = Timestamp.now();
      const postData = {
        title: createData.title.trim(),
        description: createData.description.trim(),
        content: createData.content.trim(),
        type: createData.type,
        tags: createData.tags || [],
        codeSnippet: createData.codeSnippet || null,
        images: createData.images || [],
        attachments: [],
        authorId: userId,
        authorName: authorName,
        authorProfilePicture: '',
        votes: {
          upvotes: 0,
          downvotes: 0,
          totalVotes: 0,
        },
        userVotes: {},
        comments: {
          count: 0,
          totalReplies: 0,
        },
        views: 0,
        viewedBy: {},
        status: 'published',
        isAnswered: false,
        isSpamReported: false,
        sharedCount: 0,
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      };

      const postsRef = collection(
        db,
        FIRESTORE_COLLECTIONS.COMMUNITIES,
        communityId,
        FIRESTORE_COLLECTIONS.POSTS
      );

      const postRef = await addDoc(postsRef, postData);

      return postRef.id;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to create post');
    }
  }

  /**
   * Get a single post
   * @param communityId - Community ID
   * @param postId - Post document ID
   * @returns Promise<Post> - Post data
   * @throws AppError if post not found
   */
  static async getPost(communityId: string, postId: string): Promise<Post> {
    try {
      if (!communityId || !postId) {
        throw new AppError(400, 'Community ID and post ID are required');
      }

      const postDocRef = doc(
        db,
        FIRESTORE_COLLECTIONS.COMMUNITIES,
        communityId,
        FIRESTORE_COLLECTIONS.POSTS,
        postId
      );

      const postSnapshot = await getDoc(postDocRef);

      if (!postSnapshot.exists()) {
        throw new AppError(404, 'Post not found');
      }

      const post = {
        id: postSnapshot.id,
        ...postSnapshot.data(),
      };

      return serializePost(post);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to fetch post');
    }
  }

  /**
   * Get community posts with filtering
   * @param communityId - Community ID
   * @param options - Filter options (type, sortBy, page, pageSize)
   * @returns Promise<{posts: Post[], total: number}>
   * @throws AppError if fetch fails
   */
  static async getCommunityPosts(
    communityId: string,
    options?: {
      type?: string;
      sortBy?: 'recent' | 'popular' | 'mostViewed';
      page?: number;
      pageSize?: number;
    }
  ): Promise<{ posts: Post[]; total: number }> {
    try {
      if (!communityId) {
        throw new AppError(400, 'Community ID is required');
      }

      const pageSize = options?.pageSize || 20;
      const currentPage = options?.page || 1;
      const pageOffset = (currentPage - 1) * pageSize;

      const postsRef = collection(
        db,
        FIRESTORE_COLLECTIONS.COMMUNITIES,
        communityId,
        FIRESTORE_COLLECTIONS.POSTS
      );

      let q = query(postsRef, where('status', '==', 'published'));

      const snapshot = await getDocs(q);
      let posts: any[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Apply filtering by type
      if (options?.type) {
        posts = posts.filter((p) => p.type === options.type);
      }

      // Sort posts (before serialization, while we still have Timestamp objects)
      switch (options?.sortBy) {
        case 'popular':
          posts.sort((a, b) => (b.votes?.totalVotes || 0) - (a.votes?.totalVotes || 0));
          break;
        case 'mostViewed':
          posts.sort((a, b) => (b.views || 0) - (a.views || 0));
          break;
        case 'recent':
        default:
          posts.sort(
            (a, b) =>
              (b.publishedAt?.toMillis?.() || 0) - (a.publishedAt?.toMillis?.() || 0)
          );
      }

      // Apply pagination
      const total = posts.length;
      posts = posts.slice(pageOffset, pageOffset + pageSize);

      // Serialize posts for Redux storage
      return { posts: serializePosts(posts), total };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to fetch posts');
    }
  }

  /**
   * Update a post
   * @param communityId - Community ID
   * @param postId - Post document ID
   * @param updateData - Data to update
   * @param userId - User ID (must be author)
   * @returns Promise<void>
   * @throws AppError if validation fails or user unauthorized
   */
  static async updatePost(
    communityId: string,
    postId: string,
    updateData: UpdatePostRequest,
    userId: string
  ): Promise<void> {
    try {
      if (!communityId || !postId || !userId) {
        throw new AppError(400, 'Community ID, post ID, and user ID are required');
      }

      const postDocRef = doc(
        db,
        FIRESTORE_COLLECTIONS.COMMUNITIES,
        communityId,
        FIRESTORE_COLLECTIONS.POSTS,
        postId
      );

      const postSnapshot = await getDoc(postDocRef);

      if (!postSnapshot.exists()) {
        throw new AppError(404, 'Post not found');
      }

      const postData = postSnapshot.data() as Post;

      // Check authorization (author only)
      if (postData.authorId !== userId) {
        throw new AppError(403, 'Only post author can update post');
      }

      // Validate fields if provided
      if (updateData.title) {
        if (updateData.title.length < 5 || updateData.title.length > 200) {
          throw new AppError(400, 'Post title must be between 5 and 200 characters');
        }
      }

      if (updateData.content) {
        if (updateData.content.length > 10000) {
          throw new AppError(400, 'Post content cannot exceed 10000 characters');
        }
      }

      // Prepare update payload
      const updatePayload = {
        ...updateData,
        updatedAt: Timestamp.now(),
      };

      // Don't allow updating certain fields
      delete (updatePayload as any).authorId;
      delete (updatePayload as any).authorName;
      delete (updatePayload as any).createdAt;
      delete (updatePayload as any).votes;
      delete (updatePayload as any).comments;
      delete (updatePayload as any).viewedBy;

      await updateDoc(postDocRef, updatePayload);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to update post');
    }
  }

  /**
   * Delete a post
   * @param communityId - Community ID
   * @param postId - Post document ID
   * @param userId - User ID (must be author)
   * @returns Promise<void>
   * @throws AppError if post not found or user unauthorized
   */
  static async deletePost(
    communityId: string,
    postId: string,
    userId: string
  ): Promise<void> {
    try {
      if (!communityId || !postId || !userId) {
        throw new AppError(400, 'Community ID, post ID, and user ID are required');
      }

      const postDocRef = doc(
        db,
        FIRESTORE_COLLECTIONS.COMMUNITIES,
        communityId,
        FIRESTORE_COLLECTIONS.POSTS,
        postId
      );

      const postSnapshot = await getDoc(postDocRef);

      if (!postSnapshot.exists()) {
        throw new AppError(404, 'Post not found');
      }

      const postData = postSnapshot.data() as Post;

      // Check authorization (author only)
      if (postData.authorId !== userId) {
        throw new AppError(403, 'Only post author can delete post');
      }

      // Delete post document
      await deleteDoc(postDocRef);

      // TODO: In production, also delete all comments and votes
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to delete post');
    }
  }

  /**
   * Vote on a post
   * @param communityId - Community ID
   * @param postId - Post document ID
   * @param userId - User ID
   * @param voteType - 'upvote' or 'downvote'
   * @returns Promise<void>
   * @throws AppError if validation fails
   */
  static async votePost(
    communityId: string,
    postId: string,
    userId: string,
    voteType: 'upvote' | 'downvote'
  ): Promise<void> {
    try {
      if (!communityId || !postId || !userId) {
        throw new AppError(400, 'Community ID, post ID, and user ID are required');
      }

      if (!['upvote', 'downvote'].includes(voteType)) {
        throw new AppError(400, 'Vote type must be either upvote or downvote');
      }

      const postDocRef = doc(
        db,
        FIRESTORE_COLLECTIONS.COMMUNITIES,
        communityId,
        FIRESTORE_COLLECTIONS.POSTS,
        postId
      );

      const postSnapshot = await getDoc(postDocRef);

      if (!postSnapshot.exists()) {
        throw new AppError(404, 'Post not found');
      }

      const postData = postSnapshot.data() as Post;
      const userVotes = { ...(postData.userVotes || {}) }; // Create a copy
      const currentVote = userVotes[userId] || null;

      // Get current vote counts
      const currentUpvotes = postData.votes?.upvotes || 0;
      const currentDownvotes = postData.votes?.downvotes || 0;

      // Calculate new vote counts based on the action
      let newUpvotes = currentUpvotes;
      let newDownvotes = currentDownvotes;

      if (currentVote === null) {
        // User hasn't voted yet - add new vote
        if (voteType === 'upvote') {
          newUpvotes = currentUpvotes + 1;
          userVotes[userId] = 'upvote';
        } else {
          newDownvotes = currentDownvotes + 1;
          userVotes[userId] = 'downvote';
        }
      } else if (currentVote === voteType) {
        // User is clicking the same vote - remove it
        if (voteType === 'upvote') {
          newUpvotes = Math.max(0, currentUpvotes - 1);
        } else {
          newDownvotes = Math.max(0, currentDownvotes - 1);
        }
        delete userVotes[userId];
      } else {
        // User is switching vote type
        if (currentVote === 'upvote' && voteType === 'downvote') {
          // Switch from upvote to downvote
          newUpvotes = Math.max(0, currentUpvotes - 1);
          newDownvotes = currentDownvotes + 1;
          userVotes[userId] = 'downvote';
        } else if (currentVote === 'downvote' && voteType === 'upvote') {
          // Switch from downvote to upvote
          newDownvotes = Math.max(0, currentDownvotes - 1);
          newUpvotes = currentUpvotes + 1;
          userVotes[userId] = 'upvote';
        }
      }

      // Ensure votes never go negative
      newUpvotes = Math.max(0, newUpvotes);
      newDownvotes = Math.max(0, newDownvotes);

      await updateDoc(postDocRef, {
        'votes.upvotes': newUpvotes,
        'votes.downvotes': newDownvotes,
        'votes.totalVotes': newUpvotes - newDownvotes,
        userVotes: userVotes,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to vote on post');
    }
  }

  /**
   * Record a post view
   * @param communityId - Community ID
   * @param postId - Post document ID
   * @param userId - User ID
   * @returns Promise<void>
   * @throws AppError if update fails
   */
  static async recordPostView(
    communityId: string,
    postId: string,
    userId: string
  ): Promise<void> {
    try {
      if (!communityId || !postId || !userId) {
        throw new AppError(400, 'Community ID, post ID, and user ID are required');
      }

      const postDocRef = doc(
        db,
        FIRESTORE_COLLECTIONS.COMMUNITIES,
        communityId,
        FIRESTORE_COLLECTIONS.POSTS,
        postId
      );

      const postSnapshot = await getDoc(postDocRef);

      if (!postSnapshot.exists()) {
        throw new AppError(404, 'Post not found');
      }

      const postData = postSnapshot.data() as Post;
      const viewedBy = postData.viewedBy || {};

      // Only count view if user hasn't viewed recently (within 1 hour)
      const lastViewTime = viewedBy[userId];
      const now = Timestamp.now();

      // Check if user hasn't viewed or if last view was more than 1 hour ago
      let shouldRecordView = !lastViewTime;
      if (lastViewTime && lastViewTime instanceof Timestamp) {
        shouldRecordView = (now.toMillis() - lastViewTime.toMillis()) > 3600000;
      }

      if (shouldRecordView) {
        viewedBy[userId] = now;
        const currentViews = postData.views || 0;

        await updateDoc(postDocRef, {
          views: currentViews + 1,
          viewedBy: viewedBy,
          updatedAt: now,
        });
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to record post view');
    }
  }

  /**
   * Report a post as spam
   * @param communityId - Community ID
   * @param postId - Post document ID
   * @returns Promise<void>
   * @throws AppError if update fails
   */
  static async reportPostAsSpam(communityId: string, postId: string): Promise<void> {
    try {
      if (!communityId || !postId) {
        throw new AppError(400, 'Community ID and post ID are required');
      }

      const postDocRef = doc(
        db,
        FIRESTORE_COLLECTIONS.COMMUNITIES,
        communityId,
        FIRESTORE_COLLECTIONS.POSTS,
        postId
      );

      await updateDoc(postDocRef, {
        isSpamReported: true,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to report post');
    }
  }
  /**
   * Get all posts by a specific user across all communities
   * @param userId - User ID
   * @returns Promise<Post[]>
   */
  static async getUserPosts(userId: string): Promise<Post[]> {
    try {
      // Note: This query requires a Collection Group Index on authorId if used with sorting
      // For now, we fetch and sort in memory to minimize index requirements
      const postsQuery = query(
        collectionGroup(db, FIRESTORE_COLLECTIONS.POSTS),
        where('authorId', '==', userId)
      );

      const snapshot = await getDocs(postsQuery);
      const posts: any[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by createdAt desc in memory (before serialization)
      posts.sort((a, b) => {
        const dateA = a.createdAt?.toMillis?.() || 0;
        const dateB = b.createdAt?.toMillis?.() || 0;
        return dateB - dateA;
      });

      // Serialize posts for Redux storage
      return serializePosts(posts);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, error instanceof Error ? error.message : 'Failed to fetch user posts');
    }
  }
}
