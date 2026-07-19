'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@adysre/ui';
import { useLikesStore } from '@/stores/likes-store';

/**
 * A heart like button with a live count. Each tap adds one, persisted per item
 * id via the likes store, so the total is the item's base likes plus the
 * visitor's taps.
 *
 * The count is gated on mount: the persisted store hydrates client-side, so the
 * server and first client render both show the base count (no hydration
 * mismatch), then the stored delta appears.
 */
export function LikeButton({
  id,
  baseLikes,
  label,
}: {
  id: string;
  baseLikes: number;
  label: string;
}) {
  const extra = useLikesStore((s) => s.likes[id] ?? 0);
  const addLike = useLikesStore((s) => s.addLike);
  const [mounted, setMounted] = useState(false);
  const [pulse, setPulse] = useState(false);
  useEffect(() => setMounted(true), []);

  const liked = mounted && extra > 0;
  const count = baseLikes + (mounted ? extra : 0);

  return (
    <button
      type="button"
      onClick={() => {
        addLike(id);
        setPulse(true);
        setTimeout(() => setPulse(false), 220);
      }}
      aria-label={label}
      title={label}
      className={cn(
        'flex h-8 shrink-0 items-center gap-1 rounded-md px-2 text-[11px] font-medium tabular-nums transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        liked ? 'text-danger' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <Heart
        className={cn(
          'h-3.5 w-3.5 transition-transform motion-reduce:transition-none',
          liked && 'fill-current',
          pulse && 'scale-125',
        )}
        aria-hidden
      />
      {count.toLocaleString()}
    </button>
  );
}
