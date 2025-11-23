/**
 * Firestore Utilities
 * Helper functions for working with Firestore data
 */

import { Timestamp } from 'firebase/firestore';
import type { Post } from '@/types/community.types';

/**
 * Convert Firestore Timestamp to ISO string
 */
export function timestampToString(timestamp: Timestamp | string | undefined): string | undefined {
    if (!timestamp) return undefined;
    if (typeof timestamp === 'string') return timestamp;
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate().toISOString();
    }
    return undefined;
}

/**
 * Convert ISO string to Firestore Timestamp
 */
export function stringToTimestamp(dateString: string | Timestamp | undefined): Timestamp | undefined {
    if (!dateString) return undefined;
    if (dateString instanceof Timestamp) return dateString;
    if (typeof dateString === 'string') {
        return Timestamp.fromDate(new Date(dateString));
    }
    return undefined;
}

/**
 * Serialize a Post object for Redux storage
 * Converts all Timestamp objects to ISO strings
 */
export function serializePost(post: any): Post {
    return {
        ...post,
        createdAt: timestampToString(post.createdAt) as any,
        updatedAt: timestampToString(post.updatedAt) as any,
        publishedAt: post.publishedAt ? timestampToString(post.publishedAt) as any : undefined,
        viewedBy: post.viewedBy
            ? Object.entries(post.viewedBy).reduce((acc, [userId, timestamp]) => {
                acc[userId] = timestampToString(timestamp as Timestamp) as any;
                return acc;
            }, {} as Record<string, any>)
            : {},
    };
}

/**
 * Serialize an array of posts
 */
export function serializePosts(posts: any[]): Post[] {
    return posts.map(serializePost);
}

/**
 * Deserialize a Post object from Redux storage
 * Converts ISO strings back to Timestamp objects for Firestore operations
 */
export function deserializePost(post: Post): any {
    return {
        ...post,
        createdAt: stringToTimestamp(post.createdAt as any),
        updatedAt: stringToTimestamp(post.updatedAt as any),
        publishedAt: post.publishedAt ? stringToTimestamp(post.publishedAt as any) : undefined,
        viewedBy: post.viewedBy
            ? Object.entries(post.viewedBy).reduce((acc, [userId, dateString]) => {
                const timestamp = stringToTimestamp(dateString as any);
                if (timestamp) {
                    acc[userId] = timestamp;
                }
                return acc;
            }, {} as Record<string, Timestamp>)
            : {},
    };
}
