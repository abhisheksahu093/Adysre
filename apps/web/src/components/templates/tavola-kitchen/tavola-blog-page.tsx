'use client';

import { TavolaSectionHeading } from './tavola-section-heading';
import { useTavolaSettings } from './tavola-settings';

/** TAVOLA - notes from the kitchen. */
export function TavolaBlogPage() {
  const { data } = useTavolaSettings();
  const { copy, posts } = data;

  return (
    <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <TavolaSectionHeading title={copy.blog.title} subtitle={copy.blog.subtitle} align="left" />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="tv-card overflow-hidden">
            <div aria-hidden data-food={post.palette} className="tv-plate !rounded-none h-44 w-full" />
            <div className="p-6">
              <h2 className="text-[17px] font-bold leading-snug">{post.title}</h2>
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--tv-ink-soft)]">
                {post.excerpt}
              </p>
              <p className="mt-5 text-[12px] text-[var(--tv-ink-faint)]">
                {copy.blog.by} {post.author} · {post.date} · {post.readMinutes} {copy.blog.readTime}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
