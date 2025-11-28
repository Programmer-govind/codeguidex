'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MentorService } from '@/services/mentor.service';
import { BookingRequest } from '@/types/mentor.types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Badge } from '@/components/common/Badge';
import { SubNav, STUDENT_DASHBOARD_NAV } from '@/components/navigation/SubNav';

export default function StudentBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect this route - only students should access
  useEffect(() => {
    if (user && user.role !== 'student') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || user.role !== 'student') {
        setLoading(false);
        return;
      }

      try {
        const data = await MentorService.getBookings(user.id, 'student');

        // Remove duplicates
        const uniqueBookings = data.filter((booking, index, self) =>
          index === self.findIndex((b) => (
            b.mentorId === booking.mentorId &&
            b.topic === booking.topic &&
            b.preferredDate === booking.preferredDate &&
            b.preferredTime === booking.preferredTime
          ))
        );

        setBookings(uniqueBookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading your bookings..." />
      </div>
    );
  }

  // Prevent mentors and others from accessing
  if (user && user.role !== 'student') {
    return (
      <div className="section">
        <div className="section-container">
          <div className="empty-state card">
            <div className="empty-state-icon">🚫</div>
            <h3 className="empty-state-title">Access Denied</h3>
            <p className="empty-state-description">
              Only students can view bookings. Please go to your dashboard.
            </p>
            <Link href="/dashboard" className="btn-primary mt-4">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-container">
        {/* Navigation Tabs */}
        <SubNav items={STUDENT_DASHBOARD_NAV} showBorder={true} />

        {/* Header */}
        <div className="section-header mb-8">
          <h1>My Mentor Bookings</h1>
          <p className="section-subtitle">
            View and manage your mentor booking requests
          </p>
        </div>

        {bookings.length > 0 ? (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Mentor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Topic
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {booking.mentorName?.[0] || 'M'}
                          </div>
                          <span className="font-medium text-gray-900">
                            {booking.mentorName || 'Unknown Mentor'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-700">{booking.topic}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-700">
                          {booking.preferredDate} at {booking.preferredTime}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge
                          label={booking.status || 'Pending'}
                          variant={
                            booking.status === 'confirmed' ? 'success' :
                            booking.status === 'cancelled' ? 'danger' :
                            'warning'
                          }
                          size="md"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/dashboard/student/bookings/${booking.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-state-icon">📅</div>
            <h3 className="empty-state-title">No bookings yet</h3>
            <p className="empty-state-description">
              You haven't made any mentor booking requests. Find a mentor to get started.
            </p>
            <Link href="/mentors" className="btn-primary mt-4">
              Find a Mentor
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
