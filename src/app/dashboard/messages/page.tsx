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

export default function StudentMessagesPage() {
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
        <LoadingSpinner message="Loading messages..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Mock messages data
  const messages = [
    {
      id: '1',
      from: 'Sarah Johnson',
      subject: 'Re: React Performance Questions',
      preview: 'Great questions! Let me explain the key concepts...',
      date: '2025-11-28',
      unread: true
    },
    {
      id: '2',
      from: 'Mike Chen',
      subject: 'TypeScript Study Group',
      preview: 'Are you interested in joining our weekly study group?',
      date: '2025-11-27',
      unread: false
    },
    {
      id: '3',
      from: 'Community Admin',
      subject: 'Welcome to Web Development Community',
      preview: 'Thank you for joining! Here are some resources to get started...',
      date: '2025-11-25',
      unread: false
    }
  ];

  return (
    <div className="section">
      <div className="section-container">
        <SubNav items={STUDENT_DASHBOARD_NAV} />

        <div className="section-header">
          <h1 className="section-title">Messages</h1>
          <p className="section-subtitle">Your private messages and conversations</p>
        </div>

        <div className="card-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Inbox</h2>
            <button className="button-primary">
              New Message
            </button>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-gray-600">Start a conversation with mentors or community members</p>
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                    message.unread ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">{message.from}</span>
                        {message.unread && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                      <h3 className={`font-medium ${message.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                        {message.subject}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{message.preview}</p>
                    </div>
                    <span className="text-sm text-gray-500">{message.date}</span>
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