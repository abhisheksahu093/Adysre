import { validateScanUrl, ScanValidationError } from '../validate';
import { isChannelType, type ChannelInput } from './types';

/**
 * Validate a create-channel body.
 *
 * A URL target (webhook/Slack/Discord) goes through the same SSRF-safe validator
 * scans use, so a channel can never be pointed at an internal address - the
 * platform would otherwise POST to it on every notification. An email target is
 * checked with a conservative pattern; actually sending it is a later,
 * provider-dependent step.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseChannelInput(body: unknown): ChannelInput {
  const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};

  const type = record.type;
  if (typeof type !== 'string' || !isChannelType(type)) {
    throw new ScanValidationError('Channel type must be webhook, slack, discord or email.', 'channel_type');
  }

  const target = record.target;
  if (typeof target !== 'string' || target.trim() === '') {
    throw new ScanValidationError('A target is required.', 'target_required');
  }

  if (type === 'email') {
    if (!EMAIL.test(target.trim())) {
      throw new ScanValidationError('That is not a valid email address.', 'email_invalid');
    }
    return { type, target: target.trim() };
  }

  // Webhook/Slack/Discord: an SSRF-safe, absolute http(s) URL.
  return { type, target: validateScanUrl(target).toString() };
}
