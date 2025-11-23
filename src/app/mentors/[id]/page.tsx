'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MentorService } from '@/services/mentor.service';
import { MentorProfile, MentorReview } from '@/types/mentor.types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { Badge } from '@/components/common/Badge';

interface MentorProfilePageProps {
    params: {
        id: string;
    };
}

export default function MentorProfilePage({ params }: MentorProfilePageProps) {
    const router = useRouter();
    const [mentor, setMentor] = useState<MentorProfile | null>(null);
    const [reviews, setReviews] = useState<MentorReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMentorData = async () => {
            setLoading(true);
            try {
                const [mentorData, reviewsData] = await Promise.all([
                    MentorService.getMentorProfile(params.id),
                    MentorService.getReviews(params.id)
                ]);
                setMentor(mentorData);
                setReviews(reviewsData);
            } catch (err) {
                console.error('Failed to fetch mentor details:', err);
                setError('Failed to load mentor profile');
            } finally {
                setLoading(false);
            }
        };

        fetchMentorData();
    }, [params.id]);

    if (loading) return <LoadingSpinner fullPage message="Loading mentor profile..." />;

    if (error || !mentor) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorMessage message={error || 'Mentor not found'} type="error" />
                <button onClick={() => router.back()} className="mt-4 text-blue-600 hover:underline">
                    ← Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            {/* Header / Cover */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 h-48 md:h-64"></div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            {/* Profile Image */}
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md -mt-20 md:-mt-24 flex-shrink-0">
                                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                                    {mentor.profilePicture ? (
                                        <img
                                            src={mentor.profilePicture}
                                            alt={mentor.displayName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        mentor.displayName.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="flex-1 pt-2 md:pt-0">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                            {mentor.displayName}
                                        </h1>
                                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                                            {mentor.experience} experience
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {mentor.specializations.map((spec) => (
                                                <Badge key={spec} label={spec.replace('-', ' ')} variant="secondary" />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            ${mentor.hourlyRate}
                                        </div>
                                        <div className="text-gray-500 dark:text-gray-400">per hour</div>
                                        <Link
                                            href={`/mentors/${mentor.id}/book`}
                                            className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-colors shadow-sm hover:shadow-md"
                                        >
                                            Book Session
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="md:col-span-2 space-y-8">
                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About</h2>
                                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                        {mentor.bio}
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {mentor.skills.map((skill) => (
                                            <div
                                                key={skill.name}
                                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                                            >
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {skill.name}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400 ml-2">
                                                    • {skill.level}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                        Reviews ({mentor.totalReviews})
                                    </h2>
                                    {reviews.length > 0 ? (
                                        <div className="space-y-4">
                                            {reviews.map((review) => (
                                                <div key={review.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="font-medium text-gray-900 dark:text-white">
                                                            {review.studentName}
                                                        </span>
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <svg
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                </svg>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
                                    )}
                                </section>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Availability</h3>
                                    <div className="space-y-2">
                                        {mentor.availability.map((slot, index) => (
                                            <div key={index} className="flex justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-300 capitalize">
                                                    {slot.day}
                                                </span>
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {slot.startTime} - {slot.endTime}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Links</h3>
                                    <div className="space-y-3">
                                        {mentor.linkedIn && (
                                            <a
                                                href={mentor.linkedIn}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:underline"
                                            >
                                                LinkedIn Profile
                                            </a>
                                        )}
                                        {mentor.github && (
                                            <a
                                                href={mentor.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
                                            >
                                                GitHub Profile
                                            </a>
                                        )}
                                        {mentor.portfolio && (
                                            <a
                                                href={mentor.portfolio}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-purple-600 hover:underline"
                                            >
                                                Portfolio Website
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
