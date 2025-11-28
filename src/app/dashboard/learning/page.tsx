'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav } from '@/components/navigation/SubNav';

const STUDENT_DASHBOARD_NAV = [
  { label: 'Overview', href: '/dashboard', icon: '📊' },
  { label: 'My Communities', href: '/dashboard/communities', icon: '👥' },
  { label: 'My Learning', href: '/dashboard/learning', icon: '📚' },
  { label: 'Messages', href: '/dashboard/messages', icon: '💬' },
  { label: 'Bookmarks', href: '/dashboard/bookmarks', icon: '🔖' },
];

export default function StudentLearningPage() {
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
        <LoadingSpinner message="Loading learning dashboard..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Mock learning data
  const learningData = {
    enrolledCourses: [
      {
        id: '1',
        title: 'Advanced React Patterns',
        progress: 75,
        nextLesson: 'Higher-Order Components',
        instructor: 'Sarah Johnson'
      },
      {
        id: '2',
        title: 'TypeScript Fundamentals',
        progress: 45,
        nextLesson: 'Advanced Types',
        instructor: 'Mike Chen'
      }
    ],
    completedCourses: 3,
    totalHours: 24,
    currentStreak: 7,
    achievements: [
      { title: 'First Course Completed', date: '2025-11-15', icon: '🎓' },
      { title: 'Week Streak', date: '2025-11-20', icon: '🔥' },
      { title: 'Helpful Contributor', date: '2025-11-18', icon: '🤝' }
    ]
  };

  return (
    <div className="section">
      <div className="section-container">
        <SubNav items={STUDENT_DASHBOARD_NAV} />

        <div className="section-header">
          <h1 className="section-title">My Learning</h1>
          <p className="section-subtitle">Track your learning progress and achievements</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">📚</div>
            <div className="text-2xl font-bold">{learningData.enrolledCourses.length}</div>
            <div className="text-gray-600">Enrolled Courses</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold">{learningData.completedCourses}</div>
            <div className="text-gray-600">Completed Courses</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-2xl font-bold">{learningData.totalHours}h</div>
            <div className="text-gray-600">Learning Hours</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold">{learningData.currentStreak}</div>
            <div className="text-gray-600">Day Streak</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-lg">
            <h2 className="text-xl font-semibold mb-4">Current Courses</h2>
            <div className="space-y-4">
              {learningData.enrolledCourses.map((course) => (
                <div key={course.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{course.title}</h3>
                    <span className="text-sm text-gray-600">{course.progress}%</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600">Next: {course.nextLesson}</p>
                  <button className="button-primary mt-2">
                    Continue Learning
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="card-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
            <div className="space-y-4">
              {learningData.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-gray-600">{achievement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Node.js Backend Development</h3>
              <p className="text-sm text-gray-600 mb-3">Learn to build scalable backend applications</p>
              <button className="button-primary">Enroll Now</button>
            </div>
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">System Design Interview Prep</h3>
              <p className="text-sm text-gray-600 mb-3">Master the art of system design interviews</p>
              <button className="button-primary">Enroll Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}