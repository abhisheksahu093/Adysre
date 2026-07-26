/**
 * QR payload encoders - pure functions that turn typed input into the exact
 * string a QR scanner expects. These are the engine of the QR generator: no
 * DOM, no dependencies, so they are unit-tested in isolation and reused by both
 * the live preview and any future server-side render.
 *
 * Each encoder follows the relevant de-facto standard (the WIFI: and MECARD/
 * vCard grammars, the tel:/mailto:/smsto: URI schemes, wa.me links, the UPI
 * deep link, iCalendar VEVENT) and escapes user input so a stray `;` or `,`
 * cannot corrupt the payload.
 */

/** Trim and collapse a phone number to `+` and digits (wa.me/tel want E.164-ish). */
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const plus = trimmed.startsWith('+') ? '+' : '';
  return plus + trimmed.replace(/[^\d]/g, '');
}

/** Ensure a URL has a scheme; default to https so bare domains still resolve. */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/** Escape the four reserved characters in the WIFI:/MECARD grammars. */
function escapeMecard(value: string): string {
  return value.replace(/([\\;,:"])/g, '\\$1');
}

/** Escape iCalendar TEXT values (RFC 5545 §3.3.11). */
function escapeICal(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export const encodeUrl = (url: string): string => normalizeUrl(url);

export const encodeText = (text: string): string => text;

export const encodePhone = (phone: string): string => `tel:${normalizePhone(phone)}`;

export function encodeEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject?: string | undefined;
  body?: string | undefined;
}): string {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString();
  return `mailto:${to.trim()}${query ? `?${query}` : ''}`;
}

export function encodeSms({ phone, message }: { phone: string; message?: string | undefined }): string {
  // SMSTO is the most widely recognised of the several SMS grammars.
  return `SMSTO:${normalizePhone(phone)}:${message ?? ''}`;
}

export function encodeWhatsApp({ phone, message }: { phone: string; message?: string | undefined }): string {
  const number = normalizePhone(phone).replace(/^\+/, '');
  const query = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${number}${query}`;
}

export const encodeTelegram = (username: string): string =>
  `https://t.me/${username.trim().replace(/^@/, '')}`;

export function encodeWifi({
  ssid,
  password,
  encryption = 'WPA',
  hidden = false,
}: {
  ssid: string;
  password?: string | undefined;
  encryption?: 'WPA' | 'WEP' | 'nopass' | undefined;
  hidden?: boolean | undefined;
}): string {
  const parts = [`T:${encryption}`, `S:${escapeMecard(ssid)}`];
  if (encryption !== 'nopass' && password) parts.push(`P:${escapeMecard(password)}`);
  if (hidden) parts.push('H:true');
  return `WIFI:${parts.join(';')};;`;
}

export function encodeGeo({ lat, lng }: { lat: string; lng: string }): string {
  return `geo:${lat.trim()},${lng.trim()}`;
}

export interface VCardInput {
  firstName: string;
  lastName?: string | undefined;
  org?: string | undefined;
  title?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  url?: string | undefined;
  address?: string | undefined;
}

export function encodeVCard(input: VCardInput): string {
  const name = `${input.lastName ?? ''};${input.firstName};;;`;
  const full = `${input.firstName}${input.lastName ? ` ${input.lastName}` : ''}`;
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:${name}`, `FN:${full}`];
  if (input.org) lines.push(`ORG:${input.org}`);
  if (input.title) lines.push(`TITLE:${input.title}`);
  if (input.phone) lines.push(`TEL;TYPE=CELL:${normalizePhone(input.phone)}`);
  if (input.email) lines.push(`EMAIL:${input.email.trim()}`);
  if (input.url) lines.push(`URL:${normalizeUrl(input.url)}`);
  if (input.address) lines.push(`ADR;TYPE=WORK:;;${input.address};;;;`);
  lines.push('END:VCARD');
  return lines.join('\n');
}

export interface EventInput {
  title: string;
  location?: string | undefined;
  description?: string | undefined;
  /** `YYYY-MM-DDTHH:mm` local, as an <input type=datetime-local> produces. */
  start: string;
  end?: string | undefined;
}

/** Convert a local datetime-local value to an iCalendar floating-time stamp. */
function icalStamp(value: string): string {
  return value.replace(/[-:]/g, '').replace('T', 'T') + '00';
}

export function encodeEvent(input: EventInput): string {
  const lines = ['BEGIN:VEVENT', `SUMMARY:${escapeICal(input.title)}`, `DTSTART:${icalStamp(input.start)}`];
  if (input.end) lines.push(`DTEND:${icalStamp(input.end)}`);
  if (input.location) lines.push(`LOCATION:${escapeICal(input.location)}`);
  if (input.description) lines.push(`DESCRIPTION:${escapeICal(input.description)}`);
  lines.push('END:VEVENT');
  return lines.join('\n');
}

export function encodeUpi({
  vpa,
  name,
  amount,
  note,
}: {
  vpa: string;
  name?: string | undefined;
  amount?: string | undefined;
  note?: string | undefined;
}): string {
  const params = new URLSearchParams({ pa: vpa.trim(), cu: 'INR' });
  if (name) params.set('pn', name);
  if (amount) params.set('am', amount);
  if (note) params.set('tn', note);
  // URLSearchParams encodes spaces as `+`; UPI apps expect %20.
  return `upi://pay?${params.toString().replace(/\+/g, '%20')}`;
}

/** Build a profile URL from a bare handle for the common social networks. */
export function encodeSocial(base: string, handle: string): string {
  const clean = handle.trim().replace(/^@/, '');
  if (/^https?:\/\//i.test(handle.trim())) return handle.trim();
  return `${base}${clean}`;
}
