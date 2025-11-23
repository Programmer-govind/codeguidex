'use client';

import notificationService, { CreateNotificationInput } from '@services/notification.service';

/**
 * Trigger notification for new comment on a post
 */
export async function triggerPostCommentNotification(
  postOwnerId: string,
  commenterName: string,
  commenterProfilePic: string,
  commenterId: string,
  postTitle: string,
  communityId: string,
  postId: string,
  commentId: string
): Promise<void> {
  try {
    // Don't notify if the commenter is the post owner
    if (postOwnerId === commenterId) return;

    const notificationData: CreateNotificationInput = {
      type: 'post_comment',
      title: 'New Comment',
      message: `${commenterName} commented on your post: "${postTitle}"`,
      relatedId: postId,
      relatedType: 'post',
      communityId,
      postId,
      commentId,
      triggeredById: commenterId,
      triggeredByName: commenterName,
      triggeredByProfilePic: commenterProfilePic,
      priority: 'high',
      actionUrl: `/communities/${communityId}/posts/${postId}#comment-${commentId}`,
      actionLabel: 'View Comment',
    };

    await notificationService.createNotification(postOwnerId, notificationData);
  } catch (error) {
    console.error('Error triggering post comment notification:', error);
  }
}

/**
 * Trigger notification for reply to a comment
 */
export async function triggerCommentReplyNotification(
  commentOwnerId: string,
  replierName: string,
  replierProfilePic: string,
  replierId: string,
  communityId: string,
  postId: string,
  commentId: string,
  replyId: string
): Promise<void> {
  try {
    // Don't notify if the replier is the comment owner
    if (commentOwnerId === replierId) return;

    const notificationData: CreateNotificationInput = {
      type: 'comment_reply',
      title: 'New Reply',
      message: `${replierName} replied to your comment`,
      relatedId: commentId,
      relatedType: 'comment',
      communityId,
      postId,
      commentId,
      triggeredById: replierId,
      triggeredByName: replierName,
      triggeredByProfilePic: replierProfilePic,
      priority: 'high',
      actionUrl: `/communities/${communityId}/posts/${postId}#reply-${replyId}`,
      actionLabel: 'View Reply',
    };

    await notificationService.createNotification(
      commentOwnerId,
      notificationData
    );
  } catch (error) {
    console.error('Error triggering comment reply notification:', error);
  }
}

/**
 * Trigger notification for upvote on comment
 */
export async function triggerCommentUpvoteNotification(
  commentOwnerId: string,
  voterName: string,
  voterId: string,
  communityId: string,
  postId: string,
  commentId: string,
  upvoteCount: number
): Promise<void> {
  try {
    // Don't notify if the voter is the comment owner
    if (commentOwnerId === voterId) return;

    // Only notify for milestones: 1st, 5th, 10th, 25th, 50th upvote
    const milestones = [1, 5, 10, 25, 50, 100, 500, 1000];
    if (!milestones.includes(upvoteCount)) return;

    const notificationData: CreateNotificationInput = {
      type: 'upvote',
      title: 'Comment Popular!',
      message: `Your comment reached ${upvoteCount} upvotes!`,
      relatedId: commentId,
      relatedType: 'comment',
      communityId,
      postId,
      commentId,
      triggeredById: voterId,
      triggeredByName: voterName,
      priority: 'low',
      actionUrl: `/communities/${communityId}/posts/${postId}#comment-${commentId}`,
      actionLabel: 'View Comment',
    };

    await notificationService.createNotification(
      commentOwnerId,
      notificationData
    );
  } catch (error) {
    console.error('Error triggering upvote notification:', error);
  }
}

/**
 * Trigger notification for upvote on post
 */
export async function triggerPostUpvoteNotification(
  postOwnerId: string,
  voterName: string,
  voterId: string,
  postTitle: string,
  communityId: string,
  postId: string,
  upvoteCount: number
): Promise<void> {
  try {
    // Don't notify if the voter is the post owner
    if (postOwnerId === voterId) return;

    // Only notify for milestones
    const milestones = [1, 5, 10, 25, 50, 100];
    if (!milestones.includes(upvoteCount)) return;

    const notificationData: CreateNotificationInput = {
      type: 'upvote',
      title: 'Post Popular!',
      message: `Your post "${postTitle}" reached ${upvoteCount} upvotes!`,
      relatedId: postId,
      relatedType: 'post',
      communityId,
      postId,
      triggeredById: voterId,
      triggeredByName: voterName,
      priority: 'low',
      actionUrl: `/communities/${communityId}/posts/${postId}`,
      actionLabel: 'View Post',
    };

    await notificationService.createNotification(
      postOwnerId,
      notificationData
    );
  } catch (error) {
    console.error('Error triggering post upvote notification:', error);
  }
}

/**
 * Trigger notification for mention in comment
 */
export async function triggerMentionNotification(
  mentionedUserId: string,
  mentionerName: string,
  mentionerId: string,
  mentionerProfilePic: string,
  communityId: string,
  postId: string,
  commentId: string
): Promise<void> {
  try {
    // Don't notify if mentioning yourself
    if (mentionedUserId === mentionerId) return;

    const notificationData: CreateNotificationInput = {
      type: 'mention',
      title: 'You were mentioned',
      message: `${mentionerName} mentioned you in a comment`,
      relatedId: commentId,
      relatedType: 'comment',
      communityId,
      postId,
      commentId,
      triggeredById: mentionerId,
      triggeredByName: mentionerName,
      triggeredByProfilePic: mentionerProfilePic,
      priority: 'high',
      actionUrl: `/communities/${communityId}/posts/${postId}#comment-${commentId}`,
      actionLabel: 'View Mention',
    };

    await notificationService.createNotification(
      mentionedUserId,
      notificationData
    );
  } catch (error) {
    console.error('Error triggering mention notification:', error);
  }
}

/**
 * Trigger notification for new community member join
 */
export async function triggerCommunityJoinNotification(
  communityOwnerId: string,
  joinerName: string,
  joinerId: string,
  joinerProfilePic: string,
  communityId: string,
  communityName: string,
  memberCount: number
): Promise<void> {
  try {
    const notificationData: CreateNotificationInput = {
      type: 'community_activity',
      title: 'New Community Member',
      message: `${joinerName} joined ${communityName}. You now have ${memberCount} members!`,
      relatedId: communityId,
      relatedType: 'community',
      communityId,
      triggeredById: joinerId,
      triggeredByName: joinerName,
      triggeredByProfilePic: joinerProfilePic,
      priority: 'medium',
      actionUrl: `/communities/${communityId}`,
      actionLabel: 'View Community',
    };

    await notificationService.createNotification(
      communityOwnerId,
      notificationData
    );
  } catch (error) {
    console.error('Error triggering community join notification:', error);
  }
}

/**
 * Trigger system notification (admin/system-wide)
 */
export async function triggerSystemNotification(
  userId: string,
  title: string,
  message: string,
  actionUrl?: string,
  actionLabel?: string
): Promise<void> {
  try {
    const notificationData: CreateNotificationInput = {
      type: 'system',
      title,
      message,
      relatedId: 'system',
      relatedType: 'user',
      priority: 'medium',
      actionUrl,
      actionLabel,
    };

    await notificationService.createNotification(userId, notificationData);
  } catch (error) {
    console.error('Error triggering system notification:', error);
  }
}

/**
 * Trigger bookmark notification
 */
export async function triggerBookmarkNotification(
  userId: string,
  bookmarkType: 'post' | 'comment',
  itemTitle: string,
  communityId?: string,
  postId?: string,
  commentId?: string
): Promise<void> {
  try {
    const notificationData: CreateNotificationInput = {
      type: 'bookmark',
      title: 'Bookmark Saved',
      message: `You bookmarked: "${itemTitle}"`,
      relatedId: bookmarkType === 'post' ? postId! : commentId!,
      relatedType: bookmarkType === 'post' ? 'post' : 'comment',
      communityId,
      postId,
      commentId,
      priority: 'low',
      actionUrl:
        bookmarkType === 'post'
          ? `/communities/${communityId}/posts/${postId}`
          : `/communities/${communityId}/posts/${postId}#comment-${commentId}`,
    };

    await notificationService.createNotification(userId, notificationData);
  } catch (error) {
    console.error('Error triggering bookmark notification:', error);
  }
}
