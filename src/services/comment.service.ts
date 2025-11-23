import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  increment,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@config/firebase.config';
import { triggerPostCommentNotification, triggerCommentReplyNotification } from '@utils/notification-triggers';

export interface CreateCommentInput {
  content: string;
  authorId: string;
  authorName: string;
  authorProfilePicture?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  parentCommentId?: string;
}

export interface UpdateCommentInput {
  content?: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
}

export interface Comment extends CreateCommentInput {
  id: string;
  postId: string;
  communityId: string;
  votes: {
    upvotes: number;
    downvotes: number;
    totalVotes: number;
  };
  userVotes: Record<string, 'upvote' | 'downvote'>;
  replyCount: number;
  isEdited: boolean;
  isDeleted?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  deletedAt?: Timestamp;
}

class CommentService {
  async createComment(
    communityId: string,
    postId: string,
    commentData: CreateCommentInput
  ): Promise<Comment> {
    try {
      const commentsRef = collection(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments'
      );

      const commentToCreate = {
        ...commentData,
        parentCommentId: commentData.parentCommentId || null, // Explicitly set to null if not provided
        votes: {
          upvotes: 0,
          downvotes: 0,
          totalVotes: 0,
        },
        userVotes: {},
        replyCount: 0,
        isEdited: false,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(commentsRef, commentToCreate);

      const newComment = {
        id: docRef.id,
        postId,
        communityId,
        ...commentToCreate,
      } as Comment;

      // Get post details to notify post owner
      try {
        const postRef = doc(db, 'communities', communityId, 'posts', postId);
        const postSnap = await getDoc(postRef);
        if (postSnap.exists()) {
          const postData = postSnap.data();

          // Trigger notification based on whether this is a reply or main comment
          if (commentData.parentCommentId) {
            // This is a reply - notify the parent comment owner
            const parentRef = doc(
              db,
              'communities',
              communityId,
              'posts',
              postId,
              'comments',
              commentData.parentCommentId
            );
            const parentSnap = await getDoc(parentRef);
            if (parentSnap.exists()) {
              const parentData = parentSnap.data();
              if (parentData.authorId && parentData.authorId !== commentData.authorId) {
                await triggerCommentReplyNotification(
                  parentData.authorId,
                  commentData.authorName,
                  commentData.authorProfilePicture || '',
                  commentData.authorId,
                  communityId,
                  postId,
                  commentData.parentCommentId,
                  newComment.id
                );
              }
            }
          } else {
            // This is a main comment - notify the post owner
            if (postData?.author && postData.author !== commentData.authorId) {
              await triggerPostCommentNotification(
                postData.author,
                commentData.authorName,
                commentData.authorProfilePicture || '',
                commentData.authorId,
                postData.title,
                communityId,
                postId,
                newComment.id
              );
            }
          }
        }
      } catch (notificationError) {
        console.warn('Error triggering notification:', notificationError);
        // Don't fail the comment creation if notification fails
      }

      return newComment;
    } catch (error) {
      console.error('Error creating comment:', error);
      throw new Error('Failed to create comment');
    }
  }

  async getComments(
    communityId: string,
    postId: string,
    pageSize: number = 20,
    startAfterDoc?: any
  ): Promise<{ comments: Comment[]; lastDoc: any }> {
    try {
      const commentsRef = collection(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments'
      );

      const constraints: QueryConstraint[] = [
        where('parentCommentId', '==', null),
        orderBy('createdAt', 'desc'),
        limit(pageSize + 1),
      ];

      if (startAfterDoc) {
        constraints.push(startAfter(startAfterDoc));
      }

      const q = query(commentsRef, ...constraints);
      const querySnapshot = await getDocs(q);

      const comments: Comment[] = [];
      let lastDoc = null;
      const docs = querySnapshot.docs;

      for (let i = 0; i < docs.length; i++) {
        const docSnapshot = docs[i];
        if (i < pageSize) {
          comments.push({
            id: docSnapshot.id,
            postId,
            communityId,
            ...docSnapshot.data(),
          } as Comment);
        }
        if (i === pageSize - 1) {
          lastDoc = docSnapshot;
        }
      }

      return { comments, lastDoc };
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw new Error('Failed to fetch comments');
    }
  }

  async getReplies(
    communityId: string,
    postId: string,
    parentCommentId: string,
    pageSize: number = 10
  ): Promise<Comment[]> {
    try {
      const commentsRef = collection(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments'
      );

      const q = query(
        commentsRef,
        where('parentCommentId', '==', parentCommentId),
        orderBy('createdAt', 'asc'),
        limit(pageSize)
      );

      const querySnapshot = await getDocs(q);
      const replies: Comment[] = [];

      querySnapshot.forEach((doc) => {
        replies.push({
          id: doc.id,
          postId,
          communityId,
          ...doc.data(),
        } as Comment);
      });

      return replies;
    } catch (error) {
      console.error('Error fetching replies:', error);
      throw new Error('Failed to fetch replies');
    }
  }

  async getComment(
    communityId: string,
    postId: string,
    commentId: string
  ): Promise<Comment | null> {
    try {
      const commentRef = doc(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments',
        commentId
      );

      const docSnapshot = await getDoc(commentRef);

      if (!docSnapshot.exists()) {
        return null;
      }

      return {
        id: docSnapshot.id,
        postId,
        communityId,
        ...docSnapshot.data(),
      } as Comment;
    } catch (error) {
      console.error('Error fetching comment:', error);
      throw new Error('Failed to fetch comment');
    }
  }

  async updateComment(
    communityId: string,
    postId: string,
    commentId: string,
    updates: UpdateCommentInput
  ): Promise<void> {
    try {
      const commentRef = doc(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments',
        commentId
      );

      await updateDoc(commentRef, {
        ...updates,
        isEdited: true,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating comment:', error);
      throw new Error('Failed to update comment');
    }
  }

  async deleteComment(
    communityId: string,
    postId: string,
    commentId: string
  ): Promise<void> {
    try {
      const commentRef = doc(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments',
        commentId
      );

      await updateDoc(commentRef, {
        isDeleted: true,
        deletedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw new Error('Failed to delete comment');
    }
  }

  async upvoteComment(
    communityId: string,
    postId: string,
    commentId: string,
    userId: string
  ): Promise<void> {
    try {
      const commentRef = doc(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments',
        commentId
      );

      const comment = await getDoc(commentRef);

      if (!comment.exists()) {
        throw new Error('Comment not found');
      }

      const currentVote = comment.data()?.userVotes?.[userId];

      if (currentVote === 'upvote') {
        await updateDoc(commentRef, {
          'votes.upvotes': increment(-1),
          'votes.totalVotes': increment(-1),
          [`userVotes.${userId}`]: null,
        });
      } else if (currentVote === 'downvote') {
        await updateDoc(commentRef, {
          'votes.upvotes': increment(1),
          'votes.downvotes': increment(-1),
          'votes.totalVotes': increment(2),
          [`userVotes.${userId}`]: 'upvote',
        });
      } else {
        await updateDoc(commentRef, {
          'votes.upvotes': increment(1),
          'votes.totalVotes': increment(1),
          [`userVotes.${userId}`]: 'upvote',
        });
      }
    } catch (error) {
      console.error('Error upvoting comment:', error);
      throw new Error('Failed to upvote comment');
    }
  }

  async downvoteComment(
    communityId: string,
    postId: string,
    commentId: string,
    userId: string
  ): Promise<void> {
    try {
      const commentRef = doc(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments',
        commentId
      );

      const comment = await getDoc(commentRef);

      if (!comment.exists()) {
        throw new Error('Comment not found');
      }

      const currentVote = comment.data()?.userVotes?.[userId];

      if (currentVote === 'downvote') {
        await updateDoc(commentRef, {
          'votes.downvotes': increment(-1),
          'votes.totalVotes': increment(1),
          [`userVotes.${userId}`]: null,
        });
      } else if (currentVote === 'upvote') {
        await updateDoc(commentRef, {
          'votes.upvotes': increment(-1),
          'votes.downvotes': increment(1),
          'votes.totalVotes': increment(-2),
          [`userVotes.${userId}`]: 'downvote',
        });
      } else {
        await updateDoc(commentRef, {
          'votes.downvotes': increment(1),
          'votes.totalVotes': increment(-1),
          [`userVotes.${userId}`]: 'downvote',
        });
      }
    } catch (error) {
      console.error('Error downvoting comment:', error);
      throw new Error('Failed to downvote comment');
    }
  }

  async removeCommentVote(
    communityId: string,
    postId: string,
    commentId: string,
    userId: string
  ): Promise<void> {
    try {
      const commentRef = doc(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments',
        commentId
      );

      const comment = await getDoc(commentRef);

      if (!comment.exists()) {
        throw new Error('Comment not found');
      }

      const currentVote = comment.data()?.userVotes?.[userId];

      if (currentVote === 'upvote') {
        await updateDoc(commentRef, {
          'votes.upvotes': increment(-1),
          'votes.totalVotes': increment(-1),
          [`userVotes.${userId}`]: null,
        });
      } else if (currentVote === 'downvote') {
        await updateDoc(commentRef, {
          'votes.downvotes': increment(-1),
          'votes.totalVotes': increment(1),
          [`userVotes.${userId}`]: null,
        });
      }
    } catch (error) {
      console.error('Error removing comment vote:', error);
      throw new Error('Failed to remove vote');
    }
  }

  async incrementReplyCount(
    communityId: string,
    postId: string,
    commentId: string
  ): Promise<void> {
    try {
      const commentRef = doc(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments',
        commentId
      );

      await updateDoc(commentRef, {
        replyCount: increment(1),
      });
    } catch (error) {
      console.error('Error incrementing reply count:', error);
      throw new Error('Failed to increment reply count');
    }
  }

  async decrementReplyCount(
    communityId: string,
    postId: string,
    commentId: string
  ): Promise<void> {
    try {
      const commentRef = doc(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments',
        commentId
      );

      await updateDoc(commentRef, {
        replyCount: increment(-1),
      });
    } catch (error) {
      console.error('Error decrementing reply count:', error);
      throw new Error('Failed to decrement reply count');
    }
  }

  async getCommentCount(
    communityId: string,
    postId: string
  ): Promise<number> {
    try {
      const commentsRef = collection(
        db,
        'communities',
        communityId,
        'posts',
        postId,
        'comments'
      );

      const q = query(commentsRef, where('parentCommentId', '==', null));
      const querySnapshot = await getDocs(q);

      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting comment count:', error);
      throw new Error('Failed to get comment count');
    }
  }
}

export default new CommentService();
