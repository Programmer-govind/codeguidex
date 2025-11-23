import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';
import notificationService, { Notification, NotificationType } from '@services/notification.service';

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  lastDoc: any;
  hasMore: boolean;
  filter: {
    isRead?: boolean;
    type?: NotificationType;
  };
  loading: boolean;
  error: string | null;
  operationInProgress: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  lastDoc: null,
  hasMore: true,
  filter: {},
  loading: false,
  error: null,
  operationInProgress: null,
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (
    {
      userId,
      pageSize,
      startAfterDoc,
      filters,
    }: {
      userId: string;
      pageSize?: number;
      startAfterDoc?: any;
      filters?: { isRead?: boolean; type?: NotificationType };
    },
    { rejectWithValue }
  ) => {
    try {
      const result = await notificationService.getNotifications(
        userId,
        pageSize,
        startAfterDoc,
        filters
      );

      return result;
    } catch (error) {
      return rejectWithValue('Failed to fetch notifications');
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const count = await notificationService.getUnreadCount(userId);
      return count;
    } catch (error) {
      return rejectWithValue('Failed to fetch unread count');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (
    { userId, notificationId }: { userId: string; notificationId: string },
    { rejectWithValue }
  ) => {
    try {
      await notificationService.markAsRead(userId, notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue('Failed to mark as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead(userId);
      return null;
    } catch (error) {
      return rejectWithValue('Failed to mark all as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (
    { userId, notificationId }: { userId: string; notificationId: string },
    { rejectWithValue }
  ) => {
    try {
      await notificationService.deleteNotification(userId, notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue('Failed to delete notification');
    }
  }
);

export const deleteMultipleNotifications = createAsyncThunk(
  'notifications/deleteMultiple',
  async (
    { userId, notificationIds }: { userId: string; notificationIds: string[] },
    { rejectWithValue }
  ) => {
    try {
      await notificationService.deleteMultiple(userId, notificationIds);
      return notificationIds;
    } catch (error) {
      return rejectWithValue('Failed to delete notifications');
    }
  }
);

export const clearOldNotifications = createAsyncThunk(
  'notifications/clearOld',
  async ({ userId }: { userId: string }, { rejectWithValue }) => {
    try {
      const deletedCount = await notificationService.clearOldNotifications(
        userId
      );
      return deletedCount;
    } catch (error) {
      return rejectWithValue('Failed to clear old notifications');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setFilter: (
      state,
      action: PayloadAction<{ isRead?: boolean; type?: NotificationType }>
    ) => {
      state.filter = action.payload;
    },
    clearFilter: (state) => {
      state.filter = {};
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.lastDoc = null;
      state.hasMore = true;
      state.error = null;
    },
    addNotificationLocal: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    updateNotificationLocal: (state, action: PayloadAction<Notification>) => {
      const index = state.notifications.findIndex(
        (n) => n.id === action.payload.id
      );
      if (index !== -1) {
        const wasRead = state.notifications[index].isRead;
        state.notifications[index] = action.payload;

        if (!wasRead && action.payload.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    },
  },
  extraReducers: (builder) => {
    // fetchNotifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        const { notifications, lastDoc } = action.payload;

        // If lastDoc is provided, append to existing (pagination)
        if (state.lastDoc) {
          state.notifications.push(...notifications);
        } else {
          // First load
          state.notifications = notifications;
        }

        state.lastDoc = lastDoc;
        state.hasMore = !!lastDoc;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // fetchUnreadCount
    builder
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      })
      .addCase(fetchUnreadCount.rejected, () => {
        // Silently fail on unread count
      });

    // markAsRead
    builder
      .addCase(markAsRead.pending, (state, action) => {
        state.operationInProgress = action.meta.arg.notificationId;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notification = state.notifications.find(
          (n) => n.id === action.payload
        );
        if (notification && !notification.isRead) {
          notification.isRead = true;
          notification.readAt = { toDate: () => new Date() } as any;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.operationInProgress = null;
      })
      .addCase(markAsRead.rejected, (state) => {
        state.operationInProgress = null;
      });

    // markAllAsRead
    builder
      .addCase(markAllAsRead.pending, (state) => {
        state.operationInProgress = 'markAllAsRead';
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach((notification) => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
        state.operationInProgress = null;
      })
      .addCase(markAllAsRead.rejected, (state) => {
        state.operationInProgress = null;
      });

    // deleteNotification
    builder
      .addCase(deleteNotification.pending, (state, action) => {
        state.operationInProgress = action.meta.arg.notificationId;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload
        );
        if (index !== -1) {
          const notification = state.notifications[index];
          if (!notification.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications.splice(index, 1);
        }
        state.operationInProgress = null;
      })
      .addCase(deleteNotification.rejected, (state) => {
        state.operationInProgress = null;
      });

    // deleteMultiple
    builder
      .addCase(deleteMultipleNotifications.pending, (state) => {
        state.operationInProgress = 'deleteMultiple';
      })
      .addCase(deleteMultipleNotifications.fulfilled, (state, action) => {
        const idsToDelete = action.payload;
        state.notifications = state.notifications.filter((n) => {
          if (idsToDelete.includes(n.id)) {
            if (!n.isRead) {
              state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
            return false;
          }
          return true;
        });
        state.operationInProgress = null;
      })
      .addCase(deleteMultipleNotifications.rejected, (state) => {
        state.operationInProgress = null;
      });

    // clearOldNotifications
    builder
      .addCase(clearOldNotifications.pending, (state) => {
        state.operationInProgress = 'clearOld';
      })
      .addCase(clearOldNotifications.fulfilled, (state) => {
        state.operationInProgress = null;
        // Refresh list after clearing
      })
      .addCase(clearOldNotifications.rejected, (state) => {
        state.operationInProgress = null;
      });
  },
});

export const {
  setFilter,
  clearFilter,
  clearNotifications,
  addNotificationLocal,
  updateNotificationLocal,
} = notificationSlice.actions;

export default notificationSlice.reducer;
