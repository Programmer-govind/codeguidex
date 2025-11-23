/**
 * Profile Redux Slice
 * Manages user profile state including current profile and editing
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/user.types';

export interface ProfileState {
  // Current user profile
  userProfile: User | null;
  isLoadingProfile: boolean;

  // User's own communities
  userCommunities: string[]; // Array of community IDs
  isLoadingUserCommunities: boolean;

  // Profile editing
  isEditingProfile: boolean;
  editFormData: Partial<User> | null;

  // Skills and goals
  skills: string[];
  learningGoals: string[];

  // Mentor profile (if user is mentor)
  isMentor: boolean;
  mentorData: {
    specialties: string[];
    hourlyRate: number;
    bio: string;
  } | null;

  // Error handling
  error: string | null;
}

const initialState: ProfileState = {
  userProfile: null,
  isLoadingProfile: false,
  userCommunities: [],
  isLoadingUserCommunities: false,
  isEditingProfile: false,
  editFormData: null,
  skills: [],
  learningGoals: [],
  isMentor: false,
  mentorData: null,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Profile loading
    setLoadingProfile: (state, action: PayloadAction<boolean>) => {
      state.isLoadingProfile = action.payload;
    },

    setUserProfile: (state, action: PayloadAction<User>) => {
      state.userProfile = action.payload;
      state.skills = action.payload.skills || [];
      state.learningGoals = action.payload.learningGoals || [];
      state.isMentor = action.payload.role === 'mentor';
      state.error = null;
    },

    // Profile editing
    startEditingProfile: (state, action: PayloadAction<Partial<User>>) => {
      state.isEditingProfile = true;
      state.editFormData = action.payload;
    },

    updateEditFormData: (state, action: PayloadAction<Partial<User>>) => {
      state.editFormData = { ...state.editFormData, ...action.payload };
    },

    cancelEditingProfile: (state) => {
      state.isEditingProfile = false;
      state.editFormData = null;
    },

    finishEditingProfile: (state, action: PayloadAction<User>) => {
      state.userProfile = action.payload;
      state.isEditingProfile = false;
      state.editFormData = null;
      state.skills = action.payload.skills || [];
      state.learningGoals = action.payload.learningGoals || [];
      state.error = null;
    },

    // Skills management
    addSkill: (state, action: PayloadAction<string>) => {
      if (!state.skills.includes(action.payload) && state.skills.length < 20) {
        state.skills.push(action.payload);
      }
    },

    removeSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter((s) => s !== action.payload);
    },

    setSkills: (state, action: PayloadAction<string[]>) => {
      state.skills = action.payload;
    },

    // Learning goals management
    addLearningGoal: (state, action: PayloadAction<string>) => {
      if (
        !state.learningGoals.includes(action.payload) &&
        state.learningGoals.length < 10
      ) {
        state.learningGoals.push(action.payload);
      }
    },

    removeLearningGoal: (state, action: PayloadAction<string>) => {
      state.learningGoals = state.learningGoals.filter((g) => g !== action.payload);
    },

    setLearningGoals: (state, action: PayloadAction<string[]>) => {
      state.learningGoals = action.payload;
    },

    // User communities
    setLoadingUserCommunities: (state, action: PayloadAction<boolean>) => {
      state.isLoadingUserCommunities = action.payload;
    },

    setUserCommunities: (state, action: PayloadAction<string[]>) => {
      state.userCommunities = action.payload;
      state.error = null;
    },

    addUserCommunity: (state, action: PayloadAction<string>) => {
      if (!state.userCommunities.includes(action.payload)) {
        state.userCommunities.push(action.payload);
      }
    },

    removeUserCommunity: (state, action: PayloadAction<string>) => {
      state.userCommunities = state.userCommunities.filter(
        (c) => c !== action.payload
      );
    },

    // Mentor profile
    setMentorData: (
      state,
      action: PayloadAction<{
        specialties: string[];
        hourlyRate: number;
        bio: string;
      }>
    ) => {
      state.isMentor = true;
      state.mentorData = action.payload;
      state.error = null;
    },

    updateMentorData: (
      state,
      action: PayloadAction<Partial<{ specialties: string[]; hourlyRate: number; bio: string }>>
    ) => {
      if (state.mentorData) {
        state.mentorData = { ...state.mentorData, ...action.payload };
      }
    },

    clearMentorData: (state) => {
      state.isMentor = false;
      state.mentorData = null;
    },

    // Error handling
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Profile picture update
    updateProfilePicture: (state, action: PayloadAction<string>) => {
      if (state.userProfile) {
        state.userProfile.profilePicture = action.payload;
      }
    },

    // Clear profile
    clearProfile: () => initialState,
  },
});

export const {
  setLoadingProfile,
  setUserProfile,
  startEditingProfile,
  updateEditFormData,
  cancelEditingProfile,
  finishEditingProfile,
  addSkill,
  removeSkill,
  setSkills,
  addLearningGoal,
  removeLearningGoal,
  setLearningGoals,
  setLoadingUserCommunities,
  setUserCommunities,
  addUserCommunity,
  removeUserCommunity,
  setMentorData,
  updateMentorData,
  clearMentorData,
  setError,
  updateProfilePicture,
  clearProfile,
} = profileSlice.actions;

export default profileSlice.reducer;
