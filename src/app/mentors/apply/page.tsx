'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MentorService } from '@/services/mentor.service';
import { CreateMentorProfileData, MentorSpecialization } from '@/types/mentor.types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav } from '@/components/navigation/SubNav';

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

const MENTORS_NAV = [
  { label: 'Browse Mentors', href: '/mentors', icon: '👥' },
  { label: 'Become a Mentor', href: '/mentors/apply', icon: '✨' },
  { label: 'My Profile', href: '/dashboard', icon: '📊' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function ApplyMentorPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
        setError(null);
        try {
            await MentorService.createMentorProfile(
                user.id,
                user.displayName || 'Mentor',
                user.email || '',
                formData
            );
            alert('✅ Mentor profile created successfully! You can now start accepting bookings.');
            router.push('/dashboard');
        } catch (err: any) {
            console.error('Failed to create profile:', err);
            setError(err.message || 'Failed to create mentor profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                <div className="card-lg max-w-md w-full text-center">
                    <div className="text-4xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Log In to Continue
                    </h2>
                    <p className="text-gray-600 mb-8">
                        You need to create an account or log in to become a mentor.
                    </p>
                    <button
                        onClick={() => router.push('/auth/login?redirect=/mentors/apply')}
                        className="button-primary w-full"
                    >
                        Log In / Sign Up
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="section">
                <div className="section-container">
                    <div className="flex items-center justify-center py-20">
                        <LoadingSpinner message="Creating your mentor profile..." />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
            <div className="section">
                <div className="section-container">
                    {/* SubNav */}
                    <SubNav items={MENTORS_NAV} showBorder={true} />

                    {/* Header */}
                    <div className="section-header mb-12 text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            🎓 Become a Mentor
                        </h1>
                        <p className="section-subtitle max-w-2xl mx-auto">
                            Share your expertise, help students grow, and build a rewarding mentoring career.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {/* Error Alert */}
                        {error && (
                            <div className="card-lg border-2 border-red-200 bg-red-50 p-4 mb-8 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <div>
                                        <h3 className="font-semibold text-red-900">Error</h3>
                                        <p className="text-red-700 text-sm">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Form Card */}
                        <div className="card-lg shadow-lg">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Bio Section */}
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span>📝</span> About You
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Bio / Introduction *
                                            </label>
                                            <textarea
                                                required
                                                rows={4}
                                                value={formData.bio}
                                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                className="input-field w-full"
                                                placeholder="Tell students about your experience, teaching style, and why you're passionate about mentoring..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Years of Experience *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.experience}
                                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                                className="input-field w-full"
                                                placeholder="e.g., 5 years in web development"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Hourly Rate (USD) *
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl font-semibold text-gray-900">$</span>
                                                <input
                                                    type="number"
                                                    required
                                                    min="15"
                                                    max="500"
                                                    value={formData.hourlyRate}
                                                    onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) })}
                                                    className="input-field flex-1"
                                                    placeholder="50"
                                                />
                                                <span className="text-gray-600">/hour</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Specializations */}
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span>🎯</span> Specializations
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-4">Select your areas of expertise</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {SPECIALIZATIONS.map((spec) => (
                                            <label key={spec} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-blue-50 transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.specializations.includes(spec)}
                                                    onChange={() => handleSpecializationChange(spec)}
                                                    className="w-4 h-4 rounded"
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {spec.replace('-', ' ').toUpperCase()}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span>⚡</span> Key Skills
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={skillInput}
                                                onChange={(e) => setSkillInput(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        addSkill();
                                                    }
                                                }}
                                                className="input-field flex-1"
                                                placeholder="Add a skill (e.g., React, Python, Docker)"
                                            />
                                            <button
                                                type="button"
                                                onClick={addSkill}
                                                className="button-secondary"
                                            >
                                                Add
                                            </button>
                                        </div>

                                        {formData.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {formData.skills.map((skill, idx) => (
                                                    <div key={idx} className="badge-primary flex items-center gap-2">
                                                        {skill.name}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSkill(idx)}
                                                            className="ml-2 hover:text-red-700"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <span>🔗</span> Professional Links
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                LinkedIn Profile
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.linkedIn}
                                                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                                                className="input-field w-full"
                                                placeholder="https://linkedin.com/in/yourprofile"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                GitHub Profile
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.github}
                                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                                className="input-field w-full"
                                                placeholder="https://github.com/yourprofile"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">
                                                Portfolio Website
                                            </label>
                                            <input
                                                type="url"
                                                value={formData.portfolio}
                                                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                                                className="input-field w-full"
                                                placeholder="https://yourportfolio.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="p-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="button-primary w-full py-3 text-lg font-semibold"
                                    >
                                        {loading ? 'Creating Profile...' : '🚀 Become a Mentor'}
                                    </button>
                                    <p className="text-xs text-gray-600 text-center mt-4">
                                        By submitting, you agree to our mentoring terms and conditions
                                    </p>
                                </div>
                            </form>
                        </div>

                        {/* Benefits Section */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="card-lg p-6 text-center">
                                <div className="text-4xl mb-3">💰</div>
                                <h3 className="font-bold text-gray-900 mb-2">Earn Money</h3>
                                <p className="text-sm text-gray-600">Set your own hourly rate and earn for each session</p>
                            </div>
                            <div className="card-lg p-6 text-center">
                                <div className="text-4xl mb-3">🌱</div>
                                <h3 className="font-bold text-gray-900 mb-2">Make Impact</h3>
                                <p className="text-sm text-gray-600">Help students achieve their learning goals</p>
                            </div>
                            <div className="card-lg p-6 text-center">
                                <div className="text-4xl mb-3">🎓</div>
                                <h3 className="font-bold text-gray-900 mb-2">Build Reputation</h3>
                                <p className="text-sm text-gray-600">Grow your professional network and visibility</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
