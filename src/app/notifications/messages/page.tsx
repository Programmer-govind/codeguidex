'use client';

import { SubNav } from '@/components/navigation/SubNav';

const MESSAGES_NAV = [
  { label: 'All Messages', href: '/notifications/messages', icon: '💬' },
  { label: 'Unread', href: '/notifications/messages?filter=unread', icon: '📬' },
  { label: 'Archived', href: '/notifications/messages?filter=archived', icon: '📦' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      <div className="section">
        <div className="section-container">
          <SubNav items={MESSAGES_NAV} showBorder={true} />
          
          <div className="section-header mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">💬 Messages</h1>
            <p className="section-subtitle">Direct messages and conversations</p>
          </div>

          <div className="card-lg border-2 border-blue-200 bg-blue-50 p-12 text-center rounded-lg">
            <div className="text-4xl mb-3">💬</div>
            <h3 className="text-xl font-semibold text-blue-900 mb-2">No Messages Yet</h3>
            <p className="text-blue-700 mb-6">
              When you connect with mentors or students, your conversations will appear here
            </p>
            <a href="/mentors" className="button-primary inline-block">
              Find a Mentor
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
