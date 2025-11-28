'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PostCard } from '@/components/post/PostCard';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import type { Post } from '@/types/community.types';

type SortOption = 'newest' | 'oldest' | 'most-voted' | 'most-viewed';
type FilterOption = 'all' | 'question' | 'discussion' | 'resource';

// Helper function to safely extract timestamp value for sorting
const getTimestampValue = (timestamp: any): number => {
  if (typeof timestamp === 'string') {
    return new Date(timestamp).getTime();
  }
  if (timestamp && 'seconds' in timestamp) {
    return timestamp.seconds * 1000;
  }
  return 0;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch posts from API (removed mock data)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/posts');
        
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.data || []);
      } catch (err) {
        console.error('Error fetching posts:', err);
        // Set empty state if no API is available yet
        setPosts([]);
        setError(null);
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
          return (b.votes?.totalVotes || 0) - (a.votes?.totalVotes || 0);
        case 'most-viewed':
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

  return (
    <div className="section">
      <div className="section-container">
        {/* Header */}
        <div className="section-header">
          <h1>All Posts</h1>
          <p className="section-subtitle">
            Browse and discover posts from all communities
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Search Input */}
            <div className="form-group">
              <label className="form-label">Search Posts</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, description, or tags..."
                className="form-input"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="form-group">
              <label className="form-label">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="form-select"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="most-voted">Most Voted</option>
                <option value="most-viewed">Most Viewed</option>
              </select>
            </div>

            {/* Filter Type */}
            <div className="form-group">
              <label className="form-label">Filter Type</label>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="form-select"
              >
                <option value="all">All Types</option>
                <option value="question">Questions</option>
                <option value="discussion">Discussions</option>
                <option value="resource">Resources</option>
              </select>
            </div>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {(['all', 'question', 'discussion', 'resource'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterBy(filter)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterBy === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'question' ? 'Questions' :
                  filter === 'discussion' ? 'Discussions' :
                    filter === 'resource' ? 'Resources' :
                      'All Posts'}
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} type="error" />
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="empty-state">
            <LoadingSpinner />
            <p className="empty-state-description">Loading posts...</p>
          </div>
        ) : filteredAndSortedPosts.length === 0 ? (
          /* Empty State */
          <div className="empty-state card">
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">No posts found</h3>
            <p className="empty-state-description">
              {searchTerm || filterBy !== 'all'
                ? 'Try adjusting your filters or search terms to find posts.'
                : 'No posts yet. Be the first to create one!'}
            </p>
            <Link href="/communities" className="btn-primary">
              Browse Communities
            </Link>
          </div>
        ) : (
          /* Posts Grid */
          <>
            <div className="grid-cards">
              {filteredAndSortedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  communityId={(post as any).communityId || 'general'}
                  userVote={null}
                  onVote={() => {}}
                />
              ))}
            </div>

            {/* Results Summary */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-900">
                  {filteredAndSortedPosts.length}
                </span>
                {' '}post{filteredAndSortedPosts.length !== 1 ? 's' : ''} found
                {(searchTerm || filterBy !== 'all') && ' matching your criteria'}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
