'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { MentorService } from '@/services/mentor.service';
import { BookingRequest, MentorProfile } from '@/types/mentor.types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import { SubNav } from '@/components/navigation/SubNav';

const MENTOR_BOOKINGS_NAV = [
  { label: 'All Bookings', href: '/dashboard/mentor/bookings', icon: '📋' },
  { label: 'Videos', href: '/dashboard/mentor/videos', icon: '🎥' },
  { label: 'Earnings', href: '/dashboard', icon: '💰' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function MentorBookingsPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<BookingRequest[]>([]);
    const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // Check if user is a mentor
                const profile = await MentorService.getMentorProfileByUserId(user.id);
                setMentorProfile(profile);

                if (profile) {
                    const data = await MentorService.getBookings(profile.id, 'mentor');

                    // Remove duplicates based on unique combination
                    const uniqueBookings = data.filter((booking, index, self) =>
                        index === self.findIndex((b) => (
                            b.studentId === booking.studentId &&
                            b.topic === booking.topic &&
                            b.preferredDate === booking.preferredDate &&
                            b.preferredTime === booking.preferredTime
                        ))
                    );

                    setBookings(uniqueBookings);
                }
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const filteredBookings = filter === 'all' 
        ? bookings 
        : bookings.filter(b => b.status === filter);

    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        completed: bookings.filter(b => b.status === 'completed').length,
    };

    if (loading) {
        return (
            <div className="section">
                <div className="section-container">
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner />
                    </div>
                </div>
            </div>
        );
    }

    if (!mentorProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                <div className="card-lg max-w-md w-full text-center">
                    <div className="text-4xl mb-4">🎓</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Become a Mentor
                    </h2>
                    <p className="text-gray-600 mb-8">
                        You need to create a mentor profile to see your bookings and accept sessions.
                    </p>
                    <Link
                        href="/mentors/apply"
                        className="button-primary w-full"
                    >
                        Create Mentor Profile
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
            <div className="section">
                <div className="section-container">
                    {/* SubNav - Mentor Navigation */}
                    <SubNav items={MENTOR_BOOKINGS_NAV} showBorder={true} />

                    {/* Header */}
                    <div className="section-header mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Mentor Bookings</h1>
                        <p className="section-subtitle">Manage your tutoring sessions and student bookings</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="card-lg text-center">
                            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
                            <p className="text-sm text-gray-600 mt-1">Total Bookings</p>
                        </div>
                        <div className="card-lg text-center">
                            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
                            <p className="text-sm text-gray-600 mt-1">Pending</p>
                        </div>
                        <div className="card-lg text-center">
                            <div className="text-3xl font-bold text-green-600">{stats.confirmed}</div>
                            <p className="text-sm text-gray-600 mt-1">Confirmed</p>
                        </div>
                        <div className="card-lg text-center">
                            <div className="text-3xl font-bold text-purple-600">{stats.completed}</div>
                            <p className="text-sm text-gray-600 mt-1">Completed</p>
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    {bookings.length > 0 && (
                        <div className="mb-8 flex gap-2 flex-wrap">
                            {(['all', 'pending', 'confirmed', 'completed'] as const).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`filter-button ${filter === f ? 'filter-button-active' : ''}`}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Bookings Section */}
                    {filteredBookings.length > 0 ? (
                        <div className="space-y-4">
                            {filteredBookings.map((booking) => (
                                <div key={booking.id} className="card-lg hover:shadow-md transition-shadow">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {/* Student Info */}
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold mb-1">STUDENT</p>
                                            <p className="font-semibold text-gray-900">{booking.studentName || 'Student'}</p>
                                            <p className="text-xs text-gray-500">{booking.studentEmail}</p>
                                        </div>

                                        {/* Topic & Date */}
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold mb-1">SESSION</p>
                                            <p className="font-semibold text-gray-900">{booking.topic}</p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(booking.preferredDate).toLocaleDateString()} at {booking.preferredTime}
                                            </p>
                                        </div>

                                        {/* Duration & Rate */}
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold mb-1">DETAILS</p>
                                            <p className="font-semibold text-gray-900">{booking.duration || 60} min</p>
                                            <p className="text-xs text-gray-500">${(booking as any).rate || 30}/hr</p>
                                        </div>

                                        {/* Status & Action */}
                                        <div className="md:col-span-1 flex flex-col md:items-end justify-between">
                                            <div>
                                                {booking.status === 'pending' && (
                                                    <Badge label="⏳ Pending" variant="warning" size="sm" />
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <Badge label="✓ Confirmed" variant="success" size="sm" />
                                                )}
                                                {booking.status === 'completed' && (
                                                    <Badge label="✓ Completed" variant="primary" size="sm" />
                                                )}
                                                {booking.status === 'cancelled' && (
                                                    <Badge label="✕ Cancelled" variant="danger" size="sm" />
                                                )}
                                            </div>
                                            <Link
                                                href={`/dashboard/mentor/bookings/${booking.id}`}
                                                className="text-blue-600 hover:text-blue-700 text-sm font-semibold mt-2"
                                            >
                                                View Details →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card-lg border-2 border-blue-200 bg-blue-50 p-12 text-center rounded-lg">
                            <div className="text-4xl mb-3">📋</div>
                            <h3 className="text-xl font-semibold text-blue-900 mb-2">
                                {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
                            </h3>
                            <p className="text-blue-700 mb-4">
                                {filter === 'all' 
                                    ? 'Students will book your sessions once they discover your profile'
                                    : 'Check other filters for more bookings'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
