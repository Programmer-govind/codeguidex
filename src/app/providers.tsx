'use client';

import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/config/firebase.config';
import { store, persistor } from '@/store/store';
import { setAuthenticatedUser, clearAuth, setLoading } from '@/store/slices/authSlice';
import { UserRole } from '@/types/user.types';
import { ProfileService } from '@/services/profile.service';

/**
 * Auth State Listener Component
 * Monitors Firebase auth state changes and updates Redux store
 */
function AuthStateListener() {
  useEffect(() => {
    // Set loading to true when starting auth check
    store.dispatch(setLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          try {
            const token = await firebaseUser.getIdToken();

            let user;

            try {
              user = await ProfileService.getProfile(firebaseUser.uid);
            } catch (profileError: any) {
              // If profile doesn't exist or fetch fails, use basic info
              console.warn('User profile not found or fetch failed, using basic info:', profileError.message);

              // For admin users, set the correct role
              const isAdmin = firebaseUser.email === 'admin448@codeguidex.com';
              const userRole: UserRole = isAdmin ? 'admin' : 'student';

              const basicUser = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                displayName: firebaseUser.displayName || 'User',
                profilePicture: firebaseUser.photoURL || undefined,
                joinedDate: new Date(firebaseUser.metadata.creationTime || Date.now()).toISOString(),
                lastActive: new Date().toISOString(),
                role: userRole,
              };

              user = basicUser;

              // Try to create profile asynchronously (don't block login)
              ProfileService.createProfile(basicUser).catch((createError: any) => {
                console.warn('Failed to create profile asynchronously:', createError.message);
              });
            }

            store.dispatch(setAuthenticatedUser({ user, token }));
          } catch (error) {
            console.error('Error getting auth token or setting user:', error);
            // Clear auth on critical errors (like token issues)
            store.dispatch(clearAuth());
          }
        } else {
          // User is signed out
          store.dispatch(clearAuth());
        }
      } catch (error) {
        console.error('Error in auth state listener:', error);
        store.dispatch(clearAuth());
      }
    });

    // Set a timeout to ensure loading doesn't get stuck
    const timeoutId = setTimeout(() => {
      console.warn('Auth state listener timeout - forcing loading to false');
      store.dispatch(setLoading(false));
    }, 10000); // 10 second timeout

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  return null;
}

/**
 * Redux Provider wrapper component for client-side state management
 * Wraps the entire application to provide Redux store access
 * Includes PersistGate to rehydrate persisted state from localStorage
 */
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        }
        persistor={persistor}
      >
        <AuthStateListener />
        {children}
      </PersistGate>
    </Provider>
  );
}

