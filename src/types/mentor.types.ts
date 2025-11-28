/**
 * Mentor-related TypeScript types and interfaces
 */

export type MentorSkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type MentorSpecialization =
    | 'web-development'
    | 'mobile-development'
    | 'data-science'
    | 'machine-learning'
    | 'devops'
    | 'cloud-computing'
    | 'cybersecurity'
    | 'game-development'
    | 'blockchain'
    | 'ui-ux-design'
    | 'other';

export interface MentorSkill {
    name: string;
    level: MentorSkillLevel;
}

export interface MentorAvailability {
    day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
    startTime: string; // Format: "HH:MM"
    endTime: string; // Format: "HH:MM"
}

export interface MentorProfile {
    id: string; // Same as user ID
    userId: string;
    displayName: string;
    email: string;
    profilePicture?: string;
    bio: string;
    specializations: MentorSpecialization[];
    skills: MentorSkill[];
    experience: string; // Years of experience
    hourlyRate: number; // In USD
    availability: MentorAvailability[];
    rating: number; // Average rating (0-5)
    totalSessions: number;
    totalReviews: number;
    isVerified: boolean;
    linkedIn?: string;
    github?: string;
    portfolio?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BookingRequest {
    id: string;
    studentId: string;
    studentName: string;
    studentEmail: string;
    mentorId: string;
    mentorName: string;
    mentorEmail: string;
    topic: string;
    description: string;
    preferredDate: string;
    preferredTime: string;
    duration: number; // In minutes
    amount: number; // Payment amount
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    paymentId?: string;
    paymentStatus: 'pending' | 'paid' | 'refunded';
    videoRoomId?: string;
    videoRoomUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MentorSession {
    id: string;
    bookingId: string;
    mentorId: string;
    studentId: string;
    topic: string;
    scheduledDate: string;
    scheduledTime: string;
    duration: number;
    videoRoomId: string;
    videoRoomUrl: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    startedAt?: string;
    endedAt?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface MentorReview {
    id: string;
    sessionId: string;
    mentorId: string;
    studentId: string;
    studentName: string;
    rating: number; // 1-5
    comment: string;
    createdAt: string;
}

export interface MentorVideo {
    id: string;
    mentorId: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration: number; // In seconds
    views: number;
    tags: string[];
    createdAt: string;
    updatedAt: string;
}

export interface MentorState {
    mentors: MentorProfile[];
    currentMentor: MentorProfile | null;
    bookings: BookingRequest[];
    sessions: MentorSession[];
    reviews: MentorReview[];
    videos: MentorVideo[];
    isLoading: boolean;
    error: string | null;
}

export interface CreateMentorProfileData {
    bio: string;
    specializations: MentorSpecialization[];
    skills: MentorSkill[];
    experience: string;
    hourlyRate: number;
    availability: MentorAvailability[];
    linkedIn?: string;
    github?: string;
    portfolio?: string;
}

export interface UpdateMentorProfileData extends Partial<CreateMentorProfileData> { }

export interface CreateBookingData {
    mentorId: string;
    topic: string;
    description: string;
    preferredDate: string;
    preferredTime: string;
    duration: number;
}

export interface MentorStudent {
    id: string;
    name: string;
    email: string;
    sessionsCompleted: number;
    totalHours: number;
    lastSession: string;
    progress: string;
    status: 'active' | 'completed' | 'inactive';
}

export interface MentorFilters {
    specializations?: MentorSpecialization[];
    minRating?: number;
    maxHourlyRate?: number;
    availability?: string; // Day of week
    searchQuery?: string;
}
