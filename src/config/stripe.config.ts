export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  secretKey: process.env.STRIPE_SECRET_KEY,
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const CURRENCY = 'USD';

export const SESSION_PRICING = {
  MIN_RATE: 10,
  MAX_RATE: 500,
  DEFAULT_RATE: 50,
  PLATFORM_FEE_PERCENTAGE: 0.1, // 10% platform fee
} as const;
