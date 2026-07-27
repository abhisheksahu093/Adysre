import 'server-only';
import type { EmailMessage, EmailTransport } from './types';

/**
 * Choosing where mail goes.
 *
 * Two transports ship: a console one for development, and Resend for
 * production. Resend is spoken over plain `fetch` rather than through its SDK,
 * because the whole integration is one HTTP POST and a dependency that has to
 * be kept current is a poor trade for that.
 *
 * Adding a provider is one object implementing `EmailTransport` plus a case in
 * `selectTransport`. Nothing above this file knows which one is active.
 */

/**
 * Development transport: writes the message to the server log.
 *
 * The reset and verification LINKS are printed in full, which is deliberate and
 * is also why this must never be selected in production: a live account-takeover
 * link would then be sitting in every log aggregator that ingests stdout.
 * `selectTransport` refuses to choose it there.
 */
const consoleTransport: EmailTransport = {
  name: 'console',
  async send(message: EmailMessage): Promise<boolean> {
    console.info(
      [
        '',
        '──────────────────────────────────────────────────────────────',
        ` EMAIL (not actually sent - console transport)`,
        ` To:      ${message.to}`,
        ` Subject: ${message.subject}`,
        '──────────────────────────────────────────────────────────────',
        message.text,
        '──────────────────────────────────────────────────────────────',
        '',
      ].join('\n'),
    );
    return true;
  },
};

/** Resend, over its HTTP API. */
function resendTransport(apiKey: string, from: string): EmailTransport {
  return {
    name: 'resend',
    async send(message: EmailMessage): Promise<boolean> {
      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from,
            to: [message.to],
            subject: message.subject,
            text: message.text,
            html: message.html,
          }),
          // Without a timeout a hung provider holds the request open until the
          // platform kills the whole function, turning slow mail into a failed
          // sign-up.
          signal: AbortSignal.timeout(10_000),
        });

        if (!response.ok) {
          // The body carries the provider's reason (bad domain, unverified
          // sender). Logging only the status makes this undiagnosable.
          const detail = await response.text().catch(() => '');
          console.error(`[email.resend] ${response.status}: ${detail.slice(0, 300)}`);
          return false;
        }
        return true;
      } catch (error) {
        console.error(
          `[email.resend] ${error instanceof Error ? error.message : String(error)}`,
        );
        return false;
      }
    },
  };
}

/**
 * A transport that accepts nothing and says so.
 *
 * Used when production has no provider configured. It returns false rather than
 * throwing, so a missing configuration degrades to "the link never arrives"
 * rather than to a 500 on every registration, and it logs loudly enough that
 * the cause is obvious.
 */
const nullTransport: EmailTransport = {
  name: 'none',
  async send(message: EmailMessage): Promise<boolean> {
    console.error(
      `[email] no transport configured; dropped "${message.subject}" to ${message.to}. ` +
        'Set RESEND_API_KEY and EMAIL_FROM.',
    );
    return false;
  },
};

let cached: EmailTransport | null = null;

export function selectTransport(): EmailTransport {
  if (cached) return cached;

  const isProduction = process.env.NODE_ENV === 'production';
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  const configured = process.env.EMAIL_TRANSPORT;

  if (configured === 'console') {
    // Explicitly requested. Refused in production regardless, because the
    // console transport prints live reset links.
    cached = isProduction ? nullTransport : consoleTransport;
    if (isProduction) {
      console.error('[email] EMAIL_TRANSPORT=console is refused in production.');
    }
    return cached;
  }

  if (apiKey && from) {
    cached = resendTransport(apiKey, from);
    return cached;
  }

  // Nothing configured: fine locally, a misconfiguration in production.
  cached = isProduction ? nullTransport : consoleTransport;
  return cached;
}

/** Reset the cached choice. Tests only. */
export function resetTransport(): void {
  cached = null;
}

/**
 * Send a message. Never throws.
 *
 * Every caller is a request handler whose real work is already done, so a mail
 * failure must not undo it. Returning a boolean rather than throwing makes that
 * the default rather than something each caller has to remember to wrap.
 */
export async function sendEmail(message: EmailMessage): Promise<boolean> {
  const transport = selectTransport();
  try {
    return await transport.send(message);
  } catch (error) {
    console.error(
      `[email.${transport.name}] unexpected failure: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return false;
  }
}
