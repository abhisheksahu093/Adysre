import { Worker } from 'bullmq';
import { prisma } from '@adysre/database';
import { createLogger } from '@adysre/logger';
import { connection } from './connection.js';
import { QUEUE_NAMES, type NotificationJob } from './queues.js';

const log = createLogger({ module: 'worker' });

/** Persists in-app notifications enqueued by the API. */
const notificationsWorker = new Worker<NotificationJob>(
  QUEUE_NAMES.notifications,
  async (job) => {
    const { tenantId, userId, type, title, body } = job.data;
    await prisma.notification.create({ data: { tenantId, userId, type, title, body } });
    log.info({ jobId: job.id, tenantId, userId }, 'notification persisted');
  },
  { connection, concurrency: 10 },
);

notificationsWorker.on('failed', (job, err) =>
  log.error({ jobId: job?.id, err }, 'notification job failed'),
);

log.info('ADYSRE worker started');

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, async () => {
    log.info({ signal }, 'shutting down worker');
    await notificationsWorker.close();
    await connection.quit();
    process.exit(0);
  });
}
