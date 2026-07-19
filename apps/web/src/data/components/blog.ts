import type { ComponentEntry } from './types';

/**
 * Blog category - post cards, article chrome and reading affordances.
 *
 * Eight structurally distinct pieces, not eight recolours of one card: a
 * vertical cover card, a horizontal media split, a full post grid, a featured
 * overlay hero, an article header, an author byline, a compact post list and an
 * inline newsletter capture.
 *
 * Two shared rules run through all of them. First, headings track document
 * position: a card that repeats across a grid uses `<h3>`, an article header
 * owns the `<h2>` (the page's `<h1>` is the site chrome), so the outline never
 * grows a second top-level node. Second, every image ships real `alt` text and
 * `loading="lazy"`, because a blog is mostly photography and the alt is the
 * only copy a screen-reader user gets for it. Placeholder art points at
 * `/images/*.jpg` so nothing external can rot.
 */
export const blogComponents: ComponentEntry[] = [
  {
    slug: 'blog-card-vertical',
    category: 'blog',
    tags: ['blog', 'card', 'post', 'cover', 'article'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1420, copies: 388, downloads: 96 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'excerpt', type: 'string', descriptionKey: 'excerpt' },
      { name: 'category', type: 'string', descriptionKey: 'category' },
      { name: 'href', type: 'string', default: "'#'", descriptionKey: 'href' },
      { name: 'coverSrc', type: 'string', descriptionKey: 'coverSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      { name: 'authorName', type: 'string', descriptionKey: 'authorName' },
      { name: 'date', type: 'string', descriptionKey: 'date' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'bordered', labelKey: 'bordered' },
      { id: 'compact', labelKey: 'compact' },
    ],
    code: {
      tailwind: `<!-- A grid card repeats, so its heading is an <h3>. The whole card is one
     link; nested links inside a card link are invalid and untabbable. -->
<a
  href="#"
  class="group flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
>
  <div class="aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
    <img
      src="/images/photo-1.jpg"
      alt="Aerial view of a coastal city at dusk"
      loading="lazy"
      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
    />
  </div>
  <div class="flex flex-1 flex-col p-5">
    <span class="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
      Engineering
    </span>
    <h3 class="mt-2 text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100">
      Designing a token-first color system that scales
    </h3>
    <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      How we moved every surface onto semantic tokens and deleted a thousand one-off hex values along the way.
    </p>
    <div class="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
      <span class="font-medium text-gray-700 dark:text-gray-300">Priya Nair</span>
      <span aria-hidden="true">&middot;</span>
      <time datetime="2026-07-12">Jul 12, 2026</time>
    </div>
  </div>
</a>`,
      react: `export function BlogCardVertical({
  title,
  excerpt,
  category,
  href = '#',
  coverSrc = '/images/photo-1.jpg',
  imageAlt = '',
  authorName,
  date,
  className = '',
}) {
  return (
    <a
      href={href}
      className={['group flex w-full max-w-sm flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950', className].filter(Boolean).join(' ')}
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={coverSrc}
          alt={imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        {category ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
            {category}
          </span>
        ) : null}
        <h3 className="mt-2 text-lg font-semibold leading-snug text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        {excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {excerpt}
          </p>
        ) : null}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          {authorName ? <span className="font-medium text-gray-700 dark:text-gray-300">{authorName}</span> : null}
          {authorName && date ? <span aria-hidden="true">&middot;</span> : null}
          {date ? <span>{date}</span> : null}
        </div>
      </div>
    </a>
  );
}`,
    },
  },
  {
    slug: 'blog-card-horizontal',
    category: 'blog',
    tags: ['blog', 'card', 'horizontal', 'post', 'media'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1180, copies: 302, downloads: 74 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'excerpt', type: 'string', descriptionKey: 'excerpt' },
      { name: 'category', type: 'string', descriptionKey: 'category' },
      { name: 'href', type: 'string', default: "'#'", descriptionKey: 'href' },
      { name: 'coverSrc', type: 'string', descriptionKey: 'coverSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      { name: 'readTime', type: 'string', descriptionKey: 'readTime' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'reverse', labelKey: 'reverse' },
    ],
    code: {
      tailwind: `<!-- Below sm the image sits above the copy in reading order; the grid keeps
     the two columns aligned without the copy ever wrapping under the image. -->
<a
  href="#"
  class="group grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:grid-cols-[40%_1fr] dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950"
>
  <div class="aspect-video overflow-hidden bg-gray-100 sm:aspect-auto dark:bg-gray-800">
    <img
      src="/images/photo-2.jpg"
      alt="Two designers reviewing a wireframe on a tablet"
      loading="lazy"
      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
    />
  </div>
  <div class="flex flex-col justify-center p-5">
    <span class="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Product</span>
    <h3 class="mt-1.5 text-base font-semibold leading-snug text-gray-900 sm:text-lg dark:text-gray-100">
      Shipping accessible components without slowing the team down
    </h3>
    <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
      A practical checklist we run before any component leaves review.
    </p>
    <span class="mt-3 text-xs text-gray-500 dark:text-gray-500">6 min read</span>
  </div>
</a>`,
      react: `export function BlogCardHorizontal({
  title,
  excerpt,
  category,
  href = '#',
  coverSrc = '/images/photo-2.jpg',
  imageAlt = '',
  readTime,
  className = '',
}) {
  return (
    <a
      href={href}
      className={['group grid w-full max-w-2xl grid-cols-1 overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:grid-cols-[40%_1fr] dark:border-gray-800 dark:bg-gray-900 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-950', className].filter(Boolean).join(' ')}
    >
      <div className="aspect-video overflow-hidden bg-gray-100 sm:aspect-auto dark:bg-gray-800">
        <img
          src={coverSrc}
          alt={imageAlt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
        />
      </div>
      <div className="flex flex-col justify-center p-5">
        {category ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">{category}</span>
        ) : null}
        <h3 className="mt-1.5 text-base font-semibold leading-snug text-gray-900 sm:text-lg dark:text-gray-100">
          {title}
        </h3>
        {excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{excerpt}</p>
        ) : null}
        {readTime ? <span className="mt-3 text-xs text-gray-500 dark:text-gray-500">{readTime}</span> : null}
      </div>
    </a>
  );
}`,
    },
  },
  {
    slug: 'blog-post-grid',
    category: 'blog',
    tags: ['blog', 'grid', 'posts', 'section', 'listing'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    featured: true,
    stats: { views: 1610, copies: 421, downloads: 132 },
    props: [
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'posts', type: 'Post[]', required: true, descriptionKey: 'posts' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'twoColumn', labelKey: 'twoColumn' },
    ],
    code: {
      tailwind: `<section class="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
  <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">
    From the blog
  </h2>
  <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
    Notes on building, designing and shipping.
  </p>

  <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <!-- Repeat this article per post. -->
    <article class="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <a href="#" class="aspect-[16/10] overflow-hidden bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-800">
        <img src="/images/photo-3.jpg" alt="Whiteboard covered in system diagrams" loading="lazy" class="h-full w-full object-cover" />
      </a>
      <div class="flex flex-1 flex-col p-5">
        <span class="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Design</span>
        <h3 class="mt-2 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
          <a href="#" class="focus-visible:outline-none focus-visible:underline hover:underline">
            The quiet power of consistent spacing
          </a>
        </h3>
        <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          A four-point scale removed most of our layout debates overnight.
        </p>
        <div class="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          <time datetime="2026-07-08">Jul 8, 2026</time>
          <span aria-hidden="true">&middot;</span>
          <span>5 min read</span>
        </div>
      </div>
    </article>
  </div>
</section>`,
      react: `export function BlogPostGrid({ title = 'From the blog', posts = [], className = '' }) {
  return (
    <section className={['mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-20', className].filter(Boolean).join(' ')}>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-gray-100">{title}</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <a href={post.href} className="aspect-[16/10] overflow-hidden bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-gray-800">
              <img src={post.coverSrc} alt={post.imageAlt} loading="lazy" className="h-full w-full object-cover" />
            </a>
            <div className="flex flex-1 flex-col p-5">
              {post.category ? (
                <span className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">{post.category}</span>
              ) : null}
              <h3 className="mt-2 text-base font-semibold leading-snug text-gray-900 dark:text-gray-100">
                <a href={post.href} className="focus-visible:outline-none focus-visible:underline hover:underline">{post.title}</a>
              </h3>
              {post.excerpt ? (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{post.excerpt}</p>
              ) : null}
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                {post.date ? <span>{post.date}</span> : null}
                {post.date && post.readTime ? <span aria-hidden="true">&middot;</span> : null}
                {post.readTime ? <span>{post.readTime}</span> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}`,
    },
  },
  {
    slug: 'blog-featured-hero',
    category: 'blog',
    tags: ['blog', 'featured', 'hero', 'overlay', 'cover'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1330, copies: 350, downloads: 88 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'excerpt', type: 'string', descriptionKey: 'excerpt' },
      { name: 'category', type: 'string', descriptionKey: 'category' },
      { name: 'href', type: 'string', default: "'#'", descriptionKey: 'href' },
      { name: 'coverSrc', type: 'string', descriptionKey: 'coverSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'gradient', labelKey: 'gradient' },
    ],
    code: {
      tailwind: `<!-- The scrim is the component, not decoration: white text over an arbitrary
     photo only clears 4.5:1 once a dark gradient is guaranteed beneath it. -->
<a
  href="#"
  class="group relative flex aspect-[16/9] w-full max-w-4xl items-end overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
>
  <img
    src="/images/photo-4.jpg"
    alt="Long-exposure highway at night"
    class="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
  />
  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true"></div>
  <div class="relative max-w-xl p-6 sm:p-8">
    <span class="inline-flex rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
      Featured
    </span>
    <h2 class="mt-3 text-2xl font-bold leading-tight text-white sm:text-4xl">
      What a year of shipping every week taught us about pace
    </h2>
    <p class="mt-2 hidden text-sm leading-relaxed text-gray-200 sm:block">
      Momentum is a system, not a sprint. Here is the loop that kept it going.
    </p>
  </div>
</a>`,
      react: `export function BlogFeaturedHero({
  title,
  excerpt,
  category = 'Featured',
  href = '#',
  coverSrc = '/images/photo-4.jpg',
  imageAlt = '',
  className = '',
}) {
  return (
    <a
      href={href}
      className={['group relative flex aspect-[16/9] w-full max-w-4xl items-end overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950', className].filter(Boolean).join(' ')}
    >
      <img
        src={coverSrc}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden="true" />
      <div className="relative max-w-xl p-6 sm:p-8">
        <span className="inline-flex rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
          {category}
        </span>
        <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-4xl">{title}</h2>
        {excerpt ? (
          <p className="mt-2 hidden text-sm leading-relaxed text-gray-200 sm:block">{excerpt}</p>
        ) : null}
      </div>
    </a>
  );
}`,
    },
  },
  {
    slug: 'blog-post-header',
    category: 'blog',
    tags: ['blog', 'article', 'header', 'meta', 'cover'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1090, copies: 276, downloads: 61 },
    props: [
      { name: 'title', type: 'string', required: true, descriptionKey: 'title' },
      { name: 'kicker', type: 'string', descriptionKey: 'kicker' },
      { name: 'authorName', type: 'string', descriptionKey: 'authorName' },
      { name: 'date', type: 'string', descriptionKey: 'date' },
      { name: 'readTime', type: 'string', descriptionKey: 'readTime' },
      { name: 'coverSrc', type: 'string', descriptionKey: 'coverSrc' },
      { name: 'imageAlt', type: 'string', default: "''", descriptionKey: 'imageAlt' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'centered', labelKey: 'centered' },
    ],
    code: {
      tailwind: `<!-- The article's own top-level heading is an <h2>: the site header owns the
     page <h1>. Meta sits in a <div> of muted text, not headings. -->
<header class="mx-auto w-full max-w-3xl px-4 pt-10 sm:px-6">
  <p class="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Engineering</p>
  <h2 class="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
    Migrating a design system to semantic tokens
  </h2>
  <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
    <span class="font-medium text-gray-700 dark:text-gray-300">Priya Nair</span>
    <span aria-hidden="true">&middot;</span>
    <time datetime="2026-07-19">Jul 19, 2026</time>
    <span aria-hidden="true">&middot;</span>
    <span>8 min read</span>
  </div>
  <div class="mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
    <img src="/images/photo-5.jpg" alt="Close-up of a color palette on a monitor" class="h-full w-full object-cover" />
  </div>
</header>`,
      react: `export function BlogPostHeader({
  title,
  kicker,
  authorName,
  date,
  readTime,
  coverSrc = '/images/photo-5.jpg',
  imageAlt = '',
  className = '',
}) {
  return (
    <header className={['mx-auto w-full max-w-3xl px-4 pt-10 sm:px-6', className].filter(Boolean).join(' ')}>
      {kicker ? (
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">{kicker}</p>
      ) : null}
      <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-100">
        {title}
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
        {authorName ? <span className="font-medium text-gray-700 dark:text-gray-300">{authorName}</span> : null}
        {authorName && date ? <span aria-hidden="true">&middot;</span> : null}
        {date ? <span>{date}</span> : null}
        {date && readTime ? <span aria-hidden="true">&middot;</span> : null}
        {readTime ? <span>{readTime}</span> : null}
      </div>
      <div className="mt-6 aspect-[16/9] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <img src={coverSrc} alt={imageAlt} className="h-full w-full object-cover" />
      </div>
    </header>
  );
}`,
    },
  },
  {
    slug: 'blog-author-byline',
    category: 'blog',
    tags: ['blog', 'author', 'byline', 'avatar', 'meta'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 940, copies: 240, downloads: 52 },
    props: [
      { name: 'authorName', type: 'string', required: true, descriptionKey: 'authorName' },
      { name: 'role', type: 'string', descriptionKey: 'role' },
      { name: 'avatarSrc', type: 'string', descriptionKey: 'avatarSrc' },
      { name: 'date', type: 'string', descriptionKey: 'date' },
      { name: 'readTime', type: 'string', descriptionKey: 'readTime' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'compact', labelKey: 'compact' },
    ],
    code: {
      tailwind: `<div class="flex items-center gap-3">
  <img
    src="/images/avatar-1.jpg"
    alt="Priya Nair"
    class="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
  />
  <div class="min-w-0">
    <p class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">Priya Nair</p>
    <div class="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 dark:text-gray-400">
      <span>Staff Engineer</span>
      <span aria-hidden="true">&middot;</span>
      <time datetime="2026-07-19">Jul 19, 2026</time>
      <span aria-hidden="true">&middot;</span>
      <span>8 min read</span>
    </div>
  </div>
</div>`,
      react: `export function BlogAuthorByline({
  authorName,
  role,
  avatarSrc = '/images/avatar-1.jpg',
  date,
  readTime,
  className = '',
}) {
  return (
    <div className={['flex items-center gap-3', className].filter(Boolean).join(' ')}>
      <img
        src={avatarSrc}
        alt={authorName}
        className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{authorName}</p>
        <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 dark:text-gray-400">
          {role ? <span>{role}</span> : null}
          {role && date ? <span aria-hidden="true">&middot;</span> : null}
          {date ? <span>{date}</span> : null}
          {date && readTime ? <span aria-hidden="true">&middot;</span> : null}
          {readTime ? <span>{readTime}</span> : null}
        </div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'blog-post-list',
    category: 'blog',
    tags: ['blog', 'list', 'posts', 'compact', 'archive'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1020, copies: 264, downloads: 70 },
    props: [
      { name: 'posts', type: 'Post[]', required: true, descriptionKey: 'posts' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'withThumbnail', labelKey: 'withThumbnail' },
    ],
    code: {
      tailwind: `<ul class="mx-auto w-full max-w-2xl divide-y divide-gray-200 dark:divide-gray-800">
  <!-- Repeat per post. -->
  <li>
    <a href="#" class="flex items-start gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950">
      <img src="/images/thumb-1.jpg" alt="" loading="lazy" class="hidden h-16 w-24 shrink-0 rounded-lg object-cover sm:block" />
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
          <span class="font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Product</span>
          <span aria-hidden="true">&middot;</span>
          <time datetime="2026-07-15">Jul 15, 2026</time>
        </div>
        <h3 class="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
          Naming things: our lightweight component conventions
        </h3>
        <p class="mt-1 line-clamp-1 text-sm text-gray-600 dark:text-gray-400">
          The three rules that removed most of our review comments.
        </p>
      </div>
    </a>
  </li>
</ul>`,
      react: `export function BlogPostList({ posts = [], className = '' }) {
  return (
    <ul className={['mx-auto w-full max-w-2xl divide-y divide-gray-200 dark:divide-gray-800', className].filter(Boolean).join(' ')}>
      {posts.map((post) => (
        <li key={post.id}>
          <a href={post.href} className="flex items-start gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950">
            {post.thumbSrc ? (
              <img src={post.thumbSrc} alt="" loading="lazy" className="hidden h-16 w-24 shrink-0 rounded-lg object-cover sm:block" />
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                {post.category ? <span className="font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">{post.category}</span> : null}
                {post.category && post.date ? <span aria-hidden="true">&middot;</span> : null}
                {post.date ? <span>{post.date}</span> : null}
              </div>
              <h3 className="mt-1 truncate text-sm font-semibold text-gray-900 dark:text-gray-100">{post.title}</h3>
              {post.excerpt ? <p className="mt-1 line-clamp-1 text-sm text-gray-600 dark:text-gray-400">{post.excerpt}</p> : null}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}`,
    },
  },
  {
    slug: 'blog-newsletter-inline',
    category: 'blog',
    tags: ['blog', 'newsletter', 'subscribe', 'email', 'cta'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-19',
    updatedAt: '2026-07-19',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 1250, copies: 330, downloads: 90 },
    props: [
      { name: 'title', type: 'string', descriptionKey: 'title' },
      { name: 'copy', type: 'string', descriptionKey: 'copy' },
      { name: 'onSubmit', type: '(email: string) => void', descriptionKey: 'onSubmit' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    variants: [
      { id: 'default', labelKey: 'default' },
      { id: 'card', labelKey: 'card' },
    ],
    code: {
      tailwind: `<!-- A label the field can be reached by, visually hidden so the design stays
     clean without leaving the input nameless to a screen reader. -->
<section class="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center sm:p-8 dark:border-gray-800 dark:bg-gray-900">
  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Get the weekly digest</h3>
  <p class="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">
    One email a week with our newest posts. No spam, unsubscribe anytime.
  </p>
  <form class="mt-5 flex flex-col gap-3 sm:flex-row">
    <label for="newsletter-email" class="sr-only">Email address</label>
    <input
      id="newsletter-email"
      type="email"
      required
      autocomplete="email"
      placeholder="you@example.com"
      class="w-full flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
    />
    <button
      type="submit"
      class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-offset-gray-900"
    >
      Subscribe
    </button>
  </form>
</section>`,
      react: `import { useState } from 'react';

export function BlogNewsletterInline({
  title = 'Get the weekly digest',
  copy = 'One email a week with our newest posts. No spam, unsubscribe anytime.',
  onSubmit,
  className = '',
}) {
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit?.(email);
  }

  return (
    <section className={['mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center sm:p-8 dark:border-gray-800 dark:bg-gray-900', className].filter(Boolean).join(' ')}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-gray-600 dark:text-gray-400">{copy}</p>
      <form className="mt-5 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full flex-1 rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:focus-visible:ring-offset-gray-900"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
}`,
    },
  },
];
