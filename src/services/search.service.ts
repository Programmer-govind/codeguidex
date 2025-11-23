import {
  collection,
  query,
  where,
  getDocs,
  QueryConstraint,
  orderBy,
  limit,
  QueryDocumentSnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@config/firebase.config';

/**
 * Search result item from any collection
 */
export interface SearchResult {
  id: string;
  type: 'post' | 'community' | 'user';
  title: string;
  description: string;
  metadata: Record<string, any>;
  relevanceScore: number;
}

/**
 * Search query parameters
 */
export interface SearchQuery {
  searchTerm: string;
  type?: 'post' | 'community' | 'user' | 'all';
  filters?: SearchFilters;
  sortBy?: 'relevance' | 'newest' | 'popular';
  pageSize?: number;
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>;
}

/**
 * Advanced search filters
 */
export interface SearchFilters {
  communityId?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  tags?: string[];
  authorId?: string;
  minVotes?: number;
}

/**
 * Search Service - Handles multi-type search across posts, communities, and users
 */
export class SearchService {
  private static readonly SEARCH_RESULT_LIMIT = 20;

  /**
   * Performs multi-type search across posts, communities, and users
   * @param searchQuery - Search parameters
   * @returns Array of search results
   */
  static async search(searchQuery: SearchQuery): Promise<SearchResult[]> {
    const { searchTerm, type = 'all', filters, sortBy = 'relevance', pageSize = this.SEARCH_RESULT_LIMIT } = searchQuery;

    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const results: SearchResult[] = [];

    try {
      // Search across requested types
      if (type === 'all' || type === 'post') {
        const postResults = await this.searchPosts(searchTerm, filters, sortBy, pageSize);
        results.push(...postResults);
      }

      if (type === 'all' || type === 'community') {
        const communityResults = await this.searchCommunities(searchTerm, filters, sortBy, pageSize);
        results.push(...communityResults);
      }

      if (type === 'all' || type === 'user') {
        const userResults = await this.searchUsers(searchTerm, filters, sortBy, pageSize);
        results.push(...userResults);
      }

      // Sort results by relevance or specified sort
      return this.sortResults(results, sortBy);
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Search failed. Please try again.');
    }
  }

  /**
   * Search for posts by title, content, and tags
   */
  private static async searchPosts(
    searchTerm: string,
    filters?: SearchFilters,
    sortBy?: string,
    pageSize?: number
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const postsCollection = collection(db, 'posts');
    const constraints: QueryConstraint[] = [];

    // Add community filter if specified
    if (filters?.communityId) {
      constraints.push(where('community', '==', filters.communityId));
    }

    // Add minimum votes filter
    if (filters?.minVotes !== undefined) {
      constraints.push(where('upvotes', '>=', filters.minVotes));
    }

    // Build query
    if (sortBy === 'newest' || sortBy === 'popular') {
      const sortField = sortBy === 'newest' ? 'createdAt' : 'upvotes';
      constraints.push(orderBy(sortField, 'desc'));
    }

    constraints.push(limit(pageSize || this.SEARCH_RESULT_LIMIT));

    try {
      const q = query(postsCollection, ...constraints);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const relevanceScore = this.calculateRelevance(searchTerm, data.title, data.content);

        if (relevanceScore > 0) {
          results.push({
            id: doc.id,
            type: 'post',
            title: data.title,
            description: data.content.substring(0, 150),
            metadata: {
              author: data.author,
              community: data.community,
              upvotes: data.upvotes,
              downvotes: data.downvotes,
              views: data.viewCount,
              tags: data.tags,
              createdAt: data.createdAt,
            },
            relevanceScore,
          });
        }
      });
    } catch (error) {
      console.error('Error searching posts:', error);
    }

    return results;
  }

  /**
   * Search for communities by name, description, and tags
   */
  private static async searchCommunities(
    searchTerm: string,
    filters?: SearchFilters,
    sortBy?: string,
    pageSize?: number
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const communitiesCollection = collection(db, 'communities');
    const constraints: QueryConstraint[] = [
      where('visibility', '==', 'public'), // Only search public communities
    ];

    if (sortBy === 'newest' || sortBy === 'popular') {
      const sortField = sortBy === 'newest' ? 'createdAt' : 'memberCount';
      constraints.push(orderBy(sortField, 'desc'));
    }

    constraints.push(limit(pageSize || this.SEARCH_RESULT_LIMIT));

    try {
      const q = query(communitiesCollection, ...constraints);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const relevanceScore = this.calculateRelevance(searchTerm, data.name, data.description);

        if (relevanceScore > 0) {
          // Apply tag filter if specified
          if (filters?.tags && filters.tags.length > 0) {
            const hasMatchingTag = filters.tags.some((tag) => (data.tags || []).includes(tag));
            if (!hasMatchingTag) return;
          }

          results.push({
            id: doc.id,
            type: 'community',
            title: data.name,
            description: data.description,
            metadata: {
              category: data.category,
              tags: data.tags,
              members: data.memberCount,
              visibility: data.visibility,
              creator: data.creator,
              createdAt: data.createdAt,
            },
            relevanceScore,
          });
        }
      });
    } catch (error) {
      console.error('Error searching communities:', error);
    }

    return results;
  }

  /**
   * Search for users by display name, bio, and skills
   */
  private static async searchUsers(
    searchTerm: string,
    _filters?: SearchFilters,
    sortBy?: string,
    pageSize?: number
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];
    const usersCollection = collection(db, 'users');
    const constraints: QueryConstraint[] = [];

    if (sortBy === 'newest') {
      constraints.push(orderBy('createdAt', 'desc'));
    }

    constraints.push(limit(pageSize || this.SEARCH_RESULT_LIMIT));

    try {
      const q = query(usersCollection, ...constraints);
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const relevanceScore =
          this.calculateRelevance(searchTerm, data.displayName, data.bio) +
          (data.skills ? this.calculateRelevance(searchTerm, data.skills.join(' '), '') : 0);

        if (relevanceScore > 0) {
          results.push({
            id: doc.id,
            type: 'user',
            title: data.displayName,
            description: data.bio,
            metadata: {
              role: data.role,
              skills: data.skills,
              menteeCount: data.menteeCount,
              rating: data.rating,
              profilePicture: data.profilePicture,
              createdAt: data.createdAt,
            },
            relevanceScore,
          });
        }
      });
    } catch (error) {
      console.error('Error searching users:', error);
    }

    return results;
  }

  /**
   * Calculate relevance score based on search term matches
   * Higher score = more relevant
   */
  private static calculateRelevance(searchTerm: string, text1: string = '', text2: string = ''): number {
    const term = searchTerm.toLowerCase();
    let score = 0;

    const fullText = `${text1} ${text2}`.toLowerCase();

    // Exact match bonus
    if (fullText === term) score += 100;
    // Starts with term
    else if (fullText.startsWith(term)) score += 50;
    // Contains term
    else if (fullText.includes(term)) score += 25;

    // Additional scoring for each word match
    const words = term.split(' ');
    words.forEach((word) => {
      if (fullText.includes(word)) score += 5;
    });

    return score;
  }

  /**
   * Sort search results by specified criteria
   */
  private static sortResults(results: SearchResult[], sortBy: string = 'relevance'): SearchResult[] {
    const sorted = [...results];

    if (sortBy === 'relevance') {
      sorted.sort((a, b) => b.relevanceScore - a.relevanceScore);
    } else if (sortBy === 'newest') {
      sorted.sort((a, b) => {
        const dateA = new Date(a.metadata.createdAt?.toDate?.() || 0).getTime();
        const dateB = new Date(b.metadata.createdAt?.toDate?.() || 0).getTime();
        return dateB - dateA;
      });
    } else if (sortBy === 'popular') {
      sorted.sort((a, b) => {
        const scoreA = (a.metadata.upvotes || 0) + (a.metadata.members || 0);
        const scoreB = (b.metadata.upvotes || 0) + (b.metadata.members || 0);
        return scoreB - scoreA;
      });
    }

    return sorted;
  }

  /**
   * Get search suggestions based on partial input
   */
  static async getSuggestions(partialTerm: string, type?: 'post' | 'community' | 'user'): Promise<string[]> {
    const suggestions: Set<string> = new Set();

    try {
      if (!type || type === 'post') {
        const postSuggestions = await this.getPostSuggestions(partialTerm);
        postSuggestions.forEach((s) => suggestions.add(s));
      }

      if (!type || type === 'community') {
        const communitySuggestions = await this.getCommunitySuggestions(partialTerm);
        communitySuggestions.forEach((s) => suggestions.add(s));
      }

      if (!type || type === 'user') {
        const userSuggestions = await this.getUserSuggestions(partialTerm);
        userSuggestions.forEach((s) => suggestions.add(s));
      }

      return Array.from(suggestions).slice(0, 10);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  /**
   * Get post suggestions
   */
  private static async getPostSuggestions(partialTerm: string): Promise<string[]> {
    try {
      const postsCollection = collection(db, 'posts');
      const q = query(postsCollection, limit(10));
      const querySnapshot = await getDocs(q);

      const suggestions: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.title.toLowerCase().includes(partialTerm.toLowerCase())) {
          suggestions.push(data.title);
        }
      });

      return suggestions;
    } catch (error) {
      console.error('Error getting post suggestions:', error);
      return [];
    }
  }

  /**
   * Get community suggestions
   */
  private static async getCommunitySuggestions(partialTerm: string): Promise<string[]> {
    try {
      const communitiesCollection = collection(db, 'communities');
      const q = query(communitiesCollection, where('visibility', '==', 'public'), limit(10));
      const querySnapshot = await getDocs(q);

      const suggestions: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name.toLowerCase().includes(partialTerm.toLowerCase())) {
          suggestions.push(data.name);
        }
      });

      return suggestions;
    } catch (error) {
      console.error('Error getting community suggestions:', error);
      return [];
    }
  }

  /**
   * Get user suggestions
   */
  private static async getUserSuggestions(partialTerm: string): Promise<string[]> {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, limit(10));
      const querySnapshot = await getDocs(q);

      const suggestions: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.displayName.toLowerCase().includes(partialTerm.toLowerCase())) {
          suggestions.push(data.displayName);
        }
      });

      return suggestions;
    } catch (error) {
      console.error('Error getting user suggestions:', error);
      return [];
    }
  }

  /**
   * Track search query for analytics/history
   */
  static async trackSearch(_userId: string, searchTerm: string, resultsCount: number): Promise<void> {
    try {
      // This would typically be stored in a searchHistory collection
      console.log(`Search tracked: "${searchTerm}" (${resultsCount} results)`);
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  }
}
