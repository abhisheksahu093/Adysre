import type { NotificationChannel, Notifier, NotifyEvent, SendResult } from './types';
import { discordPayload, slackPayload, webhookPayload } from './format';
import { isBlockedHost } from '../validate';

/**
 * The HTTP notifier: POSTs the formatted payload to webhook/Slack/Discord URLs.
 *
 * `fetch` is injected so the whole thing tests with a stub. The target host is
 * re-checked against the SSRF guard before every send - a stored channel is
 * still an outbound request to a user-supplied URL, so a target that has since
 * become (or always resolved to) an internal address is refused here as well as
 * at creation time.
 *
 * Email is intentionally not sent: it needs a provider (SMTP, SES, Resend...).
 * The channel is accepted and stored, and sending returns a clear
 * `email_not_configured` result, so wiring a provider later is a single method
 * and changes nothing else.
 */
export class HttpNotifier implements Notifier {
  constructor(private readonly fetchImpl: typeof fetch = fetch) {}

  async send(channel: NotificationChannel, event: NotifyEvent): Promise<SendResult> {
    const base = { channelId: channel.id, type: channel.type };

    if (channel.type === 'email') {
      return { ...base, ok: false, error: 'email_not_configured' };
    }

    let url: URL;
    try {
      url = new URL(channel.target);
    } catch {
      return { ...base, ok: false, error: 'bad_target' };
    }
    if (isBlockedHost(url.hostname)) {
      return { ...base, ok: false, error: 'blocked_target' };
    }

    const payload =
      channel.type === 'slack'
        ? slackPayload(event)
        : channel.type === 'discord'
          ? discordPayload(event)
          : webhookPayload(event);

    try {
      const response = await this.fetchImpl(channel.target, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return { ...base, ok: response.ok, status: response.status };
    } catch {
      return { ...base, ok: false, error: 'send_failed' };
    }
  }
}
