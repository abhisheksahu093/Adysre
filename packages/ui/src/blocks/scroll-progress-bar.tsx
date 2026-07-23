'use client';

/**
 * Live preview for `scroll-progress-bar`.
 *
 * Mirrors the `typescript` code variant (minus the JSX.Element annotation, per
 * the preview convention). Keep in step with `src/data/components/animation.ts`.
 */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface ScrollProgressBarProps {
  children: ReactNode;
  height?: number;
  maxHeight?: number;
  className?: string;
}

export function ScrollProgressBar({
  children,
  height = 4,
  maxHeight = 288,
  className = '',
}: ScrollProgressBarProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;

    const update = () => {
      const max = node.scrollHeight - node.clientHeight;
      setProgress(max > 0 ? Math.min(node.scrollTop / max, 1) : 0);
    };

    update();
    node.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      node.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 ${className}`}>
      <div
        className="w-full bg-gray-200 dark:bg-gray-800"
        style={{ height }}
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="h-full bg-blue-600 transition-[width] duration-150 ease-out motion-reduce:transition-none dark:bg-blue-500"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div ref={scrollRef} className="overflow-y-auto px-4 py-3" style={{ maxHeight }}>
        {children}
      </div>
    </div>
  );
}

export const minHeight = 320;

export default function ScrollProgressBarPreview() {
  const paragraphs = [
    'Scroll this panel to watch the bar above fill. Progress is measured against this container, not the page, so the component drops into cards and dialogs unchanged.',
    'The indicator uses role="progressbar" with a live aria-valuenow, so assistive technology can announce how far through the content a reader has moved.',
    'Reduced-motion users still get an accurate bar - only the smoothing transition on the fill is dropped, never the value itself.',
    'Because the listener is passive and scoped to one element, it stays cheap even with several progress panels on a single screen.',
    'Keep scrolling to reach one hundred percent and confirm the fill lands exactly at the end of the content.',
  ];

  return (
    <div className="w-full max-w-md px-4">
      <ScrollProgressBar maxHeight={240}>
        <div className="space-y-3">
          {paragraphs.map((text, index) => (
            <p key={index} className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {text}
            </p>
          ))}
        </div>
      </ScrollProgressBar>
    </div>
  );
}
