/**
 * Firestore Collections Configuration
 * Defines all collection names and paths used throughout the application
 */

export const FIRESTORE_COLLECTIONS = {
  // Core collections
  USERS: 'users',
  COMMUNITIES: 'communities',
  POSTS: 'posts', // Subcollection path: communities/{communityId}/posts
  COMMENTS: 'comments', // Subcollection path: communities/{communityId}/posts/{postId}/comments

  // Tracking & Relationship collections
  USER_COMMUNITY_JOINS: 'userCommunityJoins',
  USER_POST_VOTES: 'userPostVotes',
  USER_POST_VIEWS: 'userPostViews',

  // Admin collections
  REPORTS: 'reports',
} as const;

export const FIRESTORE_PATHS = {
  // User paths
  user: (userId: string) => `${FIRESTORE_COLLECTIONS.USERS}/${userId}`,

  // Community paths
  community: (communityId: string) => `${FIRESTORE_COLLECTIONS.COMMUNITIES}/${communityId}`,
  communityPosts: (communityId: string) =>
    `${FIRESTORE_COLLECTIONS.COMMUNITIES}/${communityId}/${FIRESTORE_COLLECTIONS.POSTS}`,
  post: (communityId: string, postId: string) =>
    `${FIRESTORE_COLLECTIONS.COMMUNITIES}/${communityId}/${FIRESTORE_COLLECTIONS.POSTS}/${postId}`,
  postComments: (communityId: string, postId: string) =>
    `${FIRESTORE_COLLECTIONS.COMMUNITIES}/${communityId}/${FIRESTORE_COLLECTIONS.POSTS}/${postId}/${FIRESTORE_COLLECTIONS.COMMENTS}`,
  comment: (communityId: string, postId: string, commentId: string) =>
    `${FIRESTORE_COLLECTIONS.COMMUNITIES}/${communityId}/${FIRESTORE_COLLECTIONS.POSTS}/${postId}/${FIRESTORE_COLLECTIONS.COMMENTS}/${commentId}`,

  // User relationship paths
  userCommunityJoin: (userId: string, communityId: string) =>
    `${FIRESTORE_COLLECTIONS.USER_COMMUNITY_JOINS}/${userId}_${communityId}`,
  userPostVote: (userId: string, postId: string) =>
    `${FIRESTORE_COLLECTIONS.USER_POST_VOTES}/${userId}_${postId}`,
  userPostView: (userId: string, postId: string) =>
    `${FIRESTORE_COLLECTIONS.USER_POST_VIEWS}/${userId}_${postId}`,
} as const;

/**
 * Firestore Indexes Required
 * These should be created in Firebase Console for optimal query performance
 */
export const FIRESTORE_INDEXES = [
  {
    collection: FIRESTORE_COLLECTIONS.COMMUNITIES,
    fields: ['visibility', 'createdAt'],
    description: 'Query public communities ordered by creation',
  },
  {
    collection: FIRESTORE_COLLECTIONS.COMMUNITIES,
    fields: ['category', 'memberCount'],
    description: 'Query communities by category and member count',
  },
  {
    collection: `${FIRESTORE_COLLECTIONS.COMMUNITIES}/{communityId}/${FIRESTORE_COLLECTIONS.POSTS}`,
    fields: ['status', 'createdAt'],
    description: 'Query published posts ordered by creation date',
  },
  {
    collection: `${FIRESTORE_COLLECTIONS.COMMUNITIES}/{communityId}/${FIRESTORE_COLLECTIONS.POSTS}`,
    fields: ['status', 'votes.totalVotes'],
    description: 'Query posts by votes (trending)',
  },
  {
    collection: FIRESTORE_COLLECTIONS.USER_COMMUNITY_JOINS,
    fields: ['userId', 'joinedDate'],
    description: 'Query user communities ordered by join date',
  },
  {
    collection: FIRESTORE_COLLECTIONS.USER_POST_VOTES,
    fields: ['userId', 'createdAt'],
    description: 'Query user votes',
  },
] as const;
