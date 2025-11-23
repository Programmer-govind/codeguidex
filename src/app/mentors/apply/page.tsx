'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MentorService } from '@/services/mentor.service';
import { CreateMentorProfileData, MentorSpecialization, MentorSkill } from '@/types/mentor.types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

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

export default function ApplyMentorPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateMentorProfileData>({
        bio: '',
        specializations: [],
        skills: [],
        experience: '',
        hourlyRate: 50,
        availability: [
            { day: 'monday', startTime: '09:00', endTime: '17:00' },
            { day: 'wednesday', startTime: '09:00', endTime: '17:00' },
            { day: 'friday', startTime: '09:00', endTime: '17:00' },
        ],
        linkedIn: '',
        github: '',
        portfolio: '',
    });

    const [skillInput, setSkillInput] = useState('');

    const handleSpecializationChange = (spec: MentorSpecialization) => {
        const currentSpecs = formData.specializations;
        const newSpecs = currentSpecs.includes(spec)
            ? currentSpecs.filter((s) => s !== spec)
            : [...currentSpecs, spec];
        setFormData({ ...formData, specializations: newSpecs });
    };

    const addSkill = () => {
        if (skillInput.trim()) {
            setFormData({
                ...formData,
                skills: [...formData.skills, { name: skillInput.trim(), level: 'expert' }],
            });
            setSkillInput('');
        }
    };

    const removeSkill = (index: number) => {
        const newSkills = [...formData.skills];
        newSkills.splice(index, 1);
        setFormData({ ...formData, skills: newSkills });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        try {
            await MentorService.createMentorProfile(
                user.id,
                user.displayName || 'Mentor',
                user.email || '',
                formData
            );
            router.push('/dashboard/mentor/bookings');
        } catch (error) {
            console.error('Failed to create profile:', error);
            alert('Failed to create mentor profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Please Log In
                    </h2>
                    <button
                        onClick={() => router.push('/auth/login?redirect=/mentors/apply')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
                    >
                        Log In / Sign Up
                    </button>
                </div>
            </div>
        );
    }

    if (loading) return <LoadingSpinner fullPage message="Creating profile..." />;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                        Apply to be a Mentor
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bio
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="Tell us about your experience and why you want to mentor..."
                            />
                        </div>

                        {/* Experience */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Years of Experience
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                placeholder="e.g., 5 years"
                            />
                        </div>

                        {/* Hourly Rate */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Hourly Rate ($)
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.hourlyRate}
                                onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        {/* Specializations */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Specializations
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {SPECIALIZATIONS.map((spec) => (
                                    <label key={spec} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.specializations.includes(spec)}
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

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Skills
                            </label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Add a skill (e.g., React, Python)"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm flex items-center gap-2"
                                    >
                                        {skill.name}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(index)}
                                            className="hover:text-blue-900 dark:hover:text-blue-100"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900 dark:text-white">Social Links</h3>
                            <input
                                type="url"
                                placeholder="LinkedIn URL"
                                value={formData.linkedIn}
                                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                            <input
                                type="url"
                                placeholder="GitHub URL"
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                            <input
                                type="url"
                                placeholder="Portfolio URL"
                                value={formData.portfolio}
                                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-colors"
                        >
                            Submit Application
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
