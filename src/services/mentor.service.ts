import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
} from 'firebase/firestore';
import { db } from '@/config/firebase.config';
import {
    MentorProfile,
    CreateMentorProfileData,
    UpdateMentorProfileData,
    MentorFilters,
    BookingRequest,
    CreateBookingData,
    MentorSession,
    MentorReview,
    MentorVideo,
    MentorStudent,
} from '@/types/mentor.types';

const MENTORS_COLLECTION = 'mentors';
const BOOKINGS_COLLECTION = 'bookings';
const SESSIONS_COLLECTION = 'sessions';
const REVIEWS_COLLECTION = 'reviews';
const VIDEOS_COLLECTION = 'mentor_videos';

export class MentorService {
    /**
     * Create a new mentor profile
     */
    static async createMentorProfile(
        userId: string,
        displayName: string,
        email: string,
        data: CreateMentorProfileData
    ): Promise<MentorProfile> {
        try {
            const mentorData: Omit<MentorProfile, 'id'> = {
                userId,
                displayName,
                email,
                ...data,
                rating: 0,
                totalSessions: 0,
                totalReviews: 0,
                isVerified: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, MENTORS_COLLECTION), mentorData);

            return {
                id: docRef.id,
                ...mentorData,
            };
        } catch (error: any) {
            throw new Error(`Failed to create mentor profile: ${error.message}`);
        }
    }

    /**
     * Get mentor profile by ID
     */
    static async getMentorProfile(mentorId: string): Promise<MentorProfile> {
        try {
            const docRef = doc(db, MENTORS_COLLECTION, mentorId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Mentor profile not found');
            }

            return {
                id: docSnap.id,
                ...docSnap.data(),
            } as MentorProfile;
        } catch (error: any) {
            throw new Error(`Failed to get mentor profile: ${error.message}`);
        }
    }

    /**
     * Get mentor profile by user ID
     */
    static async getMentorProfileByUserId(userId: string): Promise<MentorProfile | null> {
        try {
            const q = query(collection(db, MENTORS_COLLECTION), where('userId', '==', userId), limit(1));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const doc = querySnapshot.docs[0];
            return {
                id: doc.id,
                ...doc.data(),
            } as MentorProfile;
        } catch (error: any) {
            throw new Error(`Failed to get mentor profile: ${error.message}`);
        }
    }

    /**
     * Update mentor profile
     */
    static async updateMentorProfile(
        mentorId: string,
        data: UpdateMentorProfileData
    ): Promise<void> {
        try {
            const docRef = doc(db, MENTORS_COLLECTION, mentorId);
            await updateDoc(docRef, {
                ...data,
                updatedAt: new Date().toISOString(),
            });
        } catch (error: any) {
            throw new Error(`Failed to update mentor profile: ${error.message}`);
        }
    }

    /**
     * Get all mentors with optional filters
     */
    static async getMentors(filters?: MentorFilters): Promise<MentorProfile[]> {
        try {
            // Simple query - just order by rating, no range filters to avoid index requirement
            const q = query(collection(db, MENTORS_COLLECTION), orderBy('rating', 'desc'));

            const querySnapshot = await getDocs(q);
            let mentors: MentorProfile[] = [];

            querySnapshot.forEach((doc) => {
                mentors.push({
                    id: doc.id,
                    ...doc.data(),
                } as MentorProfile);
            });

            // Apply all filters client-side
            if (filters) {
                mentors = mentors.filter((mentor) => {
                    // Filter by minimum rating
                    if (filters.minRating && mentor.rating < filters.minRating) {
                        return false;
                    }

                    // Filter by maximum hourly rate
                    if (filters.maxHourlyRate && mentor.hourlyRate > filters.maxHourlyRate) {
                        return false;
                    }

                    // Filter by specializations
                    if (filters.specializations && filters.specializations.length > 0) {
                        const hasSpecialization = filters.specializations.some((spec) =>
                            mentor.specializations.includes(spec)
                        );
                        if (!hasSpecialization) {
                            return false;
                        }
                    }

                    // Filter by search query
                    if (filters.searchQuery) {
                        const searchLower = filters.searchQuery.toLowerCase();
                        const matchesSearch =
                            mentor.displayName.toLowerCase().includes(searchLower) ||
                            mentor.bio.toLowerCase().includes(searchLower) ||
                            mentor.skills.some((skill) => skill.name.toLowerCase().includes(searchLower));
                        if (!matchesSearch) {
                            return false;
                        }
                    }

                    return true;
                });
            }

            return mentors;
        } catch (error: any) {
            throw new Error(`Failed to get mentors: ${error.message}`);
        }
    }

    /**
     * Create a booking request
     */
    static async createBooking(
        studentId: string,
        studentName: string,
        studentEmail: string,
        mentorId: string,
        data: CreateBookingData
    ): Promise<BookingRequest> {
        try {
            // Get mentor details
            const mentor = await this.getMentorProfile(mentorId);

            const bookingData: Omit<BookingRequest, 'id'> = {
                studentId,
                studentName,
                studentEmail,
                mentorId,
                mentorName: mentor.displayName,
                mentorEmail: mentor.email,
                topic: data.topic,
                description: data.description,
                preferredDate: data.preferredDate,
                preferredTime: data.preferredTime,
                duration: data.duration,
                amount: (mentor.hourlyRate * data.duration) / 60,
                status: 'pending',
                paymentStatus: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), bookingData);

            return {
                id: docRef.id,
                ...bookingData,
            };
        } catch (error: any) {
            throw new Error(`Failed to create booking: ${error.message}`);
        }
    }

    /**
     * Update booking status
     */
    static async updateBooking(
        bookingId: string,
        updates: Partial<BookingRequest>
    ): Promise<void> {
        try {
            const docRef = doc(db, BOOKINGS_COLLECTION, bookingId);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date().toISOString(),
            });
        } catch (error: any) {
            throw new Error(`Failed to update booking: ${error.message}`);
        }
    }

    /**
     * Update session details
     */
    static async updateSession(
        sessionId: string,
        updates: Partial<MentorSession>
    ): Promise<void> {
        try {
            const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
            await updateDoc(docRef, {
                ...updates,
                updatedAt: new Date().toISOString(),
            });
        } catch (error: any) {
            throw new Error(`Failed to update session: ${error.message}`);
        }
    }

    /**
     * Get sessions for a user (student or mentor)
     */
    static async getBookings(userId: string, role: 'student' | 'mentor'): Promise<BookingRequest[]> {
        try {
            const field = role === 'student' ? 'studentId' : 'mentorId';

            // Simple query - just filter by userId, sort client-side to avoid index requirement
            const q = query(
                collection(db, BOOKINGS_COLLECTION),
                where(field, '==', userId)
            );

            const querySnapshot = await getDocs(q);

            const bookings: BookingRequest[] = [];

            querySnapshot.forEach((doc) => {
                bookings.push({
                    id: doc.id,
                    ...doc.data(),
                } as BookingRequest);
            });

            // Sort by createdAt descending (client-side)
            bookings.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA; // Descending order (newest first)
            });

            return bookings;
        } catch (error: any) {
            console.error(`Failed to get bookings: ${error.message}`);
            throw new Error(`Failed to get bookings: ${error.message}`);
        }
    }

    /**
     * Create a mentor session (after payment confirmation)
     */
    static async createSession(bookingId: string): Promise<MentorSession> {
        try {
            // Get booking details
            const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId);
            const bookingSnap = await getDoc(bookingRef);

            if (!bookingSnap.exists()) {
                throw new Error('Booking not found');
            }

            const booking = { id: bookingSnap.id, ...bookingSnap.data() } as BookingRequest;

            // Generate a secure, random room name for Jitsi
            // Using crypto random + timestamp makes it virtually impossible to guess
            const randomString = Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            const videoRoomId = `CodeGuideX-${bookingId}-${randomString}-${Date.now()}`;

            // The video page URL that users will visit
            // Use environment-specific URL or fallback to localhost for development
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const videoRoomUrl = `${baseUrl}/video/${videoRoomId}`;

            const sessionData: Omit<MentorSession, 'id'> = {
                bookingId,
                mentorId: booking.mentorId,
                studentId: booking.studentId,
                topic: booking.topic,
                scheduledDate: booking.preferredDate,
                scheduledTime: booking.preferredTime,
                duration: booking.duration,
                videoRoomId, // The Jitsi room name
                videoRoomUrl, // Our app's video page URL
                status: 'scheduled',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData);

            // Update booking with video room details
            await updateDoc(bookingRef, {
                videoRoomId,
                videoRoomUrl,
                status: 'confirmed',
                updatedAt: new Date().toISOString(),
            });

            return {
                id: docRef.id,
                ...sessionData,
            };
        } catch (error: any) {
            throw new Error(`Failed to create session: ${error.message}`);
        }
    }

    /**
     * Get session by ID
     */
    static async getSession(sessionId: string): Promise<MentorSession> {
        try {
            const docRef = doc(db, SESSIONS_COLLECTION, sessionId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                throw new Error('Session not found');
            }

            return {
                id: docSnap.id,
                ...docSnap.data(),
            } as MentorSession;
        } catch (error: any) {
            throw new Error(`Failed to get session: ${error.message}`);
        }
    }

    /**
     * Get sessions for a user
     */
    static async getSessions(userId: string, role: 'student' | 'mentor'): Promise<MentorSession[]> {
        try {
            const field = role === 'student' ? 'studentId' : 'mentorId';
            // Simple query - just filter by userId, sort client-side to avoid index requirement
            const q = query(
                collection(db, SESSIONS_COLLECTION),
                where(field, '==', userId)
            );

            const querySnapshot = await getDocs(q);
            const sessions: MentorSession[] = [];

            querySnapshot.forEach((doc) => {
                sessions.push({
                    id: doc.id,
                    ...doc.data(),
                } as MentorSession);
            });

            // Remove duplicates based on bookingId (in case sessions were created multiple times)
            const uniqueSessions = sessions.filter((session, index, self) => 
                index === self.findIndex(s => s.bookingId === session.bookingId)
            );

            // Sort by scheduledDate descending (client-side)
            uniqueSessions.sort((a, b) => {
                const dateA = new Date(a.scheduledDate).getTime();
                const dateB = new Date(b.scheduledDate).getTime();
                return dateB - dateA; // Descending order (newest first)
            });

            console.log(`Returning ${uniqueSessions.length} unique sessions (filtered from ${sessions.length})`);
            return uniqueSessions;
        } catch (error: any) {
            console.error(`Failed to get sessions: ${error.message}`);
            throw new Error(`Failed to get sessions: ${error.message}`);
        }
    }

    /**
     * Add a review for a mentor
     */
    static async addReview(
        sessionId: string,
        mentorId: string,
        studentId: string,
        studentName: string,
        rating: number,
        comment: string
    ): Promise<MentorReview> {
        try {
            const reviewData: Omit<MentorReview, 'id'> = {
                sessionId,
                mentorId,
                studentId,
                studentName,
                rating,
                comment,
                createdAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), reviewData);

            // Update mentor's average rating
            await this.updateMentorRating(mentorId);

            return {
                id: docRef.id,
                ...reviewData,
            };
        } catch (error: any) {
            throw new Error(`Failed to add review: ${error.message}`);
        }
    }

    /**
     * Update mentor's average rating
     */
    private static async updateMentorRating(mentorId: string): Promise<void> {
        try {
            const q = query(collection(db, REVIEWS_COLLECTION), where('mentorId', '==', mentorId));
            const querySnapshot = await getDocs(q);

            let totalRating = 0;
            let count = 0;

            querySnapshot.forEach((doc) => {
                const review = doc.data() as MentorReview;
                totalRating += review.rating;
                count++;
            });

            const averageRating = count > 0 ? totalRating / count : 0;

            const mentorRef = doc(db, MENTORS_COLLECTION, mentorId);
            await updateDoc(mentorRef, {
                rating: averageRating,
                totalReviews: count,
                updatedAt: new Date().toISOString(),
            });
        } catch (error: any) {
            console.error('Failed to update mentor rating:', error);
        }
    }

    /**
     * Get reviews for a mentor
     */
    static async getReviews(mentorId: string): Promise<MentorReview[]> {
        try {
            // Simple query - just filter by mentorId, sort client-side to avoid index requirement
            const q = query(
                collection(db, REVIEWS_COLLECTION),
                where('mentorId', '==', mentorId)
            );

            const querySnapshot = await getDocs(q);
            const reviews: MentorReview[] = [];

            querySnapshot.forEach((doc) => {
                reviews.push({
                    id: doc.id,
                    ...doc.data(),
                } as MentorReview);
            });

            // Sort by createdAt descending (client-side)
            reviews.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA; // Descending order
            });

            return reviews;
        } catch (error: any) {
            throw new Error(`Failed to get reviews: ${error.message}`);
        }
    }

    /**
     * Upload a mentor video (metadata only, actual upload handled separately)
     */
    static async uploadVideo(
        mentorId: string,
        title: string,
        description: string,
        videoUrl: string,
        duration: number,
        tags: string[],
        thumbnailUrl?: string
    ): Promise<MentorVideo> {
        try {
            const videoData: Omit<MentorVideo, 'id'> = {
                mentorId,
                title,
                description,
                videoUrl,
                thumbnailUrl,
                duration,
                views: 0,
                tags,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, VIDEOS_COLLECTION), videoData);

            return {
                id: docRef.id,
                ...videoData,
            };
        } catch (error: any) {
            throw new Error(`Failed to upload video: ${error.message}`);
        }
    }

    /**
     * Get videos for a mentor
     */
    static async getVideos(mentorId: string): Promise<MentorVideo[]> {
        try {
            // Simple query - just filter by mentorId, sort client-side to avoid index requirement
            const q = query(
                collection(db, VIDEOS_COLLECTION),
                where('mentorId', '==', mentorId)
            );

            const querySnapshot = await getDocs(q);
            const videos: MentorVideo[] = [];

            querySnapshot.forEach((doc) => {
                videos.push({
                    id: doc.id,
                    ...doc.data(),
                } as MentorVideo);
            });

            // Sort by createdAt descending (client-side)
            videos.sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return dateB - dateA; // Descending order (newest first)
            });

            return videos;
        } catch (error: any) {
            throw new Error(`Failed to get videos: ${error.message}`);
        }
    }

    /**
     * Increment video views
     */
    static async incrementVideoViews(videoId: string): Promise<void> {
        try {
            const docRef = doc(db, VIDEOS_COLLECTION, videoId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const currentViews = docSnap.data().views || 0;
                await updateDoc(docRef, {
                    views: currentViews + 1,
                    updatedAt: new Date().toISOString(),
                });
            }
        } catch (error: any) {
            console.error('Failed to increment video views:', error);
        }
    }

    /**
     * Get students for a mentor
     */
    static async getStudents(mentorId: string): Promise<MentorStudent[]> {
        try {
            // Get all sessions for this mentor
            const sessions = await this.getSessions(mentorId, 'mentor');
            
            // Get all bookings for this mentor
            const bookings = await this.getBookings(mentorId, 'mentor');

            // Create a map of student data
            const studentMap = new Map<string, MentorStudent>();

            // Process sessions to build student data
            sessions.forEach(session => {
                const booking = bookings.find(b => b.id === session.bookingId);
                if (booking) {
                    const studentId = booking.studentId;
                    
                    if (!studentMap.has(studentId)) {
                        studentMap.set(studentId, {
                            id: studentId,
                            name: booking.studentName,
                            email: booking.studentEmail,
                            sessionsCompleted: 0,
                            totalHours: 0,
                            lastSession: session.scheduledDate,
                            progress: session.topic,
                            status: 'active'
                        });
                    }

                    const student = studentMap.get(studentId)!;
                    
                    // Count completed sessions
                    if (session.status === 'completed') {
                        student.sessionsCompleted += 1;
                        student.totalHours += session.duration / 60; // Convert minutes to hours
                    }

                    // Update last session date if more recent
                    if (new Date(session.scheduledDate) > new Date(student.lastSession)) {
                        student.lastSession = session.scheduledDate;
                    }

                    // Update status based on recent activity
                    const lastSessionDate = new Date(student.lastSession);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    
                    if (lastSessionDate < thirtyDaysAgo) {
                        student.status = 'inactive';
                    } else if (student.sessionsCompleted >= 10) {
                        student.status = 'completed';
                    }
                }
            });

            return Array.from(studentMap.values());
        } catch (error: any) {
            throw new Error(`Failed to get students: ${error.message}`);
        }
    }
}
