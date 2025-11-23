import { app, auth, db } from '@/config/firebase.config';

export function testFirebaseConnection() {
  try {
    console.log('Firebase app initialized:', app.name);
    console.log('Auth initialized:', !!auth);
    console.log('Firestore initialized:', !!db);
    console.log('Firebase config:', {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
}