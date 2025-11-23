import React, { useState } from 'react';
import { MentorProfile, CreateBookingData } from '@/types/mentor.types';

interface BookingFormProps {
    mentor: MentorProfile;
    onSubmit: (data: CreateBookingData) => Promise<void>;
    isSubmitting: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({ mentor, onSubmit, isSubmitting }) => {
    const [formData, setFormData] = useState<CreateBookingData>({
        mentorId: mentor.id,
        topic: '',
        description: '',
        preferredDate: '',
        preferredTime: '',
        duration: 60,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const calculateTotal = () => {
        return (mentor.hourlyRate * formData.duration) / 60;
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Session Topic
                </label>
                <input
                    type="text"
                    required
                    placeholder="e.g., React Hooks, Career Advice, Code Review"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                </label>
                <textarea
                    required
                    rows={4}
                    placeholder="Describe what you'd like to discuss..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Date
                    </label>
                    <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Preferred Time
                    </label>
                    <input
                        type="time"
                        required
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration
                </label>
                <div className="grid grid-cols-3 gap-4">
                    {[30, 60, 90].map((duration) => (
                        <button
                            key={duration}
                            type="button"
                            onClick={() => setFormData({ ...formData, duration })}
                            className={`px-4 py-2 rounded-lg border ${formData.duration === duration
                                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-700 dark:text-blue-300'
                                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            {duration} min
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Rate</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        ${mentor.hourlyRate}/hour
                    </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-600 dark:text-gray-400">Duration</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                        {formData.duration} minutes
                    </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${calculateTotal().toFixed(2)}
                    </span>
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
            </button>
        </form>
    );
};
