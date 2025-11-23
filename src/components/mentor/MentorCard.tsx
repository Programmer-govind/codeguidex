import React from 'react';
import Link from 'next/link';
import { MentorProfile } from '@/types/mentor.types';
import { Badge } from '@/components/common/Badge';

interface MentorCardProps {
    mentor: MentorProfile;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {mentor.profilePicture ? (
                                <img
                                    src={mentor.profilePicture}
                                    alt={mentor.displayName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                mentor.displayName.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {mentor.displayName}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {mentor.experience} experience
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {mentor.rating.toFixed(1)}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">
                                    ({mentor.totalReviews} reviews)
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                            ${mentor.hourlyRate}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">/ hour</div>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {mentor.bio}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {mentor.specializations.slice(0, 3).map((spec) => (
                        <Badge key={spec} label={spec.replace('-', ' ')} variant="secondary" size="sm" />
                    ))}
                    {mentor.specializations.length > 3 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center px-2">
                            +{mentor.specializations.length - 3} more
                        </span>
                    )}
                </div>

                <div className="flex gap-3">
                    <Link
                        href={`/mentors/${mentor.id}`}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                        View Profile
                    </Link>
                    <Link
                        href={`/mentors/${mentor.id}/book`}
                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 text-center rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-colors"
                    >
                        Book Session
                    </Link>
                </div>
            </div>
        </div>
    );
};
