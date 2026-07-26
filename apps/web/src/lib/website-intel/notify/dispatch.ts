import type { NotificationChannel, Notifier, NotifyEvent, SendResult } from './types';

/**
 * Fan an event out to every active channel. Best-effort and parallel: each send
 * resolves to its own `SendResult` (the notifier never throws), so one dead
 * webhook cannot stop the others. Inactive channels are skipped.
 */
export async function dispatchNotifications(
  channels: NotificationChannel[],
  notifier: Notifier,
  event: NotifyEvent,
): Promise<SendResult[]> {
  const active = channels.filter((channel) => channel.active);
  return Promise.all(active.map((channel) => notifier.send(channel, event)));
}
