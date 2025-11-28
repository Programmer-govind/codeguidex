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

export default function MentorProgressPage() {
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
        <LoadingSpinner message="Loading progress..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Mock data - in real app, fetch user's progress
  const progressData = {
    sessionsCompleted: 12,
    totalHours: 15,
    goals: [
      { title: 'Master React Hooks', completed: true, progress: 100 },
      { title: 'Learn TypeScript', completed: false, progress: 75 },
      { title: 'Build Portfolio Project', completed: false, progress: 40 },
      { title: 'Prepare for Interviews', completed: false, progress: 20 }
    ],
    skills: [
      { name: 'JavaScript', level: 'Advanced', progress: 90 },
      { name: 'React', level: 'Intermediate', progress: 70 },
      { name: 'Node.js', level: 'Beginner', progress: 30 },
      { name: 'TypeScript', level: 'Intermediate', progress: 60 }
    ]
  };

  return (
    <div className="section">
      <div className="section-container">
        <SubNav items={MENTORSHIP_NAV_ITEMS} />

        <div className="section-header">
          <h1 className="section-title">Mentorship Progress</h1>
          <p className="section-subtitle">Track your learning journey and achievements</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">🎥</div>
            <div className="text-2xl font-bold">{progressData.sessionsCompleted}</div>
            <div className="text-gray-600">Sessions Completed</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-2xl font-bold">{progressData.totalHours}h</div>
            <div className="text-gray-600">Total Hours</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold">{progressData.goals.filter(g => g.completed).length}</div>
            <div className="text-gray-600">Goals Achieved</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-lg">
            <h2 className="text-xl font-semibold mb-4">Learning Goals</h2>
            <div className="space-y-4">
              {progressData.goals.map((goal, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                      {goal.title}
                    </span>
                    {goal.completed && <span className="text-green-600">✓</span>}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">{goal.progress}% complete</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-lg">
            <h2 className="text-xl font-semibold mb-4">Skill Development</h2>
            <div className="space-y-4">
              {progressData.skills.map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-sm text-gray-600">{skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600">{skill.progress}% proficiency</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/mentor/sessions" className="button-primary">
              Schedule Next Session
            </Link>
            <button className="button-secondary">
              Update Goals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}