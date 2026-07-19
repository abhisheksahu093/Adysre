import type { ComponentEntry } from './types';

/**
 * About category - the five sections an About page is actually made of:
 * the narrative, the people, the numbers, the history and the principles.
 *
 * All six framework variants per entry, following `buttons.ts`. None of these
 * hold state, so every `nextjs` variant here is a Server Component - the
 * 'use client' directive would buy nothing but a hydration cost.
 */
export const aboutComponents: ComponentEntry[] = [
  {
    slug: 'about-story',
    category: 'about',
    tags: ['about', 'story', 'narrative', 'portrait', 'founding'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-04-16',
    updatedAt: '2026-07-04',
    license: 'MIT',
    version: '1.2.0',
    featured: true,
    stats: { views: 1720, copies: 449, downloads: 126 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker', example: 'Our story' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'paragraphs', type: 'string[]', required: true, descriptionKey: 'paragraphs' },
      { name: 'foundingYear', type: 'string', descriptionKey: 'foundingYear', example: '2019' },
      {
        name: 'foundingLabel',
        type: 'string',
        descriptionKey: 'foundingLabel',
        example: 'Founded in Bristol, two people and one contract',
      },
      { name: 'imageSrc', type: 'string', required: true, descriptionKey: 'imageSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      {
        name: 'caption',
        type: 'string',
        descriptionKey: 'figureCaption',
        example: 'Priya Raman and Tom Ashcroft, founders',
      },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The narrative is real <p> elements, not one blob with <br> between paragraphs:
  a screen reader can jump paragraph by paragraph, and a translator gets units
  that make sense.

  The founding-year callout is an <aside> - it is genuinely tangential to the
  prose beside it, which is exactly what the element is for. Its year is a real
  text node inside a <p>, not a background image or a ::before, so it can be
  read, copied and translated like any other fact on the page.

  The portrait's alt is empty because the caption underneath names the person.
  Filling both in makes a screen reader say the name twice in a row.
-->
<section class="abt-story" aria-labelledby="abt-story-title">
  <div class="abt-story__copy">
    <p class="abt-story__kicker">Our story</p>
    <h2 class="abt-story__title" id="abt-story-title">We started with one stubborn question</h2>

    <p class="abt-story__text">
      Why does software that costs a fortune so often ship late and please nobody? We had both
      spent a decade inside teams that could not answer it, so in 2019 we left to find out.
    </p>
    <p class="abt-story__text">
      The answer turned out to be unglamorous. Teams were not short of talent or tools - they
      were short of a decision-making habit. So that is what we build with our clients now,
      and the software is what falls out of it.
    </p>

    <aside class="abt-story__callout">
      <p class="abt-story__year">2019</p>
      <p class="abt-story__year-label">Founded in Bristol, two people and one contract</p>
    </aside>
  </div>

  <figure class="abt-story__figure">
    <img class="abt-story__image" src="/promo/all-access.svg" alt="" width="480" height="600" />
    <figcaption class="abt-story__caption">Priya Raman and Tom Ashcroft, founders</figcaption>
  </figure>
</section>`,
      css: `.abt-story {
  display: grid;
  gap: 2.5rem;
  align-items: start;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

/*
 * The portrait is a 5/7 column so the prose keeps a readable measure rather
 * than stretching to half the page. Below this width the two stack and the
 * picture goes full-bleed within the padding.
 */
@media (min-width: 48rem) {
  .abt-story {
    grid-template-columns: 7fr 5fr;
    gap: 4rem;
  }
}

.abt-story__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1d4ed8;
}

.abt-story__title {
  margin: 0.75rem 0 0;
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #111827;
}

.abt-story__text {
  margin: 1rem 0 0;
  max-width: 38rem;
  line-height: 1.75;
  color: #4b5563;
}

/*
 * A left rule rather than a box: the callout is an aside to the prose, and a
 * full card would promote it into a competing element.
 */
.abt-story__callout {
  margin-top: 2rem;
  padding: 0.25rem 0 0.25rem 1.25rem;
  border-left: 3px solid #2563eb;
}

.abt-story__year {
  margin: 0;
  font-size: 2.25rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: #111827;
}

.abt-story__year-label {
  margin: 0.375rem 0 0;
  font-size: 0.875rem;
  color: #4b5563;
}

.abt-story__figure {
  margin: 0;
}

.abt-story__image {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #f9fafb;
}

.abt-story__caption {
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  color: #6b7280;
}

@media (prefers-color-scheme: dark) {
  .abt-story {
    background-color: #111827;
  }

  .abt-story__kicker {
    color: #60a5fa;
  }

  .abt-story__title,
  .abt-story__year {
    color: #f3f4f6;
  }

  .abt-story__text,
  .abt-story__year-label {
    color: #9ca3af;
  }

  .abt-story__callout {
    border-left-color: #60a5fa;
  }

  .abt-story__image {
    border-color: #1f2937;
    background-color: #1f2937;
  }

  /* #6b7280 is 4.8:1 on white but 3.4:1 on #111827 - a caption still needs AA. */
  .abt-story__caption {
    color: #9ca3af;
  }
}`,
      tailwind: `<section class="mx-auto grid w-full max-w-6xl items-start gap-10 bg-white px-4 py-12 md:grid-cols-[7fr_5fr] md:gap-16 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="abt-story-title">
  <div>
    <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Our story</p>
    <h2 id="abt-story-title" class="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
      We started with one stubborn question
    </h2>

    <p class="mt-4 max-w-prose leading-[1.75] text-gray-600 dark:text-gray-400">
      Why does software that costs a fortune so often ship late and please nobody? We had both
      spent a decade inside teams that could not answer it, so in 2019 we left to find out.
    </p>
    <p class="mt-4 max-w-prose leading-[1.75] text-gray-600 dark:text-gray-400">
      The answer turned out to be unglamorous. Teams were not short of talent or tools - they were
      short of a decision-making habit.
    </p>

    <aside class="mt-8 border-l-[3px] border-blue-600 py-1 pl-5 dark:border-blue-400">
      <p class="text-4xl font-bold leading-none tracking-tight tabular-nums text-gray-900 dark:text-gray-100">2019</p>
      <p class="mt-1.5 text-sm text-gray-600 dark:text-gray-400">Founded in Bristol, two people and one contract</p>
    </aside>
  </div>

  <figure class="m-0">
    <img
      src="/promo/all-access.svg"
      alt=""
      width="480"
      height="600"
      class="block aspect-[4/5] w-full rounded-2xl border border-gray-200 bg-gray-50 object-cover dark:border-gray-800 dark:bg-gray-800"
    />
    <figcaption class="mt-3 text-[0.8125rem] text-gray-500 dark:text-gray-400">
      Priya Raman and Tom Ashcroft, founders
    </figcaption>
  </figure>
</section>`,
      react: `export function AboutStory({
  kicker,
  title,
  paragraphs,
  foundingYear,
  foundingLabel,
  imageSrc,
  imageAlt = '',
  caption,
  className = '',
}) {
  return (
    <section
      aria-labelledby="abt-story-title"
      className={[
        'mx-auto grid w-full max-w-6xl items-start gap-10 bg-white px-4 py-12 md:grid-cols-[7fr_5fr] md:gap-16 md:px-6 md:py-16 dark:bg-gray-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2 id="abt-story-title" className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>

        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="mt-4 max-w-prose leading-[1.75] text-gray-600 dark:text-gray-400">
            {paragraph}
          </p>
        ))}

        {foundingYear ? (
          <aside className="mt-8 border-l-[3px] border-blue-600 py-1 pl-5 dark:border-blue-400">
            <p className="text-4xl font-bold leading-none tracking-tight tabular-nums text-gray-900 dark:text-gray-100">
              {foundingYear}
            </p>
            {foundingLabel ? <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{foundingLabel}</p> : null}
          </aside>
        ) : null}
      </div>

      <figure className="m-0">
        <img
          src={imageSrc}
          alt={imageAlt}
          width={480}
          height={600}
          className="block aspect-[4/5] w-full rounded-2xl border border-gray-200 bg-gray-50 object-cover dark:border-gray-800 dark:bg-gray-800"
        />
        {caption ? (
          <figcaption className="mt-3 text-[0.8125rem] text-gray-500 dark:text-gray-400">{caption}</figcaption>
        ) : null}
      </figure>
    </section>
  );
}`,
      nextjs: `import Image from 'next/image';

interface AboutStoryProps {
  kicker?: string;
  title: string;
  paragraphs: string[];
  foundingYear?: string;
  foundingLabel?: string;
  imageSrc: string;
  imageAlt?: string;
  caption?: string;
  className?: string;
}

// Stateless - no 'use client'. next/image needs the aspect box on the wrapper
// for \`fill\`, and the sizes hint matches the 7fr/5fr split above.
export function AboutStory({
  kicker,
  title,
  paragraphs,
  foundingYear,
  foundingLabel,
  imageSrc,
  imageAlt = '',
  caption,
  className = '',
}: AboutStoryProps) {
  return (
    <section
      aria-labelledby="abt-story-title"
      className={[
        'mx-auto grid w-full max-w-6xl items-start gap-10 bg-white px-4 py-12 md:grid-cols-[7fr_5fr] md:gap-16 md:px-6 md:py-16 dark:bg-gray-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2 id="abt-story-title" className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>

        {paragraphs.map((paragraph: string) => (
          <p key={paragraph.slice(0, 32)} className="mt-4 max-w-prose leading-[1.75] text-gray-600 dark:text-gray-400">
            {paragraph}
          </p>
        ))}

        {foundingYear ? (
          <aside className="mt-8 border-l-[3px] border-blue-600 py-1 pl-5 dark:border-blue-400">
            <p className="text-4xl font-bold leading-none tracking-tight tabular-nums text-gray-900 dark:text-gray-100">
              {foundingYear}
            </p>
            {foundingLabel ? <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{foundingLabel}</p> : null}
          </aside>
        ) : null}
      </div>

      <figure className="m-0">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
          <Image src={imageSrc} alt={imageAlt} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
        </div>
        {caption ? (
          <figcaption className="mt-3 text-[0.8125rem] text-gray-500 dark:text-gray-400">{caption}</figcaption>
        ) : null}
      </figure>
    </section>
  );
}`,
      typescript: `export interface AboutStoryProps {
  kicker?: string;
  title: string;
  /** One string per paragraph - rendered as real <p> elements, never joined. */
  paragraphs: string[];
  foundingYear?: string;
  foundingLabel?: string;
  imageSrc: string;
  /** Empty when a caption names the subject, or the name is announced twice. */
  imageAlt?: string;
  caption?: string;
  className?: string;
}

export function AboutStory({
  kicker,
  title,
  paragraphs,
  foundingYear,
  foundingLabel,
  imageSrc,
  imageAlt = '',
  caption,
  className = '',
}: AboutStoryProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-story-title"
      className={[
        'mx-auto grid w-full max-w-6xl items-start gap-10 bg-white px-4 py-12 md:grid-cols-[7fr_5fr] md:gap-16 md:px-6 md:py-16 dark:bg-gray-900',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2
          id="abt-story-title"
          className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>

        {/*
          Separate <p> elements, so a screen reader can move paragraph by
          paragraph and a translator gets units rather than one blob split by
          <br>. max-w-prose holds the measure even as the column widens.
        */}
        {paragraphs.map((paragraph: string) => (
          <p key={paragraph.slice(0, 32)} className="mt-4 max-w-prose leading-[1.75] text-gray-600 dark:text-gray-400">
            {paragraph}
          </p>
        ))}

        {/*
          An <aside>: genuinely tangential to the prose beside it, which is what
          the element means. A left rule rather than a card, so it stays a note
          instead of being promoted into a competing block.
        */}
        {foundingYear ? (
          <aside className="mt-8 border-l-[3px] border-blue-600 py-1 pl-5 dark:border-blue-400">
            <p className="text-4xl font-bold leading-none tracking-tight tabular-nums text-gray-900 dark:text-gray-100">
              {foundingYear}
            </p>
            {foundingLabel ? <p className="mt-1.5 text-sm text-gray-600 dark:text-gray-400">{foundingLabel}</p> : null}
          </aside>
        ) : null}
      </div>

      <figure className="m-0">
        <img
          src={imageSrc}
          alt={imageAlt}
          width={480}
          height={600}
          className="block aspect-[4/5] w-full rounded-2xl border border-gray-200 bg-gray-50 object-cover dark:border-gray-800 dark:bg-gray-800"
        />
        {caption ? (
          <figcaption className="mt-3 text-[0.8125rem] text-gray-500 dark:text-gray-400">{caption}</figcaption>
        ) : null}
      </figure>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-team-grid',
    category: 'about',
    tags: ['about', 'team', 'avatar', 'people', 'socials'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-05-14',
    updatedAt: '2026-07-09',
    license: 'MIT',
    version: '1.1.0',
    stats: { views: 1980, copies: 531, downloads: 148 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'members', type: 'TeamMember[]', required: true, descriptionKey: 'members' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Every avatar has alt="" and every social link has its own aria-label naming
  the person: "Priya Raman on LinkedIn", not "LinkedIn". A grid of eight people
  otherwise announces as eight identical "LinkedIn / GitHub" pairs, and the
  links-list dialog every screen reader offers becomes useless.

  Roles are <p>, not <h4>: a job title is not a section of the document, and
  promoting it to a heading puts sixteen phantom entries in the outline.
-->
<section class="abt-team" aria-labelledby="abt-team-title">
  <p class="abt-team__kicker">The team</p>
  <h2 class="abt-team__title" id="abt-team-title">Twelve people, no account managers</h2>

  <ul class="abt-team__grid">
    <li class="abt-team__card">
      <img class="abt-team__avatar" src="/promo/all-access.svg" alt="" width="96" height="96" />
      <h3 class="abt-team__name">Priya Raman</h3>
      <p class="abt-team__role">Co-founder, strategy</p>
      <p class="abt-team__bio">Fifteen years turning vague briefs into things that can be built.</p>
      <ul class="abt-team__socials">
        <li>
          <a class="abt-team__social" href="https://example.com/in/priya" aria-label="Priya Raman on LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2.05 1.4-2.05 2.8V21h-4V9Z" />
            </svg>
          </a>
        </li>
        <li>
          <a class="abt-team__social" href="https://example.com/priya" aria-label="Priya Raman on GitHub">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.69-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
            </svg>
          </a>
        </li>
      </ul>
    </li>
  </ul>
</section>`,
      css: `.abt-team {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.abt-team__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1d4ed8;
}

.abt-team__title {
  margin: 0.75rem 0 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.abt-team__grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
  margin: 2.5rem 0 0;
  padding: 0;
  list-style: none;
}

.abt-team__card {
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  background-color: #fff;
  text-align: center;
}

/*
 * A fixed square plus object-fit, so a portrait and a landscape headshot both
 * land as the same circle instead of one of them squashing.
 */
.abt-team__avatar {
  display: block;
  width: 6rem;
  height: 6rem;
  margin: 0 auto;
  border-radius: 9999px;
  object-fit: cover;
  background-color: #f3f4f6;
}

.abt-team__name {
  margin: 1rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.abt-team__role {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1d4ed8;
}

.abt-team__bio {
  margin: 0.75rem 0 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

.abt-team__socials {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
}

/*
 * 2.5rem box around a 1.125rem glyph: the icon can stay small while the tap
 * target stays at least 40px on touch.
 */
.abt-team__social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  color: #6b7280;
  transition: background-color 150ms, color 150ms;
}

.abt-team__social:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.abt-team__social:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

.abt-team__social svg {
  width: 1.125rem;
  height: 1.125rem;
}

@media (prefers-color-scheme: dark) {
  .abt-team {
    background-color: #111827;
  }

  .abt-team__kicker {
    color: #60a5fa;
  }

  .abt-team__title,
  .abt-team__name {
    color: #f3f4f6;
  }

  .abt-team__role {
    color: #60a5fa;
  }

  .abt-team__bio {
    color: #9ca3af;
  }

  .abt-team__card {
    border-color: #1f2937;
    background-color: #111827;
  }

  .abt-team__avatar {
    background-color: #1f2937;
  }

  .abt-team__social {
    color: #9ca3af;
  }

  .abt-team__social:hover {
    background-color: #1f2937;
    color: #f3f4f6;
  }

  .abt-team__social:focus-visible {
    outline-color: #60a5fa;
  }
}

@media (prefers-reduced-motion: reduce) {
  .abt-team__social {
    transition: none;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="abt-team-title">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">The team</p>
  <h2 id="abt-team-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Twelve people, no account managers
  </h2>

  <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <li class="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
      <img src="/promo/all-access.svg" alt="" width="96" height="96" class="mx-auto block h-24 w-24 rounded-full bg-gray-100 object-cover dark:bg-gray-800" />
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Priya Raman</h3>
      <p class="mt-1 text-sm font-medium text-blue-700 dark:text-blue-400">Co-founder, strategy</p>
      <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Fifteen years turning vague briefs into things that can be built.
      </p>
      <ul class="mt-4 flex justify-center gap-1">
        <li>
          <!-- The label names the person, not just the network. -->
          <a
            href="https://example.com/in/priya"
            aria-label="Priya Raman on LinkedIn"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            <svg class="h-[1.125rem] w-[1.125rem]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2.05 1.4-2.05 2.8V21h-4V9Z" />
            </svg>
          </a>
        </li>
      </ul>
    </li>
    <!-- Repeat one <li> per person. -->
  </ul>
</section>`,
      react: `export function AboutTeamGrid({ kicker, title, members, className = '' }) {
  return (
    <section
      aria-labelledby="abt-team-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="abt-team-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <li key={member.name} className="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
            <img
              src={member.avatarSrc}
              alt=""
              width={96}
              height={96}
              className="mx-auto block h-24 w-24 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
            />
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
            <p className="mt-1 text-sm font-medium text-blue-700 dark:text-blue-400">{member.role}</p>
            {member.bio ? (
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{member.bio}</p>
            ) : null}

            {member.socials?.length ? (
              <ul className="mt-4 flex justify-center gap-1">
                {member.socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={\`\${member.name} on \${social.label}\`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      nextjs: `import Image from 'next/image';
import type { ReactNode } from 'react';

interface TeamSocial {
  label: string;
  href: string;
  icon: ReactNode;
}

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatarSrc: string;
  socials?: TeamSocial[];
}

interface AboutTeamGridProps {
  kicker?: string;
  title: string;
  members: TeamMember[];
  className?: string;
}

// Stateless - no 'use client' needed.
export function AboutTeamGrid({ kicker, title, members, className = '' }: AboutTeamGridProps) {
  return (
    <section
      aria-labelledby="abt-team-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="abt-team-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member: TeamMember) => (
          <li key={member.name} className="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900">
            <Image
              src={member.avatarSrc}
              alt=""
              width={96}
              height={96}
              className="mx-auto block h-24 w-24 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
            />
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>
            <p className="mt-1 text-sm font-medium text-blue-700 dark:text-blue-400">{member.role}</p>
            {member.bio ? (
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{member.bio}</p>
            ) : null}

            {member.socials?.length ? (
              <ul className="mt-4 flex justify-center gap-1">
                {member.socials.map((social: TeamSocial) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      aria-label={\`\${member.name} on \${social.label}\`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface TeamSocial {
  /** The network's name. Composed into the link's accessible name. */
  label: string;
  href: string;
  icon: ReactNode;
}

export interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  avatarSrc: string;
  socials?: TeamSocial[];
}

export interface AboutTeamGridProps {
  kicker?: string;
  title: string;
  members: TeamMember[];
  className?: string;
}

export function AboutTeamGrid({
  kicker,
  title,
  members,
  className = '',
}: AboutTeamGridProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-team-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="abt-team-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member: TeamMember) => (
          <li
            key={member.name}
            className="rounded-2xl border border-gray-200 bg-white p-6 text-center dark:border-gray-800 dark:bg-gray-900"
          >
            {/* alt="" - the heading below is the person's name. Repeating it in
                the alt makes a screen reader say it twice, back to back. */}
            <img
              src={member.avatarSrc}
              alt=""
              width={96}
              height={96}
              className="mx-auto block h-24 w-24 rounded-full bg-gray-100 object-cover dark:bg-gray-800"
            />

            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{member.name}</h3>

            {/* A <p>, not an <h4>: a job title is not a section of the page, and
                promoting it puts one phantom entry per person in the outline. */}
            <p className="mt-1 text-sm font-medium text-blue-700 dark:text-blue-400">{member.role}</p>

            {member.bio ? (
              <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{member.bio}</p>
            ) : null}

            {member.socials?.length ? (
              <ul className="mt-4 flex justify-center gap-1">
                {member.socials.map((social: TeamSocial) => (
                  <li key={social.label}>
                    {/*
                      "Priya Raman on LinkedIn", not "LinkedIn". Twelve people
                      otherwise announce as twelve identical link pairs, which
                      makes the screen reader's links dialog worthless.
                    */}
                    <a
                      href={social.href}
                      aria-label={\`\${member.name} on \${social.label}\`}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white motion-reduce:transition-none dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
                    >
                      {social.icon}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-stats',
    category: 'about',
    tags: ['about', 'stats', 'metrics', 'numbers', 'section'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-06-12',
    updatedAt: '2026-07-07',
    license: 'MIT',
    version: '1.0.1',
    stats: { views: 1450, copies: 392, downloads: 103 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'stats', type: 'AboutStat[]', required: true, descriptionKey: 'metrics' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  A <dl>: each metric is a value and the term that names it, which is precisely
  what a definition list is. Marked up as divs, "12" and "People" are two
  unrelated strings and a screen reader reads eight of them in a row with no
  hint which label belongs to which number.

  Note the dd comes first visually but the dt is the label. That is legal and
  intended - flex-direction: column-reverse flips the paint order while the DOM
  keeps the term before its definition.

  Values are pre-formatted strings ("98%", "£4.2m"), never numbers this
  component has to format. Localising currency and percent is the page's job.
-->
<section class="abt-stats" aria-labelledby="abt-stats-title">
  <h2 class="abt-stats__title" id="abt-stats-title">Where we are after six years</h2>

  <dl class="abt-stats__grid">
    <div class="abt-stats__item">
      <dt class="abt-stats__label">People</dt>
      <dd class="abt-stats__value">12</dd>
    </div>
    <div class="abt-stats__item">
      <dt class="abt-stats__label">Projects shipped</dt>
      <dd class="abt-stats__value">148</dd>
    </div>
    <div class="abt-stats__item">
      <dt class="abt-stats__label">Client retention</dt>
      <dd class="abt-stats__value">94%</dd>
    </div>
    <div class="abt-stats__item">
      <dt class="abt-stats__label">Countries</dt>
      <dd class="abt-stats__value">9</dd>
    </div>
  </dl>
</section>`,
      css: `.abt-stats {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.abt-stats__title {
  margin: 0 0 2rem;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

/*
 * Two up on a phone, four across from 40rem. Four big numbers in one row on a
 * 390px screen would each be about 80px wide - which is where a stats band
 * usually stops being legible and starts being a texture.
 */
.abt-stats__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem 1.5rem;
  margin: 0;
}

@media (min-width: 40rem) {
  .abt-stats__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/*
 * column-reverse paints the value above its label while the DOM keeps dt
 * before dd - the reading order stays "People, 12", which is the order that
 * makes sense read aloud.
 */
.abt-stats__item {
  display: flex;
  flex-direction: column-reverse;
  gap: 0.375rem;
}

.abt-stats__value {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: #111827;
}

.abt-stats__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .abt-stats {
    background-color: #111827;
  }

  .abt-stats__title,
  .abt-stats__value {
    color: #f3f4f6;
  }

  .abt-stats__label {
    color: #9ca3af;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="abt-stats-title">
  <h2 id="abt-stats-title" class="mb-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Where we are after six years
  </h2>

  <dl class="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
    <!-- flex-col-reverse paints the value first; the DOM keeps dt before dd. -->
    <div class="flex flex-col-reverse gap-1.5">
      <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">People</dt>
      <dd class="text-4xl font-bold leading-[1.05] tracking-tight tabular-nums text-gray-900 dark:text-gray-100">12</dd>
    </div>
    <div class="flex flex-col-reverse gap-1.5">
      <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">Projects shipped</dt>
      <dd class="text-4xl font-bold leading-[1.05] tracking-tight tabular-nums text-gray-900 dark:text-gray-100">148</dd>
    </div>
    <div class="flex flex-col-reverse gap-1.5">
      <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">Client retention</dt>
      <dd class="text-4xl font-bold leading-[1.05] tracking-tight tabular-nums text-gray-900 dark:text-gray-100">94%</dd>
    </div>
    <div class="flex flex-col-reverse gap-1.5">
      <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">Countries</dt>
      <dd class="text-4xl font-bold leading-[1.05] tracking-tight tabular-nums text-gray-900 dark:text-gray-100">9</dd>
    </div>
  </dl>
</section>`,
      react: `export function AboutStats({ kicker, title, stats, className = '' }) {
  return (
    <section
      aria-labelledby="abt-stats-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2 id="abt-stats-title" className="mb-8 mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-1.5">
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</dt>
            <dd className="text-4xl font-bold leading-[1.05] tracking-tight tabular-nums text-gray-900 dark:text-gray-100">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}`,
      nextjs: `interface AboutStat {
  label: string;
  value: string;
}

interface AboutStatsProps {
  kicker?: string;
  title?: string;
  stats: AboutStat[];
  className?: string;
}

// Stateless - no 'use client' needed.
export function AboutStats({ kicker, title, stats, className = '' }: AboutStatsProps) {
  return (
    <section
      aria-labelledby="abt-stats-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2 id="abt-stats-title" className="mb-8 mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {stats.map((stat: AboutStat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-1.5">
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</dt>
            <dd className="text-4xl font-bold leading-[1.05] tracking-tight tabular-nums text-gray-900 dark:text-gray-100">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}`,
      typescript: `export interface AboutStat {
  label: string;
  /** Pre-formatted - "94%", "£4.2m". Localising is the caller's job, not this component's. */
  value: string;
}

export interface AboutStatsProps {
  kicker?: string;
  title?: string;
  /** Four reads best: two per row on a phone, one row from sm. */
  stats: AboutStat[];
  className?: string;
}

export function AboutStats({ kicker, title, stats, className = '' }: AboutStatsProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-stats-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-stats-title"
          className="mb-8 mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      {/*
        A <dl>: each metric is a value and the term naming it. As plain divs,
        "12" and "People" are two unrelated strings, and eight of them in a row
        give no clue which label owns which number.
      */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
        {stats.map((stat: AboutStat) => (
          // flex-col-reverse paints the value above the label while the DOM
          // keeps dt before dd - so it reads aloud as "People, 12".
          <div key={stat.label} className="flex flex-col-reverse gap-1.5">
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</dt>
            <dd className="text-4xl font-bold leading-[1.05] tracking-tight tabular-nums text-gray-900 dark:text-gray-100">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-timeline',
    category: 'about',
    tags: ['about', 'timeline', 'milestones', 'history', 'rail'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-06-30',
    updatedAt: '2026-07-13',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1080, copies: 261, downloads: 68 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'milestones', type: 'Milestone[]', required: true, descriptionKey: 'milestones' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  Each date is a <time datetime="2019-04">, so the machine-readable value and
  the human-readable label are separate strings. "April 2019" can then be
  translated, or written "Spring 2019", without the date it encodes changing.

  An <ol>, because a history is a sequence - that is the element's job, and it
  means a screen reader announces "1 of 5" without the rail being visible.
  The rail itself is a ::before on each item and is pure decoration.
-->
<section class="abt-time" aria-labelledby="abt-time-title">
  <p class="abt-time__kicker">History</p>
  <h2 class="abt-time__title" id="abt-time-title">How we got here</h2>

  <ol class="abt-time__list">
    <li class="abt-time__item">
      <time class="abt-time__date" datetime="2019-04">April 2019</time>
      <h3 class="abt-time__event">Two people, one contract</h3>
      <p class="abt-time__copy">We took a kitchen table and a six-month engagement and called it a company.</p>
    </li>
    <li class="abt-time__item">
      <time class="abt-time__date" datetime="2021-09">September 2021</time>
      <h3 class="abt-time__event">First platform team</h3>
      <p class="abt-time__copy">Five engineers, and the first year we turned work down rather than stretch.</p>
    </li>
    <li class="abt-time__item">
      <time class="abt-time__date" datetime="2023-02">February 2023</time>
      <h3 class="abt-time__event">The Bristol studio</h3>
      <p class="abt-time__copy">A permanent home, and a research practice that stopped being a side project.</p>
    </li>
    <li class="abt-time__item">
      <time class="abt-time__date" datetime="2026-01">January 2026</time>
      <h3 class="abt-time__event">Twelve people, nine countries</h3>
      <p class="abt-time__copy">Still no account managers. Still the same stubborn question.</p>
    </li>
  </ol>
</section>`,
      css: `.abt-time {
  width: 100%;
  max-width: 48rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.abt-time__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1d4ed8;
}

.abt-time__title {
  margin: 0.75rem 0 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.abt-time__list {
  margin: 2.5rem 0 0;
  padding: 0;
  list-style: none;
}

/*
 * The rail and the node are both drawn on the item, so they cannot drift apart
 * from each other or from the list. The 1.75rem left padding clears them.
 */
.abt-time__item {
  position: relative;
  padding: 0 0 2rem 1.75rem;
}

/* The rail: from below this node down to the next one. */
.abt-time__item::before {
  content: '';
  position: absolute;
  top: 1.125rem;
  bottom: 0;
  left: 0.3125rem;
  width: 2px;
  background-color: #e5e7eb;
}

/* The node. */
.abt-time__item::after {
  content: '';
  position: absolute;
  top: 0.375rem;
  left: 0;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background-color: #2563eb;
}

/* The last milestone ends the history - it trails no rail into nothing. */
.abt-time__item:last-child {
  padding-bottom: 0;
}

.abt-time__item:last-child::before {
  display: none;
}

.abt-time__date {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1d4ed8;
}

.abt-time__event {
  margin: 0.375rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.abt-time__copy {
  margin: 0.375rem 0 0;
  max-width: 36rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .abt-time {
    background-color: #111827;
  }

  .abt-time__kicker,
  .abt-time__date {
    color: #60a5fa;
  }

  .abt-time__title,
  .abt-time__event {
    color: #f3f4f6;
  }

  .abt-time__copy {
    color: #9ca3af;
  }

  /* A hairline rail needs lifting on a dark surface or it disappears. */
  .abt-time__item::before {
    background-color: #374151;
  }

  .abt-time__item::after {
    background-color: #60a5fa;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900" aria-labelledby="abt-time-title">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">History</p>
  <h2 id="abt-time-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    How we got here
  </h2>

  <ol class="mt-10">
    <!--
      ::before is the rail, ::after is the node. last:before:hidden stops the
      final milestone trailing a rule into empty space.
    -->
    <li class="relative pb-8 pl-7 before:absolute before:bottom-0 before:left-[0.3125rem] before:top-[1.125rem] before:w-0.5 before:bg-gray-200 after:absolute after:left-0 after:top-1.5 after:h-3 after:w-3 after:rounded-full after:bg-blue-600 last:pb-0 last:before:hidden dark:before:bg-gray-700 dark:after:bg-blue-400">
      <time datetime="2019-04" class="block text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">April 2019</time>
      <h3 class="mt-1.5 text-base font-semibold text-gray-900 dark:text-gray-100">Two people, one contract</h3>
      <p class="mt-1.5 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        We took a kitchen table and a six-month engagement and called it a company.
      </p>
    </li>
    <li class="relative pb-8 pl-7 before:absolute before:bottom-0 before:left-[0.3125rem] before:top-[1.125rem] before:w-0.5 before:bg-gray-200 after:absolute after:left-0 after:top-1.5 after:h-3 after:w-3 after:rounded-full after:bg-blue-600 last:pb-0 last:before:hidden dark:before:bg-gray-700 dark:after:bg-blue-400">
      <time datetime="2021-09" class="block text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">September 2021</time>
      <h3 class="mt-1.5 text-base font-semibold text-gray-900 dark:text-gray-100">First platform team</h3>
      <p class="mt-1.5 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Five engineers, and the first year we turned work down rather than stretch.
      </p>
    </li>
  </ol>
</section>`,
      react: `export function AboutTimeline({ kicker, title, milestones, className = '' }) {
  return (
    <section
      aria-labelledby="abt-time-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="abt-time-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ol className="mt-10">
        {milestones.map((milestone) => (
          <li
            key={milestone.date}
            className="relative pb-8 pl-7 before:absolute before:bottom-0 before:left-[0.3125rem] before:top-[1.125rem] before:w-0.5 before:bg-gray-200 after:absolute after:left-0 after:top-1.5 after:h-3 after:w-3 after:rounded-full after:bg-blue-600 last:pb-0 last:before:hidden dark:before:bg-gray-700 dark:after:bg-blue-400"
          >
            <time dateTime={milestone.date} className="block text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">
              {milestone.dateLabel}
            </time>
            <h3 className="mt-1.5 text-base font-semibold text-gray-900 dark:text-gray-100">{milestone.title}</h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">{milestone.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}`,
      nextjs: `interface Milestone {
  date: string;
  dateLabel: string;
  title: string;
  copy: string;
}

interface AboutTimelineProps {
  kicker?: string;
  title: string;
  milestones: Milestone[];
  className?: string;
}

// Stateless - no 'use client' needed.
export function AboutTimeline({ kicker, title, milestones, className = '' }: AboutTimelineProps) {
  return (
    <section
      aria-labelledby="abt-time-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="abt-time-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ol className="mt-10">
        {milestones.map((milestone: Milestone) => (
          <li
            key={milestone.date}
            className="relative pb-8 pl-7 before:absolute before:bottom-0 before:left-[0.3125rem] before:top-[1.125rem] before:w-0.5 before:bg-gray-200 after:absolute after:left-0 after:top-1.5 after:h-3 after:w-3 after:rounded-full after:bg-blue-600 last:pb-0 last:before:hidden dark:before:bg-gray-700 dark:after:bg-blue-400"
          >
            <time dateTime={milestone.date} className="block text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">
              {milestone.dateLabel}
            </time>
            <h3 className="mt-1.5 text-base font-semibold text-gray-900 dark:text-gray-100">{milestone.title}</h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">{milestone.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}`,
      typescript: `export interface Milestone {
  /** Machine-readable, for <time dateTime> - e.g. "2019-04". */
  date: string;
  /** Human-readable and translatable - e.g. "April 2019" or "Spring 2019". */
  dateLabel: string;
  title: string;
  copy: string;
}

export interface AboutTimelineProps {
  kicker?: string;
  title: string;
  /** Rendered in the order given. Oldest first reads as a history. */
  milestones: Milestone[];
  className?: string;
}

export function AboutTimeline({
  kicker,
  title,
  milestones,
  className = '',
}: AboutTimelineProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-time-title"
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="abt-time-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      {/* An <ol>: a history is a sequence, so it announces "1 of 5" even
          though the rail that shows it is decoration a screen reader cannot see. */}
      <ol className="mt-10">
        {milestones.map((milestone: Milestone) => (
          // ::before is the rail, ::after is the node - both on the item, so
          // neither can drift from the list. last:before:hidden ends the rail
          // at the final milestone rather than trailing into nothing.
          <li
            key={milestone.date}
            className="relative pb-8 pl-7 before:absolute before:bottom-0 before:left-[0.3125rem] before:top-[1.125rem] before:w-0.5 before:bg-gray-200 after:absolute after:left-0 after:top-1.5 after:h-3 after:w-3 after:rounded-full after:bg-blue-600 last:pb-0 last:before:hidden dark:before:bg-gray-700 dark:after:bg-blue-400"
          >
            {/*
              The encoded date and its label are separate strings, so "April
              2019" can be translated or rewritten without the date it stands
              for changing underneath it.
            */}
            <time
              dateTime={milestone.date}
              className="block text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400"
            >
              {milestone.dateLabel}
            </time>
            <h3 className="mt-1.5 text-base font-semibold text-gray-900 dark:text-gray-100">{milestone.title}</h3>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">{milestone.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-values',
    category: 'about',
    tags: ['about', 'values', 'principles', 'cards', 'icons'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-05-27',
    updatedAt: '2026-07-01',
    license: 'MIT',
    version: '1.0.2',
    stats: { views: 1290, copies: 337, downloads: 84 },
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'values', type: 'AboutValue[]', required: true, descriptionKey: 'principles' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      html: `<!--
  The principle is the <h3> and the copy explains it - not the other way round.
  A values section where the heading is "Value 01" and the principle is buried
  in the paragraph gives a screen reader an outline of numbers, and gives anyone
  skimming headings nothing at all.

  Icons are aria-hidden: a lightbulb next to "Say the hard thing early" adds
  decoration, not meaning, and "image, lightbulb" before every principle is
  noise between the reader and the point.
-->
<section class="abt-vals" aria-labelledby="abt-vals-title">
  <p class="abt-vals__kicker">What we hold to</p>
  <h2 class="abt-vals__title" id="abt-vals-title">Four things we will not trade</h2>

  <ul class="abt-vals__grid">
    <li class="abt-vals__card">
      <span class="abt-vals__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.1 14a5 5 0 1 0-6.2 0" /><path d="M12 14v-3" />
        </svg>
      </span>
      <h3 class="abt-vals__name">Say the hard thing early</h3>
      <p class="abt-vals__copy">
        Bad news does not improve with age. If the plan is wrong we say so in week one, not at
        handover.
      </p>
    </li>
    <li class="abt-vals__card">
      <span class="abt-vals__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <h3 class="abt-vals__name">Leave it ownable</h3>
      <p class="abt-vals__copy">
        Every line we write is one your team has to live with. If they cannot maintain it, we
        have not finished.
      </p>
    </li>
  </ul>
</section>`,
      css: `.abt-vals {
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 3rem 1rem;
  background-color: #fff;
}

.abt-vals__kicker {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #1d4ed8;
}

.abt-vals__title {
  margin: 0.75rem 0 0;
  font-size: 1.875rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #111827;
}

.abt-vals__grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  margin: 2.5rem 0 0;
  padding: 0;
  list-style: none;
}

/*
 * A tinted panel rather than a bordered card: values are prose, and four
 * hairline boxes around four paragraphs add structure the content does not have.
 */
.abt-vals__card {
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: #f9fafb;
}

.abt-vals__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: #dbeafe;
  color: #1d4ed8;
}

.abt-vals__icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.abt-vals__name {
  margin: 1rem 0 0;
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
}

.abt-vals__copy {
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  line-height: 1.65;
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  .abt-vals {
    background-color: #111827;
  }

  .abt-vals__kicker {
    color: #60a5fa;
  }

  .abt-vals__title,
  .abt-vals__name {
    color: #f3f4f6;
  }

  .abt-vals__copy {
    color: #9ca3af;
  }

  /* The tint inverts: lighter than the page, where on light it was darker. */
  .abt-vals__card {
    background-color: #1f2937;
  }

  .abt-vals__icon {
    background-color: #172554;
    color: #93c5fd;
  }
}`,
      tailwind: `<section class="mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="abt-vals-title">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">What we hold to</p>
  <h2 id="abt-vals-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Four things we will not trade
  </h2>

  <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <li class="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
      <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M9 18h6" /><path d="M10 22h4" /><path d="M15.1 14a5 5 0 1 0-6.2 0" /><path d="M12 14v-3" />
        </svg>
      </span>
      <!-- The principle IS the heading. -->
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Say the hard thing early</h3>
      <p class="mt-2 text-sm leading-[1.65] text-gray-600 dark:text-gray-400">
        Bad news does not improve with age. If the plan is wrong we say so in week one, not at handover.
      </p>
    </li>
    <!-- Repeat one <li> per value. -->
  </ul>
</section>`,
      react: `export function AboutValues({ kicker, title, values, className = '' }) {
  return (
    <section
      aria-labelledby="abt-vals-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="abt-vals-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value) => (
          <li key={value.name} className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {value.icon}
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{value.name}</h3>
            <p className="mt-2 text-sm leading-[1.65] text-gray-600 dark:text-gray-400">{value.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      nextjs: `import type { ReactNode } from 'react';

interface AboutValue {
  name: string;
  copy: string;
  icon: ReactNode;
}

interface AboutValuesProps {
  kicker?: string;
  title: string;
  values: AboutValue[];
  className?: string;
}

// Stateless - no 'use client' needed.
export function AboutValues({ kicker, title, values, className = '' }: AboutValuesProps) {
  return (
    <section
      aria-labelledby="abt-vals-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="abt-vals-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value: AboutValue) => (
          <li key={value.name} className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {value.icon}
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{value.name}</h3>
            <p className="mt-2 text-sm leading-[1.65] text-gray-600 dark:text-gray-400">{value.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface AboutValue {
  /** The principle itself - rendered as the heading, not as body copy. */
  name: string;
  copy: string;
  icon: ReactNode;
}

export interface AboutValuesProps {
  kicker?: string;
  title: string;
  values: AboutValue[];
  className?: string;
}

export function AboutValues({ kicker, title, values, className = '' }: AboutValuesProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-vals-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="abt-vals-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value: AboutValue) => (
          // A tinted panel, not a bordered card: four hairline boxes around four
          // paragraphs impose a structure the prose does not actually have.
          <li key={value.name} className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
            {/* aria-hidden - a lightbulb beside "Say the hard thing early" is
                decoration, and announcing it puts noise before the point. */}
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {value.icon}
            </span>

            {/* The principle is the heading. Making it "Value 01" and burying the
                principle in the paragraph gives the outline a list of numbers. */}
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{value.name}</h3>
            <p className="mt-2 text-sm leading-[1.65] text-gray-600 dark:text-gray-400">{value.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-mission-vision',
    category: 'about',
    tags: ['about', 'mission', 'vision', 'purpose', 'cards'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'items', type: 'MissionVisionItem[]', required: true, descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="abt-mv-title">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Our purpose</p>
  <h2 id="abt-mv-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Why we exist and where we are headed
  </h2>

  <!-- Two panels stack on a phone and sit side by side from md. -->
  <div class="mt-10 grid gap-6 md:grid-cols-2">
    <div class="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 dark:border-gray-800 dark:bg-gray-800/50">
      <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" />
        </svg>
      </span>
      <p class="mt-4 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Mission</p>
      <h3 class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">Make good decisions cheap to make</h3>
      <p class="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">
        We help teams turn slow, expensive judgement calls into fast, repeatable habits - and let the software fall out of that.
      </p>
    </div>
    <div class="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 dark:border-gray-800 dark:bg-gray-800/50">
      <span class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
        </svg>
      </span>
      <p class="mt-4 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Vision</p>
      <h3 class="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">A world with less shelfware</h3>
      <p class="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">
        Software that ships, gets used and gets owned - not another platform that arrives late and pleases nobody.
      </p>
    </div>
  </div>
</section>`,
      react: `export function AboutMissionVision({ kicker, title, items, className = '' }) {
  return (
    <section
      aria-labelledby="abt-mv-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2 id="abt-mv-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
      ) : null}

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 dark:border-gray-800 dark:bg-gray-800/50">
            {item.icon ? (
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{item.label}</p>
            <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{item.heading}</h3>
            <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">{item.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface MissionVisionItem {
  /** Short overline, e.g. "Mission" or "Vision". */
  label: string;
  heading: string;
  copy: string;
  icon?: ReactNode;
}

export interface AboutMissionVisionProps {
  kicker?: string;
  title?: string;
  /** Two reads best - the panels sit two-up from md and stack below it. */
  items: MissionVisionItem[];
  className?: string;
}

export function AboutMissionVision({
  kicker,
  title,
  items,
  className = '',
}: AboutMissionVisionProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-mv-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-mv-title"
          className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {items.map((item: MissionVisionItem) => (
          <div
            key={item.label}
            className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8 dark:border-gray-800 dark:bg-gray-800/50"
          >
            {/* aria-hidden - the label beneath already names the panel. */}
            {item.icon ? (
              <span
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                aria-hidden="true"
              >
                {item.icon}
              </span>
            ) : null}
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{item.label}</p>
            <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{item.heading}</h3>
            <p className="mt-2 leading-relaxed text-gray-600 dark:text-gray-400">{item.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-image-story',
    category: 'about',
    tags: ['about', 'story', 'gradient', 'two-column', 'panel'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'reversed', labelKey: 'reversed' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'paragraphs', type: 'string[]', required: true, descriptionKey: 'paragraphs' },
      { name: 'panelClassName', type: 'string', descriptionKey: 'panelClassName' },
      { name: 'monogram', type: 'string', default: "'A'", descriptionKey: 'monogram' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto grid w-full max-w-6xl items-center gap-10 bg-white px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="abt-imgstory-title">
  <div>
    <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Where we came from</p>
    <h2 id="abt-imgstory-title" class="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
      A studio, not a software factory
    </h2>
    <p class="mt-4 max-w-prose leading-[1.75] text-gray-600 dark:text-gray-400">
      We began as two people who were tired of shipping things nobody asked for. That has not changed, only the number of us.
    </p>
    <p class="mt-4 max-w-prose leading-[1.75] text-gray-600 dark:text-gray-400">
      Every engagement still starts the same way: in a room, with the hard question nobody wants to name first.
    </p>
  </div>

  <!-- A CSS gradient stands in for a photograph: no asset to load, still a filled media panel at any width. -->
  <div class="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600" aria-hidden="true">
    <span class="text-7xl font-black tracking-tight text-white/90">A</span>
    <span class="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15"></span>
    <span class="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-black/10"></span>
  </div>
</section>`,
      react: `export function AboutImageStory({
  kicker,
  title,
  paragraphs,
  panelClassName = 'bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600',
  monogram = 'A',
  className = '',
}) {
  return (
    <section
      aria-labelledby="abt-imgstory-title"
      className={['mx-auto grid w-full max-w-6xl items-center gap-10 bg-white px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2 id="abt-imgstory-title" className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)} className="mt-4 max-w-prose leading-[1.75] text-gray-600 dark:text-gray-400">
            {paragraph}
          </p>
        ))}
      </div>

      <div
        aria-hidden="true"
        className={['relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl', panelClassName]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="text-7xl font-black tracking-tight text-white/90">{monogram}</span>
        <span className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15" />
        <span className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-black/10" />
      </div>
    </section>
  );
}`,
      typescript: `export interface AboutImageStoryProps {
  kicker?: string;
  title: string;
  /** One string per paragraph, rendered as real <p> elements. */
  paragraphs: string[];
  /** Tailwind gradient utilities for the visual panel. */
  panelClassName?: string;
  /** Large decorative monogram shown inside the panel. */
  monogram?: string;
  className?: string;
}

export function AboutImageStory({
  kicker,
  title,
  paragraphs,
  panelClassName = 'bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600',
  monogram = 'A',
  className = '',
}: AboutImageStoryProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-imgstory-title"
      className={['mx-auto grid w-full max-w-6xl items-center gap-10 bg-white px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2
          id="abt-imgstory-title"
          className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
        {paragraphs.map((paragraph: string) => (
          <p key={paragraph.slice(0, 32)} className="mt-4 max-w-prose leading-[1.75] text-gray-600 dark:text-gray-400">
            {paragraph}
          </p>
        ))}
      </div>

      {/*
        A CSS gradient stands in for a photograph - no asset to load, and it
        still reads as a filled media panel at any width. aria-hidden: it
        carries nothing the prose beside it does not.
      */}
      <div
        aria-hidden="true"
        className={['relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl', panelClassName]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="text-7xl font-black tracking-tight text-white/90">{monogram}</span>
        <span className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15" />
        <span className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-black/10" />
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-founder-note',
    category: 'about',
    tags: ['about', 'founder', 'letter', 'signature', 'note'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'paragraphs', type: 'string[]', required: true, descriptionKey: 'paragraphs' },
      { name: 'signatureName', type: 'string', required: true, descriptionKey: 'signatureName' },
      { name: 'signatureRole', type: 'string', descriptionKey: 'signatureRole' },
      { name: 'initials', type: 'string', descriptionKey: 'initials' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-2xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900" aria-labelledby="abt-founder-title">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">A note from our founder</p>
  <h2 id="abt-founder-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Why we still answer the phone
  </h2>

  <div class="mt-6 space-y-4 leading-[1.75] text-gray-600 dark:text-gray-400">
    <p>When we started, I promised myself we would never grow past the point of knowing every client by name. Six years on, that promise is the hardest and most useful constraint we have.</p>
    <p>It is why we turn work down, why we ship slower than some, and why the people who build your software are the people you actually talk to.</p>
  </div>

  <!-- A real signature block: an avatar of initials, a name and a role, not an image of a scribble. -->
  <figcaption class="mt-8 flex items-center gap-3 not-italic">
    <span class="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">PR</span>
    <span>
      <span class="block text-sm font-semibold text-gray-900 dark:text-gray-100">Priya Raman</span>
      <span class="block text-sm text-gray-500 dark:text-gray-400">Co-founder &amp; CEO</span>
    </span>
  </figcaption>
</section>`,
      react: `export function AboutFounderNote({
  kicker,
  title,
  paragraphs,
  signatureName,
  signatureRole,
  initials,
  className = '',
}) {
  return (
    <section
      aria-labelledby="abt-founder-title"
      className={['mx-auto w-full max-w-2xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 id="abt-founder-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
        {title}
      </h2>

      <div className="mt-6 space-y-4 leading-[1.75] text-gray-600 dark:text-gray-400">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <figcaption className="mt-8 flex items-center gap-3 not-italic">
        {initials ? (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
            {initials}
          </span>
        ) : null}
        <span>
          <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{signatureName}</span>
          {signatureRole ? <span className="block text-sm text-gray-500 dark:text-gray-400">{signatureRole}</span> : null}
        </span>
      </figcaption>
    </section>
  );
}`,
      typescript: `export interface AboutFounderNoteProps {
  kicker?: string;
  title: string;
  /** One string per paragraph of the letter. */
  paragraphs: string[];
  signatureName: string;
  signatureRole?: string;
  /** Initials for the signature avatar; omitted, the avatar is not rendered. */
  initials?: string;
  className?: string;
}

export function AboutFounderNote({
  kicker,
  title,
  paragraphs,
  signatureName,
  signatureRole,
  initials,
  className = '',
}: AboutFounderNoteProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-founder-title"
      className={['mx-auto w-full max-w-2xl bg-white px-4 py-12 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2
        id="abt-founder-title"
        className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
      >
        {title}
      </h2>

      <div className="mt-6 space-y-4 leading-[1.75] text-gray-600 dark:text-gray-400">
        {paragraphs.map((paragraph: string) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      {/*
        A real signature block - initials avatar, name and role - not an image
        of a scribble. not-italic keeps figcaption upright inside prose contexts.
      */}
      <figcaption className="mt-8 flex items-center gap-3 not-italic">
        {initials ? (
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            aria-hidden="true"
          >
            {initials}
          </span>
        ) : null}
        <span>
          <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{signatureName}</span>
          {signatureRole ? <span className="block text-sm text-gray-500 dark:text-gray-400">{signatureRole}</span> : null}
        </span>
      </figcaption>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-culture-values-grid',
    category: 'about',
    tags: ['about', 'culture', 'values', 'grid', 'principles'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'values', type: 'CultureValue[]', required: true, descriptionKey: 'principles' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="abt-culture-title">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">How we work</p>
  <h2 id="abt-culture-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    The culture behind the work
  </h2>

  <ul class="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
    <li class="flex gap-3">
      <span class="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <div class="min-w-0">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Default to writing</h3>
        <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">A decision that is not written down did not happen. We argue in documents, not meetings.</p>
      </div>
    </li>
    <li class="flex gap-3">
      <span class="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" focusable="false">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </span>
      <div class="min-w-0">
        <h3 class="text-base font-semibold text-gray-900 dark:text-gray-100">Trust by default</h3>
        <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">No one asks permission to do their job well. We hire adults and treat them like it.</p>
      </div>
    </li>
    <!-- Repeat one <li> per principle. -->
  </ul>
</section>`,
      react: `export function AboutCultureValuesGrid({ kicker, title, values, className = '' }) {
  return (
    <section
      aria-labelledby="abt-culture-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2 id="abt-culture-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
      ) : null}

      <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((value) => (
          <li key={value.title} className="flex gap-3">
            <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{value.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{value.copy}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
      typescript: `export interface CultureValue {
  /** The principle itself - rendered as the heading. */
  title: string;
  copy: string;
}

export interface AboutCultureValuesGridProps {
  kicker?: string;
  title?: string;
  values: CultureValue[];
  className?: string;
}

export function AboutCultureValuesGrid({
  kicker,
  title,
  values,
  className = '',
}: AboutCultureValuesGridProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-culture-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-culture-title"
          className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      {/* min-w-0 on the text column lets long words wrap instead of forcing the
          row wider than the grid track at 320px. */}
      <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {values.map((value: CultureValue) => (
          <li key={value.title} className="flex gap-3">
            {/* aria-hidden - the check is decoration, the heading is the content. */}
            <span
              className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                focusable="false"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </span>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{value.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{value.copy}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-milestones-counter',
    category: 'about',
    tags: ['about', 'stats', 'counter', 'animated', 'metrics'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'stats', type: 'CounterStat[]', required: true, descriptionKey: 'metrics' },
      { name: 'durationMs', type: 'number', default: '1600', descriptionKey: 'durationMs' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The Tailwind markup is the styled end-state. The count-up itself is behaviour:
  see the React / TypeScript variants, which animate from 0 only when the band
  scrolls into view and skip the animation entirely under prefers-reduced-motion.
-->
<section class="mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="abt-counter-title">
  <h2 id="abt-counter-title" class="mb-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Six years, counted
  </h2>

  <dl class="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
    <div class="flex flex-col-reverse gap-1.5">
      <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">Projects shipped</dt>
      <dd class="text-4xl font-bold leading-none tracking-tight tabular-nums text-gray-900 dark:text-gray-100">148</dd>
    </div>
    <div class="flex flex-col-reverse gap-1.5">
      <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">Client retention</dt>
      <dd class="text-4xl font-bold leading-none tracking-tight tabular-nums text-gray-900 dark:text-gray-100">94%</dd>
    </div>
    <div class="flex flex-col-reverse gap-1.5">
      <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">Countries</dt>
      <dd class="text-4xl font-bold leading-none tracking-tight tabular-nums text-gray-900 dark:text-gray-100">9</dd>
    </div>
    <div class="flex flex-col-reverse gap-1.5">
      <dt class="text-sm font-medium text-gray-600 dark:text-gray-400">People</dt>
      <dd class="text-4xl font-bold leading-none tracking-tight tabular-nums text-gray-900 dark:text-gray-100">12</dd>
    </div>
  </dl>
</section>`,
      react: `import { useEffect, useRef, useState } from 'react';

function CountUp({ value, prefix = '', suffix = '', durationMs = 1600 }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect the OS setting: no motion means jump straight to the final value.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let start = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        observer.disconnect();
        const step = (now) => {
          if (!start) start = now;
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function AboutMilestonesCounter({ kicker, title, stats, durationMs = 1600, className = '' }) {
  return (
    <section
      aria-labelledby="abt-counter-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2 id="abt-counter-title" className="mb-8 mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-1.5">
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</dt>
            <dd className="text-4xl font-bold leading-none tracking-tight text-gray-900 dark:text-gray-100">
              <CountUp value={stat.value} prefix={stat.prefix ?? ''} suffix={stat.suffix ?? ''} durationMs={durationMs} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}`,
      typescript: `import { useEffect, useRef, useState } from 'react';

export interface CounterStat {
  /** Target the number counts up to. */
  value: number;
  /** Text after the number, e.g. "%" or "k+". */
  suffix?: string;
  /** Text before the number, e.g. "£". */
  prefix?: string;
  label: string;
}

export interface AboutMilestonesCounterProps {
  kicker?: string;
  title?: string;
  stats: CounterStat[];
  /** Count-up duration in ms. */
  durationMs?: number;
  className?: string;
}

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}

function CountUp({ value, prefix = '', suffix = '', durationMs = 1600 }: CountUpProps): JSX.Element {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect the OS setting: no motion means jump straight to the final value.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let start = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || !entry.isIntersecting) return;
        observer.disconnect();
        const step = (now: number) => {
          if (!start) start = now;
          const progress = Math.min((now - start) / durationMs, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(Math.round(eased * value));
          if (progress < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function AboutMilestonesCounter({
  kicker,
  title,
  stats,
  durationMs = 1600,
  className = '',
}: AboutMilestonesCounterProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-counter-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-counter-title"
          className="mb-8 mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
        {stats.map((stat: CounterStat) => (
          <div key={stat.label} className="flex flex-col-reverse gap-1.5">
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</dt>
            <dd className="text-4xl font-bold leading-none tracking-tight text-gray-900 dark:text-gray-100">
              <CountUp value={stat.value} prefix={stat.prefix ?? ''} suffix={stat.suffix ?? ''} durationMs={durationMs} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-two-column-intro',
    category: 'about',
    tags: ['about', 'intro', 'two-column', 'heading', 'lead'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'paragraphs', type: 'string[]', required: true, descriptionKey: 'paragraphs' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto grid w-full max-w-6xl gap-8 bg-white px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="abt-intro-title">
  <div>
    <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">About us</p>
    <h2 id="abt-intro-title" class="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
      A small team with an unfashionable habit of finishing things
    </h2>
  </div>
  <div class="space-y-4 leading-[1.75] text-gray-600 dark:text-gray-400 md:pt-2">
    <p>We are a product studio of twelve, spread across nine countries, working with teams who would rather ship one good thing than plan ten.</p>
    <p>The heading sits in its own column so it can run large without crowding the prose, and the two stack cleanly the moment the screen is too narrow to hold both.</p>
  </div>
</section>`,
      react: `export function AboutTwoColumnIntro({ kicker, title, paragraphs, className = '' }) {
  return (
    <section
      aria-labelledby="abt-intro-title"
      className={['mx-auto grid w-full max-w-6xl gap-8 bg-white px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2 id="abt-intro-title" className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
          {title}
        </h2>
      </div>
      <div className="space-y-4 leading-[1.75] text-gray-600 dark:text-gray-400 md:pt-2">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}`,
      typescript: `export interface AboutTwoColumnIntroProps {
  kicker?: string;
  title: string;
  /** One string per paragraph, rendered in the right-hand column. */
  paragraphs: string[];
  className?: string;
}

export function AboutTwoColumnIntro({
  kicker,
  title,
  paragraphs,
  className = '',
}: AboutTwoColumnIntroProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-intro-title"
      className={['mx-auto grid w-full max-w-6xl gap-8 bg-white px-4 py-12 md:grid-cols-2 md:gap-16 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* The heading owns a column so it can run large without crowding the
          prose; below md the two columns stack in source order. */}
      <div>
        {kicker ? (
          <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
        ) : null}
        <h2
          id="abt-intro-title"
          className="mt-3 text-2xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100"
        >
          {title}
        </h2>
      </div>
      <div className="space-y-4 leading-[1.75] text-gray-600 dark:text-gray-400 md:pt-2">
        {paragraphs.map((paragraph: string) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-quote-highlight',
    category: 'about',
    tags: ['about', 'quote', 'pullquote', 'blockquote', 'highlight'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'quote', type: 'string', required: true, descriptionKey: 'quote' },
      { name: 'attributionName', type: 'string', required: true, descriptionKey: 'attributionName' },
      { name: 'attributionRole', type: 'string', descriptionKey: 'attributionRole' },
      { name: 'initials', type: 'string', descriptionKey: 'initials' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-3xl bg-white px-4 py-12 text-center md:py-16 dark:bg-gray-900">
  <figure class="m-0">
    <svg class="mx-auto h-8 w-8 text-blue-600/30 dark:text-blue-400/30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M9.5 5C6.5 6.7 5 9.3 5 12.9V19h6v-6H8.2c0-2.2.9-3.7 2.6-4.7L9.5 5Zm9 0c-3 1.7-4.5 4.3-4.5 7.9V19h6v-6h-2.8c0-2.2.9-3.7 2.6-4.7L18.5 5Z" />
    </svg>
    <!-- The quote is a real <blockquote>; the attribution is a <figcaption> outside it, not part of the quoted words. -->
    <blockquote class="mt-5 text-balance text-2xl font-semibold leading-snug tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
      They shipped in ten weeks what our last vendor could not describe in ten months. We own every line of it.
    </blockquote>
    <figcaption class="mt-6 flex items-center justify-center gap-3">
      <span class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">DL</span>
      <span class="text-left">
        <span class="block text-sm font-semibold text-gray-900 dark:text-gray-100">Dana Levine</span>
        <span class="block text-sm text-gray-500 dark:text-gray-400">VP Engineering, Northwind</span>
      </span>
    </figcaption>
  </figure>
</section>`,
      react: `export function AboutQuoteHighlight({ quote, attributionName, attributionRole, initials, className = '' }) {
  return (
    <section
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 text-center md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <figure className="m-0">
        <svg className="mx-auto h-8 w-8 text-blue-600/30 dark:text-blue-400/30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
          <path d="M9.5 5C6.5 6.7 5 9.3 5 12.9V19h6v-6H8.2c0-2.2.9-3.7 2.6-4.7L9.5 5Zm9 0c-3 1.7-4.5 4.3-4.5 7.9V19h6v-6h-2.8c0-2.2.9-3.7 2.6-4.7L18.5 5Z" />
        </svg>
        <blockquote className="mt-5 text-balance text-2xl font-semibold leading-snug tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {quote}
        </blockquote>
        <figcaption className="mt-6 flex items-center justify-center gap-3">
          {initials ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300" aria-hidden="true">
              {initials}
            </span>
          ) : null}
          <span className="text-left">
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{attributionName}</span>
            {attributionRole ? <span className="block text-sm text-gray-500 dark:text-gray-400">{attributionRole}</span> : null}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}`,
      typescript: `export interface AboutQuoteHighlightProps {
  quote: string;
  attributionName: string;
  attributionRole?: string;
  /** Initials for the attribution avatar; omitted, the avatar is not rendered. */
  initials?: string;
  className?: string;
}

export function AboutQuoteHighlight({
  quote,
  attributionName,
  attributionRole,
  initials,
  className = '',
}: AboutQuoteHighlightProps): JSX.Element {
  return (
    <section
      className={['mx-auto w-full max-w-3xl bg-white px-4 py-12 text-center md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      <figure className="m-0">
        {/* Decorative quotation mark - the real quote is the blockquote below. */}
        <svg
          className="mx-auto h-8 w-8 text-blue-600/30 dark:text-blue-400/30"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M9.5 5C6.5 6.7 5 9.3 5 12.9V19h6v-6H8.2c0-2.2.9-3.7 2.6-4.7L9.5 5Zm9 0c-3 1.7-4.5 4.3-4.5 7.9V19h6v-6h-2.8c0-2.2.9-3.7 2.6-4.7L18.5 5Z" />
        </svg>
        {/* The attribution is a <figcaption> outside the <blockquote>: the name
            is not part of the words being quoted. */}
        <blockquote className="mt-5 text-balance text-2xl font-semibold leading-snug tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {quote}
        </blockquote>
        <figcaption className="mt-6 flex items-center justify-center gap-3">
          {initials ? (
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
              aria-hidden="true"
            >
              {initials}
            </span>
          ) : null}
          <span className="text-left">
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">{attributionName}</span>
            {attributionRole ? (
              <span className="block text-sm text-gray-500 dark:text-gray-400">{attributionRole}</span>
            ) : null}
          </span>
        </figcaption>
      </figure>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-process-steps',
    category: 'about',
    tags: ['about', 'process', 'steps', 'how-it-works', 'numbered'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'steps', type: 'ProcessStep[]', required: true, descriptionKey: 'steps' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="abt-process-title">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">How we work</p>
  <h2 id="abt-process-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Four steps, every engagement
  </h2>

  <!-- An <ol>: the steps are a sequence, so the order is content, not styling. -->
  <ol class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
    <li>
      <span class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white dark:bg-blue-500" aria-hidden="true">1</span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Frame the question</h3>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">A week in the room, naming the decision everyone has been avoiding.</p>
    </li>
    <li>
      <span class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white dark:bg-blue-500" aria-hidden="true">2</span>
      <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">Prototype the answer</h3>
      <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">Something real and clickable, fast enough to be wrong cheaply.</p>
    </li>
    <!-- Repeat one <li> per step. -->
  </ol>
</section>`,
      react: `export function AboutProcessSteps({ kicker, title, steps, className = '' }) {
  return (
    <section
      aria-labelledby="abt-process-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2 id="abt-process-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
      ) : null}

      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white dark:bg-blue-500" aria-hidden="true">
              {index + 1}
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}`,
      typescript: `export interface ProcessStep {
  title: string;
  copy: string;
}

export interface AboutProcessStepsProps {
  kicker?: string;
  title?: string;
  /** Rendered in order; the number badge is derived from the index. */
  steps: ProcessStep[];
  className?: string;
}

export function AboutProcessSteps({
  kicker,
  title,
  steps,
  className = '',
}: AboutProcessStepsProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-process-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-process-title"
          className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      {/* An <ol>: the steps are a sequence. The number is decoration
          (aria-hidden) because the list already conveys the order. */}
      <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step: ProcessStep, index: number) => (
          <li key={step.title}>
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white dark:bg-blue-500"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">{step.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{step.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-awards-logos',
    category: 'about',
    tags: ['about', 'awards', 'press', 'logos', 'badges'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
    ],
    props: [
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'awards', type: 'Award[]', required: true, descriptionKey: 'awards' },
      { name: 'logos', type: 'PressLogo[]', descriptionKey: 'logos' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900" aria-labelledby="abt-awards-title">
  <p class="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Recognition</p>
  <h2 id="abt-awards-title" class="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    Kind words, in writing
  </h2>

  <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <li class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50">
      <!-- The laurel is a decorative inline SVG; the award text is real, readable content. -->
      <svg class="h-9 w-9 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M12 2a6 6 0 0 0-3 11.2V15a3 3 0 0 0 6 0v-1.8A6 6 0 0 0 12 2Zm-2 15v1a2 2 0 0 0 4 0v-1a5.98 5.98 0 0 1-4 0Z" />
      </svg>
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Studio of the Year</p>
        <p class="text-xs text-gray-500 dark:text-gray-400">Design Week &middot; 2025</p>
      </div>
    </li>
    <!-- Repeat one <li> per award. -->
  </ul>

  <p class="mt-10 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">As seen in</p>
  <ul class="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
    <li class="flex items-center gap-2 text-gray-400 dark:text-gray-500">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="10" /></svg>
      <span class="text-base font-bold tracking-tight text-gray-500 dark:text-gray-400">Northwind</span>
    </li>
    <li class="flex items-center gap-2 text-gray-400 dark:text-gray-500">
      <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="4" /></svg>
      <span class="text-base font-bold tracking-tight text-gray-500 dark:text-gray-400">Meridian</span>
    </li>
  </ul>
</section>`,
      react: `export function AboutAwardsLogos({ kicker, title, awards, logos = [], className = '' }) {
  return (
    <section
      aria-labelledby="abt-awards-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2 id="abt-awards-title" className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
          {title}
        </h2>
      ) : null}

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((award) => (
          <li key={award.label} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50">
            <svg className="h-9 w-9 flex-none text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M12 2a6 6 0 0 0-3 11.2V15a3 3 0 0 0 6 0v-1.8A6 6 0 0 0 12 2Zm-2 15v1a2 2 0 0 0 4 0v-1a5.98 5.98 0 0 1-4 0Z" />
            </svg>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{award.label}</p>
              {award.detail ? <p className="text-xs text-gray-500 dark:text-gray-400">{award.detail}</p> : null}
            </div>
          </li>
        ))}
      </ul>

      {logos.length ? (
        <>
          <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">As seen in</p>
          <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
            {logos.map((logo) => (
              <li key={logo.name} className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                {logo.icon}
                <span className="text-base font-bold tracking-tight text-gray-500 dark:text-gray-400">{logo.name}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}`,
      typescript: `import type { ReactNode } from 'react';

export interface Award {
  /** The award name - rendered as readable text, not baked into the SVG. */
  label: string;
  /** Optional issuer and year, e.g. "Design Week · 2025". */
  detail?: string;
}

export interface PressLogo {
  name: string;
  /** A small inline SVG mark shown beside the name. */
  icon: ReactNode;
}

export interface AboutAwardsLogosProps {
  kicker?: string;
  title?: string;
  awards: Award[];
  logos?: PressLogo[];
  className?: string;
}

export function AboutAwardsLogos({
  kicker,
  title,
  awards,
  logos = [],
  className = '',
}: AboutAwardsLogosProps): JSX.Element {
  return (
    <section
      aria-labelledby="abt-awards-title"
      className={['mx-auto w-full max-w-6xl bg-white px-4 py-12 md:px-6 md:py-16 dark:bg-gray-900', className]
        .filter(Boolean)
        .join(' ')}
    >
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">{kicker}</p>
      ) : null}
      {title ? (
        <h2
          id="abt-awards-title"
          className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100"
        >
          {title}
        </h2>
      ) : null}

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {awards.map((award: Award) => (
          <li
            key={award.label}
            className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-800/50"
          >
            {/* The laurel is decorative; the award text carries the meaning. */}
            <svg
              className="h-9 w-9 flex-none text-blue-600 dark:text-blue-400"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M12 2a6 6 0 0 0-3 11.2V15a3 3 0 0 0 6 0v-1.8A6 6 0 0 0 12 2Zm-2 15v1a2 2 0 0 0 4 0v-1a5.98 5.98 0 0 1-4 0Z" />
            </svg>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{award.label}</p>
              {award.detail ? <p className="text-xs text-gray-500 dark:text-gray-400">{award.detail}</p> : null}
            </div>
          </li>
        ))}
      </ul>

      {logos.length ? (
        <>
          <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">As seen in</p>
          <ul className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
            {logos.map((logo: PressLogo) => (
              <li key={logo.name} className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                {logo.icon}
                <span className="text-base font-bold tracking-tight text-gray-500 dark:text-gray-400">{logo.name}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}`,
    },
  },
  {
    slug: 'about-cta-join',
    category: 'about',
    tags: ['about', 'cta', 'join', 'careers', 'banner'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'gradient', labelKey: 'gradient' },
    ],
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'primaryLabel', type: 'string', default: "'See open roles'", descriptionKey: 'primaryLabel' },
      { name: 'primaryHref', type: 'string', default: "'#'", descriptionKey: 'primaryHref' },
      { name: 'secondaryLabel', type: 'string', descriptionKey: 'secondaryLabel' },
      { name: 'secondaryHref', type: 'string', default: "'#'", descriptionKey: 'secondaryHref' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16">
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-12 text-center sm:px-12 sm:py-16">
    <span class="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" aria-hidden="true"></span>
    <h2 class="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl">Come build the unfashionable way</h2>
    <p class="mx-auto mt-3 max-w-xl text-balance leading-relaxed text-blue-100">
      Twelve people, nine countries, no account managers. If you would rather finish one good thing than plan ten, we should talk.
    </p>
    <!-- Buttons stack full-width on a phone and sit inline from sm; each stays a 40px+ tap target. -->
    <div class="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <a href="#" class="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 motion-reduce:transition-none sm:w-auto">
        See open roles
      </a>
      <a href="#" class="inline-flex w-full items-center justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 motion-reduce:transition-none sm:w-auto">
        Read our handbook
      </a>
    </div>
  </div>
</section>`,
      react: `export function AboutCtaJoin({
  title,
  copy,
  primaryLabel = 'See open roles',
  primaryHref = '#',
  secondaryLabel,
  secondaryHref = '#',
  className = '',
}) {
  return (
    <section
      className={['mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-12 text-center sm:px-12 sm:py-16">
        <span className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" aria-hidden="true" />
        <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
        {copy ? <p className="mx-auto mt-3 max-w-xl text-balance leading-relaxed text-blue-100">{copy}</p> : null}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={primaryHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 motion-reduce:transition-none sm:w-auto"
          >
            {primaryLabel}
          </a>
          {secondaryLabel ? (
            <a
              href={secondaryHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 motion-reduce:transition-none sm:w-auto"
            >
              {secondaryLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}`,
      typescript: `export interface AboutCtaJoinProps {
  title: string;
  copy?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
}

export function AboutCtaJoin({
  title,
  copy,
  primaryLabel = 'See open roles',
  primaryHref = '#',
  secondaryLabel,
  secondaryHref = '#',
  className = '',
}: AboutCtaJoinProps): JSX.Element {
  return (
    <section
      className={['mx-auto w-full max-w-6xl px-4 py-12 md:px-6 md:py-16', className]
        .filter(Boolean)
        .join(' ')}
    >
      {/* The gradient panel is decorative - contrast is carried by white text on
          the darkest stop, which stays AA across the whole gradient. */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-6 py-12 text-center sm:px-12 sm:py-16">
        <span className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" aria-hidden="true" />
        <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
        {copy ? <p className="mx-auto mt-3 max-w-xl text-balance leading-relaxed text-blue-100">{copy}</p> : null}
        {/* Buttons stack full-width on a phone and sit inline from sm; each stays
            a 40px+ tap target either way. */}
        <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href={primaryHref}
            className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 motion-reduce:transition-none sm:w-auto"
          >
            {primaryLabel}
          </a>
          {secondaryLabel ? (
            <a
              href={secondaryHref}
              className="inline-flex w-full items-center justify-center rounded-lg border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 motion-reduce:transition-none sm:w-auto"
            >
              {secondaryLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}`,
    },
  },
];
