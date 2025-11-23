/**
* Profile Service
* Handles user profile operations including fetching, updating, and profile picture management
*/

import { doc, getDoc, updateDoc, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import type { User } from '@/types/user.types';
import { AppError } from '@/utils/errorHandling';

/**
 * ProfileService class - Manages user profile operations
 */
export class ProfileService {
  /**
   * Create user profile in Firestore
   * @param user - User data to create
   * @returns Promise<void>
   * @throws AppError if creation fails
   */
  static async createProfile(user: User): Promise<void> {
    try {
      if (!user.id) {
        throw new AppError(400, 'User ID is required');
      }

      const userDocRef = doc(db, 'users', user.id);
      const userSnapshot = await getDoc(userDocRef);

      if (userSnapshot.exists()) {
        // Profile already exists, no need to create
        return;
      }

      // Prepare user data for Firestore
      const userData = {
        ...user,
        joinedDate: Timestamp.fromDate(new Date(user.joinedDate)),
        lastActive: Timestamp.fromDate(new Date(user.lastActive)),
        // Initialize optional fields
        bio: user.bio || '',
        skills: user.skills || [],
        learningGoals: user.learningGoals || [],
        profilePicture: user.profilePicture || null,
        isSuspended: false,
        updatedAt: Timestamp.now(),
      };

      await setDoc(userDocRef, userData);
    } catch (error) {
      // Check if it's a connectivity error - don't throw for these
      if (error instanceof Error &&
        (error.message.includes('offline') ||
          error.message.includes('unavailable') ||
          error.message.includes('network') ||
          error.message.includes('Failed to get document'))) {
        console.warn('Firestore is offline or unreachable, skipping profile creation:', error.message);
        return; // Don't throw error for connectivity issues
      }

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to create profile'
      );
    }
  }

  /**
   * Fetch user profile by user ID
   * @param userId - Firebase Auth UID
   * @returns Promise<User> - User profile data
   * @throws AppError if user not found or database error occurs
   */
  static async getProfile(userId: string): Promise<User> {
    try {
      if (!userId) {
        throw new AppError(400, 'User ID is required');
      }

      const userDocRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        // Profile doesn't exist, try to get user data from Auth
        // This is a fallback - ideally profiles should be created during signup/login
        throw new AppError(404, 'User profile not found');
      }

      const userData = userSnapshot.data();

      // Convert Firestore Timestamps to ISO strings
      const sanitizedData = { ...userData };

      // Helper to convert Timestamp to ISO string
      const convertTimestamp = (val: any) => {
        return val?.toDate ? val.toDate().toISOString() : val;
      };

      // Sanitize known timestamp fields
      if (sanitizedData.joinedDate) sanitizedData.joinedDate = convertTimestamp(sanitizedData.joinedDate);
      if (sanitizedData.lastActive) sanitizedData.lastActive = convertTimestamp(sanitizedData.lastActive);
      if (sanitizedData.updatedAt) sanitizedData.updatedAt = convertTimestamp(sanitizedData.updatedAt);
      if (sanitizedData.createdAt) sanitizedData.createdAt = convertTimestamp(sanitizedData.createdAt);

      return {
        ...sanitizedData,
        // Ensure required fields exist
        joinedDate: sanitizedData.joinedDate || new Date().toISOString(),
        lastActive: sanitizedData.lastActive || new Date().toISOString(),
      } as User;
    } catch (error) {
      // Check if it's a connectivity error
      if (error instanceof Error &&
        (error.message.includes('offline') ||
          error.message.includes('unavailable') ||
          error.message.includes('network'))) {
        console.warn('Firestore is offline, cannot fetch profile:', error.message);
        throw new AppError(503, 'Service temporarily unavailable');
      }

      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to fetch profile'
      );
    }
  }

  /**
   * Update user profile
   * @param userId - Firebase Auth UID
   * @param updateData - Partial user data to update
   * @returns Promise<void>
   * @throws AppError if update fails
   */
  static async updateProfile(
    userId: string,
    updateData: Partial<User>
  ): Promise<void> {
    try {
      if (!userId) {
        throw new AppError(400, 'User ID is required');
      }

      // Validate required fields if provided
      if (updateData.displayName && !updateData.displayName.trim()) {
        throw new AppError(400, 'Display name cannot be empty');
      }

      if (updateData.bio && updateData.bio.length > 500) {
        throw new AppError(400, 'Bio cannot exceed 500 characters');
      }

      if (updateData.skills && !Array.isArray(updateData.skills)) {
        throw new AppError(400, 'Skills must be an array');
      }

      if (updateData.learningGoals && !Array.isArray(updateData.learningGoals)) {
        throw new AppError(400, 'Learning goals must be an array');
      }

      // Prepare update payload
      const updatePayload = {
        ...updateData,
        updatedAt: Timestamp.now(),
        lastActive: Timestamp.now(),
      };

      // Don't allow updating certain fields
      delete (updatePayload as any).id;
      delete (updatePayload as any).email;
      delete (updatePayload as any).role;
      delete (updatePayload as any).joinedDate;
      delete (updatePayload as any).isSuspended;

      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, updatePayload);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to delete profile picture'
      );
    }
  }

  /**
   * Update user profile picture URL
   * @param userId - Firebase Auth UID
   * @param pictureUrl - Firebase Storage URL
   * @returns Promise<void>
   * @throws AppError if update fails
   */
  static async updateProfilePicture(
    userId: string,
    pictureUrl: string
  ): Promise<void> {
    try {
      if (!userId) {
        throw new AppError(400, 'User ID is required');
      }

      if (!pictureUrl) {
        throw new AppError(400, 'Picture URL is required');
      }

      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        profilePicture: pictureUrl,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to update profile picture'
      );
    }
  }

  /**
   * Delete profile picture
   * @param userId - Firebase Auth UID
   * @returns Promise<void>
   * @throws AppError if deletion fails
   */
  static async deleteProfilePicture(userId: string): Promise<void> {
    try {
      if (!userId) {
        throw new AppError(400, 'User ID is required');
      }

      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        profilePicture: null,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to delete profile picture'
      );
    }
  }

  /**
   * Add skill to user profile
   * @param userId - Firebase Auth UID
   * @param skill - Skill to add
   * @returns Promise<void>
   * @throws AppError if operation fails
   */
  static async addSkill(userId: string, skill: string): Promise<void> {
    try {
      if (!userId || !skill) {
        throw new AppError(400, 'User ID and skill are required');
      }

      if (skill.length > 50) {
        throw new AppError(400, 'Skill name cannot exceed 50 characters');
      }

      const userDocRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        throw new AppError(404, 'User not found');
      }

      const currentSkills = userSnapshot.data().skills || [];

      if (currentSkills.includes(skill)) {
        throw new AppError(400, 'Skill already added');
      }

      if (currentSkills.length >= 20) {
        throw new AppError(400, 'Maximum 20 skills allowed');
      }

      await updateDoc(userDocRef, {
        skills: [...currentSkills, skill],
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to add skill'
      );
    }
  }

  /**
   * Remove skill from user profile
   * @param userId - Firebase Auth UID
   * @param skill - Skill to remove
   * @returns Promise<void>
   * @throws AppError if operation fails
   */
  static async removeSkill(userId: string, skill: string): Promise<void> {
    try {
      if (!userId || !skill) {
        throw new AppError(400, 'User ID and skill are required');
      }

      const userDocRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        throw new AppError(404, 'User not found');
      }

      const currentSkills = userSnapshot.data().skills || [];
      const updatedSkills = currentSkills.filter((s: string) => s !== skill);

      await updateDoc(userDocRef, {
        skills: updatedSkills,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to remove skill'
      );
    }
  }

  /**
   * Add learning goal to user profile
   * @param userId - Firebase Auth UID
   * @param goal - Learning goal to add
   * @returns Promise<void>
   * @throws AppError if operation fails
   */
  static async addLearningGoal(userId: string, goal: string): Promise<void> {
    try {
      if (!userId || !goal) {
        throw new AppError(400, 'User ID and goal are required');
      }

      if (goal.length > 100) {
        throw new AppError(400, 'Goal cannot exceed 100 characters');
      }

      const userDocRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        throw new AppError(404, 'User not found');
      }

      const currentGoals = userSnapshot.data().learningGoals || [];

      if (currentGoals.includes(goal)) {
        throw new AppError(400, 'Goal already added');
      }

      if (currentGoals.length >= 10) {
        throw new AppError(400, 'Maximum 10 goals allowed');
      }

      await updateDoc(userDocRef, {
        learningGoals: [...currentGoals, goal],
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to add learning goal'
      );
    }
  }

  /**
   * Remove learning goal from user profile
   * @param userId - Firebase Auth UID
   * @param goal - Learning goal to remove
   * @returns Promise<void>
   * @throws AppError if operation fails
   */
  static async removeLearningGoal(userId: string, goal: string): Promise<void> {
    try {
      if (!userId || !goal) {
        throw new AppError(400, 'User ID and goal are required');
      }

      const userDocRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        throw new AppError(404, 'User not found');
      }

      const currentGoals = userSnapshot.data().learningGoals || [];
      const updatedGoals = currentGoals.filter((g: string) => g !== goal);

      await updateDoc(userDocRef, {
        learningGoals: updatedGoals,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to remove learning goal'
      );
    }
  }

  /**
   * Update mentor-specific fields
   * @param userId - Firebase Auth UID
   * @param mentorData - Mentor data to update
   * @returns Promise<void>
   * @throws AppError if user is not a mentor
   */
  static async updateMentorProfile(
    userId: string,
    mentorData: {
      mentorSpecialties?: string[];
      mentorHourlyRate?: number;
      bio?: string;
    }
  ): Promise<void> {
    try {
      if (!userId) {
        throw new AppError(400, 'User ID is required');
      }

      const userDocRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userDocRef);

      if (!userSnapshot.exists()) {
        throw new AppError(404, 'User not found');
      }

      const userData = userSnapshot.data();

      if (userData.role !== 'mentor') {
        throw new AppError(403, 'Only mentors can update mentor profile');
      }

      // Validate mentor data
      if (
        mentorData.mentorHourlyRate &&
        (mentorData.mentorHourlyRate < 5 || mentorData.mentorHourlyRate > 500)
      ) {
        throw new AppError(400, 'Hourly rate must be between $5 and $500');
      }

      if (
        mentorData.mentorSpecialties &&
        mentorData.mentorSpecialties.length > 10
      ) {
        throw new AppError(400, 'Maximum 10 specialties allowed');
      }

      await updateDoc(userDocRef, {
        ...mentorData,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        500,
        error instanceof Error ? error.message : 'Failed to update mentor profile'
      );
    }
  }
}
