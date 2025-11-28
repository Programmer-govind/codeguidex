'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav } from '@/components/navigation/SubNav';

const MENTORSHIP_NAV_ITEMS = [
  { label: 'Find Mentors', href: '/mentors', icon: '🔍' },
  { label: 'My Mentor', href: '/mentors/my-mentor', icon: '👨‍🏫' },
  { label: 'Sessions', href: '/mentor/sessions', icon: '🎥' },
  { label: 'Progress', href: '/mentor/progress', icon: '📈' },
];

export default function MyMentorPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading mentor information..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Mock data - in real app, fetch user's mentor
  const myMentor = {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer at Google',
    expertise: ['React', 'Node.js', 'System Design'],
    rating: 4.9,
    sessionsCompleted: 45,
    image: '/api/placeholder/120/120',
    bio: 'Passionate about helping developers grow their careers through mentorship and hands-on guidance.',
    availability: 'Available for new sessions'
  };

  return (
    <div className="section">
      <div className="section-container">
        <SubNav items={MENTORSHIP_NAV_ITEMS} />

        <div className="section-header">
          <h1 className="section-title">My Mentor</h1>
          <p className="section-subtitle">Your dedicated mentor for career growth</p>
        </div>

        {myMentor ? (
          <div className="card-lg">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              <img
                src={myMentor.image}
                alt={myMentor.name}
                className="w-32 h-32 rounded-lg object-cover mx-auto md:mx-0"
              />
              <div className="flex-1 mt-4 md:mt-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{myMentor.name}</h2>
                    <p className="text-gray-600 mb-2">{myMentor.title}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {myMentor.expertise.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <div className="flex items-center justify-center md:justify-end mb-2">
                      <span className="text-yellow-500 text-lg">⭐</span>
                      <span className="ml-1 font-semibold">{myMentor.rating}</span>
                    </div>
                    <p className="text-sm text-gray-600">{myMentor.sessionsCompleted} sessions completed</p>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{myMentor.bio}</p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/mentor/sessions" className="button-primary">
                    Schedule Session
                  </Link>
                  <button className="button-secondary">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-lg text-center py-12">
            <div className="text-6xl mb-4">👨‍🏫</div>
            <h3 className="text-xl font-semibold mb-2">No Mentor Yet</h3>
            <p className="text-gray-600 mb-6">Find a mentor to guide your career journey</p>
            <Link href="/mentors" className="button-primary">
              Find a Mentor
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}