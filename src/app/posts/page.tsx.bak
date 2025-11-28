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
    <div className="posts-container">
      {/* Header */}
      <div className="posts-header">
        <h1 className="posts-title">All Posts</h1>
        <p className="posts-subtitle">
          Browse and discover posts from all communities
        </p>
        <Link href="/communities" className="btn-primary">
          Browse Communities
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="posts-filters">
        <div className="filter-group">
          <label className="filter-label">Search</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search posts..."
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Filter by Type</label>
          <div className="filter-buttons">
            {(['all', 'question', 'discussion', 'resource'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterBy(filter)}
                className={`filter-button ${filterBy === filter ? 'filter-button-active' : 'filter-button-inactive'
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

        <div className="filter-group">
          <label className="filter-label">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="filter-select"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="most-voted">Most Voted</option>
            <option value="most-viewed">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Posts List */}
      {error && <ErrorMessage message={error} type="error" />}

      {isLoading ? (
        <div className="loading-container">
          <LoadingSpinner />
          <p className="loading-text">Loading posts...</p>
        </div>
      ) : filteredAndSortedPosts.length === 0 ? (
        <div className="empty-container">
          <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="empty-title">No posts found</h3>
          <p className="empty-text">
            {searchTerm || filterBy !== 'all'
              ? 'Try adjusting your filters or search terms.'
              : 'Be the first to create a post in one of our communities!'}
          </p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredAndSortedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              communityId="general" // For now, using a default community ID
              userVote={null}
              onVote={() => { }} // Placeholder - would need community context
            />
          ))}
        </div>
      )}

      {/* Stats */}
      {filteredAndSortedPosts.length > 0 && (
        <div className="posts-stats">
          <p className="posts-stats-text">
            Showing {filteredAndSortedPosts.length} of {posts.length} posts
          </p>
        </div>
      )}
    </div>
  );
}