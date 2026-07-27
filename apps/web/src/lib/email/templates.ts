import type { EmailMessage } from './types';

/**
 * Transactional email content.
 *
 * Deliberately plain: inline styles, a table-free single column, no images, no
 * web fonts. Email clients are a decade behind browsers and Gmail strips
 * `<style>` blocks, so anything more ambitious degrades unpredictably in
 * exactly the message a user most needs to read.
 *
 * Nothing here is hardcoded to a brand: the product name and base URL come from
 * configuration, so a rename or a new environment does not mean editing copy.
 */

/** Product name shown in subjects and signatures. */
function appName(): string {
  return process.env.NEXT_PUBLIC_APP_NAME ?? 'ADYSRE';
}

/**
 * Base URL for links.
 *
 * Falls back to localhost so development works untouched. In production this
 * MUST be set, or every link mails the recipient back to their own machine.
 */
function appUrl(): string {
  return (process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000').replace(/\/$/, '');
}

/**
 * Escape text interpolated into HTML.
 *
 * A display name is user-controlled and lands inside the markup. Without this,
 * a name containing a tag is injected into an email we send on the user's
 * behalf, which is both an XSS in whichever client renders it loosely and a
 * trivial way to forge convincing content inside our own template.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** One visual shell, so every message looks like it came from the same place. */
function layout(heading: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      <h1 style="margin:0 0 16px;font-size:20px;font-weight:600;">${escapeHtml(heading)}</h1>
      ${bodyHtml}
      <p style="margin:32px 0 0;padding-top:16px;border-top:1px solid #e4e4e7;font-size:12px;color:#71717a;">
        ${escapeHtml(appName())}
      </p>
    </div>
  </body>
</html>`;
}

/** A call-to-action button that degrades to a plain link where CSS is stripped. */
function button(href: string, label: string): string {
  return `<p style="margin:24px 0;">
    <a href="${escapeHtml(href)}" style="display:inline-block;background:#18181b;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:500;">${escapeHtml(label)}</a>
  </p>
  <p style="margin:16px 0;font-size:13px;color:#52525b;">
    If the button does not work, paste this into your browser:<br />
    <span style="word-break:break-all;">${escapeHtml(href)}</span>
  </p>`;
}

export function passwordResetEmail(to: string, token: string, name?: string): EmailMessage {
  // The token rides in the query string, so the reset page can read it without
  // the user copying anything. `Referrer-Policy: strict-origin-when-cross-origin`
  // is what stops that URL leaking to third parties from the page it opens.
  const link = `${appUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  const greeting = name ? `Hi ${name},` : 'Hi,';

  return {
    to,
    subject: `Reset your ${appName()} password`,
    text: [
      greeting,
      '',
      'Someone asked to reset the password on this account. Open the link below to choose a new one:',
      '',
      link,
      '',
      'This link expires in one hour and can be used once.',
      '',
      // Stated plainly because a reset mail is indistinguishable from a
      // phishing attempt unless it tells the reader what inaction costs.
      'If you did not ask for this, you can ignore this email. Your password will not change.',
      '',
      appName(),
    ].join('\n'),
    html: layout(
      'Reset your password',
      `<p style="margin:0;font-size:15px;line-height:1.6;">${escapeHtml(greeting)}</p>
       <p style="margin:12px 0 0;font-size:15px;line-height:1.6;">Someone asked to reset the password on this account. Choose a new one below.</p>
       ${button(link, 'Reset password')}
       <p style="margin:0;font-size:13px;color:#52525b;line-height:1.6;">This link expires in one hour and can be used once. If you did not ask for this, ignore this email and your password will not change.</p>`,
    ),
  };
}

export function verificationEmail(to: string, token: string, name?: string): EmailMessage {
  const link = `${appUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  const greeting = name ? `Hi ${name},` : 'Hi,';

  return {
    to,
    subject: `Confirm your email for ${appName()}`,
    text: [
      greeting,
      '',
      `Confirm this address to finish setting up your ${appName()} account:`,
      '',
      link,
      '',
      'This link expires in 24 hours.',
      '',
      'If you did not create this account, you can ignore this email.',
      '',
      appName(),
    ].join('\n'),
    html: layout(
      'Confirm your email',
      `<p style="margin:0;font-size:15px;line-height:1.6;">${escapeHtml(greeting)}</p>
       <p style="margin:12px 0 0;font-size:15px;line-height:1.6;">Confirm this address to finish setting up your account.</p>
       ${button(link, 'Confirm email')}
       <p style="margin:0;font-size:13px;color:#52525b;line-height:1.6;">This link expires in 24 hours. If you did not create this account, ignore this email.</p>`,
    ),
  };
}
