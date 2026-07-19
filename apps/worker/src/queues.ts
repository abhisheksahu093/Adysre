import { Queue } from 'bullmq';
import { connection } from './connection.js';

/** Central registry of BullMQ queues shared by the API (producer) and worker. */
export const QUEUE_NAMES = {
  notifications: 'notifications',
  email: 'email',
  audit: 'audit',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export interface NotificationJob {
  tenantId: string;
  userId: string;
  type: string;
  title: string;
  body: string;
}

export const notificationsQueue = new Queue<NotificationJob>(QUEUE_NAMES.notifications, {
  connection,
});
