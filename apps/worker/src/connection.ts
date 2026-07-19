import { Redis } from 'ioredis';

/** Shared Redis connection for BullMQ. */
export const connection = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});
