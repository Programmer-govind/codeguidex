import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    MentorProfile,
    BookingRequest,
    MentorSession,
    MentorReview,
    MentorVideo,
    MentorState,
} from '@/types/mentor.types';

const initialState: MentorState = {
    mentors: [],
    currentMentor: null,
    bookings: [],
    sessions: [],
    reviews: [],
    videos: [],
    isLoading: false,
    error: null,
};

const mentorSlice = createSlice({
    name: 'mentor',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setMentors: (state, action: PayloadAction<MentorProfile[]>) => {
            state.mentors = action.payload;
            state.error = null;
        },
        setCurrentMentor: (state, action: PayloadAction<MentorProfile | null>) => {
            state.currentMentor = action.payload;
            state.error = null;
        },
        addMentor: (state, action: PayloadAction<MentorProfile>) => {
            state.mentors.push(action.payload);
        },
        updateMentor: (state, action: PayloadAction<MentorProfile>) => {
            const index = state.mentors.findIndex((m) => m.id === action.payload.id);
            if (index !== -1) {
                state.mentors[index] = action.payload;
            }
            if (state.currentMentor?.id === action.payload.id) {
                state.currentMentor = action.payload;
            }
        },
        setBookings: (state, action: PayloadAction<BookingRequest[]>) => {
            state.bookings = action.payload;
            state.error = null;
        },
        addBooking: (state, action: PayloadAction<BookingRequest>) => {
            state.bookings.unshift(action.payload);
        },
        updateBooking: (state, action: PayloadAction<BookingRequest>) => {
            const index = state.bookings.findIndex((b) => b.id === action.payload.id);
            if (index !== -1) {
                state.bookings[index] = action.payload;
            }
        },
        setSessions: (state, action: PayloadAction<MentorSession[]>) => {
            state.sessions = action.payload;
            state.error = null;
        },
        addSession: (state, action: PayloadAction<MentorSession>) => {
            state.sessions.unshift(action.payload);
        },
        updateSession: (state, action: PayloadAction<MentorSession>) => {
            const index = state.sessions.findIndex((s) => s.id === action.payload.id);
            if (index !== -1) {
                state.sessions[index] = action.payload;
            }
        },
        setReviews: (state, action: PayloadAction<MentorReview[]>) => {
            state.reviews = action.payload;
            state.error = null;
        },
        addReview: (state, action: PayloadAction<MentorReview>) => {
            state.reviews.unshift(action.payload);
        },
        setVideos: (state, action: PayloadAction<MentorVideo[]>) => {
            state.videos = action.payload;
            state.error = null;
        },
        addVideo: (state, action: PayloadAction<MentorVideo>) => {
            state.videos.unshift(action.payload);
        },
        clearMentorState: (state) => {
            state.mentors = [];
            state.currentMentor = null;
            state.bookings = [];
            state.sessions = [];
            state.reviews = [];
            state.videos = [];
            state.isLoading = false;
            state.error = null;
        },
    },
});

export const {
    setLoading,
    setError,
    setMentors,
    setCurrentMentor,
    addMentor,
    updateMentor,
    setBookings,
    addBooking,
    updateBooking,
    setSessions,
    addSession,
    updateSession,
    setReviews,
    addReview,
    setVideos,
    addVideo,
    clearMentorState,
} = mentorSlice.actions;

export default mentorSlice.reducer;
