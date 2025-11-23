export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  // Posts
  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts',
    GET: (id: string) => `/api/posts/${id}`,
    UPDATE: (id: string) => `/api/posts/${id}`,
    DELETE: (id: string) => `/api/posts/${id}`,
    SEARCH: '/api/posts/search',
    TRENDING: '/api/posts/trending',
    UPVOTE: (id: string) => `/api/posts/${id}/upvote`,
    DOWNVOTE: (id: string) => `/api/posts/${id}/downvote`,
    SAVE: (id: string) => `/api/posts/${id}/save`,
  },
  // Comments
  COMMENTS: {
    CREATE: '/api/comments',
    GET: (id: string) => `/api/comments/${id}`,
    UPDATE: (id: string) => `/api/comments/${id}`,
    DELETE: (id: string) => `/api/comments/${id}`,
    REPLY: (id: string) => `/api/comments/${id}/reply`,
    UPVOTE: (id: string) => `/api/comments/${id}/upvote`,
  },
  // Mentors
  MENTORS: {
    LIST: '/api/mentors',
    GET: (id: string) => `/api/mentors/${id}`,
    AVAILABILITY: (id: string) => `/api/mentors/${id}/availability`,
    SEARCH: '/api/mentors/search',
  },
  // Bookings
  BOOKINGS: {
    CREATE: '/api/bookings',
    LIST: '/api/bookings',
    GET: (id: string) => `/api/bookings/${id}`,
    UPDATE: (id: string) => `/api/bookings/${id}`,
    DELETE: (id: string) => `/api/bookings/${id}`,
    HISTORY: '/api/bookings/history',
  },
  // Payments
  PAYMENTS: {
    CREATE_INTENT: '/api/payments/create-intent',
    CONFIRM: '/api/payments/confirm',
    WEBHOOK: '/api/payments/webhook',
    HISTORY: '/api/payments/history',
    REFUND: '/api/payments/refund',
  },
  // Communities
  COMMUNITY: {
    LIST: '/api/community',
    CREATE: '/api/community',
    GET: (slug: string) => `/api/community/${slug}`,
    JOIN: (slug: string) => `/api/community/${slug}/join`,
    LEAVE: (slug: string) => `/api/community/${slug}/leave`,
    POSTS: (slug: string) => `/api/community/${slug}/posts`,
  },
  // Admin
  ADMIN: {
    USERS: '/api/admin/users',
    UPDATE_USER: (id: string) => `/api/admin/users/${id}`,
    POSTS: '/api/admin/posts',
    DELETE_POST: (id: string) => `/api/admin/posts/${id}`,
    ANALYTICS: '/api/admin/analytics',
    CONFIG: '/api/admin/config',
  },
  // Jitsi
  JITSI: {
    GENERATE_TOKEN: '/api/jitsi/generate-token',
    ROOM_DATA: '/api/jitsi/room-data',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;
