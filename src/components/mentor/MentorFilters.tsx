import React from 'react';
import { MentorFilters as MentorFiltersType, MentorSpecialization } from '@/types/mentor.types';

interface MentorFiltersProps {
    filters: MentorFiltersType;
    onFilterChange: (filters: MentorFiltersType) => void;
}

const SPECIALIZATIONS: MentorSpecialization[] = [
    'web-development',
    'mobile-development',
    'data-science',
    'machine-learning',
    'devops',
    'cloud-computing',
    'cybersecurity',
    'game-development',
    'blockchain',
    'ui-ux-design',
];

export const MentorFilters: React.FC<MentorFiltersProps> = ({ filters, onFilterChange }) => {
    const handleSpecializationChange = (spec: MentorSpecialization) => {
        const currentSpecs = filters.specializations || [];
        const newSpecs = currentSpecs.includes(spec)
            ? currentSpecs.filter((s) => s !== spec)
            : [...currentSpecs, spec];

        onFilterChange({ ...filters, specializations: newSpecs });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Filters</h3>

            {/* Search */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                </label>
                <input
                    type="text"
                    placeholder="Search mentors..."
                    value={filters.searchQuery || ''}
                    onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            {/* Hourly Rate */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Hourly Rate ($)
                </label>
                <input
                    type="range"
                    min="0"
                    max="200"
                    step="10"
                    value={filters.maxHourlyRate || 200}
                    onChange={(e) => onFilterChange({ ...filters, maxHourlyRate: Number(e.target.value) })}
                    className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                    <span>$0</span>
                    <span>${filters.maxHourlyRate || 200}</span>
                </div>
            </div>

            {/* Specializations */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specializations
                </label>
                <div className="space-y-2">
                    {SPECIALIZATIONS.map((spec) => (
                        <label key={spec} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={filters.specializations?.includes(spec) || false}
                                onChange={() => handleSpecializationChange(spec)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                                {spec.replace('-', ' ')}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Minimum Rating */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Rating
                </label>
                <select
                    value={filters.minRating || 0}
                    onChange={(e) => onFilterChange({ ...filters, minRating: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                    <option value="0">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                </select>
            </div>
        </div>
    );
};
