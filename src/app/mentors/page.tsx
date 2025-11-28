'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MentorService } from '@/services/mentor.service';
import { MentorProfile, MentorFilters as MentorFiltersType } from '@/types/mentor.types';
import { MentorCard } from '@/components/mentor/MentorCard';
import { MentorFilters } from '@/components/mentor/MentorFilters';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav, MENTORSHIP_NAV_ITEMS } from '@/components/navigation/SubNav';

export default function MentorsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MentorFiltersType>({
    maxHourlyRate: 200,
    minRating: 0,
    specializations: [],
    searchQuery: '',
  });

  // Prevent mentors from viewing this page
  useEffect(() => {
    if (user && user.role === 'mentor') {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const data = await MentorService.getMentors(filters);
        setMentors(data);
      } catch (error) {
        console.error('Failed to fetch mentors:', error);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchMentors();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters]);

  // If user is a mentor, show access denied
  if (user && user.role === 'mentor') {
    return (
      <div className="section">
        <div className="section-container">
          <div className="empty-state card">
            <div className="empty-state-icon">👨‍🏫</div>
            <h3 className="empty-state-title">You're a Mentor!</h3>
            <p className="empty-state-description">
              Mentors don't need to find other mentors. Go to your dashboard to manage your profile and students.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="btn-primary mt-4"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-container">
        {/* Navigation Tabs */}
        <SubNav items={MENTORSHIP_NAV_ITEMS} showBorder={true} />

        {/* Header */}
        <div className="section-header mb-8">
          <h1>Find a Mentor</h1>
          <p className="section-subtitle">
            Connect with experienced mentors who can guide your learning journey
          </p>
        </div>

        {/* Filters Card */}
        <div className="card mb-8">
          <MentorFilters
            onFilterChange={setFilters}
            filters={filters}
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="empty-state card">
            <LoadingSpinner />
            <p className="empty-state-description">Loading mentors...</p>
          </div>
        ) : mentors.length === 0 ? (
          /* Empty State */
          <div className="empty-state card">
            <div className="empty-state-icon">🔍</div>
            <h3 className="empty-state-title">No mentors found</h3>
            <p className="empty-state-description">
              Try adjusting your filters to find mentors that match your needs.
            </p>
          </div>
        ) : (
          /* Mentors Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                />
              ))}
            </div>

            {/* Results Summary */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                Found <span className="font-semibold text-blue-900">{mentors.length}</span>
                {' '}mentor{mentors.length !== 1 ? 's' : ''} matching your criteria
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
