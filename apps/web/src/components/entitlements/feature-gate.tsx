'use client';

import { useState, type ReactNode } from 'react';
import { Lock } from 'lucide-react';
import { Button } from 'adysre';
import { useEntitlement } from '@/hooks/use-entitlement';
import { describeReset } from '@/lib/entitlements/client';
import { PremiumModal } from './premium-modal';

/**
 * Renders children when the workspace may use a feature, and an explanation
 * when it may not.
 *
 * ─── NOT A SECURITY BOUNDARY ────────────────────────────────────────────────
 * This is for experience: it shows what is left and explains what is spent.
 * Anyone can delete a DOM node. The server enforces where it can, and for the
 * browser-local tools it records what the client reports. Never rely on this
 * to protect anything; see `Enforcement` in lib/entitlements/types.ts.
 */

export interface FeatureGateProps {
  feature: string;
  children: ReactNode;
  /**
   * Render the children anyway, disabled, rather than replacing them.
   *
   * Better for a control someone is about to use: hiding a button they used
   * yesterday reads as a bug, while a disabled one with a reason reads as a
   * limit. The caller is responsible for actually disabling the control.
   */
  mode?: 'replace' | 'overlay';
  /** Shown instead of the default locked state. */
  fallback?: ReactNode;
}

export function FeatureGate({ feature, children, mode = 'replace', fallback }: FeatureGateProps) {
  const { feature: usage, isLoading, allowed } = useEntitlement(feature);
  const [showModal, setShowModal] = useState(false);

  // Render nothing while the answer is unknown rather than flashing the
  // unlocked state and snatching it back, which looks like a bug and teaches
  // users to distrust the interface.
  if (isLoading) return null;

  // An unknown key must not silently unlock. It is a caller mistake, and
  // failing open would disable a gate the moment someone mistyped it.
  if (!usage) return <>{fallback ?? null}</>;

  if (allowed) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  const resets = describeReset(usage);

  return (
    <>
      {mode === 'overlay' && <div className="pointer-events-none opacity-50">{children}</div>}

      <div className="rounded-md border border-dashed border-border bg-muted/30 p-4 text-center">
        <Lock className="mx-auto h-5 w-5 text-muted-foreground" aria-hidden />
        <p className="mt-2 text-sm font-medium text-foreground">
          {usage.locked ? `${usage.name} is a premium feature` : `You have used all your ${usage.unit}s`}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {usage.locked
            ? 'Upgrade to unlock it.'
            : resets
              ? `Your limit resets ${resets}.`
              : 'Upgrade for unlimited use.'}
        </p>
        <Button size="sm" className="mt-3" onClick={() => setShowModal(true)}>
          See plans
        </Button>
      </div>

      <PremiumModal open={showModal} onClose={() => setShowModal(false)} denial={usage} />
    </>
  );
}
