/**
 * Classify a decoded QR payload into a known type and readable fields, so the
 * reader shows "WiFi · SSID / password" rather than an opaque `WIFI:S:...;` blob.
 * Everything is string parsing; there is no network.
 */

export interface ParsedField {
  key: string;
  value: string;
}

export interface ParsedPayload {
  type: string;
  fields: ParsedField[];
  raw: string;
}

function decode(value: string): string {
  return value.replace(/\\([;,:\\])/g, '$1').trim();
}

function paramsOf(query: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const part of query.split('&')) {
    const [k, v] = part.split('=');
    if (k) out[decodeURIComponent(k)] = decodeURIComponent((v ?? '').replace(/\+/g, ' '));
  }
  return out;
}

export function parseQrPayload(raw: string): ParsedPayload {
  const value = raw.trim();
  const lower = value.toLowerCase();

  if (/^https?:\/\//i.test(value)) {
    return { type: 'URL', fields: [{ key: 'Link', value }], raw };
  }

  if (lower.startsWith('wifi:')) {
    const get = (letter: string) => {
      const match = new RegExp(`${letter}:((?:\\\\.|[^;])*)`, 'i').exec(value.slice(5));
      return match ? decode(match[1]!) : '';
    };
    return {
      type: 'WiFi',
      fields: [
        { key: 'Network', value: get('S') },
        { key: 'Security', value: get('T') || 'Open' },
        { key: 'Password', value: get('P') },
      ].filter((f) => f.value),
      raw,
    };
  }

  if (lower.startsWith('begin:vcard')) {
    const field = (tag: string) => {
      const match = new RegExp(`^${tag}[^:]*:(.+)$`, 'im').exec(value);
      return match ? match[1]!.trim().replace(/;+/g, ' ').trim() : '';
    };
    return {
      type: 'Contact',
      fields: [
        { key: 'Name', value: field('FN') || field('N') },
        { key: 'Phone', value: field('TEL') },
        { key: 'Email', value: field('EMAIL') },
        { key: 'Organization', value: field('ORG') },
      ].filter((f) => f.value),
      raw,
    };
  }

  if (lower.startsWith('mailto:')) {
    const [addr, query] = value.slice(7).split('?');
    const params = paramsOf(query ?? '');
    return {
      type: 'Email',
      fields: [
        { key: 'To', value: addr ?? '' },
        ...(params.subject ? [{ key: 'Subject', value: params.subject }] : []),
      ],
      raw,
    };
  }

  if (lower.startsWith('tel:')) return { type: 'Phone', fields: [{ key: 'Number', value: value.slice(4) }], raw };

  if (lower.startsWith('smsto:') || lower.startsWith('sms:')) {
    const rest = value.slice(value.indexOf(':') + 1);
    const [number, body] = rest.split(':');
    return {
      type: 'SMS',
      fields: [
        { key: 'Number', value: number ?? '' },
        ...(body ? [{ key: 'Message', value: body }] : []),
      ],
      raw,
    };
  }

  if (lower.startsWith('geo:')) {
    const [lat, lng] = value.slice(4).split(',');
    return { type: 'Location', fields: [{ key: 'Latitude', value: lat ?? '' }, { key: 'Longitude', value: (lng ?? '').split('?')[0] ?? '' }], raw };
  }

  if (lower.startsWith('upi://')) {
    const params = paramsOf(value.split('?')[1] ?? '');
    return {
      type: 'UPI Payment',
      fields: [
        { key: 'Payee', value: params.pn ?? '' },
        { key: 'UPI ID', value: params.pa ?? '' },
        ...(params.am ? [{ key: 'Amount', value: params.am }] : []),
      ].filter((f) => f.value),
      raw,
    };
  }

  return { type: 'Text', fields: [{ key: 'Content', value }], raw };
}

/** A plain-text rendering of a parsed payload, for download and copy. */
export function payloadToText(payload: ParsedPayload): string {
  const header = `Type: ${payload.type}`;
  const body = payload.fields.map((f) => `${f.key}: ${f.value}`).join('\n');
  return `${header}\n${body}`;
}
