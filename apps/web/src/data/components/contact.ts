import type { ComponentEntry } from './types';

/**
 * Contact category — "Contact Us" sections.
 *
 * Ten structurally different ways to ask for a message, not ten recolours of one
 * form: a bare centred form, a form beside a stylised inline-SVG map, a form
 * with a details column, a boxed card, department pickers, a gradient side
 * panel, a minimal pair of fields, a form beside an FAQ, and a form with social
 * links. Two constraints are shared across all of them and are the reason the
 * markup looks the way it does:
 *   1. A form is only as accessible as its labels. Every field carries a real
 *      `<label>` tied by id — placeholders are hints, never names — and the
 *      message is always a `<textarea>`, never a one-line input pretending.
 *   2. These are UI only. Nothing here posts anywhere; `onSubmit` is a no-op
 *      default the caller overrides. That is a feature: you wire it to your own
 *      backend and the component never assumes an endpoint.
 * Two-column layouts stack in reading order below `md`, so a 320px phone gets a
 * single clean column and never a horizontal scrollbar.
 */
export const contactComponents: ComponentEntry[] = [
  {
    slug: 'contact-form-simple',
    category: 'contact',
    tags: ['contact', 'form', 'simple', 'validation', 'accessible'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Get in touch'", descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'submitLabel', type: 'string', default: "'Send message'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(values: ContactFormValues) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Native validation is doing the accessibility work here: required + type="email"
  + minlength give the browser real, announced error messages for free. The
  React/TypeScript tabs swap that for inline errors wired with aria-invalid and
  role="alert"; this static markup keeps the browser's version.
-->
<section class="mx-auto w-full max-w-lg px-4 py-12 sm:py-16">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Get in touch
  </h2>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
    Tell us what you need and we'll reply within one business day.
  </p>

  <form class="mt-6 space-y-4">
    <div>
      <label for="cf-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
      <input id="cf-name" name="name" type="text" autocomplete="name" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" placeholder="Jane Doe" />
    </div>
    <div>
      <label for="cf-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input id="cf-email" name="email" type="email" autocomplete="email" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" placeholder="you@company.com" />
    </div>
    <div>
      <label for="cf-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
      <textarea id="cf-message" name="message" rows="4" required minlength="10" class="mt-1.5 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400" placeholder="How can we help?"></textarea>
    </div>
    <button type="submit" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
      Send message
    </button>
  </form>
</section>`,
      react: `import { useId, useState } from 'react';

export function ContactFormSimple({
  title = 'Get in touch',
  description = "Tell us what you need and we'll reply within one business day.",
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const [errors, setErrors] = useState({});

  // noValidate on the form hands validation to us so we can render inline errors
  // wired with aria-invalid + role="alert" instead of the browser's tooltip.
  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };
    const next = {};
    if (!values.name) next.name = 'Please enter your name.';
    if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(values.email)) next.email = 'Enter a valid email address.';
    if (values.message.length < 10) next.message = 'Your message needs at least 10 characters.';
    setErrors(next);
    if (Object.keys(next).length === 0) {
      onSubmit(values);
      form.reset();
    }
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400';

  return (
    <section className={\`mx-auto w-full max-w-lg px-4 py-12 sm:py-16 \${className}\`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
      {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={nameId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input id={nameId} name="name" type="text" autoComplete="name" placeholder="Jane Doe"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? \`\${nameId}-error\` : undefined}
            className={\`\${field} \${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}\`} />
          {errors.name ? <p id={\`\${nameId}-error\`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" placeholder="you@company.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? \`\${emailId}-error\` : undefined}
            className={\`\${field} \${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}\`} />
          {errors.email ? <p id={\`\${emailId}-error\`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email}</p> : null}
        </div>
        <div>
          <label htmlFor={messageId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
          <textarea id={messageId} name="message" rows={4} placeholder="How can we help?"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? \`\${messageId}-error\` : undefined}
            className={\`\${field} resize-y \${errors.message ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}\`} />
          {errors.message ? <p id={\`\${messageId}-error\`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.message}</p> : null}
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
          {submitLabel}
        </button>
      </form>
    </section>
  );
}`,
      typescript: `import { useId, useState, type FormEvent } from 'react';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormSimpleProps {
  title?: string;
  description?: string;
  submitLabel?: string;
  /** No-op by default — this component posts nowhere. Wire it to your backend. */
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

export function ContactFormSimple({
  title = 'Get in touch',
  description = "Tell us what you need and we'll reply within one business day.",
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactFormSimpleProps): JSX.Element {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values: ContactFormValues = {
      name: String(data.get('name') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      message: String(data.get('message') ?? '').trim(),
    };
    const next: Partial<Record<keyof ContactFormValues, string>> = {};
    if (!values.name) next.name = 'Please enter your name.';
    if (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(values.email)) next.email = 'Enter a valid email address.';
    if (values.message.length < 10) next.message = 'Your message needs at least 10 characters.';
    setErrors(next);
    if (Object.keys(next).length === 0) {
      onSubmit(values);
      form.reset();
    }
  }

  const field =
    'mt-1.5 block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-900 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus-visible:ring-blue-400';

  return (
    <section className={\`mx-auto w-full max-w-lg px-4 py-12 sm:py-16 \${className}\`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
      {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}

      <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={nameId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input id={nameId} name="name" type="text" autoComplete="name" placeholder="Jane Doe"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? \`\${nameId}-error\` : undefined}
            className={\`\${field} \${errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}\`} />
          {errors.name ? <p id={\`\${nameId}-error\`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" placeholder="you@company.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={errors.email ? \`\${emailId}-error\` : undefined}
            className={\`\${field} \${errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}\`} />
          {errors.email ? <p id={\`\${emailId}-error\`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.email}</p> : null}
        </div>
        <div>
          <label htmlFor={messageId} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
          <textarea id={messageId} name="message" rows={4} placeholder="How can we help?"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? \`\${messageId}-error\` : undefined}
            className={\`\${field} resize-y \${errors.message ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'}\`} />
          {errors.message ? <p id={\`\${messageId}-error\`} role="alert" className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.message}</p> : null}
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">
          {submitLabel}
        </button>
      </form>
    </section>
  );
}`,
    },
  },
  {
    slug: 'contact-split-map',
    category: 'contact',
    tags: ['contact', 'map', 'form', 'split', 'location'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Visit or message us'", descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'address', type: 'string', default: "'24 Harbour Street'", descriptionKey: 'address' },
      { name: 'submitLabel', type: 'string', default: "'Send message'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(values: ContactFormValues) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The map is a stylised inline SVG, not an embedded tile: no third-party script,
  no API key, no image to go stale, and it recolours for dark mode with the rest
  of the page. It carries role="img" + aria-label so it is announced as a map
  rather than as a wall of anonymous <path> elements.
-->
<section class="mx-auto grid w-full max-w-5xl items-stretch gap-6 px-4 py-12 md:grid-cols-2 md:gap-10 sm:py-16">
  <div>
    <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Visit or message us</h2>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">We're at 24 Harbour Street. Send a note and we'll line up a time.</p>
    <form class="mt-6 space-y-4">
      <div>
        <label for="cm-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input id="cm-name" name="name" type="text" autocomplete="name" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="cm-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id="cm-email" name="email" type="email" autocomplete="email" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="cm-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
        <textarea id="cm-message" name="message" rows="4" required class="mt-1.5 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"></textarea>
      </div>
      <button type="submit" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Send message</button>
    </form>
  </div>
  <div class="relative min-h-[240px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
    <svg viewBox="0 0 400 320" class="absolute inset-0 h-full w-full" role="img" aria-label="Map to 24 Harbour Street">
      <rect width="400" height="320" class="fill-gray-100 dark:fill-gray-900" />
      <path d="M0 210 L400 150" fill="none" stroke-width="26" class="stroke-blue-200 dark:stroke-blue-950" />
      <path d="M120 -10 L180 330" fill="none" stroke-width="16" class="stroke-gray-200 dark:stroke-gray-800" />
      <path d="M-10 90 L410 40" fill="none" stroke-width="10" class="stroke-gray-200 dark:stroke-gray-800" />
      <path d="M300 -10 L340 330" fill="none" stroke-width="10" class="stroke-gray-200 dark:stroke-gray-800" />
      <circle cx="196" cy="150" r="46" class="fill-blue-500/10" />
      <path d="M196 98c-20 0-36 16-36 36 0 27 36 58 36 58s36-31 36-58c0-20-16-36-36-36z" class="fill-blue-600 dark:fill-blue-500" />
      <circle cx="196" cy="134" r="13" fill="#fff" />
    </svg>
    <p class="absolute bottom-3 left-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur dark:bg-gray-900/90 dark:text-gray-200">24 Harbour Street</p>
  </div>
</section>`,
      react: `import { useId } from 'react';

export function ContactSplitMap({
  title = 'Visit or message us',
  description = "We're at 24 Harbour Street. Send a note and we'll line up a time.",
  address = '24 Harbour Street',
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto grid w-full max-w-5xl items-stretch gap-6 px-4 py-12 md:grid-cols-2 md:gap-10 sm:py-16 \${className}\`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={nameId} className={label}>Name</label>
            <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor={emailId} className={label}>Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor={messageId} className={label}>Message</label>
            <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
        </form>
      </div>
      <div className="relative min-h-[240px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" role="img" aria-label={\`Map to \${address}\`}>
          <rect width="400" height="320" className="fill-gray-100 dark:fill-gray-900" />
          <path d="M0 210 L400 150" fill="none" strokeWidth="26" className="stroke-blue-200 dark:stroke-blue-950" />
          <path d="M120 -10 L180 330" fill="none" strokeWidth="16" className="stroke-gray-200 dark:stroke-gray-800" />
          <path d="M-10 90 L410 40" fill="none" strokeWidth="10" className="stroke-gray-200 dark:stroke-gray-800" />
          <path d="M300 -10 L340 330" fill="none" strokeWidth="10" className="stroke-gray-200 dark:stroke-gray-800" />
          <circle cx="196" cy="150" r="46" className="fill-blue-500/10" />
          <path d="M196 98c-20 0-36 16-36 36 0 27 36 58 36 58s36-31 36-58c0-20-16-36-36-36z" className="fill-blue-600 dark:fill-blue-500" />
          <circle cx="196" cy="134" r="13" fill="#fff" />
        </svg>
        <p className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur dark:bg-gray-900/90 dark:text-gray-200">{address}</p>
      </div>
    </section>
  );
}`,
      typescript: `import { useId, type FormEvent } from 'react';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactSplitMapProps {
  title?: string;
  description?: string;
  address?: string;
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

export function ContactSplitMap({
  title = 'Visit or message us',
  description = "We're at 24 Harbour Street. Send a note and we'll line up a time.",
  address = '24 Harbour Street',
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactSplitMapProps): JSX.Element {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto grid w-full max-w-5xl items-stretch gap-6 px-4 py-12 md:grid-cols-2 md:gap-10 sm:py-16 \${className}\`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={nameId} className={label}>Name</label>
            <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor={emailId} className={label}>Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor={messageId} className={label}>Message</label>
            <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
        </form>
      </div>
      <div className="relative min-h-[240px] overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
        <svg viewBox="0 0 400 320" className="absolute inset-0 h-full w-full" role="img" aria-label={\`Map to \${address}\`}>
          <rect width="400" height="320" className="fill-gray-100 dark:fill-gray-900" />
          <path d="M0 210 L400 150" fill="none" strokeWidth="26" className="stroke-blue-200 dark:stroke-blue-950" />
          <path d="M120 -10 L180 330" fill="none" strokeWidth="16" className="stroke-gray-200 dark:stroke-gray-800" />
          <path d="M-10 90 L410 40" fill="none" strokeWidth="10" className="stroke-gray-200 dark:stroke-gray-800" />
          <path d="M300 -10 L340 330" fill="none" strokeWidth="10" className="stroke-gray-200 dark:stroke-gray-800" />
          <circle cx="196" cy="150" r="46" className="fill-blue-500/10" />
          <path d="M196 98c-20 0-36 16-36 36 0 27 36 58 36 58s36-31 36-58c0-20-16-36-36-36z" className="fill-blue-600 dark:fill-blue-500" />
          <circle cx="196" cy="134" r="13" fill="#fff" />
        </svg>
        <p className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur dark:bg-gray-900/90 dark:text-gray-200">{address}</p>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'contact-with-details',
    category: 'contact',
    tags: ['contact', 'form', 'details', 'address', 'two-column'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Contact us'", descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'address', type: 'string', default: "'24 Harbour Street, Lisbon'", descriptionKey: 'address' },
      { name: 'phone', type: 'string', default: "'+351 21 000 0000'", descriptionKey: 'phone' },
      { name: 'email', type: 'string', default: "'hello@example.com'", descriptionKey: 'email' },
      { name: 'onSubmit', type: '(values: ContactFormValues) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Phone and email are real tel:/mailto: links, so a tap dials or composes. The
  icons are aria-hidden decoration; the visible label ("Email", "24 Harbour
  Street") is what carries the meaning.
-->
<section class="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 sm:py-16">
  <div>
    <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Contact us</h2>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Prefer another channel? Reach us however suits you.</p>
    <ul class="mt-6 space-y-4">
      <li class="flex items-start gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" /></svg>
        </span>
        <span><span class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Address</span><span class="text-sm text-gray-800 dark:text-gray-200">24 Harbour Street, Lisbon</span></span>
      </li>
      <li class="flex items-start gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" /></svg>
        </span>
        <span><span class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Phone</span><a href="tel:+35121000000" class="text-sm text-blue-700 hover:underline dark:text-blue-400">+351 21 000 0000</a></span>
      </li>
      <li class="flex items-start gap-3">
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="m22 7-10 5L2 7" /></svg>
        </span>
        <span><span class="block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</span><a href="mailto:hello@example.com" class="text-sm text-blue-700 hover:underline dark:text-blue-400">hello@example.com</a></span>
      </li>
    </ul>
  </div>
  <form class="space-y-4">
    <div>
      <label for="cd-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
      <input id="cd-name" name="name" type="text" autocomplete="name" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="cd-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input id="cd-email" name="email" type="email" autocomplete="email" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="cd-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
      <textarea id="cd-message" name="message" rows="4" required class="mt-1.5 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"></textarea>
    </div>
    <button type="submit" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Send message</button>
  </form>
</section>`,
      react: `import { useId } from 'react';

function DetailIcon({ name }) {
  const cls = 'h-5 w-5';
  if (name === 'address') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  if (name === 'phone') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="m22 7-10 5L2 7" />
    </svg>
  );
}

export function ContactWithDetails({
  title = 'Contact us',
  description = 'Prefer another channel? Reach us however suits you.',
  address = '24 Harbour Street, Lisbon',
  phone = '+351 21 000 0000',
  email = 'hello@example.com',
  onSubmit = () => {},
  className = '',
}) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const badge = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400';
  const cap = 'block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400';

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 sm:py-16 \${className}\`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
        <ul className="mt-6 space-y-4">
          <li className="flex items-start gap-3">
            <span className={badge} aria-hidden="true"><DetailIcon name="address" /></span>
            <span><span className={cap}>Address</span><span className="text-sm text-gray-800 dark:text-gray-200">{address}</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className={badge} aria-hidden="true"><DetailIcon name="phone" /></span>
            <span><span className={cap}>Phone</span><a href={\`tel:\${phone.replace(/[^+\\d]/g, '')}\`} className="text-sm text-blue-700 hover:underline dark:text-blue-400">{phone}</a></span>
          </li>
          <li className="flex items-start gap-3">
            <span className={badge} aria-hidden="true"><DetailIcon name="email" /></span>
            <span><span className={cap}>Email</span><a href={\`mailto:\${email}\`} className="text-sm text-blue-700 hover:underline dark:text-blue-400">{email}</a></span>
          </li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={nameId} className={label}>Name</label>
          <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
        </div>
        <div>
          <label htmlFor={emailId} className={label}>Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor={messageId} className={label}>Message</label>
          <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Send message</button>
      </form>
    </section>
  );
}`,
      typescript: `import { useId, type FormEvent } from 'react';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

type DetailName = 'address' | 'phone' | 'email';

function DetailIcon({ name }: { name: DetailName }): JSX.Element {
  const cls = 'h-5 w-5';
  if (name === 'address') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z" /><circle cx="12" cy="10" r="3" />
      </svg>
    );
  }
  if (name === 'phone') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cls}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cls}>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /><path d="m22 7-10 5L2 7" />
    </svg>
  );
}

export interface ContactWithDetailsProps {
  title?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

export function ContactWithDetails({
  title = 'Contact us',
  description = 'Prefer another channel? Reach us however suits you.',
  address = '24 Harbour Street, Lisbon',
  phone = '+351 21 000 0000',
  email = 'hello@example.com',
  onSubmit = () => {},
  className = '',
}: ContactWithDetailsProps): JSX.Element {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const badge = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400';
  const cap = 'block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 sm:py-16 \${className}\`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
        <ul className="mt-6 space-y-4">
          <li className="flex items-start gap-3">
            <span className={badge} aria-hidden="true"><DetailIcon name="address" /></span>
            <span><span className={cap}>Address</span><span className="text-sm text-gray-800 dark:text-gray-200">{address}</span></span>
          </li>
          <li className="flex items-start gap-3">
            <span className={badge} aria-hidden="true"><DetailIcon name="phone" /></span>
            <span><span className={cap}>Phone</span><a href={\`tel:\${phone.replace(/[^+\\d]/g, '')}\`} className="text-sm text-blue-700 hover:underline dark:text-blue-400">{phone}</a></span>
          </li>
          <li className="flex items-start gap-3">
            <span className={badge} aria-hidden="true"><DetailIcon name="email" /></span>
            <span><span className={cap}>Email</span><a href={\`mailto:\${email}\`} className="text-sm text-blue-700 hover:underline dark:text-blue-400">{email}</a></span>
          </li>
        </ul>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={nameId} className={label}>Name</label>
          <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
        </div>
        <div>
          <label htmlFor={emailId} className={label}>Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor={messageId} className={label}>Message</label>
          <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Send message</button>
      </form>
    </section>
  );
}`,
    },
  },
  {
    slug: 'contact-two-column',
    category: 'contact',
    tags: ['contact', 'form', 'two-column', 'split', 'intro'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Let's talk'", descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'note', type: 'string', descriptionKey: 'note' },
      { name: 'submitLabel', type: 'string', default: "'Send message'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(values: ContactFormValues) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto grid w-full max-w-5xl items-start gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 sm:py-16">
  <div class="md:pt-2">
    <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Let's talk</h2>
    <p class="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">Whether it's a question, a project, or just feedback, drop us a line and a real person will get back to you.</p>
    <p class="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400"><span class="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true"></span>Typically replies within a day</p>
  </div>
  <form class="space-y-4">
    <div>
      <label for="ct-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
      <input id="ct-name" name="name" type="text" autocomplete="name" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="ct-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input id="ct-email" name="email" type="email" autocomplete="email" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="ct-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
      <textarea id="ct-message" name="message" rows="4" required class="mt-1.5 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"></textarea>
    </div>
    <button type="submit" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Send message</button>
  </form>
</section>`,
      react: `import { useId } from 'react';

export function ContactTwoColumn({
  title = "Let's talk",
  description = "Whether it's a question, a project, or just feedback, drop us a line and a real person will get back to you.",
  note = 'Typically replies within a day',
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto grid w-full max-w-5xl items-start gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 sm:py-16 \${className}\`}>
      <div className="md:pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        {description ? <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">{description}</p> : null}
        {note ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />{note}
          </p>
        ) : null}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={nameId} className={label}>Name</label>
          <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
        </div>
        <div>
          <label htmlFor={emailId} className={label}>Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor={messageId} className={label}>Message</label>
          <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
      </form>
    </section>
  );
}`,
      typescript: `import { useId, type FormEvent } from 'react';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactTwoColumnProps {
  title?: string;
  description?: string;
  note?: string;
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

export function ContactTwoColumn({
  title = "Let's talk",
  description = "Whether it's a question, a project, or just feedback, drop us a line and a real person will get back to you.",
  note = 'Typically replies within a day',
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactTwoColumnProps): JSX.Element {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto grid w-full max-w-5xl items-start gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 sm:py-16 \${className}\`}>
      <div className="md:pt-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        {description ? <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">{description}</p> : null}
        {note ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />{note}
          </p>
        ) : null}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor={nameId} className={label}>Name</label>
          <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
        </div>
        <div>
          <label htmlFor={emailId} className={label}>Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor={messageId} className={label}>Message</label>
          <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
      </form>
    </section>
  );
}`,
    },
  },
  {
    slug: 'contact-boxed-card',
    category: 'contact',
    tags: ['contact', 'form', 'card', 'boxed', 'centered'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'primary', labelKey: 'primary' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Send us a message'", descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'submitLabel', type: 'string', default: "'Send message'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(values: ContactFormValues) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-md px-4 py-12 sm:py-16">
  <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
    <h2 class="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">Send us a message</h2>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">We read every message and reply within one business day.</p>
    <form class="mt-6 space-y-4">
      <div>
        <label for="cb-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input id="cb-name" name="name" type="text" autocomplete="name" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="cb-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id="cb-email" name="email" type="email" autocomplete="email" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="cb-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
        <textarea id="cb-message" name="message" rows="4" required class="mt-1.5 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"></textarea>
      </div>
      <button type="submit" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Send message</button>
    </form>
  </div>
</section>`,
      react: `import { useId } from 'react';

export function ContactBoxedCard({
  title = 'Send us a message',
  description = 'We read every message and reply within one business day.',
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto w-full max-w-md px-4 py-12 sm:py-16 \${className}\`}>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{title}</h2>
        {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={nameId} className={label}>Name</label>
            <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor={emailId} className={label}>Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor={messageId} className={label}>Message</label>
            <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
        </form>
      </div>
    </section>
  );
}`,
      typescript: `import { useId, type FormEvent } from 'react';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactBoxedCardProps {
  title?: string;
  description?: string;
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

export function ContactBoxedCard({
  title = 'Send us a message',
  description = 'We read every message and reply within one business day.',
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactBoxedCardProps): JSX.Element {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto w-full max-w-md px-4 py-12 sm:py-16 \${className}\`}>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-gray-100">{title}</h2>
        {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={nameId} className={label}>Name</label>
            <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor={emailId} className={label}>Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor={messageId} className={label}>Message</label>
            <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
        </form>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'contact-support-options',
    category: 'contact',
    tags: ['contact', 'support', 'topic', 'radio', 'department'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'How can we help?'", descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'topics', type: 'SupportTopic[]', descriptionKey: 'topics' },
      { name: 'submitLabel', type: 'string', default: "'Submit request'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(values: SupportFormValues) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The topic picker is a real radio group inside a <fieldset>/<legend>, so it is
  announced as one labelled group and arrow-keys move between options. The card
  look is pure CSS: the native radio is sr-only and has-[:checked] / has-[:focus-visible]
  on the <label> paint the selected and focused states — no JS, still keyboard-driven.
-->
<section class="mx-auto w-full max-w-lg px-4 py-12 sm:py-16">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">How can we help?</h2>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Pick a topic so your message reaches the right team.</p>
  <form class="mt-6 space-y-5">
    <fieldset>
      <legend class="text-sm font-medium text-gray-700 dark:text-gray-300">Choose a topic</legend>
      <div class="mt-2 grid gap-3 sm:grid-cols-3">
        <label class="flex cursor-pointer flex-col rounded-lg border border-gray-300 p-3 text-sm has-[:checked]:border-blue-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600 dark:border-gray-700">
          <input type="radio" name="topic" value="sales" class="sr-only" checked />
          <span class="font-medium text-gray-900 dark:text-gray-100">Sales</span>
          <span class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Plans and pricing</span>
        </label>
        <label class="flex cursor-pointer flex-col rounded-lg border border-gray-300 p-3 text-sm has-[:checked]:border-blue-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600 dark:border-gray-700">
          <input type="radio" name="topic" value="support" class="sr-only" />
          <span class="font-medium text-gray-900 dark:text-gray-100">Support</span>
          <span class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Help with an issue</span>
        </label>
        <label class="flex cursor-pointer flex-col rounded-lg border border-gray-300 p-3 text-sm has-[:checked]:border-blue-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600 dark:border-gray-700">
          <input type="radio" name="topic" value="billing" class="sr-only" />
          <span class="font-medium text-gray-900 dark:text-gray-100">Billing</span>
          <span class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Invoices and payments</span>
        </label>
      </div>
    </fieldset>
    <div>
      <label for="cs-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input id="cs-email" name="email" type="email" autocomplete="email" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="cs-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
      <textarea id="cs-message" name="message" rows="4" required class="mt-1.5 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"></textarea>
    </div>
    <button type="submit" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Submit request</button>
  </form>
</section>`,
      react: `import { useId } from 'react';

const DEFAULT_TOPICS = [
  { value: 'sales', label: 'Sales', description: 'Plans and pricing' },
  { value: 'support', label: 'Support', description: 'Help with an issue' },
  { value: 'billing', label: 'Billing', description: 'Invoices and payments' },
];

export function ContactSupportOptions({
  title = 'How can we help?',
  description = 'Pick a topic so your message reaches the right team.',
  topics = DEFAULT_TOPICS,
  submitLabel = 'Submit request',
  onSubmit = () => {},
  className = '',
}) {
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const card =
    'flex cursor-pointer flex-col rounded-lg border border-gray-300 p-3 text-sm has-[:checked]:border-blue-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600 dark:border-gray-700';

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      topic: String(data.get('topic') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto w-full max-w-lg px-4 py-12 sm:py-16 \${className}\`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
      {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <fieldset>
          <legend className={label}>Choose a topic</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {topics.map((topic, index) => (
              <label key={topic.value} className={card}>
                <input type="radio" name="topic" value={topic.value} defaultChecked={index === 0} className="sr-only" />
                <span className="font-medium text-gray-900 dark:text-gray-100">{topic.label}</span>
                {topic.description ? <span className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{topic.description}</span> : null}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor={emailId} className={label}>Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor={messageId} className={label}>Message</label>
          <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
      </form>
    </section>
  );
}`,
      typescript: `import { useId, type FormEvent } from 'react';

export interface SupportTopic {
  value: string;
  label: string;
  description?: string;
}

export interface SupportFormValues {
  topic: string;
  email: string;
  message: string;
}

const DEFAULT_TOPICS: SupportTopic[] = [
  { value: 'sales', label: 'Sales', description: 'Plans and pricing' },
  { value: 'support', label: 'Support', description: 'Help with an issue' },
  { value: 'billing', label: 'Billing', description: 'Invoices and payments' },
];

export interface ContactSupportOptionsProps {
  title?: string;
  description?: string;
  topics?: SupportTopic[];
  submitLabel?: string;
  onSubmit?: (values: SupportFormValues) => void;
  className?: string;
}

export function ContactSupportOptions({
  title = 'How can we help?',
  description = 'Pick a topic so your message reaches the right team.',
  topics = DEFAULT_TOPICS,
  submitLabel = 'Submit request',
  onSubmit = () => {},
  className = '',
}: ContactSupportOptionsProps): JSX.Element {
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const card =
    'flex cursor-pointer flex-col rounded-lg border border-gray-300 p-3 text-sm has-[:checked]:border-blue-600 has-[:checked]:ring-2 has-[:checked]:ring-blue-600 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-600 dark:border-gray-700';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      topic: String(data.get('topic') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto w-full max-w-lg px-4 py-12 sm:py-16 \${className}\`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
      {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <fieldset>
          <legend className={label}>Choose a topic</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {topics.map((topic, index) => (
              <label key={topic.value} className={card}>
                <input type="radio" name="topic" value={topic.value} defaultChecked={index === 0} className="sr-only" />
                <span className="font-medium text-gray-900 dark:text-gray-100">{topic.label}</span>
                {topic.description ? <span className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{topic.description}</span> : null}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor={emailId} className={label}>Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor={messageId} className={label}>Message</label>
          <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
      </form>
    </section>
  );
}`,
    },
  },
  {
    slug: 'contact-gradient-side',
    category: 'contact',
    tags: ['contact', 'form', 'gradient', 'split', 'panel'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'panelTitle', type: 'string', default: "'Let's build something'", descriptionKey: 'panelTitle' },
      { name: 'panelText', type: 'string', descriptionKey: 'panelText' },
      { name: 'submitLabel', type: 'string', default: "'Send message'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(values: ContactFormValues) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The gradient panel paints its own dark surface, so the white text on it needs
  no dark: variant — it looks identical on a light or dark page. Only the form
  side inherits the theme and carries dark: utilities.
-->
<section class="mx-auto w-full max-w-4xl px-4 py-12 sm:py-16">
  <div class="grid overflow-hidden rounded-2xl border border-gray-200 md:grid-cols-2 dark:border-gray-800">
    <div class="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8">
      <h2 class="text-2xl font-bold tracking-tight text-white">Let's build something</h2>
      <p class="mt-3 text-sm leading-relaxed text-blue-50">Tell us about your project. We'll come back with next steps, not a sales script.</p>
    </div>
    <form class="space-y-4 bg-white p-6 sm:p-8 dark:bg-gray-950">
      <div>
        <label for="cg-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input id="cg-name" name="name" type="text" autocomplete="name" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="cg-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id="cg-email" name="email" type="email" autocomplete="email" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="cg-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
        <textarea id="cg-message" name="message" rows="4" required class="mt-1.5 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"></textarea>
      </div>
      <button type="submit" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">Send message</button>
    </form>
  </div>
</section>`,
      react: `import { useId } from 'react';

export function ContactGradientSide({
  panelTitle = "Let's build something",
  panelText = "Tell us about your project. We'll come back with next steps, not a sales script.",
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 py-12 sm:py-16 \${className}\`}>
      <div className="grid overflow-hidden rounded-2xl border border-gray-200 md:grid-cols-2 dark:border-gray-800">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">{panelTitle}</h2>
          {panelText ? <p className="mt-3 text-sm leading-relaxed text-blue-50">{panelText}</p> : null}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 dark:bg-gray-950">
          <div>
            <label htmlFor={nameId} className={label}>Name</label>
            <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor={emailId} className={label}>Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor={messageId} className={label}>Message</label>
            <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
        </form>
      </div>
    </section>
  );
}`,
      typescript: `import { useId, type FormEvent } from 'react';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactGradientSideProps {
  panelTitle?: string;
  panelText?: string;
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

export function ContactGradientSide({
  panelTitle = "Let's build something",
  panelText = "Tell us about your project. We'll come back with next steps, not a sales script.",
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactGradientSideProps): JSX.Element {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto w-full max-w-4xl px-4 py-12 sm:py-16 \${className}\`}>
      <div className="grid overflow-hidden rounded-2xl border border-gray-200 md:grid-cols-2 dark:border-gray-800">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight text-white">{panelTitle}</h2>
          {panelText ? <p className="mt-3 text-sm leading-relaxed text-blue-50">{panelText}</p> : null}
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 sm:p-8 dark:bg-gray-950">
          <div>
            <label htmlFor={nameId} className={label}>Name</label>
            <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor={emailId} className={label}>Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor={messageId} className={label}>Message</label>
            <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950">{submitLabel}</button>
        </form>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'contact-minimal',
    category: 'contact',
    tags: ['contact', 'form', 'minimal', 'compact', 'simple'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Drop us a line'", descriptionKey: 'title' },
      { name: 'submitLabel', type: 'string', default: "'Send'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(values: MinimalContactValues) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!-- Two fields, no card, no chrome. Still a real <label> per field. -->
<section class="mx-auto w-full max-w-sm px-4 py-10">
  <h2 class="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">Drop us a line</h2>
  <form class="mt-4 space-y-3">
    <div>
      <label for="cn-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input id="cn-email" name="email" type="email" autocomplete="email" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="cn-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
      <textarea id="cn-message" name="message" rows="3" required class="mt-1.5 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"></textarea>
    </div>
    <button type="submit" class="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900">Send</button>
  </form>
</section>`,
      react: `import { useId } from 'react';

export function ContactMinimal({
  title = 'Drop us a line',
  submitLabel = 'Send',
  onSubmit = () => {},
  className = '',
}) {
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto w-full max-w-sm px-4 py-10 \${className}\`}>
      <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label htmlFor={emailId} className={label}>Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor={messageId} className={label}>Message</label>
          <textarea id={messageId} name="message" rows={3} required className={\`\${field} resize-y\`} />
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
      </form>
    </section>
  );
}`,
      typescript: `import { useId, type FormEvent } from 'react';

export interface MinimalContactValues {
  email: string;
  message: string;
}

export interface ContactMinimalProps {
  title?: string;
  submitLabel?: string;
  onSubmit?: (values: MinimalContactValues) => void;
  className?: string;
}

export function ContactMinimal({
  title = 'Drop us a line',
  submitLabel = 'Send',
  onSubmit = () => {},
  className = '',
}: ContactMinimalProps): JSX.Element {
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto w-full max-w-sm px-4 py-10 \${className}\`}>
      <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100">{title}</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div>
          <label htmlFor={emailId} className={label}>Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor={messageId} className={label}>Message</label>
          <textarea id={messageId} name="message" rows={3} required className={\`\${field} resize-y\`} />
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
      </form>
    </section>
  );
}`,
    },
  },
  {
    slug: 'contact-faq-combined',
    category: 'contact',
    tags: ['contact', 'form', 'faq', 'accordion', 'split'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Get in touch'", descriptionKey: 'title' },
      { name: 'faqTitle', type: 'string', default: "'Before you ask'", descriptionKey: 'faqTitle' },
      { name: 'faqs', type: 'FaqItem[]', descriptionKey: 'faqs' },
      { name: 'submitLabel', type: 'string', default: "'Send message'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(values: ContactFormValues) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The FAQ is native <details>/<summary> — it opens and closes with zero JS and is
  keyboard-operable and announced out of the box. The default disclosure triangle
  is hidden and replaced by a chevron that rotates with group-open.
-->
<section class="mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 sm:py-16">
  <div>
    <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Get in touch</h2>
    <form class="mt-6 space-y-4">
      <div>
        <label for="cf2-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input id="cf2-name" name="name" type="text" autocomplete="name" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="cf2-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input id="cf2-email" name="email" type="email" autocomplete="email" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
      </div>
      <div>
        <label for="cf2-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
        <textarea id="cf2-message" name="message" rows="4" required class="mt-1.5 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"></textarea>
      </div>
      <button type="submit" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Send message</button>
    </form>
  </div>
  <div>
    <h3 class="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Before you ask</h3>
    <div class="mt-3">
      <details class="group border-b border-gray-200 py-3 dark:border-gray-800">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-3 rounded text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden dark:text-gray-100">
          How soon will I hear back?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </summary>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Within one business day, usually much sooner.</p>
      </details>
      <details class="group border-b border-gray-200 py-3 dark:border-gray-800">
        <summary class="flex cursor-pointer list-none items-center justify-between gap-3 rounded text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden dark:text-gray-100">
          Do you offer phone support?
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
        </summary>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Yes, on Business and Enterprise plans.</p>
      </details>
    </div>
  </div>
</section>`,
      react: `import { useId } from 'react';

const DEFAULT_FAQS = [
  { question: 'How soon will I hear back?', answer: 'Within one business day, usually much sooner.' },
  { question: 'Do you offer phone support?', answer: 'Yes, on Business and Enterprise plans.' },
];

export function ContactFaqCombined({
  title = 'Get in touch',
  faqTitle = 'Before you ask',
  faqs = DEFAULT_FAQS,
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 sm:py-16 \${className}\`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={nameId} className={label}>Name</label>
            <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor={emailId} className={label}>Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor={messageId} className={label}>Message</label>
            <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
        </form>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{faqTitle}</h3>
        <div className="mt-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-gray-200 py-3 dark:border-gray-800">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden dark:text-gray-100">
                {faq.question}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}`,
      typescript: `import { useId, type FormEvent } from 'react';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  { question: 'How soon will I hear back?', answer: 'Within one business day, usually much sooner.' },
  { question: 'Do you offer phone support?', answer: 'Yes, on Business and Enterprise plans.' },
];

export interface ContactFaqCombinedProps {
  title?: string;
  faqTitle?: string;
  faqs?: FaqItem[];
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

export function ContactFaqCombined({
  title = 'Get in touch',
  faqTitle = 'Before you ask',
  faqs = DEFAULT_FAQS,
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactFaqCombinedProps): JSX.Element {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto grid w-full max-w-5xl gap-8 px-4 py-12 md:grid-cols-2 md:gap-12 sm:py-16 \${className}\`}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={nameId} className={label}>Name</label>
            <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor={emailId} className={label}>Email</label>
            <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor={messageId} className={label}>Message</label>
            <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
        </form>
      </div>
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{faqTitle}</h3>
        <div className="mt-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-gray-200 py-3 dark:border-gray-800">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded text-sm font-medium text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 [&::-webkit-details-marker]:hidden dark:text-gray-100">
                {faq.question}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </summary>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'contact-social-links',
    category: 'contact',
    tags: ['contact', 'form', 'social', 'links', 'icons'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 0, copies: 0, downloads: 0 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'title', type: 'string', default: "'Say hello'", descriptionKey: 'title' },
      { name: 'description', type: 'string', descriptionKey: 'description' },
      { name: 'socials', type: 'SocialLink[]', descriptionKey: 'socials' },
      { name: 'submitLabel', type: 'string', default: "'Send message'", descriptionKey: 'submitLabel' },
      { name: 'onSubmit', type: '(values: ContactFormValues) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Each social link is an <a> with an aria-label ("Follow us on X"): the glyph is
  aria-hidden, so a screen reader announces a named link, not a lone SVG. Targets
  are 40px so they clear the touch minimum.
-->
<section class="mx-auto w-full max-w-lg px-4 py-12 sm:py-16">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">Say hello</h2>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Fill in the form, or reach us on your platform of choice.</p>
  <form class="mt-6 space-y-4">
    <div>
      <label for="cso-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
      <input id="cso-name" name="name" type="text" autocomplete="name" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="cso-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
      <input id="cso-email" name="email" type="email" autocomplete="email" required class="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400" />
    </div>
    <div>
      <label for="cso-message" class="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
      <textarea id="cso-message" name="message" rows="4" required class="mt-1.5 block w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400"></textarea>
    </div>
    <button type="submit" class="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">Send message</button>
  </form>
  <div class="mt-6 flex items-center gap-3">
    <span class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Or find us</span>
    <span class="h-px flex-1 bg-gray-200 dark:bg-gray-800"></span>
  </div>
  <div class="mt-4 flex gap-2">
    <a href="#" aria-label="Follow us on X" class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
      <svg viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path d="M18.9 1.2h3.7l-8 9.1 9.4 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.5h2L6.5 3.3H4.4l13.2 17.4Z" /></svg>
    </a>
    <a href="#" aria-label="Follow us on GitHub" class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
      <svg viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" /></svg>
    </a>
    <a href="#" aria-label="Follow us on LinkedIn" class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100">
      <svg viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.24 8.2H4.7V24H.24V8.2Zm7.4 0h4.27v2.16h.06c.6-1.13 2.06-2.32 4.24-2.32 4.54 0 5.38 2.99 5.38 6.87V24h-4.46v-7.24c0-1.73-.03-3.95-2.4-3.95-2.4 0-2.77 1.88-2.77 3.82V24H7.64V8.2Z" /></svg>
    </a>
  </div>
</section>`,
      react: `import { useId } from 'react';

function SocialGlyph({ name }) {
  const cls = 'h-4 w-4';
  if (name === 'x') {
    return <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true"><path d="M18.9 1.2h3.7l-8 9.1 9.4 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.5h2L6.5 3.3H4.4l13.2 17.4Z" /></svg>;
  }
  if (name === 'github') {
    return <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.24 8.2H4.7V24H.24V8.2Zm7.4 0h4.27v2.16h.06c.6-1.13 2.06-2.32 4.24-2.32 4.54 0 5.38 2.99 5.38 6.87V24h-4.46v-7.24c0-1.73-.03-3.95-2.4-3.95-2.4 0-2.77 1.88-2.77 3.82V24H7.64V8.2Z" /></svg>;
}

const DEFAULT_SOCIALS = [
  { name: 'x', label: 'Follow us on X', href: '#' },
  { name: 'github', label: 'Follow us on GitHub', href: '#' },
  { name: 'linkedin', label: 'Follow us on LinkedIn', href: '#' },
];

export function ContactSocialLinks({
  title = 'Say hello',
  description = 'Fill in the form, or reach us on your platform of choice.',
  socials = DEFAULT_SOCIALS,
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const iconLink =
    'flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';

  function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto w-full max-w-lg px-4 py-12 sm:py-16 \${className}\`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
      {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={nameId} className={label}>Name</label>
          <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
        </div>
        <div>
          <label htmlFor={emailId} className={label}>Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor={messageId} className={label}>Message</label>
          <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
      </form>
      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Or find us</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-4 flex gap-2">
        {socials.map((social) => (
          <a key={social.label} href={social.href} aria-label={social.label} className={iconLink}>
            <SocialGlyph name={social.name} />
          </a>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import { useId, type FormEvent } from 'react';

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export type SocialName = 'x' | 'github' | 'linkedin';

export interface SocialLink {
  name: SocialName;
  label: string;
  href: string;
}

function SocialGlyph({ name }: { name: SocialName }): JSX.Element {
  const cls = 'h-4 w-4';
  if (name === 'x') {
    return <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true"><path d="M18.9 1.2h3.7l-8 9.1 9.4 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.5h2L6.5 3.3H4.4l13.2 17.4Z" /></svg>;
  }
  if (name === 'github') {
    return <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.3-1.8-1.3-1.8-1.1-.7 0-.7 0-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" /></svg>;
  }
  return <svg viewBox="0 0 24 24" fill="currentColor" className={cls} aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.24 8.2H4.7V24H.24V8.2Zm7.4 0h4.27v2.16h.06c.6-1.13 2.06-2.32 4.24-2.32 4.54 0 5.38 2.99 5.38 6.87V24h-4.46v-7.24c0-1.73-.03-3.95-2.4-3.95-2.4 0-2.77 1.88-2.77 3.82V24H7.64V8.2Z" /></svg>;
}

const DEFAULT_SOCIALS: SocialLink[] = [
  { name: 'x', label: 'Follow us on X', href: '#' },
  { name: 'github', label: 'Follow us on GitHub', href: '#' },
  { name: 'linkedin', label: 'Follow us on LinkedIn', href: '#' },
];

export interface ContactSocialLinksProps {
  title?: string;
  description?: string;
  socials?: SocialLink[];
  submitLabel?: string;
  onSubmit?: (values: ContactFormValues) => void;
  className?: string;
}

export function ContactSocialLinks({
  title = 'Say hello',
  description = 'Fill in the form, or reach us on your platform of choice.',
  socials = DEFAULT_SOCIALS,
  submitLabel = 'Send message',
  onSubmit = () => {},
  className = '',
}: ContactSocialLinksProps): JSX.Element {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const field =
    'mt-1.5 block w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus-visible:ring-blue-400';
  const label = 'block text-sm font-medium text-gray-700 dark:text-gray-300';
  const iconLink =
    'flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 motion-reduce:transition-none dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100';

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    onSubmit({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    form.reset();
  }

  return (
    <section className={\`mx-auto w-full max-w-lg px-4 py-12 sm:py-16 \${className}\`}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
      {description ? <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{description}</p> : null}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor={nameId} className={label}>Name</label>
          <input id={nameId} name="name" type="text" autoComplete="name" required className={field} />
        </div>
        <div>
          <label htmlFor={emailId} className={label}>Email</label>
          <input id={emailId} name="email" type="email" autoComplete="email" required className={field} />
        </div>
        <div>
          <label htmlFor={messageId} className={label}>Message</label>
          <textarea id={messageId} name="message" rows={4} required className={\`\${field} resize-y\`} />
        </div>
        <button type="submit" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900">{submitLabel}</button>
      </form>
      <div className="mt-6 flex items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Or find us</span>
        <span className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>
      <div className="mt-4 flex gap-2">
        {socials.map((social) => (
          <a key={social.label} href={social.href} aria-label={social.label} className={iconLink}>
            <SocialGlyph name={social.name} />
          </a>
        ))}
      </div>
    </section>
  );
}`,
    },
  },
];
