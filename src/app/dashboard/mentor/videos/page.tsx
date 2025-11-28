'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { MentorService } from '@/services/mentor.service';
import { MentorVideo } from '@/types/mentor.types';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { SubNav, MENTOR_DASHBOARD_NAV } from '@/components/navigation/SubNav';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const MENTOR_VIDEOS_NAV = MENTOR_DASHBOARD_NAV;

export default function MentorVideosPage() {
    const { user } = useAuth();
    const [videos, setVideos] = useState<MentorVideo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        duration: 0,
        tags: '',
    });

    useEffect(() => {
        if (user?.id && user.role === 'mentor') {
            fetchVideos();
        }
    }, [user]);

    const fetchVideos = async () => {
        if (!user?.id) return;
        try {
            setIsLoading(true);
            const mentorProfile = await MentorService.getMentorProfileByUserId(user.id);
            if (mentorProfile) {
                const fetchedVideos = await MentorService.getVideos(mentorProfile.id);
                setVideos(fetchedVideos);
            }
        } catch (err) {
            console.error('Failed to fetch videos:', err);
            setError('Failed to load videos.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user?.id) return;
        
        setIsUploading(true);
        try {
            const mentorProfile = await MentorService.getMentorProfileByUserId(user.id);
            if (!mentorProfile) throw new Error('Mentor profile not found');

            // Create mock new video object (actual upload would be handled by MentorService)
            const newVideo: MentorVideo = {
                id: Date.now().toString(),
                mentorId: mentorProfile.id,
                title: formData.title,
                description: formData.description,
                videoUrl: formData.videoUrl,
                thumbnailUrl: formData.thumbnailUrl,
                duration: parseInt(formData.duration.toString()),
                tags: formData.tags.split(',').map(tag => tag.trim()),
                views: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            setVideos(prev => [newVideo, ...prev]);
            setFormData({ title: '', description: '', videoUrl: '', thumbnailUrl: '', duration: 0, tags: '' });
            setShowUploadForm(false);
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Failed to upload video');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (videoId: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            // In a real app, call MentorService to delete
            setVideos(prev => prev.filter(v => v.id !== videoId));
        } catch (err) {
            console.error('Delete failed:', err);
            setError('Failed to delete video');
        }
    };

    if (isLoading) {
        return (
            <ProtectedRoute>
                <div className="section">
                    <div className="section-container">
                        <div className="flex items-center justify-center py-20">
                            <LoadingSpinner />
                        </div>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
                <div className="section">
                    <div className="section-container">
                        {/* SubNav */}
                        <SubNav items={MENTOR_VIDEOS_NAV} showBorder={true} />

                        {/* Header with Upload Button */}
                        <div className="section-header mb-8 flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">Mentor Videos</h1>
                                <p className="section-subtitle">Manage your tutorial and teaching videos</p>
                            </div>
                            <button
                                onClick={() => setShowUploadForm(!showUploadForm)}
                                className="button-primary mt-2 whitespace-nowrap"
                            >
                                {showUploadForm ? '✕ Cancel' : '+ Upload Video'}
                            </button>
                        </div>

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

                        {/* Upload Form */}
                        {showUploadForm && (
                            <div className="card-lg mb-8 border-2 border-blue-200 bg-blue-50">
                                <h3 className="card-title mb-6">📹 Upload New Video</h3>
                                <form onSubmit={handleUpload} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Video Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g., Python Basics - Variables & Data Types"
                                            className="input-field w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            placeholder="Describe what students will learn in this video..."
                                            className="input-field w-full"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">Video URL</label>
                                            <input
                                                type="url"
                                                name="videoUrl"
                                                value={formData.videoUrl}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="https://youtube.com/watch?v=..."
                                                className="input-field w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-2">Duration (minutes)</label>
                                            <input
                                                type="number"
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                min="1"
                                                placeholder="15"
                                                className="input-field w-full"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">Tags (comma-separated)</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            placeholder="python, programming, beginner"
                                            className="input-field w-full"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isUploading}
                                            className="button-primary flex-1"
                                        >
                                            {isUploading ? 'Uploading...' : 'Upload Video'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowUploadForm(false)}
                                            className="button-secondary flex-1"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Videos Grid */}
                        {videos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.map((video) => (
                                    <div key={video.id} className="card-lg group hover:shadow-lg transition-shadow overflow-hidden">
                                        {/* Thumbnail */}
                                        <div className="relative w-full h-40 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                                            {video.thumbnailUrl ? (
                                                <img
                                                    src={video.thumbnailUrl}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50">
                                                    <span className="text-3xl">🎥</span>
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-semibold">
                                                {video.duration} min
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="font-bold text-gray-900 line-clamp-2 mb-2">{video.title}</h3>
                                        <p className="text-xs text-gray-600 line-clamp-2 mb-4">{video.description}</p>

                                        {/* Tags */}
                                        {video.tags && video.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {video.tags.slice(0, 2).map((tag) => (
                                                    <span key={tag} className="badge-secondary text-xs">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {video.tags.length > 2 && (
                                                    <span className="text-xs text-gray-600">+{video.tags.length - 2} more</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex gap-2 pt-4 border-t">
                                            <a
                                                href={video.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="button-secondary flex-1 text-center text-sm"
                                            >
                                                View
                                            </a>
                                            <button
                                                onClick={() => handleDelete(video.id)}
                                                className="button-tertiary flex-1"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card-lg border-2 border-blue-200 bg-blue-50 p-12 text-center rounded-lg">
                                <div className="text-4xl mb-3">🎥</div>
                                <h3 className="text-xl font-semibold text-blue-900 mb-2">No Videos Yet</h3>
                                <p className="text-blue-700 mb-6">
                                    Start building your video library to help students learn better.
                                </p>
                                <button
                                    onClick={() => setShowUploadForm(true)}
                                    className="button-primary inline-block"
                                >
                                    Upload Your First Video
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
