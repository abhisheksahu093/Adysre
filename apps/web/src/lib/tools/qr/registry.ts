import * as enc from './encode';

/**
 * The QR type registry - the single source of truth for what the generator can
 * produce. Each entry declares its category, the fields the form should render,
 * and a `build` that turns those field values into the QR payload (delegating to
 * the pure encoders in `./encode`).
 *
 * This is the extension point: the product spec lists 100+ types across ten
 * categories, and every one of them is either a payload the encoders already
 * cover or a URL builder - so adding the rest is appending entries here, with no
 * change to the form renderer, the live preview or the download engine. The set
 * below is a representative, working slice across the categories.
 */

export const QR_CATEGORIES = [
  'basic',
  'social',
  'business',
  'wifi',
  'events',
  'payments',
] as const;
export type QrCategoryId = (typeof QR_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<QrCategoryId, string> = {
  basic: 'Basic',
  social: 'Social',
  business: 'Business',
  wifi: 'WiFi',
  events: 'Events',
  payments: 'Payments',
};

export type QrFieldType =
  | 'text'
  | 'url'
  | 'tel'
  | 'email'
  | 'password'
  | 'textarea'
  | 'number'
  | 'datetime-local'
  | 'select';

export interface QrField {
  name: string;
  label: string;
  type: QrFieldType;
  placeholder?: string;
  required?: boolean;
  options?: ReadonlyArray<{ value: string; label: string }>;
}

export interface QrType {
  id: string;
  category: QrCategoryId;
  label: string;
  /** One-line hint shown under the type selector. */
  hint: string;
  fields: readonly QrField[];
  build: (values: Record<string, string>) => string;
}

const bool = (v: string | undefined): boolean => v === 'true';

export const QR_TYPES: readonly QrType[] = [
  // ── Basic ──────────────────────────────────────────────────────────────────
  {
    id: 'url',
    category: 'basic',
    label: 'Website URL',
    hint: 'Open a link when scanned.',
    fields: [{ name: 'url', label: 'URL', type: 'url', placeholder: 'example.com', required: true }],
    build: (v) => enc.encodeUrl(v.url ?? ''),
  },
  {
    id: 'text',
    category: 'basic',
    label: 'Plain Text',
    hint: 'Show any text.',
    fields: [{ name: 'text', label: 'Text', type: 'textarea', placeholder: 'Anything…', required: true }],
    build: (v) => enc.encodeText(v.text ?? ''),
  },
  {
    id: 'phone',
    category: 'basic',
    label: 'Phone',
    hint: 'Start a call.',
    fields: [{ name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+1 555 000 1234', required: true }],
    build: (v) => enc.encodePhone(v.phone ?? ''),
  },
  {
    id: 'email',
    category: 'basic',
    label: 'Email',
    hint: 'Compose an email.',
    fields: [
      { name: 'to', label: 'To', type: 'email', placeholder: 'hi@example.com', required: true },
      { name: 'subject', label: 'Subject', type: 'text' },
      { name: 'body', label: 'Body', type: 'textarea' },
    ],
    build: (v) => enc.encodeEmail({ to: v.to ?? '', subject: v.subject, body: v.body }),
  },
  {
    id: 'sms',
    category: 'basic',
    label: 'SMS',
    hint: 'Pre-fill a text message.',
    fields: [
      { name: 'phone', label: 'Phone number', type: 'tel', required: true },
      { name: 'message', label: 'Message', type: 'textarea' },
    ],
    build: (v) => enc.encodeSms({ phone: v.phone ?? '', message: v.message }),
  },
  {
    id: 'whatsapp',
    category: 'basic',
    label: 'WhatsApp',
    hint: 'Open a WhatsApp chat.',
    fields: [
      { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+1 555 000 1234', required: true },
      { name: 'message', label: 'Pre-filled message', type: 'textarea' },
    ],
    build: (v) => enc.encodeWhatsApp({ phone: v.phone ?? '', message: v.message }),
  },
  {
    id: 'telegram',
    category: 'basic',
    label: 'Telegram',
    hint: 'Open a Telegram profile.',
    fields: [{ name: 'username', label: 'Username', type: 'text', placeholder: '@handle', required: true }],
    build: (v) => enc.encodeTelegram(v.username ?? ''),
  },

  // ── Social (URL builders) ───────────────────────────────────────────────────
  {
    id: 'instagram',
    category: 'social',
    label: 'Instagram',
    hint: 'Open an Instagram profile.',
    fields: [{ name: 'handle', label: 'Handle', type: 'text', placeholder: '@handle', required: true }],
    build: (v) => enc.encodeSocial('https://instagram.com/', v.handle ?? ''),
  },
  {
    id: 'x',
    category: 'social',
    label: 'X (Twitter)',
    hint: 'Open an X profile.',
    fields: [{ name: 'handle', label: 'Handle', type: 'text', placeholder: '@handle', required: true }],
    build: (v) => enc.encodeSocial('https://x.com/', v.handle ?? ''),
  },
  {
    id: 'linkedin',
    category: 'social',
    label: 'LinkedIn',
    hint: 'Open a LinkedIn profile (full URL).',
    fields: [{ name: 'handle', label: 'Profile URL or slug', type: 'text', placeholder: 'in/your-name', required: true }],
    build: (v) => enc.encodeSocial('https://linkedin.com/', v.handle ?? ''),
  },
  {
    id: 'youtube',
    category: 'social',
    label: 'YouTube',
    hint: 'Open a channel or video (full URL).',
    fields: [{ name: 'handle', label: 'Channel/@handle or URL', type: 'text', placeholder: '@channel', required: true }],
    build: (v) => enc.encodeSocial('https://youtube.com/', v.handle ?? ''),
  },

  // ── Business ─────────────────────────────────────────────────────────────────
  {
    id: 'vcard',
    category: 'business',
    label: 'vCard (Contact)',
    hint: 'Save a full contact card.',
    fields: [
      { name: 'firstName', label: 'First name', type: 'text', required: true },
      { name: 'lastName', label: 'Last name', type: 'text' },
      { name: 'org', label: 'Company', type: 'text' },
      { name: 'title', label: 'Job title', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'tel' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'url', label: 'Website', type: 'url' },
      { name: 'address', label: 'Address', type: 'text' },
    ],
    build: (v) =>
      enc.encodeVCard({
        firstName: v.firstName ?? '',
        lastName: v.lastName,
        org: v.org,
        title: v.title,
        phone: v.phone,
        email: v.email,
        url: v.url,
        address: v.address,
      }),
  },

  // ── WiFi ─────────────────────────────────────────────────────────────────────
  {
    id: 'wifi',
    category: 'wifi',
    label: 'WiFi Network',
    hint: 'Join a network without typing the password.',
    fields: [
      { name: 'ssid', label: 'Network name (SSID)', type: 'text', required: true },
      { name: 'password', label: 'Password', type: 'password' },
      {
        name: 'encryption',
        label: 'Security',
        type: 'select',
        options: [
          { value: 'WPA', label: 'WPA/WPA2' },
          { value: 'WEP', label: 'WEP' },
          { value: 'nopass', label: 'None' },
        ],
      },
      {
        name: 'hidden',
        label: 'Hidden network',
        type: 'select',
        options: [
          { value: 'false', label: 'No' },
          { value: 'true', label: 'Yes' },
        ],
      },
    ],
    build: (v) =>
      enc.encodeWifi({
        ssid: v.ssid ?? '',
        password: v.password,
        encryption: (v.encryption as 'WPA' | 'WEP' | 'nopass') || 'WPA',
        hidden: bool(v.hidden),
      }),
  },

  // ── Events ───────────────────────────────────────────────────────────────────
  {
    id: 'event',
    category: 'events',
    label: 'Calendar Event',
    hint: 'Add an event to a calendar.',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'start', label: 'Starts', type: 'datetime-local', required: true },
      { name: 'end', label: 'Ends', type: 'datetime-local' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
    build: (v) =>
      enc.encodeEvent({
        title: v.title ?? '',
        start: v.start ?? '',
        end: v.end,
        location: v.location,
        description: v.description,
      }),
  },
  {
    id: 'geo',
    category: 'events',
    label: 'Location (Map)',
    hint: 'Drop a pin at coordinates.',
    fields: [
      { name: 'lat', label: 'Latitude', type: 'number', placeholder: '37.7749', required: true },
      { name: 'lng', label: 'Longitude', type: 'number', placeholder: '-122.4194', required: true },
    ],
    build: (v) => enc.encodeGeo({ lat: v.lat ?? '', lng: v.lng ?? '' }),
  },

  // ── Payments ─────────────────────────────────────────────────────────────────
  {
    id: 'upi',
    category: 'payments',
    label: 'UPI Payment',
    hint: 'Collect a payment (GPay/PhonePe/Paytm/BharatPe).',
    fields: [
      { name: 'vpa', label: 'UPI ID (VPA)', type: 'text', placeholder: 'name@bank', required: true },
      { name: 'name', label: 'Payee name', type: 'text' },
      { name: 'amount', label: 'Amount (₹)', type: 'number' },
      { name: 'note', label: 'Note', type: 'text' },
    ],
    build: (v) => enc.encodeUpi({ vpa: v.vpa ?? '', name: v.name, amount: v.amount, note: v.note }),
  },
];

export const QR_TYPES_BY_ID: Record<string, QrType> = Object.fromEntries(
  QR_TYPES.map((t) => [t.id, t]),
);

export function typesForCategory(category: QrCategoryId): QrType[] {
  return QR_TYPES.filter((t) => t.category === category);
}

/** True when every required field for the type has a value - gates the preview. */
export function isComplete(type: QrType, values: Record<string, string>): boolean {
  return type.fields.every((f) => !f.required || (values[f.name] ?? '').trim() !== '');
}
