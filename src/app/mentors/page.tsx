'use client';

import { useEffect, useState } from 'react';
import { MentorService } from '@/services/mentor.service';
import { MentorProfile, MentorFilters as MentorFiltersType } from '@/types/mentor.types';
import { MentorCard } from '@/components/mentor/MentorCard';
import { MentorFilters } from '@/components/mentor/MentorFilters';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function MentorsPage() {
    const [mentors, setMentors] = useState<MentorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<MentorFiltersType>({
        maxHourlyRate: 200,
        minRating: 0,
        specializations: [],
        searchQuery: '',
    });

    useEffect(() => {
        const fetchMentors = async () => {
            setLoading(true);
            try {
                const data = await MentorService.getMentors(filters);
                setMentors(data);
            } catch (error) {
                console.error('Failed to fetch mentors:', error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchMentors();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Find a Mentor
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Connect with experienced developers for 1-on-1 guidance and code reviews.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <MentorFilters filters={filters} onFilterChange={setFilters} />
                    </div>

                    {/* Mentors Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <LoadingSpinner message="Finding mentors..." />
                            </div>
                        ) : mentors.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {mentors.map((mentor) => (
                                    <MentorCard key={mentor.id} mentor={mentor} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <svg
                                    className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No mentors found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    Try adjusting your filters or search query to find more mentors.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
