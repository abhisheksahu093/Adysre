/**
 * Notifications - channels, events and the sender seam.
 *
 * A channel is a destination (a webhook/Slack/Discord URL, or an email); an
 * event is the normalised thing that happened (a scan finished); a `Notifier`
 * sends the event to a channel. Keeping the sender behind an interface lets the
 * HTTP channels be tested with a fetch stub and the email channel stay a
 * documented, provider-dependent stub without changing anything else.
 */

export const CHANNEL_TYPES = ['webhook', 'slack', 'discord', 'email'] as const;
export type ChannelType = (typeof CHANNEL_TYPES)[number];

export function isChannelType(value: string): value is ChannelType {
  return (CHANNEL_TYPES as readonly string[]).includes(value);
}

/** A stored notification destination. */
export interface NotificationChannel {
  id: string;
  /** Owning organization. Channels are partitioned by it, so a scan's
   * notifications only ever reach its own org's destinations. */
  tenantId: string;
  type: ChannelType;
  /** A URL (webhook/slack/discord) or an email address. */
  target: string;
  active: boolean;
  createdAt: string;
}

/** Validated input to create a channel. */
export interface ChannelInput {
  type: ChannelType;
  target: string;
}

/**
 * The persistence contract for channels. Every method is scoped by `tenantId`
 * (from the verified session): a channel owned by another org is invisible to
 * `get`/`remove` and absent from `list`.
 */
export interface ChannelStore {
  create(tenantId: string, input: ChannelInput, now?: Date): Promise<NotificationChannel>;
  get(tenantId: string, id: string): Promise<NotificationChannel | null>;
  list(tenantId: string): Promise<NotificationChannel[]>;
  remove(tenantId: string, id: string): Promise<boolean>;
}

/** The normalised "a scan happened" event a channel is told about. */
export interface NotifyEvent {
  kind: 'scan.completed';
  /** Final URL scanned. */
  url: string;
  /** History id of the scan, when it was persisted. */
  scanId: string | null;
  overallScore: number;
  /** Change vs the previous scan of this URL, when there was one. */
  overallDelta: number | null;
  findings: number;
  critical: number;
  serious: number;
  at: string;
}

/** The outcome of sending to one channel. */
export interface SendResult {
  channelId: string;
  type: ChannelType;
  ok: boolean;
  status?: number;
  error?: string;
}

/** Sends an event to a channel. */
export interface Notifier {
  send(channel: NotificationChannel, event: NotifyEvent): Promise<SendResult>;
}
