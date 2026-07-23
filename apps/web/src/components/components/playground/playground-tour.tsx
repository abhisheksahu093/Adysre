'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { Button, cn } from 'adysre';
import { tourStepsForStage } from '@/data/playground/tour';
import { usePlaygroundStore } from '@/stores/playground-store';

/** Gap between a spotlit element and its ring / card, px. */
const SPOTLIGHT_PAD = 6;
const CARD_GAP = 12;
const CARD_WIDTH = 336;
/** Rough card height used only to decide above-vs-below; clamping fixes error. */
const CARD_HEIGHT_ESTIMATE = 200;

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * The playground's quick tour. Steps are data (`@/data/playground/tour`); each
 * one spotlights the element carrying the matching `data-tour` attribute, so
 * the tour survives any rearrangement of the UI that keeps the attributes.
 * Runs automatically on first entry (store decides), replayable from the
 * toolbar. No library - a fixed ring whose oversized shadow dims the page.
 */
export function PlaygroundTour() {
  const step = usePlaygroundStore((s) => s.tourStep);
  const stage = usePlaygroundStore((s) => s.stage);
  const goToTourStep = usePlaygroundStore((s) => s.goToTourStep);
  const endTour = usePlaygroundStore((s) => s.endTour);
  const t = useTranslations('components');
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = 'playground-tour-title';
  const [rect, setRect] = useState<TargetRect | null>(null);
  const [smallViewport, setSmallViewport] = useState(false);

  // Only the current stage's steps are ever mounted, so the tour scopes to them.
  const steps = tourStepsForStage(stage);
  const current = step >= 0 ? steps[step] : undefined;
  const total = steps.length;

  const measure = useCallback(() => {
    if (!current?.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${current.target}"]`);
    if (!(el instanceof HTMLElement)) {
      // A missing target must not strand the tour - fall back to a centred card.
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    // The interval re-measures constantly; only re-render on real movement.
    setRect((prev) =>
      prev &&
      prev.top === r.top &&
      prev.left === r.left &&
      prev.width === r.width &&
      prev.height === r.height
        ? prev
        : { top: r.top, left: r.left, width: r.width, height: r.height },
    );
  }, [current?.target]);

  // Bring the target on screen, then track it. Scroll and resize listeners
  // cover user movement, but the canvas also GROWS on its own as lazy preview
  // iframes load and report their heights - no event fires for that, so a slow
  // interval re-measures continuously while the tour is up. `nearest` rather
  // than `center`: the canvas is taller than the viewport, and centring a
  // viewport-sized element scrolls its middle into view instead of its top.
  useEffect(() => {
    if (!current) return;
    if (current.target) {
      const el = document.querySelector(`[data-tour="${current.target}"]`);
      el?.scrollIntoView({ block: 'nearest' });
    }
    const frame = requestAnimationFrame(measure);
    const interval = setInterval(measure, 200);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [current, measure]);

  // Below `sm` there is no room beside a target; the card docks to the bottom.
  useEffect(() => {
    if (!current) return;
    const query = window.matchMedia('(max-width: 639px)');
    const update = () => setSmallViewport(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, [current]);

  useEffect(() => {
    if (!current) return;
    cardRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') endTour();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [current, endTour]);

  if (!current) return null;

  const spotlit = rect !== null;
  const floating = spotlit && !smallViewport;

  let cardStyle: CSSProperties | undefined;
  if (floating && rect) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const fitsBelow = rect.top + rect.height + CARD_GAP + CARD_HEIGHT_ESTIMATE < viewportHeight;
    const top = fitsBelow
      ? rect.top + rect.height + SPOTLIGHT_PAD + CARD_GAP
      : Math.max(CARD_GAP, rect.top - SPOTLIGHT_PAD - CARD_GAP - CARD_HEIGHT_ESTIMATE);
    const left = Math.min(
      Math.max(CARD_GAP, rect.left + rect.width / 2 - CARD_WIDTH / 2),
      Math.max(CARD_GAP, viewportWidth - CARD_WIDTH - CARD_GAP),
    );
    cardStyle = { top, left, width: CARD_WIDTH };
  }

  return createPortal(
    <>
      {/* Blocks interaction with the page while the tour narrates. The dimming
          itself comes from the spotlight's shadow when there is a target. */}
      <div
        className={cn('fixed inset-0 z-60', !spotlit && 'bg-foreground/45')}
        aria-hidden
      />
      {spotlit && rect && (
        <div
          className="tour-spotlight"
          style={{
            top: rect.top - SPOTLIGHT_PAD,
            left: rect.left - SPOTLIGHT_PAD,
            width: rect.width + SPOTLIGHT_PAD * 2,
            height: rect.height + SPOTLIGHT_PAD * 2,
          }}
          aria-hidden
        />
      )}

      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={cardStyle}
        className={cn(
          'fixed z-70 rounded-lg border border-border bg-card p-4 shadow-lg outline-none',
          !floating && 'inset-x-4 bottom-4 mx-auto max-w-sm',
          !floating && !spotlit && 'bottom-auto top-1/2 -translate-y-1/2',
        )}
      >
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {t('playground.tour.stepCount', { current: step + 1, total })}
        </p>
        <h3 id={titleId} className="mt-1 text-sm font-semibold tracking-tight">
          {t(`playground.tour.steps.${current.id}.title`)}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {t(`playground.tour.steps.${current.id}.body`)}
        </p>

        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={endTour}
            className="h-auto py-1 text-xs text-muted-foreground"
          >
            {t('playground.tour.skip')}
          </Button>
          <div className="ml-auto flex items-center gap-2">
            {step > 0 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => goToTourStep(step - 1)}
              >
                {t('playground.tour.back')}
              </Button>
            )}
            <Button type="button" size="sm" onClick={() => goToTourStep(step + 1)}>
              {step + 1 === total ? t('playground.tour.done') : t('playground.tour.next')}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
