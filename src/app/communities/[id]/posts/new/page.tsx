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
            <div className="container mx-auto px-4 py-8">
                <ErrorMessage message="Community not found" type="error" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorMessage message="You must be logged in to create a post" type="error" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Community
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Post</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Share your knowledge with the <span className="font-semibold">{community.name}</span> community
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
                    {error && (
                        <div className="mb-6">
                            <ErrorMessage message={error} type="error" />
                        </div>
                    )}

                    {/* Post Type */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                            Post Type
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {['discussion', 'question', 'tutorial'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: type as any })}
                                    className={`p-4 rounded-xl border-2 transition-all ${formData.type === type
                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <span className={`font-semibold capitalize ${formData.type === type ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'
                                        }`}>
                                        {type}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-6">
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Enter a descriptive title..."
                            required
                            minLength={5}
                            maxLength={200}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formData.title.length}/200 characters
                        </p>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Brief description of your post..."
                            rows={3}
                            required
                            minLength={10}
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formData.description.length}/500 characters
                        </p>
                    </div>

                    {/* Content */}
                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                            placeholder="Write your detailed content here..."
                            rows={12}
                            required
                            maxLength={10000}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formData.content.length}/10,000 characters
                        </p>
                    </div>

                    {/* Code Snippet (Optional) */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Code Snippet (Optional)
                        </label>
                        <div className="mb-3">
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
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm bg-gray-50 dark:bg-gray-900"
                            placeholder="Paste your code here..."
                            rows={8}
                        />
                    </div>

                    {/* Tags */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                            Tags
                        </label>
                        <div className="flex gap-2 mb-3">
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
                                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Add a tag..."
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                            >
                                Add
                            </button>
                        </div>
                        {formData.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            {isCreating ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Creating...
                                </>
                            ) : (
                                'Create Post'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
