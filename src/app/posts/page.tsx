'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostCard } from '@/components/post/PostCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import type { Post } from '@/types/community.types';
import { Timestamp } from 'firebase/firestore';

type SortOption = 'newest' | 'oldest' | 'most-voted' | 'most-viewed';
type FilterOption = 'all' | 'question' | 'discussion' | 'resource';

// Helper function to safely extract timestamp value for sorting
const getTimestampValue = (timestamp: Timestamp | string): number => {
  if (typeof timestamp === 'string') {
    return new Date(timestamp).getTime();
  }
  return timestamp.seconds * 1000;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for now - in a real app, this would come from an API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock posts data
        const mockPosts: Post[] = [
          {
            id: '1',
            title: 'How to implement authentication in Next.js 14?',
            description: 'I\'m building a web app with Next.js 14 and need to add user authentication. What are the best practices?',
            content: 'Full content here...',
            authorId: 'user1',
            authorName: 'John Doe',
            type: 'question',
            tags: ['nextjs', 'authentication', 'react'],
            votes: { upvotes: 15, downvotes: 2, totalVotes: 13 },
            userVotes: {},
            comments: { count: 8, totalReplies: 12 },
            views: 245,
            status: 'published',
            isAnswered: false,
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
            updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 } as any,
            viewedBy: {},
            sharedCount: 3,
          },
          {
            id: '2',
            title: 'Best practices for React component design',
            description: 'Share your thoughts on designing reusable React components that are maintainable and scalable.',
            content: 'Full content here...',
            authorId: 'user2',
            authorName: 'Jane Smith',
            type: 'discussion',
            tags: ['react', 'components', 'best-practices'],
            votes: { upvotes: 22, downvotes: 1, totalVotes: 21 },
            userVotes: {},
            comments: { count: 15, totalReplies: 8 },
            views: 189,
            status: 'published',
            createdAt: { seconds: (Date.now() - 86400000) / 1000, nanoseconds: 0 } as any,
            updatedAt: { seconds: (Date.now() - 86400000) / 1000, nanoseconds: 0 } as any,
            viewedBy: {},
            sharedCount: 7,
          },
          {
            id: '3',
            title: 'Complete guide to TypeScript generics',
            description: 'A comprehensive resource on using generics in TypeScript with practical examples.',
            content: 'Full content here...',
            authorId: 'user3',
            authorName: 'Bob Johnson',
            type: 'resource',
            tags: ['typescript', 'generics', 'tutorial'],
            votes: { upvotes: 31, downvotes: 0, totalVotes: 31 },
            userVotes: {},
            comments: { count: 5, totalReplies: 2 },
            views: 567,
            status: 'published',
            createdAt: { seconds: (Date.now() - 172800000) / 1000, nanoseconds: 0 } as any,
            updatedAt: { seconds: (Date.now() - 172800000) / 1000, nanoseconds: 0 } as any,
            viewedBy: {},
            sharedCount: 15,
          },
        ];

        setPosts(mockPosts);
      } catch (err) {
        setError('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter and sort posts
  const filteredAndSortedPosts = posts
    .filter(post => {
      const matchesFilter = filterBy === 'all' || post.type === filterBy;
      const matchesSearch = searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return getTimestampValue(b.createdAt) - getTimestampValue(a.createdAt);
        case 'oldest':
          return getTimestampValue(a.createdAt) - getTimestampValue(b.createdAt);
        case 'most-voted':
          return b.votes.totalVotes - a.votes.totalVotes;
        case 'most-viewed':
          return b.views - a.views;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white py-16 px-6 mb-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl mix-blend-overlay"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Community Posts</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
            Browse questions, discussions, and resources from developers around the world.
          </p>
          <Link href="/communities" className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-medium hover:bg-white/30 transition-colors">
            Browse Communities <span className="ml-2">→</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6">
        {/* Filters and Search */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search posts..."
                  className="input-field pl-10"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Filter by Type</label>
              <div className="flex flex-wrap gap-2">
                {(['all', 'question', 'discussion', 'resource'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterBy(filter)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filterBy === filter
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                  >
                    {filter === 'question' ? 'Questions' :
                      filter === 'discussion' ? 'Discussions' :
                        filter === 'resource' ? 'Resources' :
                          'All'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="input-field cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-voted">Most Voted</option>
                <option value="most-viewed">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {error && <ErrorMessage message={error} type="error" />}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <LoadingSpinner />
            <p className="mt-4 text-slate-500">Loading posts...</p>
          </div>
        ) : filteredAndSortedPosts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No posts found</h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              {searchTerm || filterBy !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Be the first to create a post in one of our communities!'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedPosts.map((post) => (
              <div key={post.id} className="glass-card p-0 overflow-hidden rounded-xl hover:border-indigo-300 transition-colors">
                <PostCard
                  post={post}
                  communityId="general"
                  userVote={null}
                  onVote={() => { }}
                />
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        {filteredAndSortedPosts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{filteredAndSortedPosts.length}</span> of <span className="font-medium text-slate-900">{posts.length}</span> posts
            </p>
          </div>
        )}
      </div>
    </div>
  );
}