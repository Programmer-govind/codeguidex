'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav, MENTOR_DASHBOARD_NAV } from '@/components/navigation/SubNav';
import { MentorService } from '@/services/mentor.service';
import { MentorStudent } from '@/types/mentor.types';

export default function MentorStudentsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [students, setStudents] = useState<MentorStudent[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user?.id && user.role === 'mentor') {
      fetchStudents();
    }
  }, [user]);

  const fetchStudents = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingStudents(true);

      // Get mentor profile to get the correct mentor ID
      const mentorProfile = await MentorService.getMentorProfileByUserId(user.id);
      if (!mentorProfile) {
        console.log('No mentor profile found for user:', user.id);
        setStudents([]);
        return;
      }

      const studentsData = await MentorService.getStudents(mentorProfile.id);
      setStudents(studentsData);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setIsLoadingStudents(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoadingStudents) {
    return (
      <div className="section">
        <div className="section-container">
          <SubNav items={MENTOR_DASHBOARD_NAV} />
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner message="Loading students data..." />
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
          <h1 className="section-title">My Students</h1>
          <p className="section-subtitle">Manage your mentoring relationships</p>
        </div>

        <div className="card-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Active Students ({students.filter(s => s.status === 'active').length})</h2>
            <button className="button-primary">
              Invite Student
            </button>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">👨‍🎓</div>
              <h3 className="text-lg font-semibold mb-2">No students yet</h3>
              <p className="text-gray-600">Start mentoring by accepting student requests</p>
            </div>
          ) : (
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{student.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{student.email}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Sessions:</span>
                          <span className="font-medium ml-1">{student.sessionsCompleted}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Hours:</span>
                          <span className="font-medium ml-1">{student.totalHours}h</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Session:</span>
                          <span className="font-medium ml-1">{student.lastSession}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Current Focus:</span>
                          <span className="font-medium ml-1">{student.progress}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex space-x-2">
                      <Link href={`/mentor/sessions?student=${student.id}`} className="button-primary">
                        Schedule Session
                      </Link>
                      <button className="button-secondary">
                        View Progress
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}