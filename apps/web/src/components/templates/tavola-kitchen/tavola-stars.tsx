import { Star } from 'lucide-react';

/**
 * TAVOLA - a rating, drawn.
 *
 * The numeric value carries the meaning, so the stars are `aria-hidden` and the
 * accessible text is the figure itself. Half stars are a clipped overlay rather
 * than a third glyph, which keeps the row aligned at any size.
 */
export function TavolaStars({ rating, label }: { rating: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span aria-hidden className="relative inline-flex">
        {[0, 1, 2, 3, 4].map((index) => (
          <Star key={index} className="h-3.5 w-3.5 text-[var(--tv-rule-strong)]" />
        ))}
        <span
          className="absolute inset-0 inline-flex overflow-hidden"
          style={{ width: `${(Math.max(0, Math.min(5, rating)) / 5) * 100}%` }}
        >
          {[0, 1, 2, 3, 4].map((index) => (
            <Star
              key={index}
              className="h-3.5 w-3.5 shrink-0 fill-[var(--tv-gold)] text-[var(--tv-gold)]"
            />
          ))}
        </span>
      </span>
      <span className="tv-num text-[12px] font-semibold text-[var(--tv-ink)]">
        {rating.toFixed(1)}
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
