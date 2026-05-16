'use client';

import React, { useEffect, useRef } from 'react';
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
 * Monitors Firebase auth state changes and updates Redux store.
 *
 * Key design: `onAuthStateChanged` fires once on mount AND again on every
 * token refresh (~1 hr). We must NOT call heavy operations like ProfileService
 * on every token refresh — only on actual sign-in/sign-out events.
 *
 * Fix: Track the last known UID in a ref. Only fetch the profile when the
 * UID actually changes (i.e. a real sign-in/sign-out, not a silent refresh).
 */
function AuthStateListener() {
  // Track the last known user ID to detect actual sign-in/sign-out vs token refresh
  const lastUidRef = useRef<string | null>(undefined as any);
  // Track if we're currently in a profile fetch to prevent concurrent calls
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Set loading true once on mount
    store.dispatch(setLoading(true));

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const newUid = firebaseUser?.uid ?? null;

      // --- KEY FIX: Skip if the UID hasn't changed (token silent refresh) ---
      if (lastUidRef.current === newUid) {
        // UID is the same — just a silent token refresh, do nothing
        store.dispatch(setLoading(false));
        return;
      }
      lastUidRef.current = newUid;
      // ---

      // Prevent concurrent profile fetches
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      try {
        if (firebaseUser) {
          // User is signed in — get token & profile
          const token = await firebaseUser.getIdToken();

          let user;
          try {
            user = await ProfileService.getProfile(firebaseUser.uid);
          } catch {
            // Profile not found — build basic user from Firebase Auth data
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

            // Create profile in background — don't block auth
            ProfileService.createProfile(basicUser).catch(() => {});
          }

          store.dispatch(setAuthenticatedUser({ user, token }));
        } else {
          // User is signed out
          store.dispatch(clearAuth());
        }
      } catch (error) {
        console.error('AuthStateListener: Critical error:', error);
        store.dispatch(clearAuth());
      } finally {
        isFetchingRef.current = false;
        store.dispatch(setLoading(false));
      }
    });

    // Safety timeout — ensure loading never gets permanently stuck
    const timeoutId = setTimeout(() => {
      store.dispatch(setLoading(false));
    }, 8000);

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []); // Empty deps — runs exactly once on mount

  return null;
}

/**
 * Redux Provider wrapper with Firebase Auth state management
 */
export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
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
