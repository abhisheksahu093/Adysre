'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { Button, cn } from '@adysre/ui';

/** One tour step: a `data-tour` target (or `null` to centre) plus its copy. */
export interface SpotlightStep {
  target: string | null;
  title: string;
  body: string;
}

export interface SpotlightTourLabels {
  stepOf: (current: number, total: number) => string;
  back: string;
  next: string;
  done: string;
  skip: string;
}

interface SpotlightTourProps {
  steps: SpotlightStep[];
  /** Active index, or -1 when the tour is closed. */
  index: number;
  /** Go to an index; out-of-range means finish (caller closes + records done). */
  onIndex: (index: number) => void;
  onClose: () => void;
  labels: SpotlightTourLabels;
}

const SPOTLIGHT_PAD = 6;
const CARD_GAP = 12;
const CARD_WIDTH = 336;
const CARD_HEIGHT_ESTIMATE = 200;

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * A dependency-free spotlight tour: a fixed ring whose oversized shadow dims the
 * page, plus a positioned card. Purely presentational - the caller owns which
 * step is active and what each step says, so any feature can drive it.
 */
export function SpotlightTour({ steps, index, onIndex, onClose, labels }: SpotlightTourProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const titleId = 'spotlight-tour-title';
  const [rect, setRect] = useState<Rect | null>(null);
  const [smallViewport, setSmallViewport] = useState(false);

  const current = index >= 0 ? steps[index] : undefined;
  const total = steps.length;

  const measure = useCallback(() => {
    if (!current?.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${current.target}"]`);
    if (!(el instanceof HTMLElement)) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect((prev) =>
      prev && prev.top === r.top && prev.left === r.left && prev.width === r.width && prev.height === r.height
        ? prev
        : { top: r.top, left: r.left, width: r.width, height: r.height },
    );
  }, [current?.target]);

  useEffect(() => {
    if (!current) return;
    if (current.target) {
      document.querySelector(`[data-tour="${current.target}"]`)?.scrollIntoView({ block: 'nearest' });
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
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [current, onClose]);

  if (!current) return null;

  const spotlit = rect !== null;
  const floating = spotlit && !smallViewport;

  let cardStyle: CSSProperties | undefined;
  if (floating && rect) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const fitsBelow = rect.top + rect.height + CARD_GAP + CARD_HEIGHT_ESTIMATE < vh;
    const top = fitsBelow
      ? rect.top + rect.height + SPOTLIGHT_PAD + CARD_GAP
      : Math.max(CARD_GAP, rect.top - SPOTLIGHT_PAD - CARD_GAP - CARD_HEIGHT_ESTIMATE);
    const left = Math.min(
      Math.max(CARD_GAP, rect.left + rect.width / 2 - CARD_WIDTH / 2),
      Math.max(CARD_GAP, vw - CARD_WIDTH - CARD_GAP),
    );
    cardStyle = { top, left, width: CARD_WIDTH };
  }

  return createPortal(
    <>
      <div className={cn('fixed inset-0 z-60', !spotlit && 'bg-foreground/45')} aria-hidden />
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
          {labels.stepOf(index + 1, total)}
        </p>
        <h3 id={titleId} className="mt-1 text-sm font-semibold tracking-tight">
          {current.title}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground">{current.body}</p>
        <div className="mt-4 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-auto py-1 text-xs text-muted-foreground"
          >
            {labels.skip}
          </Button>
          <div className="ml-auto flex items-center gap-2">
            {index > 0 && (
              <Button type="button" variant="outline" size="sm" onClick={() => onIndex(index - 1)}>
                {labels.back}
              </Button>
            )}
            <Button type="button" size="sm" onClick={() => onIndex(index + 1)}>
              {index + 1 === total ? labels.done : labels.next}
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
