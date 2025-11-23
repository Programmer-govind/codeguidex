import { configureStore } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import communityReducer from './slices/communitySlice';
import postReducer from './slices/postSlice';
import profileReducer from './slices/profileSlice';
import commentReducer from './slices/commentSlice';
import notificationReducer from './slices/notificationSlice';
import searchReducer from './slices/searchSlice';
import mentorReducer from './slices/mentorSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // Already wrapped with persistReducer in authSlice.ts
    ui: uiReducer,
    community: communityReducer,
    post: postReducer,
    profile: profileReducer,
    comments: commentReducer,
    notifications: notificationReducer,
    search: searchReducer,
    mentor: mentorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['auth.user.joinedDate', 'auth.user.lastActive'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

