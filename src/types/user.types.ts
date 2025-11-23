export type UserRole = 'student' | 'mentor' | 'admin';

export interface User {
  id: string;
  email: string;
  displayName: string;
  profilePicture?: string;
  bio?: string;
  role: UserRole;
  isMentorVerified?: boolean;
  mentorSpecialties?: string[];
  mentorRating?: number;
  mentorHourlyRate?: number;
  skills?: string[];
  learningGoals?: string[];
  joinedDate: string;
  lastActive: string;
  isSuspended?: boolean;
  suspensionReason?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  displayName: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
