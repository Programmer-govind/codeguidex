'use client';

import Link from 'next/link';
import { SearchResult } from '@services/search.service';

interface SearchResultCardProps {
  result: SearchResult;
  onClick?: () => void;
}

/**
 * SearchResultCard Component - Individual search result display
 */
export function SearchResultCard({ result, onClick }: SearchResultCardProps) {
  const getResultLink = (): string => {
    switch (result.type) {
      case 'post':
        return `/communities/${result.metadata.community}/posts/${result.id}`;
      case 'community':
        return `/communities/${result.id}`;
      case 'user':
        return `/profile/${result.id}`;
      default:
        return '#';
    }
  };

  const getTypeColor = (): string => {
    switch (result.type) {
      case 'post':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'community':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'user':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = () => {
    switch (result.type) {
      case 'post':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 5a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
            <path d="M12.586 4.586a2 2 0 112.828 2.828L13.414 7.414a1 1 0 00-.293.707v2.828a2 2 0 11-2.828-2.828l2.829-2.829a1 1 0 00.293-.707V4.586z" />
          </svg>
        );
      case 'community':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 16a3 3 0 11-6 0 3 3 0 016 0zM14.5 9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'user':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Link href={getResultLink()}>
      <div
        onClick={onClick}
        className="
          block p-4
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg hover:shadow-md dark:hover:shadow-lg
          transition-all duration-200
          cursor-pointer hover:border-blue-300 dark:hover:border-blue-600
        "
      >
        {/* Header with Type Badge and Title */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {result.title}
            </h4>
          </div>
          <div className={`ml-3 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 whitespace-nowrap ${getTypeColor()}`}>
            {getTypeIcon()}
            {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {result.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-500">
          {result.type === 'post' && (
            <>
              {result.metadata.upvotes !== undefined && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v-6a1.5 1.5 0 01-3 0v6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  {result.metadata.upvotes} upvotes
                </span>
              )}
              {result.metadata.views !== undefined && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {result.metadata.views} views
                </span>
              )}
            </>
          )}

          {result.type === 'community' && (
            <>
              {result.metadata.members !== undefined && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                  {result.metadata.members} members
                </span>
              )}
              {result.metadata.tags?.length > 0 && (
                <span className="flex items-center gap-1">
                  {result.metadata.tags.slice(0, 2).join(', ')}
                  {result.metadata.tags.length > 2 && `+${result.metadata.tags.length - 2}`}
                </span>
              )}
            </>
          )}

          {result.type === 'user' && (
            <>
              {result.metadata.role && (
                <span className="capitalize">{result.metadata.role}</span>
              )}
              {result.metadata.rating !== undefined && result.metadata.rating > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {result.metadata.rating}
                </span>
              )}
            </>
          )}

          {/* Relevance Score */}
          {result.relevanceScore > 0 && (
            <span className="ml-auto text-xs text-gray-400">
              {Math.round(result.relevanceScore)}% match
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
