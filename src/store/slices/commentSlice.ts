import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import commentService, { Comment, CreateCommentInput, UpdateCommentInput } from '@services/comment.service';

export interface CommentState {
  comments: Comment[];
  currentComment: Comment | null;
  replies: Record<string, Comment[]>; // commentId -> replies
  loading: boolean;
  error: string | null;
  pagination: {
    lastDoc: any;
    hasMore: boolean;
  };
}

const initialState: CommentState = {
  comments: [],
  currentComment: null,
  replies: {},
  loading: false,
  error: null,
  pagination: {
    lastDoc: null,
    hasMore: true,
  },
};

// Async Thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (
    {
      communityId,
      postId,
      pageSize,
      startAfterDoc,
    }: {
      communityId: string;
      postId: string;
      pageSize?: number;
      startAfterDoc?: any;
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await commentService.getComments(
        communityId,
        postId,
        pageSize,
        startAfterDoc
      );
      return result;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchReplies = createAsyncThunk(
  'comments/fetchReplies',
  async (
    {
      communityId,
      postId,
      parentCommentId,
    }: {
      communityId: string;
      postId: string;
      parentCommentId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const replies = await commentService.getReplies(
        communityId,
        postId,
        parentCommentId
      );
      return { parentCommentId, replies };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (
    {
      communityId,
      postId,
      commentData,
    }: {
      communityId: string;
      postId: string;
      commentData: CreateCommentInput;
    },
    { rejectWithValue }
  ) => {
    try {
      const comment = await commentService.createComment(
        communityId,
        postId,
        commentData
      );

      // If this is a reply, increment parent's reply count
      if (commentData.parentCommentId) {
        await commentService.incrementReplyCount(
          communityId,
          postId,
          commentData.parentCommentId
        );
      }

      return comment;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async (
    {
      communityId,
      postId,
      commentId,
      updates,
    }: {
      communityId: string;
      postId: string;
      commentId: string;
      updates: UpdateCommentInput;
    },
    { rejectWithValue }
  ) => {
    try {
      await commentService.updateComment(
        communityId,
        postId,
        commentId,
        updates
      );
      return { commentId, updates };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (
    {
      communityId,
      postId,
      commentId,
      parentCommentId,
    }: {
      communityId: string;
      postId: string;
      commentId: string;
      parentCommentId?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await commentService.deleteComment(communityId, postId, commentId);

      // If this is a reply, decrement parent's reply count
      if (parentCommentId) {
        await commentService.decrementReplyCount(
          communityId,
          postId,
          parentCommentId
        );
      }

      return commentId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const upvoteComment = createAsyncThunk(
  'comments/upvoteComment',
  async (
    {
      communityId,
      postId,
      commentId,
      userId,
    }: {
      communityId: string;
      postId: string;
      commentId: string;
      userId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await commentService.upvoteComment(
        communityId,
        postId,
        commentId,
        userId
      );
      return { commentId, userId, voteType: 'upvote' };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const downvoteComment = createAsyncThunk(
  'comments/downvoteComment',
  async (
    {
      communityId,
      postId,
      commentId,
      userId,
    }: {
      communityId: string;
      postId: string;
      commentId: string;
      userId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await commentService.downvoteComment(
        communityId,
        postId,
        commentId,
        userId
      );
      return { commentId, userId, voteType: 'downvote' };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCommentVote = createAsyncThunk(
  'comments/removeCommentVote',
  async (
    {
      communityId,
      postId,
      commentId,
      userId,
    }: {
      communityId: string;
      postId: string;
      commentId: string;
      userId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      await commentService.removeCommentVote(
        communityId,
        postId,
        commentId,
        userId
      );
      return { commentId, userId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearComments: (state) => {
      state.comments = [];
      state.currentComment = null;
      state.replies = {};
      state.error = null;
      state.pagination = {
        lastDoc: null,
        hasMore: true,
      };
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // fetchComments
    builder
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.comments;
        state.pagination.lastDoc = action.payload.lastDoc;
        state.pagination.hasMore = !!action.payload.lastDoc;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchReplies
    builder
      .addCase(fetchReplies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReplies.fulfilled, (state, action) => {
        state.loading = false;
        const { parentCommentId, replies } = action.payload;
        state.replies[parentCommentId] = replies;
      })
      .addCase(fetchReplies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // createComment
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        // Add new comment to the beginning if it's a top-level comment
        if (!action.payload.parentCommentId) {
          state.comments.unshift(action.payload);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // updateComment
    builder
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        const { commentId, updates } = action.payload;
        const comment = state.comments.find((c) => c.id === commentId);
        if (comment) {
          Object.assign(comment, updates, { isEdited: true });
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // deleteComment
    builder
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = state.comments.filter(
          (c: Comment) => c.id !== action.payload
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // upvoteComment
    builder
      .addCase(upvoteComment.pending, (state) => {
        state.error = null;
      })
      .addCase(upvoteComment.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(upvoteComment.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // downvoteComment
    builder
      .addCase(downvoteComment.pending, (state) => {
        state.error = null;
      })
      .addCase(downvoteComment.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(downvoteComment.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // removeCommentVote
    builder
      .addCase(removeCommentVote.pending, (state) => {
        state.error = null;
      })
      .addCase(removeCommentVote.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(removeCommentVote.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearComments, setError } = commentSlice.actions;
export default commentSlice.reducer;
