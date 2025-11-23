'use client';

import { useEffect, useState } from 'react';
import { AdminService, AdminCommunity } from '@/services/admin.service';
import { AppError } from '@/utils/errorHandling';

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<AdminCommunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await AdminService.getAllCommunities();
        setCommunities(data);
      } catch (err) {
        console.error('Failed to fetch communities:', err);
        setError(err instanceof AppError ? err.message : 'Failed to load communities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const filteredCommunities = communities.filter((community) => {
    const matchesSearch =
      community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      community.creatorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'all' ||
      (selectedStatus === 'active' && !community.isSuspended) ||
      (selectedStatus === 'suspended' && community.isSuspended);

    return matchesSearch && matchesStatus;
  });

  const handleSuspendCommunity = async (communityId: string) => {
    try {
      await AdminService.suspendCommunity(communityId);
      setCommunities(communities.map(community =>
        community.id === communityId
          ? { ...community, isSuspended: true }
          : community
      ));
    } catch (err) {
      console.error('Failed to suspend community:', err);
      setError(err instanceof AppError ? err.message : 'Failed to suspend community');
    }
  };

  const handleUnsuspendCommunity = async (communityId: string) => {
    try {
      await AdminService.unsuspendCommunity(communityId);
      setCommunities(communities.map(community =>
        community.id === communityId
          ? { ...community, isSuspended: false }
          : community
      ));
    } catch (err) {
      console.error('Failed to unsuspend community:', err);
      setError(err instanceof AppError ? err.message : 'Failed to unsuspend community');
    }
  };

  const handleDeleteCommunity = async (communityId: string) => {
    if (!confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      return;
    }

    try {
      await AdminService.deleteCommunity(communityId);
      setCommunities(communities.filter(community => community.id !== communityId));
    } catch (err) {
      console.error('Failed to delete community:', err);
      setError(err instanceof AppError ? err.message : 'Failed to delete community');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Error</div>
          <div className="text-gray-600 dark:text-gray-400">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Community Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor and manage community settings</p>
            </div>
            <div className="mt-4 sm:mt-0 text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Communities</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{filteredCommunities.length}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Communities
              </label>
              <input
                type="text"
                placeholder="Search communities by name, description, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            <div className="lg:w-64">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status Filter
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
              >
                <option value="all">All Communities</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => (
          <div
            key={community.id}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border ${
              community.isSuspended ? 'border-red-200 dark:border-red-800' : 'border-gray-200 dark:border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                {community.name.charAt(0).toUpperCase()}
              </div>
              {community.isSuspended && (
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  Suspended
                </span>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {community.name}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
              {community.description}
            </p>

            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center justify-between">
                <span>Created by {community.creatorName}</span>
                <span>{new Date(community.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>{community.memberCount} members</span>
                <span>{community.postCount} posts</span>
              </div>
            </div>

            <div className="flex gap-2">
              {community.isSuspended ? (
                <button
                  onClick={() => handleUnsuspendCommunity(community.id)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                >
                  Unsuspend
                </button>
              ) : (
                <button
                  onClick={() => handleSuspendCommunity(community.id)}
                  className="flex-1 px-3 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30 rounded-lg transition-colors"
                >
                  Suspend
                </button>
              )}
              <button
                onClick={() => handleDeleteCommunity(community.id)}
                className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredCommunities.length === 0 && (
          <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No communities found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}