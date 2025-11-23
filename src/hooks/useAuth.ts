import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setLoading,
  setError,
  setAuthenticatedUser,
  clearAuth,
} from '@/store/slices/authSlice';
import { AuthService } from '@/services/auth.service';

/**
 * Custom hook for authentication operations
 * Handles signup, login, logout, and Google OAuth flows
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  /**
   * Handle user signup
   */
  const signup = useCallback(
    async (displayName: string, email: string, password: string, role: 'student' | 'mentor') => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const response = await AuthService.signup({
          displayName,
          email,
          password,
          role,
        });

        dispatch(
          setAuthenticatedUser({
            user: response.user,
            token: response.token,
          })
        );

        return { success: true, user: response.user };
      } catch (error: any) {
        const errorMessage =
          error instanceof Error ? error.message : 'Signup failed';
        dispatch(setError(errorMessage));
        return { success: false, error: errorMessage };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Handle user login
   */
  const login = useCallback(
    async (email: string, password: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const response = await AuthService.login({
          email,
          password,
        });

        dispatch(
          setAuthenticatedUser({
            user: response.user,
            token: response.token,
          })
        );

        return { success: true, user: response.user };
      } catch (error: any) {
        const errorMessage =
          error instanceof Error ? error.message : 'Login failed';
        dispatch(setError(errorMessage));
        return { success: false, error: errorMessage };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  /**
   * Handle Google OAuth login
   */
  const loginWithGoogle = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await AuthService.loginWithGoogle();

      // Check if redirect was initiated
      if (response.user && response.token) {
        dispatch(
          setAuthenticatedUser({
            user: response.user,
            token: response.token,
          })
        );
        return { success: true, user: response.user };
      } else {
        // Redirect was initiated, result will be handled separately
        return { success: true, redirectInitiated: true };
      }
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Google login failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Handle user logout
   */
  const logout = useCallback(async () => {
    dispatch(setLoading(true));

    try {
      await AuthService.logout();
      dispatch(clearAuth());
      return { success: true };
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Logout failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Handle Google OAuth redirect result
   */
  const handleGoogleRedirectResult = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await AuthService.handleGoogleRedirectResult();

      if (response) {
        dispatch(
          setAuthenticatedUser({
            user: response.user,
            token: response.token,
          })
        );
        return { success: true, user: response.user };
      }

      return { success: false, noResult: true };
    } catch (error: any) {
      const errorMessage =
        error instanceof Error ? error.message : 'Google redirect failed';
      dispatch(setError(errorMessage));
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * Handle password reset
   */
  const resetPassword = useCallback(
    async (email: string) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        await AuthService.sendPasswordReset(email);
        return { success: true };
      } catch (error: any) {
        const errorMessage =
          error instanceof Error ? error.message : 'Password reset failed';
        dispatch(setError(errorMessage));
        return { success: false, error: errorMessage };
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  return {
    ...auth,
    signup,
    login,
    loginWithGoogle,
    handleGoogleRedirectResult,
    logout,
    resetPassword,
  };
}
