/**
 * Community Type Definitions
 * Defines all interfaces related to communities functionality
 */

import { Timestamp } from 'firebase/firestore';

export type CommunityVisibility = 'public' | 'private';
export type MemberRole = 'member' | 'moderator' | 'admin';
export type PostType = 'question' | 'discussion' | 'resource';
export type PostStatus = 'draft' | 'published' | 'archived';

/**
 * Community interface - Represents a community document
 */
export interface Community {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: string; // e.g., 'frontend', 'backend', 'general'
  iconColor: string; // Hex color for community icon
  visibility: CommunityVisibility;

  // Ownership & Moderation
  ownerId: string;
  ownerName: string;
  moderatorIds: string[];

  // Membership
  members: Record<string, MemberInfo>;
  memberCount: number;

  // Content Stats (denormalized)
  stats: {
    postsCount: number;
    commentsCount: number;
    viewsCount: number;
  };

  // Rules & Guidelines
  rules?: string[];
  guidelines?: string;

  // Metadata
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
  lastActivityAt: Timestamp | string;
}

/**
 * Member information within a community
 */
export interface MemberInfo {
  joinedDate: Timestamp | string;
  role: MemberRole;
}

/**
 * Request interface for creating a community
 */
export interface CreateCommunityRequest {
  name: string;
  description: string;
  tags: string[];
  category: string;
  iconColor: string;
  visibility: CommunityVisibility;
  rules?: string[];
  guidelines?: string;
}

/**
 * Request interface for updating a community
 */
export interface UpdateCommunityRequest {
  name?: string;
  description?: string;
  tags?: string[];
  category?: string;
  iconColor?: string;
  visibility?: CommunityVisibility;
  rules?: string[];
  guidelines?: string;
}

/**
 * User's community join record
 */
export interface UserCommunityJoin {
  userId: string;
  communityId: string;
  communityName: string;
  joinedDate: Timestamp;
  role: MemberRole;
}

/**
 * Community statistics for display
 */
export interface CommunityStats {
  memberCount: number;
  postsCount: number;
  viewsCount: number;
  isUserMember: boolean;
  userRole?: MemberRole;
}

/**
 * Post interface - Represents a post document
 * 
 * Note: Timestamp fields (createdAt, updatedAt, publishedAt, viewedBy) can be either:
 * - Firestore Timestamp objects when fetched directly from Firestore
 * - ISO date strings when stored in Redux state (for serialization compatibility)
 * 
 * The PostService automatically serializes Timestamps to strings before returning posts.
 */
export interface Post {
  id: string;
  title: string;
  description: string;
  content: string; // Main post content (can be Markdown)

  // Author Information
  authorId: string;
  authorName: string;
  authorProfilePicture?: string;

  // Categorization
  type: PostType;
  tags: string[];

  // Code Snippet (optional)
  codeSnippet?: {
    language: string;
    code: string;
  };

  // Media
  images?: string[]; // Firebase Storage URLs
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;

  // Engagement
  votes: {
    upvotes: number;
    downvotes: number;
    totalVotes: number; // upvotes - downvotes
  };

  userVotes: Record<string, 'upvote' | 'downvote'>; // userId -> vote type

  comments: {
    count: number;
    totalReplies: number;
  };

  views: number;

  // Status
  status: PostStatus;
  isAnswered?: boolean;
  answerId?: string;
  isSpamReported?: boolean;

  // Publishing
  createdAt: Timestamp | string;
  updatedAt: Timestamp | string;
  publishedAt?: Timestamp | string;

  // Analytics
  viewedBy: Record<string, Timestamp | string>; // userId -> timestamp
  sharedCount: number;
}

/**
 * Request interface for creating a post
 */
export interface CreatePostRequest {
  title: string;
  description: string;
  content: string;
  type: PostType;
  tags: string[];
  codeSnippet?: {
    language: string;
    code: string;
  };
  images?: string[];
}

/**
 * Request interface for updating a post
 */
export interface UpdatePostRequest {
  title?: string;
  description?: string;
  content?: string;
  type?: PostType;
  tags?: string[];
  codeSnippet?: {
    language: string;
    code: string;
  };
  status?: PostStatus;
}

/**
 * Vote information
 */
export interface PostVote {
  userId: string;
  postId: string;
  communityId: string;
  voteType: 'upvote' | 'downvote';
  createdAt: Timestamp;
}

/**
 * Post view information
 */
export interface PostView {
  userId: string;
  postId: string;
  communityId: string;
  viewedAt: Timestamp;
}

/**
 * Comment interface (structure for Sprint 3)
 */
export interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorProfilePicture?: string;

  votes: {
    upvotes: number;
    downvotes: number;
  };

  replies: number;

  createdAt: Timestamp;
  updatedAt: Timestamp;
  isEdited: boolean;
}

/**
 * Post statistics for display
 */
export interface PostStats {
  upvotes: number;
  downvotes: number;
  totalVotes: number;
  views: number;
  comments: number;
  userVote?: 'upvote' | 'downvote';
}

/**
 * Extended profile type (updates to user.types.ts)
 */
export interface UserProfile extends Record<string, any> {
  stats: {
    postsCount: number;
    communitiesJoined: number;
    followersCount: number;
    followingCount: number;
  };
}
