/**
 * Custom Hooks for Profile Feature
 * Provides easy access to profile operations with Redux integration
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';
import type { User } from '@/types/user.types';
import { ProfileService } from '@/services/profile.service';
import {
  setLoadingProfile,
  setUserProfile,
  startEditingProfile,
  updateEditFormData,
  cancelEditingProfile,
  finishEditingProfile,
  addSkill,
  removeSkill,
  addLearningGoal,
  removeLearningGoal,
  addUserCommunity,
  removeUserCommunity,
  updateMentorData,
  setError,
  updateProfilePicture,
  clearProfile,
} from '@/store/slices/profileSlice';

/**
 * Hook to fetch user profile
 */
export const useFetchProfile = (userId: string | null, currentUser?: User | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userProfile, isLoadingProfile, error } = useSelector(
    (state: RootState) => state.profile
  );

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    dispatch(setLoadingProfile(true));
    try {
      const profile = await ProfileService.getProfile(userId);
      dispatch(setUserProfile(profile));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      
      // If profile not found and we have current user data, try to create it
      if (errorMessage.includes('not found') && currentUser && currentUser.id === userId) {
        try {
          await ProfileService.createProfile(currentUser);
          // Now fetch the created profile
          const profile = await ProfileService.getProfile(userId);
          dispatch(setUserProfile(profile));
          return;
        } catch (createErr) {
          console.error('Failed to create profile:', createErr);
        }
      }
      
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoadingProfile(false));
    }
  }, [dispatch, userId, currentUser]);

  return {
    profile: userProfile,
    isLoading: isLoadingProfile,
    error,
    fetchProfile,
  };
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const updateProfile = useCallback(
    async (userId: string, updateData: Partial<User>) => {
      dispatch(setLoadingProfile(true));
      try {
        await ProfileService.updateProfile(userId, updateData);

        // Fetch updated profile
        const updatedProfile = await ProfileService.getProfile(userId);
        dispatch(finishEditingProfile(updatedProfile));

        return updatedProfile;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
        dispatch(setError(errorMessage));
        throw err;
      } finally {
        dispatch(setLoadingProfile(false));
      }
    },
    [dispatch]
  );

  return { updateProfile };
};

/**
 * Hook for profile editing
 */
export const useProfileEditing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isEditingProfile, editFormData, userProfile } = useSelector(
    (state: RootState) => state.profile
  );

  const startEditing = useCallback(
    (profile?: User | null) => {
      const profileToEdit = profile || userProfile;
      if (profileToEdit) {
        dispatch(startEditingProfile(profileToEdit));
      }
    },
    [dispatch, userProfile]
  );

  const updateFormData = useCallback(
    (updates: Partial<User>) => {
      dispatch(updateEditFormData(updates));
    },
    [dispatch]
  );

  const cancelEditing = useCallback(() => {
    dispatch(cancelEditingProfile());
  }, [dispatch]);

  return {
    isEditing: isEditingProfile,
    formData: editFormData,
    startEditing,
    updateFormData,
    cancelEditing,
  };
};

/**
 * Hook for managing skills
 */
export const useProfileSkills = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { skills } = useSelector((state: RootState) => state.profile);

  const addSkillAction = useCallback(
    async (userId: string, skill: string) => {
      try {
        dispatch(addSkill(skill));
        await ProfileService.addSkill(userId, skill);
      } catch (err) {
        // Remove from local state on error
        dispatch(removeSkill(skill));
        const errorMessage = err instanceof Error ? err.message : 'Failed to add skill';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  const removeSkillAction = useCallback(
    async (userId: string, skill: string) => {
      try {
        dispatch(removeSkill(skill));
        await ProfileService.removeSkill(userId, skill);
      } catch (err) {
        // Add back to local state on error
        dispatch(addSkill(skill));
        const errorMessage = err instanceof Error ? err.message : 'Failed to remove skill';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  return {
    skills,
    addSkill: addSkillAction,
    removeSkill: removeSkillAction,
  };
};

/**
 * Hook for managing learning goals
 */
export const useProfileGoals = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { learningGoals } = useSelector((state: RootState) => state.profile);

  const addGoalAction = useCallback(
    async (userId: string, goal: string) => {
      try {
        dispatch(addLearningGoal(goal));
        await ProfileService.addLearningGoal(userId, goal);
      } catch (err) {
        dispatch(removeLearningGoal(goal));
        const errorMessage = err instanceof Error ? err.message : 'Failed to add goal';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  const removeGoalAction = useCallback(
    async (userId: string, goal: string) => {
      try {
        dispatch(removeLearningGoal(goal));
        await ProfileService.removeLearningGoal(userId, goal);
      } catch (err) {
        dispatch(addLearningGoal(goal));
        const errorMessage = err instanceof Error ? err.message : 'Failed to remove goal';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  return {
    goals: learningGoals,
    addGoal: addGoalAction,
    removeGoal: removeGoalAction,
  };
};

/**
 * Hook for updating profile picture
 */
export const useProfilePicture = () => {
  const dispatch = useDispatch<AppDispatch>();

  const updatePicture = useCallback(
    async (userId: string, pictureUrl: string) => {
      try {
        dispatch(updateProfilePicture(pictureUrl));
        await ProfileService.updateProfilePicture(userId, pictureUrl);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update picture';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  const deletePicture = useCallback(
    async (userId: string) => {
      try {
        dispatch(updateProfilePicture(''));
        await ProfileService.deleteProfilePicture(userId);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete picture';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch]
  );

  return { updatePicture, deletePicture };
};

/**
 * Hook for mentor profile management
 */
export const useMentorProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mentorData, isMentor } = useSelector((state: RootState) => state.profile);

  const updateMentor = useCallback(
    async (
      userId: string,
      mentorUpdates: {
        mentorSpecialties?: string[];
        mentorHourlyRate?: number;
        bio?: string;
      }
    ) => {
      try {
        await ProfileService.updateMentorProfile(userId, mentorUpdates);

        const newMentorData = {
          specialties: mentorUpdates.mentorSpecialties || mentorData?.specialties || [],
          hourlyRate: mentorUpdates.mentorHourlyRate || mentorData?.hourlyRate || 0,
          bio: mentorUpdates.bio || mentorData?.bio || '',
        };

        dispatch(updateMentorData(newMentorData));
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to update mentor profile';
        dispatch(setError(errorMessage));
        throw err;
      }
    },
    [dispatch, mentorData]
  );

  return {
    isMentor,
    mentorData,
    updateMentor,
  };
};

/**
 * Hook for user communities management
 */
export const useUserCommunities = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userCommunities, isLoadingUserCommunities } = useSelector(
    (state: RootState) => state.profile
  );

  const joinCommunity = useCallback(
    (communityId: string) => {
      dispatch(addUserCommunity(communityId));
    },
    [dispatch]
  );

  const leaveCommunity = useCallback(
    (communityId: string) => {
      dispatch(removeUserCommunity(communityId));
    },
    [dispatch]
  );

  return {
    communities: userCommunities,
    isLoading: isLoadingUserCommunities,
    joinCommunity,
    leaveCommunity,
  };
};

/**
 * Hook to clear profile
 */
export const useClearProfile = () => {
  const dispatch = useDispatch<AppDispatch>();

  const clear = useCallback(() => {
    dispatch(clearProfile());
  }, [dispatch]);

  return { clearProfile: clear };
};
