'use client';

/**
 * Live preview for `product-card`.
 *
 * Mirrors the `typescript` code variant verbatim. The image points at a local
 * SVG so the preview never hits the network; the snippet ships a plain
 * `/your-image.jpg` placeholder. Add-to-cart is a no-op here.
 * Keep this in step with `src/data/components/cards.ts`.
 */
interface ProductCardProps {
  title: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  rating: number;
  reviewCount: number;
  ctaLabel?: string;
  onAddToCart?: () => void;
  className?: string;
}

const STAR_PATH = 'm10 1.8 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6L5.1 17l.9-5.5-4-3.9 5.5-.8L10 1.8Z';

function Stars({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <p
      className="mt-2 flex items-center gap-0.5"
      role="img"
      aria-label={`Rated ${rating} out of 5 from ${reviewCount} reviews`}
    >
      {[1, 2, 3, 4, 5].map((i: number) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? 'text-amber-600 dark:text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={STAR_PATH} />
        </svg>
      ))}
      <span className="ml-1.5 text-xs text-gray-600 dark:text-gray-400">({reviewCount})</span>
    </p>
  );
}

export function ProductCard({
  title,
  price,
  imageSrc,
  imageAlt,
  rating,
  reviewCount,
  ctaLabel = 'Add to cart',
  onAddToCart,
  className = '',
}: ProductCardProps) {
  return (
    <article
      className={`flex w-full max-w-xs flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 ${className}`}
    >
      <img
        className="aspect-square w-full bg-gray-100 object-cover dark:bg-gray-800"
        src={imageSrc}
        alt={imageAlt}
        width={320}
        height={320}
      />

      <div className="p-4">
        <h3 className="text-[0.9375rem] font-semibold text-gray-900 dark:text-gray-100">{title}</h3>

        <Stars rating={rating} reviewCount={reviewCount} />

        <div className="mt-3.5 flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{price}</p>
          <button
            type="button"
            onClick={onAddToCart}
            className="rounded-lg bg-gray-900 px-3.5 py-2 text-[0.8125rem] font-semibold text-white transition hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
          >
            {ctaLabel}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductCardPreview() {
  return (
    <ProductCard
      title="Aster Wool Throw"
      price="$128"
      imageSrc="/promo/all-access.svg"
      imageAlt="Aster wool throw in oat"
      rating={4.5}
      reviewCount={128}
      ctaLabel="Add to cart"
    />
  );
}
