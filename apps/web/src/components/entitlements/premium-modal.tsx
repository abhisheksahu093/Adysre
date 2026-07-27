'use client';

import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Button, Dialog } from 'adysre';
import { useRouter } from '@/i18n/navigation';
import { describeReset } from '@/lib/entitlements/client';
import type { FeatureUsage, QuotaDenial } from '@/lib/entitlements/types';

/**
 * The upgrade prompt. ONE of them, for every feature.
 *
 * It takes the denial the server sent and renders from that, so there is no
 * per-feature copy to keep in step and no component that knows a limit. A modal
 * per feature would be thirteen places to update the day a quota changes, and
 * twelve of them would be missed.
 */

export interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  /** What the server refused, or a feature's state when opened pre-emptively. */
  denial: QuotaDenial | FeatureUsage | null;
}

/** Both shapes carry what the modal needs; this reads whichever arrived. */
function readDenial(source: QuotaDenial | FeatureUsage): {
  name: string;
  unit: string;
  limit: number;
  used: number;
  locked: boolean;
  resetsAt: string | null;
} {
  const name = 'featureName' in source ? source.featureName : source.name;
  return {
    name,
    unit: source.unit,
    limit: source.limit ?? 0,
    used: source.used,
    locked: source.locked,
    resetsAt: source.resetsAt,
  };
}

/**
 * What Premium adds.
 *
 * Kept as plain copy rather than derived from the plan record: these are
 * marketing claims, not entitlements, and generating "unlimited everything"
 * from thirteen null limits would read worse than saying it once.
 */
const BENEFITS = [
  'Unlimited use of every tool',
  'No download or generation caps',
  'Unlimited API Studio collections and design projects',
  'Unlimited website scans',
  'Every premium template',
];

export function PremiumModal({ open, onClose, denial }: PremiumModalProps) {
  const router = useRouter();
  const [isNavigating, setNavigating] = useState(false);

  if (!denial) return null;
  const detail = readDenial(denial);
  const resets = describeReset({ resetsAt: detail.resetsAt } as FeatureUsage);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={detail.locked ? `${detail.name} is a premium feature` : `You have used all your ${detail.unit}s`}
      description={
        detail.locked
          ? 'Upgrade to unlock it, along with everything else below.'
          : `Your plan includes ${detail.limit} ${detail.unit}${detail.limit === 1 ? '' : 's'}.`
      }
      footer={
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Not now
          </Button>
          <Button
            disabled={isNavigating}
            onClick={() => {
              setNavigating(true);
              // Pricing is the one place that owns the comparison and the
              // checkout. Duplicating either into this modal would be a second
              // thing to keep truthful.
              router.push('/pricing');
            }}
          >
            <Sparkles className="mr-1.5 h-4 w-4" aria-hidden />
            {isNavigating ? 'Opening…' : 'See plans'}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {!detail.locked && (
          <div className="rounded-md border border-border bg-muted/40 p-3">
            <p className="text-sm font-medium text-foreground">
              {detail.used} of {detail.limit} used
            </p>
            {/* Only shown when waiting actually helps. A lifetime quota never
                resets, and implying otherwise sends someone away to wait for
                something that will not happen. */}
            <p className="mt-0.5 text-xs text-muted-foreground">
              {resets ? `Resets ${resets}.` : 'This limit does not reset.'}
            </p>
          </div>
        )}

        <ul className="space-y-2">
          {BENEFITS.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </Dialog>
  );
}
