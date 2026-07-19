import type { ComponentContentMap } from '../types';

/** English prose for the cards category. Keys are component slugs. */
export const cardsContent: ComponentContentMap = {
  'pricing-card': {
    title: 'Pricing Card',
    description: 'A single pricing tier with a feature list, price and call to action.',
    customization:
      'Drive the tier from data rather than duplicating markup. The highlighted state is a ring plus a badge - keep the same height across cards so the CTAs line up.',
    seoTitle: 'Pricing Card - Free Tailwind CSS Component',
    seoDescription:
      'A responsive pricing card with feature list and CTA, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['pricing card', 'pricing table', 'tailwind pricing', 'saas pricing'],
  },
  'profile-card': {
    title: 'Profile Card',
    description: 'A centred team member card with an avatar, role, short bio and social links.',
    customization:
      'The avatar is decorative (`alt=""`) because the heading beside it already names the person - give it real alt text only if it carries information the name does not. Each social link keeps an `sr-only` name like "Amara on GitHub"; three identical "Link" entries in a screen reader\'s list is the failure mode to avoid. Swap `SOCIAL_PATHS` for your own icon set and the layout is unchanged.',
    seoTitle: 'Profile Card - Free Tailwind CSS Team Component',
    seoDescription:
      'An accessible profile card with avatar, role, bio and labelled social links, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['profile card', 'team card', 'user card', 'tailwind avatar card', 'bio card'],
  },
  'stat-card': {
    title: 'Stat Card',
    description: 'A KPI tile with a large metric, a label and a coloured trend delta.',
    customization:
      'Colour alone never carries the trend: the arrow is `aria-hidden` and an `sr-only` "Up" or "Down" sits beside the number, so the direction survives both greyscale and screen readers. Green and red are conventional but not universal - if your domain reads a falling number as good (churn, latency), pass `trend` from the interpretation rather than the arithmetic sign.',
    seoTitle: 'Stat Card with Trend - Free Tailwind CSS Component',
    seoDescription:
      'A dashboard stat card with a metric, label and accessible up/down trend delta, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['stat card', 'kpi card', 'metric card', 'dashboard card', 'trend indicator'],
  },
  'product-card': {
    title: 'Product Card',
    description: 'A storefront card with a square image, price, star rating and an add-to-cart button.',
    customization:
      'The five stars are one `role="img"` with a label reading "Rated 4.5 out of 5 from 128 reviews" - otherwise assistive tech announces five anonymous graphics and no number. Keep the exact rating in the label even though the stars round. `aspect-square` holds the grid steady while images load; change it to match your photography and every card in the row follows.',
    seoTitle: 'Product Card with Rating - Free Tailwind CSS Ecommerce Component',
    seoDescription:
      'An accessible product card with image, price, star rating and add-to-cart, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['product card', 'ecommerce card', 'shop card', 'star rating card', 'add to cart'],
  },
  'blog-post-card': {
    title: 'Blog Post Card',
    description: 'An article card with a cover image, category chip, excerpt and author byline.',
    customization:
      'The title link stretches over the card with `after:absolute after:inset-0`, so the whole surface is clickable from a single real anchor - no nested links, and the announced name is the headline rather than "Read more". That trick needs a positioned ancestor: keep `relative` on the article. The `<time datetime>` is what feeds structured data, so give it the machine format and let the visible label be whatever reads well.',
    seoTitle: 'Blog Post Card - Free Tailwind CSS Article Component',
    seoDescription:
      'A blog post card with cover, category chip, excerpt and author byline, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['blog card', 'article card', 'post card', 'tailwind blog', 'news card'],
  },
  'testimonial-card': {
    title: 'Testimonial Card',
    description: 'A customer quote with a star rating, avatar, name and company.',
    customization:
      'Built from `figure` / `blockquote` / `figcaption` so the attribution is bound to the quote rather than floating beside it. The card adds the quotation marks - pass `quote` clean, or your CMS ends up storing two of them. Drop `rating` to 0 and the stars grey out rather than disappearing, which keeps a row of cards aligned.',
    seoTitle: 'Testimonial Card - Free Tailwind CSS Component',
    seoDescription:
      'A testimonial card with quote, star rating, avatar and company, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['testimonial card', 'quote card', 'review card', 'social proof', 'customer quote'],
  },
  'notification-card': {
    title: 'Notification Card',
    description: 'A dismissible notice with a severity icon, message, timestamp and close button.',
    customization:
      'Severity picks the icon and the tile colour together, so info/success/warning never rely on hue alone. The card is `role="status"` - polite, announced without stealing focus; if a message genuinely blocks the user, use `role="alert"` instead. Dismiss state lives in the component, which is why the Next.js variant is the one that needs `\'use client\'`. Lift it out and pass `onDismiss` if a parent owns the queue.',
    seoTitle: 'Notification Card - Free Tailwind CSS Alert Component',
    seoDescription:
      'A dismissible notification card with severity icons, timestamp and an accessible close button, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['notification card', 'alert card', 'toast', 'dismissible alert', 'status message'],
  },
  'image-overlay-card': {
    title: 'Image Overlay Card',
    description: 'A photo card with a gradient scrim, text laid over it and a hover zoom.',
    customization:
      'The scrim is not decoration - it is the only thing guaranteeing white text stays readable over a photo you have not seen. Lightening `from-black/85` is the first thing that breaks contrast, so check it against your darkest and lightest images. The zoom lives on the image inside an `overflow-hidden` wrapper and is cancelled by `motion-reduce`; focus triggers the same zoom as hover, so keyboard users get the same affordance.',
    seoTitle: 'Image Overlay Card - Free Tailwind CSS Component',
    seoDescription:
      'An image card with a gradient scrim, overlaid text and a reduced-motion-aware hover zoom, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['image overlay card', 'gradient overlay', 'hover zoom card', 'photo card', 'scrim'],
  },
  'feature-card': {
    title: 'Feature Card',
    description: 'A marketing feature tile with an icon, heading, copy and a "Learn more" link.',
    customization:
      'Ten "Learn more" links in a feature grid are indistinguishable in a screen reader\'s link list, so the link carries an `sr-only` suffix naming the feature. The icon is passed in as a node rather than hard-coded, which keeps the card agnostic about your icon library. Drop `ctaHref` and the link disappears cleanly - useful when only some tiles have somewhere to go.',
    seoTitle: 'Feature Card with Icon - Free Tailwind CSS Component',
    seoDescription:
      'A feature card with an icon tile, heading, copy and an accessible learn-more link, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['feature card', 'icon card', 'marketing card', 'feature grid', 'landing page card'],
  },
  'horizontal-card': {
    title: 'Horizontal Card',
    description: 'A media card with the image beside the content that stacks vertically on mobile.',
    customization:
      'One breakpoint does the work: `flex-col` stacks by default and `sm:flex-row` puts the image on the left, with `sm:self-stretch` making it match the copy\'s height instead of leaving a gap. Like the blog card, the title link stretches over the whole surface, so the card is one target and one announced name. Widen `sm:w-40` for a heavier image and the text column simply takes what is left.',
    seoTitle: 'Horizontal Card - Free Responsive Tailwind CSS Component',
    seoDescription:
      'A horizontal media card that stacks on mobile, in HTML, CSS, Tailwind, React, Next.js and TypeScript. Free and MIT licensed.',
    keywords: ['horizontal card', 'responsive card', 'media card', 'list card', 'image left card'],
  },
};
