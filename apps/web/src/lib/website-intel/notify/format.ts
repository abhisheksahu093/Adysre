import type { NotifyEvent } from './types';

/**
 * Per-channel payload formatters. Pure functions of the event, so each is
 * unit-testable, and all the copy is our own generated summary - nothing here
 * echoes third-party content.
 *
 * Slack accepts a plain `{ text }`, Discord a `{ content }`, a generic webhook
 * gets the raw event, and email gets a subject and body. Richer Slack blocks or
 * Discord embeds slot in here without touching the notifier.
 */

/** One-line human summary shared by the text channels. */
export function summaryLine(event: NotifyEvent): string {
  const delta =
    event.overallDelta == null ? '' : ` (${event.overallDelta > 0 ? '+' : ''}${event.overallDelta})`;
  return `Website Intelligence: ${event.url} scored ${event.overallScore}/100${delta} — ${event.critical} critical, ${event.serious} serious, ${event.findings} findings total.`;
}

export function slackPayload(event: NotifyEvent): { text: string } {
  return { text: summaryLine(event) };
}

export function discordPayload(event: NotifyEvent): { content: string } {
  return { content: summaryLine(event) };
}

export function emailPayload(event: NotifyEvent): { subject: string; text: string } {
  return {
    subject: `Website Intelligence: ${event.url} scored ${event.overallScore}/100`,
    text: summaryLine(event),
  };
}

/** A generic webhook receives the raw, machine-readable event. */
export function webhookPayload(event: NotifyEvent): NotifyEvent {
  return event;
}
