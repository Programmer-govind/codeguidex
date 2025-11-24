'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCreatePost } from '@/hooks/usePost';
import { useFetchCommunity } from '@/hooks/useCommunity';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import type { CreatePostRequest } from '@/types/community.types';

interface NewPostPageProps {
    params: {
        id: string;
    };
}

export default function NewPostPage({ params }: NewPostPageProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { community, isLoading: loadingCommunity } = useFetchCommunity(params.id);
    const { createPost, isCreating, error } = useCreatePost();

    const [formData, setFormData] = useState<CreatePostRequest>({
        title: '',
        description: '',
        content: '',
        type: 'discussion',
        tags: [],
        codeSnippet: undefined,
        images: [],
    });

    const [currentTag, setCurrentTag] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert('You must be logged in to create a post');
            return;
        }

        try {
            await createPost(params.id, formData, user.id, user.displayName);
            router.push(`/communities/${params.id}`);
        } catch (err) {
            console.error('Failed to create post:', err);
        }
    };

    const handleAddTag = () => {
        if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
            setFormData({
                ...formData,
                tags: [...formData.tags, currentTag.trim()],
            });
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((tag) => tag !== tagToRemove),
        });
    };

    if (loadingCommunity) {
        return <LoadingSpinner fullPage message="Loading..." />;
    }

    if (!community) {
        return (
            <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12">
                <ErrorMessage message="Community not found" type="error" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-12">
                <ErrorMessage message="You must be logged in to create a post" type="error" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-purple-50/30 py-12">
            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
                {/* Header */}
                <div className="mb-10">
                    <button
                        onClick={() => router.back()}
                        className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold mb-6 flex items-center gap-2 transition-colors group"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Community
                    </button>
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Create New Post</h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Share your knowledge with the <span className="font-semibold text-indigo-600 dark:text-indigo-400">{community.name}</span> community
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass-card rounded-3xl border border-gray-100 dark:border-gray-700 p-10 shadow-xl space-y-8">
                    {error && (
                        <div className="mb-6">
                            <ErrorMessage message={error} type="error" />
                        </div>
                    )}

                    {/* Post Type */}
                    <div>
                        <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
                            Post Type
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { type: 'discussion', icon: '💬', label: 'Discussion' },
                                { type: 'question', icon: '❓', label: 'Question' },
                                { type: 'tutorial', icon: '📚', label: 'Tutorial' }
                            ].map(({ type, icon, label }) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: type as any })}
                                    className={`p-5 rounded-2xl border-2 transition-all transform hover:scale-105 ${formData.type === type
                                            ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 shadow-lg'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{icon}</div>
                                    <span className={`font-semibold text-base ${formData.type === type ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-base font-bold text-gray-900 dark:text-white mb-3">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all dark:bg-gray-800/50 dark:text-white text-base"
                            placeholder="Enter a descriptive title..."
                            required
                            minLength={5}
                            maxLength={200}
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formData.title.length}/200 characters
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-base font-bold text-gray-900 dark:text-white mb-3">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all dark:bg-gray-800/50 dark:text-white text-base resize-none"
                            placeholder="Brief description of your post..."
                            rows={4}
                            required
                            minLength={10}
                            maxLength={500}
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {formData.description.length}/500 characters
                        </p>
                    </div>

                    {/* Content */}
                    <div>
                        <label htmlFor="content" className="block text-base font-bold text-gray-900 dark:text-white mb-3">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all dark:bg-gray-800/50 dark:text-white font-mono text-sm resize-none"
                            placeholder="Write your detailed content here..."
                            rows={14}
                            required
                            maxLength={10000}
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {formData.content.length}/10,000 characters
                        </p>
                    </div>

                    {/* Code Snippet (Optional) */}
                    <div className="bg-gradient-to-br from-gray-50 to-indigo-50/30 dark:from-gray-800/30 dark:to-indigo-900/10 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                        <label className="block text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Code Snippet (Optional)
                        </label>
                        <div className="mb-4">
                            <select
                                value={formData.codeSnippet?.language || 'javascript'}
                                onChange={(e) => {
                                    if (formData.codeSnippet) {
                                        setFormData({
                                            ...formData,
                                            codeSnippet: {
                                                ...formData.codeSnippet,
                                                language: e.target.value
                                            }
                                        });
                                    } else {
                                        setFormData({
                                            ...formData,
                                            codeSnippet: {
                                                language: e.target.value,
                                                code: ''
                                            }
                                        });
                                    }
                                }}
                                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all dark:bg-gray-800/50 dark:text-white font-medium"
                            >
                                <option value="javascript">JavaScript</option>
                                <option value="typescript">TypeScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="csharp">C#</option>
                                <option value="go">Go</option>
                                <option value="rust">Rust</option>
                                <option value="html">HTML</option>
                                <option value="css">CSS</option>
                                <option value="sql">SQL</option>
                                <option value="bash">Bash</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <textarea
                            id="codeSnippet"
                            value={formData.codeSnippet?.code || ''}
                            onChange={(e) => {
                                if (e.target.value.trim()) {
                                    setFormData({
                                        ...formData,
                                        codeSnippet: {
                                            language: formData.codeSnippet?.language || 'javascript',
                                            code: e.target.value
                                        }
                                    });
                                } else {
                                    setFormData({ ...formData, codeSnippet: undefined });
                                }
                            }}
                            className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all dark:bg-gray-900/50 dark:text-white font-mono text-sm bg-gray-900 text-green-400 resize-none"
                            placeholder="Paste your code here..."
                            rows={10}
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            Tags
                        </label>
                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                className="flex-1 px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all dark:bg-gray-800/50 dark:text-white"
                                placeholder="Add a tag..."
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-md hover:shadow-lg transition-all"
                            >
                                Add
                            </button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {formData.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl font-semibold shadow-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-bold text-lg"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-8 border-t-2 border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-bold text-base transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                        >
                            {isCreating ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Creating Post...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Post
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
