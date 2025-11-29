'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav, MENTOR_DASHBOARD_NAV } from '@/components/navigation/SubNav';
import { MentorService } from '@/services/mentor.service';
import { MentorSession } from '@/types/mentor.types';

export default function MentorSessionsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<MentorSession[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<MentorSession | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user?.id && user.role === 'mentor') {
      fetchSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingSessions(true);

      // Get mentor profile to get the correct mentor ID
      const mentorProfile = await MentorService.getMentorProfileByUserId(user.id);
      if (!mentorProfile) {
        console.log('No mentor profile found for user:', user.id);
        setSessions([]);
        return;
      }

      console.log('Found mentor profile:', mentorProfile);
      const fetchedSessions = await MentorService.getSessions(mentorProfile.id, 'mentor');
      console.log('Fetched sessions for mentor:', mentorProfile.id, fetchedSessions);
      setSessions(fetchedSessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const handleRescheduleClick = (session: MentorSession) => {
    setSelectedSession(session);
    setNewDate(session.scheduledDate);
    setNewTime(session.scheduledTime);
    setShowRescheduleModal(true);
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedSession || !newDate || !newTime) return;

    try {
      // Update the session
      await MentorService.updateSession(selectedSession.id, {
        scheduledDate: newDate,
        scheduledTime: newTime,
      });

      // Update the corresponding booking
      await MentorService.updateBooking(selectedSession.bookingId, {
        preferredDate: newDate,
        preferredTime: newTime,
      });

      // Refresh sessions
      await fetchSessions();

      // Close modal
      setShowRescheduleModal(false);
      setSelectedSession(null);
      setNewDate('');
      setNewTime('');
    } catch (error) {
      console.error('Failed to reschedule session:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoadingSessions) {
    return (
      <div className="section">
        <div className="section-container">
        <SubNav items={MENTOR_DASHBOARD_NAV} />
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner message="Loading sessions..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-container">
        <SubNav items={MENTOR_DASHBOARD_NAV} />

        <div className="section-header">
          <h1 className="section-title">Mentor Sessions</h1>
          <p className="section-subtitle">Your mentoring sessions and schedule</p>
        </div>

        <div className="card-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
            <Link href="/mentor/students" className="button-primary">
              View Students
            </Link>
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-lg font-semibold mb-2">No sessions scheduled</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div key={session.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{session.topic}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">Session with student</p>
                      <p className="text-gray-500 text-sm">
                        {new Date(session.scheduledDate).toLocaleDateString()} at {session.scheduledTime} ({session.duration} min)
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-2">
                      {session.status === 'scheduled' && (
                        <>
                          <Link
                            href={`/video/${session.videoRoomId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button-primary"
                          >
                            Join Session
                          </Link>
                          <button
                            onClick={() => handleRescheduleClick(session)}
                            className="button-secondary"
                          >
                            Reschedule
                          </button>
                        </>
                      )}
                      {session.status === 'completed' && (
                        <button className="button-secondary">
                          View Recording
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Reschedule Session</h2>
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Time
                </label>
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}