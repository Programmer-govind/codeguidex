import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '@config/firebase.config';
import { LoginCredentials, SignupCredentials, AuthResponse, User } from '../types/user.types';
import { ProfileService } from './profile.service';

const googleProvider = new GoogleAuthProvider();

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'demo-api-key'
  );
};

export class AuthService {
  static async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const user: User = {
        id: userCredential.user.uid,
        email: credentials.email,
        displayName: credentials.displayName,
        role: credentials.role,
        joinedDate: new Date().toISOString(),
        lastActive: new Date().toISOString(),
      };

      // Create user profile in Firestore
      await ProfileService.createProfile(user);

      const token = await userCredential.user.getIdToken();
      const refreshToken = userCredential.user.refreshToken;

      return {
        user,
        token,
        refreshToken,
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );

      const token = await userCredential.user.getIdToken();
      const refreshToken = userCredential.user.refreshToken;

      let user: User;

      try {
        // Attempt to fetch the existing profile to get the correct role
        user = await ProfileService.getProfile(userCredential.user.uid);
      } catch (error) {
        console.warn('Profile fetch failed during login, falling back to basic info:', error);
        // Fallback to basic user info if profile fetch fails
        user = {
          id: userCredential.user.uid,
          email: userCredential.user.email || '',
          displayName: userCredential.user.displayName || 'User',
          joinedDate: new Date(userCredential.user.metadata.creationTime || Date.now()).toISOString(),
          lastActive: new Date().toISOString(),
          role: credentials.email === 'admin448@codeguidex.com' ? 'admin' : 'student',
        };

        // Ensure user profile exists in Firestore (don't block login)
        ProfileService.createProfile(user).catch((error) => {
          console.warn('Profile creation failed, but login succeeded:', error.message);
        });
      }

      return {
        user,
        token,
        refreshToken,
      };
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async loginWithGoogle(): Promise<AuthResponse> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.');
    }

    try {
      // Configure Google provider
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });

      // Try popup authentication first
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const refreshToken = result.user.refreshToken;

      let user: User;

      try {
        user = await ProfileService.getProfile(result.user.uid);
      } catch (error) {
        user = {
          id: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || 'Google User',
          profilePicture: result.user.photoURL || undefined,
          joinedDate: new Date(result.user.metadata.creationTime || Date.now()).toISOString(),
          lastActive: new Date().toISOString(),
          role: result.user.email === 'admin448@codeguidex.com' ? 'admin' : 'student',
        };

        // Ensure user profile exists in Firestore
        await ProfileService.createProfile(user);
      }

      return {
        user,
        token,
        refreshToken,
      };
    } catch (error: any) {
      // Handle various popup-related errors
      if (error.code === 'auth/popup-blocked' ||
        error.code === 'auth/popup-closed-by-user' ||
        error.message.includes('Cross-Origin-Opener-Policy') ||
        error.message.includes('blocked') ||
        error.message.includes('denied') ||
        error.message.includes('COOP')) {
        try {
          // Fallback to redirect authentication
          await signInWithRedirect(auth, googleProvider);
          // This will redirect the user, so we can't return data here
          // The result will be handled in the component that checks for redirect result
          throw new Error('REDIRECT_INITIATED');
        } catch (redirectError: any) {
          throw new Error('Google login failed. Please try again or use a different browser.');
        }
      }

      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async handleGoogleRedirectResult(): Promise<AuthResponse | null> {
    if (!isFirebaseConfigured()) {
      return null;
    }

    try {
      const result = await getRedirectResult(auth);

      if (result) {
        const token = await result.user.getIdToken();
        const refreshToken = result.user.refreshToken;

        let user: User;

        try {
          user = await ProfileService.getProfile(result.user.uid);
        } catch (error) {
          user = {
            id: result.user.uid,
            email: result.user.email || '',
            displayName: result.user.displayName || 'Google User',
            profilePicture: result.user.photoURL || undefined,
            joinedDate: new Date(result.user.metadata.creationTime || Date.now()).toISOString(),
            lastActive: new Date().toISOString(),
            role: result.user.email === 'admin448@codeguidex.com' ? 'admin' : 'student',
          };

          // Ensure user profile exists in Firestore (don't block login)
          ProfileService.createProfile(user).catch((error) => {
            console.warn('Profile creation failed, but login succeeded:', error.message);
          });
        }

        return {
          user,
          token,
          refreshToken,
        };
      }

      return null;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async sendPasswordReset(email: string): Promise<void> {
    if (!isFirebaseConfigured()) {
      throw new Error('Firebase is not properly configured. Please check your environment variables.');
    }

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static getErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'User not found. Please check your email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'Email already in use. Please use a different email.',
      'auth/weak-password': 'Password must be at least 6 characters long.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/too-many-requests': 'Too many login attempts. Please try again later.',
      'auth/configuration-not-found': 'Firebase is not properly configured. Please check your environment variables.',
    };

    return errorMessages[errorCode] || 'An error occurred. Please try again.';
  }
}
