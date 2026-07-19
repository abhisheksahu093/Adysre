import type { ComponentEntry } from './types';

/**
 * Cursors category.
 *
 * Ten pointer-driven effects sharing one rule: every effect is scoped to its
 * own stage. Nothing here listens on `document` or replaces the page cursor
 * globally - a library component that hijacks the cursor of the page that
 * imports it is a bug shipped to every page at once. Two more constraints run
 * through the set: every JS variant gates on `(pointer: fine)`, because a
 * cursor effect without a cursor is a dot parked in a corner - touch devices
 * get an ordinary static panel instead; and everything moves with transforms
 * and CSS variables, never `left`/`top`, because pointermove fires faster than
 * layout settles and a layout write per move is jank by design. Where the
 * motion is decoration rather than a 1:1 echo of the user's own hand (eased
 * followers, trails, magnetic pull, tilt), `prefers-reduced-motion` switches it
 * off entirely.
 */
export const cursorsComponents: ComponentEntry[] = [
  {
    slug: 'cursor-dot-follower',
    category: 'cursors',
    tags: ['cursor', 'follower', 'dot', 'pointer', 'interaction'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 410, copies: 96, downloads: 22 },
    props: [
      { name: 'hint', type: 'string', default: "'Move your pointer around this panel'", descriptionKey: 'hint' },
      { name: 'dotClassName', type: 'string', default: "'h-3 w-3 bg-blue-600 dark:bg-blue-400'", descriptionKey: 'dotClassName' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The dot replaces the native cursor, so cursor:none is applied by the script,
  never by a class - if the script does not run (touch, JS off) there must
  still be a visible cursor. All movement is one transform write per event.
-->
<div id="cursor-dot-stage" class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
  <div class="flex h-56 items-center justify-center px-6 text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">Move your pointer around this panel</p>
  </div>

  <div id="cursor-dot" class="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150 motion-reduce:transition-none" aria-hidden="true">
    <span class="block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
  </div>
</div>

<script>
  (() => {
    const stage = document.getElementById('cursor-dot-stage');
    const dot = document.getElementById('cursor-dot');
    if (!stage || !dot || !matchMedia('(pointer: fine)').matches) return;
    let rect = stage.getBoundingClientRect();
    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', () => { rect = stage.getBoundingClientRect(); dot.style.opacity = '1'; });
    stage.addEventListener('pointerleave', () => { dot.style.opacity = '0'; });
    stage.addEventListener('pointermove', (e) => {
      dot.style.transform = 'translate3d(' + (e.clientX - rect.left) + 'px,' + (e.clientY - rect.top) + 'px,0)';
    });
  })();
</script>`,
      react: `import { useEffect, useRef } from 'react';

export function CursorDotFollower({
  hint = 'Move your pointer around this panel',
  dotClassName = 'h-3 w-3 bg-blue-600 dark:bg-blue-400',
  className = '',
}) {
  const stageRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const dot = dotRef.current;
    if (!stage || !dot) return;
    // Coarse pointers have no cursor to replace, so the effect never attaches
    // and touch devices keep an ordinary static card.
    if (!window.matchMedia('(pointer: fine)').matches) return;

    // Read the rect once per entry, not per move - getBoundingClientRect inside
    // pointermove is a layout read sixty times a second.
    let rect = stage.getBoundingClientRect();
    const onEnter = () => { rect = stage.getBoundingClientRect(); dot.style.opacity = '1'; };
    const onLeave = () => { dot.style.opacity = '0'; };
    const onMove = (e) => {
      dot.style.transform = 'translate3d(' + (e.clientX - rect.left) + 'px,' + (e.clientY - rect.top) + 'px,0)';
    };

    // cursor:none is applied here, never in the markup - if JS does not run
    // there must still be a visible cursor.
    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.style.cursor = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex h-56 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150 motion-reduce:transition-none"
        aria-hidden="true"
      >
        <span className={\`block -translate-x-1/2 -translate-y-1/2 rounded-full \${dotClassName}\`} />
      </div>
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef } from 'react';

export interface CursorDotFollowerProps {
  hint?: string;
  /** Size and colour of the dot live here, e.g. 'h-3 w-3 bg-blue-600'. */
  dotClassName?: string;
  className?: string;
}

// 'use client' is load-bearing: the effect owns DOM listeners and writes styles
// imperatively, so this can never be a Server Component.
export function CursorDotFollower({
  hint = 'Move your pointer around this panel',
  dotClassName = 'h-3 w-3 bg-blue-600 dark:bg-blue-400',
  className = '',
}: CursorDotFollowerProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const dot = dotRef.current;
    if (!stage || !dot) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = stage.getBoundingClientRect();
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); dot.style.opacity = '1'; };
    const onLeave = (): void => { dot.style.opacity = '0'; };
    const onMove = (e: PointerEvent): void => {
      dot.style.transform = 'translate3d(' + (e.clientX - rect.left) + 'px,' + (e.clientY - rect.top) + 'px,0)';
    };

    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.style.cursor = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex h-56 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div
        ref={dotRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150 motion-reduce:transition-none"
        aria-hidden="true"
      >
        <span className={\`block -translate-x-1/2 -translate-y-1/2 rounded-full \${dotClassName}\`} />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cursor-ring-lag-follower',
    category: 'cursors',
    tags: ['cursor', 'ring', 'lag', 'easing', 'follower'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 372, copies: 88, downloads: 19 },
    props: [
      { name: 'hint', type: 'string', default: "'The ring eases in behind your pointer'", descriptionKey: 'hint' },
      { name: 'ringClassName', type: 'string', default: "'h-8 w-8 border-2 border-blue-500 dark:border-blue-400'", descriptionKey: 'ringClassName' },
      { name: 'ease', type: 'number', default: '0.15', descriptionKey: 'ease' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The ring trails the pointer via a per-frame lerp in requestAnimationFrame. The
  easing IS the effect, so with prefers-reduced-motion the factor becomes 1 and
  the ring tracks the pointer 1:1 instead of trailing it.
-->
<div id="cursor-ring-stage" class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
  <div class="flex h-56 items-center justify-center px-6 text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">The ring eases in behind your pointer</p>
  </div>
  <div id="cursor-ring" class="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150 motion-reduce:transition-none" aria-hidden="true">
    <span class="block h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-500 dark:border-blue-400"></span>
  </div>
</div>

<script>
  (() => {
    const stage = document.getElementById('cursor-ring-stage');
    const ring = document.getElementById('cursor-ring');
    if (!stage || !ring || !matchMedia('(pointer: fine)').matches) return;
    const factor = matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0.15;
    let rect = stage.getBoundingClientRect();
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, active = false;
    const loop = () => {
      cx += (tx - cx) * factor; cy += (ty - cy) * factor;
      ring.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      raf = requestAnimationFrame(loop);
    };
    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', (e) => {
      rect = stage.getBoundingClientRect();
      tx = cx = e.clientX - rect.left; ty = cy = e.clientY - rect.top;
      if (!active) { active = true; ring.style.opacity = '1'; raf = requestAnimationFrame(loop); }
    });
    stage.addEventListener('pointerleave', () => { active = false; ring.style.opacity = '0'; cancelAnimationFrame(raf); });
    stage.addEventListener('pointermove', (e) => { tx = e.clientX - rect.left; ty = e.clientY - rect.top; });
  })();
</script>`,
      react: `import { useEffect, useRef } from 'react';

export function CursorRingLagFollower({
  hint = 'The ring eases in behind your pointer',
  ringClassName = 'h-8 w-8 border-2 border-blue-500 dark:border-blue-400',
  ease = 0.15,
  className = '',
}) {
  const stageRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    // The lag is the whole effect; reduced motion drops it to a 1:1 track.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const factor = reduce ? 1 : ease;

    let rect = stage.getBoundingClientRect();
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, active = false;
    const loop = () => {
      cx += (tx - cx) * factor; cy += (ty - cy) * factor;
      ring.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      raf = requestAnimationFrame(loop);
    };
    const onEnter = (e) => {
      rect = stage.getBoundingClientRect();
      tx = cx = e.clientX - rect.left; ty = cy = e.clientY - rect.top;
      if (!active) { active = true; ring.style.opacity = '1'; raf = requestAnimationFrame(loop); }
    };
    const onLeave = () => { active = false; ring.style.opacity = '0'; cancelAnimationFrame(raf); };
    const onMove = (e) => { tx = e.clientX - rect.left; ty = e.clientY - rect.top; };

    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.style.cursor = '';
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, [ease]);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex h-56 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div
        ref={ringRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150 motion-reduce:transition-none"
        aria-hidden="true"
      >
        <span className={\`block -translate-x-1/2 -translate-y-1/2 rounded-full \${ringClassName}\`} />
      </div>
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef } from 'react';

export interface CursorRingLagFollowerProps {
  hint?: string;
  ringClassName?: string;
  /** 0..1 lerp factor per frame. Lower trails further behind the pointer. */
  ease?: number;
  className?: string;
}

export function CursorRingLagFollower({
  hint = 'The ring eases in behind your pointer',
  ringClassName = 'h-8 w-8 border-2 border-blue-500 dark:border-blue-400',
  ease = 0.15,
  className = '',
}: CursorRingLagFollowerProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const ring = ringRef.current;
    if (!stage || !ring) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const factor = reduce ? 1 : ease;

    let rect = stage.getBoundingClientRect();
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, active = false;
    const loop = (): void => {
      cx += (tx - cx) * factor; cy += (ty - cy) * factor;
      ring.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      raf = requestAnimationFrame(loop);
    };
    const onEnter = (e: PointerEvent): void => {
      rect = stage.getBoundingClientRect();
      tx = cx = e.clientX - rect.left; ty = cy = e.clientY - rect.top;
      if (!active) { active = true; ring.style.opacity = '1'; raf = requestAnimationFrame(loop); }
    };
    const onLeave = (): void => { active = false; ring.style.opacity = '0'; cancelAnimationFrame(raf); };
    const onMove = (e: PointerEvent): void => { tx = e.clientX - rect.left; ty = e.clientY - rect.top; };

    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.style.cursor = '';
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, [ease]);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex h-56 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div
        ref={ringRef}
        className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150 motion-reduce:transition-none"
        aria-hidden="true"
      >
        <span className={\`block -translate-x-1/2 -translate-y-1/2 rounded-full \${ringClassName}\`} />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cursor-spotlight-reveal',
    category: 'cursors',
    tags: ['cursor', 'spotlight', 'reveal', 'mask', 'radial'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 528, copies: 141, downloads: 34 },
    props: [
      { name: 'heading', type: 'string', default: "'Hidden in plain sight'", descriptionKey: 'heading' },
      { name: 'copy', type: 'string', default: "'The panel stays dark until your pointer lights a path across it.'", descriptionKey: 'copy' },
      { name: 'radius', type: 'number', default: '120', descriptionKey: 'radius' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The overlay is a radial-gradient with a transparent hole at (--x,--y). Off
  hover the vars default off-panel, so the whole panel reads dark; on move only
  the CSS variables change. There is no transform equivalent for a moving mask -
  updating two custom properties is the cheapest honest way to do it.
-->
<div id="cursor-spot-stage" class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-gray-950">
  <div class="flex h-56 flex-col items-center justify-center gap-2 px-6 text-center">
    <h3 class="text-lg font-semibold text-white">Hidden in plain sight</h3>
    <p class="max-w-xs text-sm text-gray-300">The panel stays dark until your pointer lights a path across it.</p>
  </div>
  <div id="cursor-spot" class="pointer-events-none absolute inset-0 transition-[background] duration-150 motion-reduce:transition-none"
    style="background: radial-gradient(120px circle at var(--x, -1000px) var(--y, -1000px), transparent 0%, transparent 45%, rgba(2,6,23,0.94) 78%)"
    aria-hidden="true"></div>
</div>

<script>
  (() => {
    const stage = document.getElementById('cursor-spot-stage');
    const spot = document.getElementById('cursor-spot');
    if (!stage || !spot || !matchMedia('(pointer: fine)').matches) return;
    let rect = stage.getBoundingClientRect();
    const set = (e) => {
      spot.style.setProperty('--x', (e.clientX - rect.left) + 'px');
      spot.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    };
    stage.addEventListener('pointerenter', (e) => { rect = stage.getBoundingClientRect(); set(e); });
    stage.addEventListener('pointermove', set);
    stage.addEventListener('pointerleave', () => {
      spot.style.setProperty('--x', '-1000px'); spot.style.setProperty('--y', '-1000px');
    });
  })();
</script>`,
      react: `import { useEffect, useRef } from 'react';

export function CursorSpotlightReveal({
  heading = 'Hidden in plain sight',
  copy = 'The panel stays dark until your pointer lights a path across it.',
  radius = 120,
  className = '',
}) {
  const stageRef = useRef(null);
  const spotRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const spot = spotRef.current;
    if (!stage || !spot) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = stage.getBoundingClientRect();
    const set = (e) => {
      spot.style.setProperty('--x', (e.clientX - rect.left) + 'px');
      spot.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    };
    const onEnter = (e) => { rect = stage.getBoundingClientRect(); set(e); };
    // Park the hole off-panel so the whole surface reads dark again.
    const onLeave = () => {
      spot.style.setProperty('--x', '-1000px');
      spot.style.setProperty('--y', '-1000px');
    };
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', set);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', set);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 \${className}\`}
    >
      <div className="flex h-56 flex-col items-center justify-center gap-2 px-6 text-center">
        <h3 className="text-lg font-semibold text-white">{heading}</h3>
        <p className="max-w-xs text-sm text-gray-300">{copy}</p>
      </div>
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 transition-[background] duration-150 motion-reduce:transition-none"
        style={{
          background: \`radial-gradient(\${radius}px circle at var(--x, -1000px) var(--y, -1000px), transparent 0%, transparent 45%, rgba(2,6,23,0.94) 78%)\`,
        }}
        aria-hidden="true"
      />
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef } from 'react';

export interface CursorSpotlightRevealProps {
  heading?: string;
  copy?: string;
  /** Radius of the revealed circle in pixels. */
  radius?: number;
  className?: string;
}

export function CursorSpotlightReveal({
  heading = 'Hidden in plain sight',
  copy = 'The panel stays dark until your pointer lights a path across it.',
  radius = 120,
  className = '',
}: CursorSpotlightRevealProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const spot = spotRef.current;
    if (!stage || !spot) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = stage.getBoundingClientRect();
    const set = (e: PointerEvent): void => {
      spot.style.setProperty('--x', (e.clientX - rect.left) + 'px');
      spot.style.setProperty('--y', (e.clientY - rect.top) + 'px');
    };
    const onEnter = (e: PointerEvent): void => { rect = stage.getBoundingClientRect(); set(e); };
    const onLeave = (): void => {
      spot.style.setProperty('--x', '-1000px');
      spot.style.setProperty('--y', '-1000px');
    };
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', set);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', set);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 \${className}\`}
    >
      <div className="flex h-56 flex-col items-center justify-center gap-2 px-6 text-center">
        <h3 className="text-lg font-semibold text-white">{heading}</h3>
        <p className="max-w-xs text-sm text-gray-300">{copy}</p>
      </div>
      <div
        ref={spotRef}
        className="pointer-events-none absolute inset-0 transition-[background] duration-150 motion-reduce:transition-none"
        style={{
          background: \`radial-gradient(\${radius}px circle at var(--x, -1000px) var(--y, -1000px), transparent 0%, transparent 45%, rgba(2,6,23,0.94) 78%)\`,
        }}
        aria-hidden="true"
      />
    </div>
  );
}`,
    },
  },
  {
    slug: 'cursor-magnetic-button',
    category: 'cursors',
    tags: ['cursor', 'magnetic', 'button', 'attract', 'micro-interaction'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 610, copies: 173, downloads: 41 },
    props: [
      { name: 'label', type: 'string', default: "'Get started'", descriptionKey: 'label' },
      { name: 'strength', type: 'number', default: '0.4', descriptionKey: 'strength' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  The button is pulled a fraction of the way toward the pointer, eased in rAF.
  The pull is decoration, so prefers-reduced-motion skips the effect entirely
  and the button stays put - still fully clickable and focusable either way.
-->
<div id="cursor-mag-stage" class="relative flex h-56 w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
  <button id="cursor-mag-btn" type="button" class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white will-change-transform transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transform-none dark:focus-visible:ring-offset-gray-900">
    Get started
  </button>
</div>

<script>
  (() => {
    const stage = document.getElementById('cursor-mag-stage');
    const btn = document.getElementById('cursor-mag-btn');
    if (!stage || !btn || !matchMedia('(pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let b = btn.getBoundingClientRect();
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      btn.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
      if (tx === 0 && ty === 0 && Math.abs(cx) < 0.1 && Math.abs(cy) < 0.1) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
    };
    stage.addEventListener('pointerenter', () => { b = btn.getBoundingClientRect(); });
    stage.addEventListener('pointermove', (e) => {
      tx = (e.clientX - (b.left + b.width / 2)) * 0.4;
      ty = (e.clientY - (b.top + b.height / 2)) * 0.4;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    stage.addEventListener('pointerleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  })();
</script>`,
      react: `import { useEffect, useRef } from 'react';

export function CursorMagneticButton({
  label = 'Get started',
  strength = 0.4,
  className = '',
}) {
  const stageRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const btn = btnRef.current;
    if (!stage || !btn) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    // The magnetism is decoration - reduced motion leaves the button still.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Read the resting centre once; using it (not the live, transformed rect)
    // keeps the pull stable instead of feeding back on itself.
    let b = btn.getBoundingClientRect();
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      btn.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
      if (tx === 0 && ty === 0 && Math.abs(cx) < 0.1 && Math.abs(cy) < 0.1) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
    };
    const onEnter = () => { b = btn.getBoundingClientRect(); };
    const onMove = (e) => {
      tx = (e.clientX - (b.left + b.width / 2)) * strength;
      ty = (e.clientY - (b.top + b.height / 2)) * strength;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      btn.style.transform = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return (
    <div
      ref={stageRef}
      className={\`relative flex h-56 w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <button
        ref={btnRef}
        type="button"
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white will-change-transform transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transform-none dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef } from 'react';

export interface CursorMagneticButtonProps {
  label?: string;
  /** How far the button follows the pointer, 0 (still) to 1 (locked on). */
  strength?: number;
  className?: string;
}

export function CursorMagneticButton({
  label = 'Get started',
  strength = 0.4,
  className = '',
}: CursorMagneticButtonProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const btn = btnRef.current;
    if (!stage || !btn) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let b = btn.getBoundingClientRect();
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = (): void => {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      btn.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
      if (tx === 0 && ty === 0 && Math.abs(cx) < 0.1 && Math.abs(cy) < 0.1) { raf = 0; return; }
      raf = requestAnimationFrame(loop);
    };
    const onEnter = (): void => { b = btn.getBoundingClientRect(); };
    const onMove = (e: PointerEvent): void => {
      tx = (e.clientX - (b.left + b.width / 2)) * strength;
      ty = (e.clientY - (b.top + b.height / 2)) * strength;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = (): void => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      btn.style.transform = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [strength]);

  return (
    <div
      ref={stageRef}
      className={\`relative flex h-56 w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <button
        ref={btnRef}
        type="button"
        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white will-change-transform transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 motion-reduce:transform-none dark:focus-visible:ring-offset-gray-900"
      >
        {label}
      </button>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cursor-trail-particles',
    category: 'cursors',
    tags: ['cursor', 'trail', 'particles', 'canvas-free', 'animation'],
    difficulty: 'advanced',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 703, copies: 205, downloads: 58 },
    props: [
      { name: 'hint', type: 'string', default: "'Drag your pointer across for a comet trail'", descriptionKey: 'hint' },
      { name: 'color', type: 'string', default: "'rgb(59 130 246)'", descriptionKey: 'color' },
      { name: 'count', type: 'number', default: '16', descriptionKey: 'count' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A fixed pool of dots (no allocation per move) is cycled as the pointer moves;
  a single rAF loop decays each dot's opacity and scale. The trail is pure
  decoration, so reduced motion skips it and the panel is a plain card.
-->
<div id="cursor-trail-stage" class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
  <div class="flex h-56 items-center justify-center px-6 text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">Drag your pointer across for a comet trail</p>
  </div>
  <div id="cursor-trail-layer" class="pointer-events-none absolute inset-0" aria-hidden="true"></div>
</div>

<script>
  (() => {
    const stage = document.getElementById('cursor-trail-stage');
    const layer = document.getElementById('cursor-trail-layer');
    if (!stage || !layer || !matchMedia('(pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const count = 16, color = 'rgb(59 130 246)';
    let rect = stage.getBoundingClientRect();
    const dots = [], xs = [], ys = [], lives = [];
    for (let i = 0; i < count; i++) {
      const d = document.createElement('span');
      d.style.cssText = 'position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:9999px;opacity:0;background:' + color;
      layer.appendChild(d); dots.push(d); xs.push(0); ys.push(0); lives.push(0);
    }
    let head = 0, raf = 0;
    const loop = () => {
      let alive = false;
      for (let i = 0; i < count; i++) {
        if (lives[i] > 0) {
          lives[i] = Math.max(0, lives[i] - 0.045);
          dots[i].style.opacity = String(lives[i]);
          dots[i].style.transform = 'translate3d(' + xs[i] + 'px,' + ys[i] + 'px,0) scale(' + lives[i] + ')';
          alive = true;
        }
      }
      raf = alive ? requestAnimationFrame(loop) : 0;
    };
    stage.addEventListener('pointerenter', () => { rect = stage.getBoundingClientRect(); });
    stage.addEventListener('pointermove', (e) => {
      xs[head] = e.clientX - rect.left; ys[head] = e.clientY - rect.top; lives[head] = 1;
      head = (head + 1) % count;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  })();
</script>`,
      react: `import { useEffect, useRef } from 'react';

export function CursorTrailParticles({
  hint = 'Drag your pointer across for a comet trail',
  color = 'rgb(59 130 246)',
  count = 16,
  className = '',
}) {
  const stageRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (!stage || !layer) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    // The trail is pure decoration - reduced motion opts out completely.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rect = stage.getBoundingClientRect();
    // A fixed pool: no element is created inside pointermove.
    const dots = [], xs = [], ys = [], lives = [];
    for (let i = 0; i < count; i++) {
      const d = document.createElement('span');
      d.style.cssText = 'position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:9999px;opacity:0;background:' + color;
      layer.appendChild(d); dots.push(d); xs.push(0); ys.push(0); lives.push(0);
    }
    let head = 0, raf = 0;
    const loop = () => {
      let alive = false;
      for (let i = 0; i < count; i++) {
        if (lives[i] > 0) {
          lives[i] = Math.max(0, lives[i] - 0.045);
          dots[i].style.opacity = String(lives[i]);
          dots[i].style.transform = 'translate3d(' + xs[i] + 'px,' + ys[i] + 'px,0) scale(' + lives[i] + ')';
          alive = true;
        }
      }
      raf = alive ? requestAnimationFrame(loop) : 0;
    };
    const onEnter = () => { rect = stage.getBoundingClientRect(); };
    const onMove = (e) => {
      xs[head] = e.clientX - rect.left; ys[head] = e.clientY - rect.top; lives[head] = 1;
      head = (head + 1) % count;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
      dots.forEach((d) => d.remove());
    };
  }, [color, count]);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex h-56 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div ref={layerRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef } from 'react';

export interface CursorTrailParticlesProps {
  hint?: string;
  /** Any CSS colour for the particles. */
  color?: string;
  /** Size of the particle pool; also the trail length. */
  count?: number;
  className?: string;
}

export function CursorTrailParticles({
  hint = 'Drag your pointer across for a comet trail',
  color = 'rgb(59 130 246)',
  count = 16,
  className = '',
}: CursorTrailParticlesProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const layer = layerRef.current;
    if (!stage || !layer) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rect = stage.getBoundingClientRect();
    const dots: HTMLSpanElement[] = [];
    const xs: number[] = [], ys: number[] = [], lives: number[] = [];
    for (let i = 0; i < count; i++) {
      const d = document.createElement('span');
      d.style.cssText = 'position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:9999px;opacity:0;background:' + color;
      layer.appendChild(d); dots.push(d); xs.push(0); ys.push(0); lives.push(0);
    }
    let head = 0, raf = 0;
    const loop = (): void => {
      let alive = false;
      for (let i = 0; i < count; i++) {
        if (lives[i] > 0) {
          lives[i] = Math.max(0, lives[i] - 0.045);
          dots[i].style.opacity = String(lives[i]);
          dots[i].style.transform = 'translate3d(' + xs[i] + 'px,' + ys[i] + 'px,0) scale(' + lives[i] + ')';
          alive = true;
        }
      }
      raf = alive ? requestAnimationFrame(loop) : 0;
    };
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); };
    const onMove = (e: PointerEvent): void => {
      xs[head] = e.clientX - rect.left; ys[head] = e.clientY - rect.top; lives[head] = 1;
      head = (head + 1) % count;
      if (!raf) raf = requestAnimationFrame(loop);
    };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
      dots.forEach((d) => d.remove());
    };
  }, [color, count]);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex h-56 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div ref={layerRef} className="pointer-events-none absolute inset-0" aria-hidden="true" />
    </div>
  );
}`,
    },
  },
  {
    slug: 'cursor-text-zoom-hover',
    category: 'cursors',
    tags: ['cursor', 'text', 'zoom', 'tilt', 'hover'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 344, copies: 79, downloads: 17 },
    props: [
      { name: 'text', type: 'string', default: "'Zoom'", descriptionKey: 'text' },
      { name: 'scale', type: 'number', default: '1.35', descriptionKey: 'scale' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  On hover the word scales up and tilts toward the pointer; a transition on the
  transform does the smoothing, so there is no rAF loop. The zoom is decoration,
  hence motion-reduce:transform-none.
-->
<div id="cursor-zoom-stage" class="relative flex h-56 w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 [perspective:600px] dark:border-gray-800 dark:bg-gray-900">
  <span id="cursor-zoom-text" class="text-5xl font-bold tracking-tight text-gray-900 will-change-transform transition-transform duration-200 ease-out motion-reduce:transform-none dark:text-gray-100">
    Zoom
  </span>
</div>

<script>
  (() => {
    const stage = document.getElementById('cursor-zoom-stage');
    const el = document.getElementById('cursor-zoom-text');
    if (!stage || !el || !matchMedia('(pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let rect = stage.getBoundingClientRect();
    stage.addEventListener('pointerenter', () => { rect = stage.getBoundingClientRect(); el.style.transform = 'scale(1.35)'; });
    stage.addEventListener('pointerleave', () => { el.style.transform = 'scale(1)'; });
    stage.addEventListener('pointermove', (e) => {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = 'scale(1.35) rotateX(' + (-py * 18) + 'deg) rotateY(' + (px * 18) + 'deg)';
    });
  })();
</script>`,
      react: `import { useEffect, useRef } from 'react';

export function CursorTextZoomHover({
  text = 'Zoom',
  scale = 1.35,
  className = '',
}) {
  const stageRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const el = textRef.current;
    if (!stage || !el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    // The zoom and tilt are decoration; reduced motion leaves the text flat.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rect = stage.getBoundingClientRect();
    const onEnter = () => { rect = stage.getBoundingClientRect(); el.style.transform = 'scale(' + scale + ')'; };
    const onLeave = () => { el.style.transform = 'scale(1)'; };
    const onMove = (e) => {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = 'scale(' + scale + ') rotateX(' + (-py * 18) + 'deg) rotateY(' + (px * 18) + 'deg)';
    };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      el.style.transform = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, [scale]);

  return (
    <div
      ref={stageRef}
      className={\`relative flex h-56 w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 [perspective:600px] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span
        ref={textRef}
        className="text-5xl font-bold tracking-tight text-gray-900 will-change-transform transition-transform duration-200 ease-out motion-reduce:transform-none dark:text-gray-100"
      >
        {text}
      </span>
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef } from 'react';

export interface CursorTextZoomHoverProps {
  text?: string;
  /** Peak scale factor while hovering. */
  scale?: number;
  className?: string;
}

export function CursorTextZoomHover({
  text = 'Zoom',
  scale = 1.35,
  className = '',
}: CursorTextZoomHoverProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const el = textRef.current;
    if (!stage || !el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rect = stage.getBoundingClientRect();
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); el.style.transform = 'scale(' + scale + ')'; };
    const onLeave = (): void => { el.style.transform = 'scale(1)'; };
    const onMove = (e: PointerEvent): void => {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = 'scale(' + scale + ') rotateX(' + (-py * 18) + 'deg) rotateY(' + (px * 18) + 'deg)';
    };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      el.style.transform = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, [scale]);

  return (
    <div
      ref={stageRef}
      className={\`relative flex h-56 w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 [perspective:600px] dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <span
        ref={textRef}
        className="text-5xl font-bold tracking-tight text-gray-900 will-change-transform transition-transform duration-200 ease-out motion-reduce:transform-none dark:text-gray-100"
      >
        {text}
      </span>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cursor-image-peek',
    category: 'cursors',
    tags: ['cursor', 'peek', 'preview', 'hover', 'list'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 486, copies: 127, downloads: 30 },
    props: [
      { name: 'items', type: 'PeekItem[]', default: '(4 sample links)', descriptionKey: 'items' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Hovering a link floats a thumbnail that follows the pointer. Visibility flips
  on enter/leave (cheap); position is a transform written on pointermove. The
  peek is aria-hidden - it is a visual flourish, and each link already names its
  destination.
-->
<div id="cursor-peek-stage" class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
  <ul class="divide-y divide-gray-200 dark:divide-gray-800">
    <li><a href="#" data-grad="linear-gradient(135deg,#6366f1,#ec4899)" class="cursor-peek-link block rounded-md px-3 py-3 text-sm font-medium text-gray-800 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800">Aurora Report 2026</a></li>
    <li><a href="#" data-grad="linear-gradient(135deg,#06b6d4,#3b82f6)" class="cursor-peek-link block rounded-md px-3 py-3 text-sm font-medium text-gray-800 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800">Field Notes</a></li>
    <li><a href="#" data-grad="linear-gradient(135deg,#f59e0b,#ef4444)" class="cursor-peek-link block rounded-md px-3 py-3 text-sm font-medium text-gray-800 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800">Case Study: Northwind</a></li>
    <li><a href="#" data-grad="linear-gradient(135deg,#10b981,#14b8a6)" class="cursor-peek-link block rounded-md px-3 py-3 text-sm font-medium text-gray-800 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800">Changelog</a></li>
  </ul>
  <div id="cursor-peek" class="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150" aria-hidden="true">
    <div id="cursor-peek-img" class="h-24 w-32 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/20 shadow-lg"></div>
  </div>
</div>

<script>
  (() => {
    const stage = document.getElementById('cursor-peek-stage');
    const peek = document.getElementById('cursor-peek');
    const img = document.getElementById('cursor-peek-img');
    if (!stage || !peek || !img || !matchMedia('(pointer: fine)').matches) return;
    let rect = stage.getBoundingClientRect();
    stage.addEventListener('pointerenter', () => { rect = stage.getBoundingClientRect(); });
    stage.addEventListener('pointermove', (e) => {
      peek.style.transform = 'translate3d(' + (e.clientX - rect.left) + 'px,' + (e.clientY - rect.top) + 'px,0)';
    });
    stage.querySelectorAll('.cursor-peek-link').forEach((a) => {
      a.addEventListener('pointerenter', () => { img.style.backgroundImage = a.dataset.grad; peek.style.opacity = '1'; });
      a.addEventListener('pointerleave', () => { peek.style.opacity = '0'; });
    });
  })();
</script>`,
      react: `import { useEffect, useRef, useState } from 'react';

const SAMPLE_ITEMS = [
  { label: 'Aurora Report 2026', href: '#', gradient: 'linear-gradient(135deg,#6366f1,#ec4899)' },
  { label: 'Field Notes', href: '#', gradient: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
  { label: 'Case Study: Northwind', href: '#', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { label: 'Changelog', href: '#', gradient: 'linear-gradient(135deg,#10b981,#14b8a6)' },
];

export function CursorImagePeek({ items = SAMPLE_ITEMS, className = '' }) {
  const stageRef = useRef(null);
  const peekRef = useRef(null);
  // Which item is active drives the thumbnail; it changes on enter/leave only,
  // never per move, so the re-render cost is negligible.
  const [active, setActive] = useState(null);

  useEffect(() => {
    const stage = stageRef.current;
    const peek = peekRef.current;
    if (!stage || !peek) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = stage.getBoundingClientRect();
    const onEnter = () => { rect = stage.getBoundingClientRect(); };
    const onMove = (e) => {
      peek.style.transform = 'translate3d(' + (e.clientX - rect.left) + 'px,' + (e.clientY - rect.top) + 'px,0)';
    };
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {items.map((it, i) => (
          <li key={it.label}>
            <a
              href={it.href}
              className="block rounded-md px-3 py-3 text-sm font-medium text-gray-800 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
      <div
        ref={peekRef}
        className={\`pointer-events-none absolute left-0 top-0 transition-opacity duration-150 \${active === null ? 'opacity-0' : 'opacity-100'}\`}
        aria-hidden="true"
      >
        <div
          className="h-24 w-32 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/20 shadow-lg"
          style={active === null ? undefined : { backgroundImage: items[active].gradient }}
        />
      </div>
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef, useState } from 'react';

export interface PeekItem {
  label: string;
  href: string;
  /** Any CSS background-image; a gradient stands in for a real thumbnail. */
  gradient: string;
}

export interface CursorImagePeekProps {
  items?: PeekItem[];
  className?: string;
}

const SAMPLE_ITEMS: PeekItem[] = [
  { label: 'Aurora Report 2026', href: '#', gradient: 'linear-gradient(135deg,#6366f1,#ec4899)' },
  { label: 'Field Notes', href: '#', gradient: 'linear-gradient(135deg,#06b6d4,#3b82f6)' },
  { label: 'Case Study: Northwind', href: '#', gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
  { label: 'Changelog', href: '#', gradient: 'linear-gradient(135deg,#10b981,#14b8a6)' },
];

export function CursorImagePeek({ items = SAMPLE_ITEMS, className = '' }: CursorImagePeekProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const peekRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const peek = peekRef.current;
    if (!stage || !peek) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = stage.getBoundingClientRect();
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); };
    const onMove = (e: PointerEvent): void => {
      peek.style.transform = 'translate3d(' + (e.clientX - rect.left) + 'px,' + (e.clientY - rect.top) + 'px,0)';
    };
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <ul className="divide-y divide-gray-200 dark:divide-gray-800">
        {items.map((it, i) => (
          <li key={it.label}>
            <a
              href={it.href}
              className="block rounded-md px-3 py-3 text-sm font-medium text-gray-800 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-gray-100 dark:hover:bg-gray-800"
              onPointerEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onPointerLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
            >
              {it.label}
            </a>
          </li>
        ))}
      </ul>
      <div
        ref={peekRef}
        className={\`pointer-events-none absolute left-0 top-0 transition-opacity duration-150 \${active === null ? 'opacity-0' : 'opacity-100'}\`}
        aria-hidden="true"
      >
        <div
          className="h-24 w-32 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-lg border border-white/20 shadow-lg"
          style={active === null ? undefined : { backgroundImage: items[active].gradient }}
        />
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cursor-gradient-blob-follow',
    category: 'cursors',
    tags: ['cursor', 'gradient', 'blob', 'blur', 'follower'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 559, copies: 148, downloads: 37 },
    props: [
      { name: 'heading', type: 'string', default: "'Follow the light'", descriptionKey: 'heading' },
      { name: 'copy', type: 'string', default: "'A soft gradient blob eases after your pointer.'", descriptionKey: 'copy' },
      { name: 'ease', type: 'number', default: '0.12', descriptionKey: 'ease' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  A blurred radial blob sits behind the content and eases after the pointer in
  rAF. The drift is decoration, so reduced motion parks the blob in the centre
  and attaches no listeners.
-->
<div id="cursor-blob-stage" class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
  <div id="cursor-blob" class="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.7),transparent_70%)] blur-2xl" aria-hidden="true"></div>
  <div class="relative flex h-56 flex-col items-center justify-center gap-2 px-6 text-center">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Follow the light</h3>
    <p class="max-w-xs text-sm text-gray-600 dark:text-gray-400">A soft gradient blob eases after your pointer.</p>
  </div>
</div>

<script>
  (() => {
    const stage = document.getElementById('cursor-blob-stage');
    const blob = document.getElementById('cursor-blob');
    if (!stage || !blob || !matchMedia('(pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let rect = stage.getBoundingClientRect();
    let tx = rect.width / 2, ty = rect.height / 2, cx = tx, cy = ty, raf = 0;
    blob.style.left = '0'; blob.style.top = '0';
    const loop = () => {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      blob.style.transform = 'translate3d(' + (cx - 64) + 'px,' + (cy - 64) + 'px,0)';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    stage.addEventListener('pointerenter', () => { rect = stage.getBoundingClientRect(); });
    stage.addEventListener('pointermove', (e) => { tx = e.clientX - rect.left; ty = e.clientY - rect.top; });
    stage.addEventListener('pointerleave', () => { tx = rect.width / 2; ty = rect.height / 2; });
  })();
</script>`,
      react: `import { useEffect, useRef } from 'react';

export function CursorGradientBlobFollow({
  heading = 'Follow the light',
  copy = 'A soft gradient blob eases after your pointer.',
  ease = 0.12,
  className = '',
}) {
  const stageRef = useRef(null);
  const blobRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const blob = blobRef.current;
    if (!stage || !blob) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    // The drift is decoration; reduced motion leaves the blob centred.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rect = stage.getBoundingClientRect();
    let tx = rect.width / 2, ty = rect.height / 2, cx = tx, cy = ty, raf = 0;
    // The blob is 128px; -64 recentres it on the target point.
    blob.style.left = '0'; blob.style.top = '0';
    const loop = () => {
      cx += (tx - cx) * ease; cy += (ty - cy) * ease;
      blob.style.transform = 'translate3d(' + (cx - 64) + 'px,' + (cy - 64) + 'px,0)';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onEnter = () => { rect = stage.getBoundingClientRect(); };
    const onMove = (e) => { tx = e.clientX - rect.left; ty = e.clientY - rect.top; };
    const onLeave = () => { tx = rect.width / 2; ty = rect.height / 2; };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [ease]);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 \${className}\`}
    >
      <div
        ref={blobRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.7),transparent_70%)] blur-2xl"
        aria-hidden="true"
      />
      <div className="relative flex h-56 flex-col items-center justify-center gap-2 px-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{heading}</h3>
        <p className="max-w-xs text-sm text-gray-600 dark:text-gray-400">{copy}</p>
      </div>
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef } from 'react';

export interface CursorGradientBlobFollowProps {
  heading?: string;
  copy?: string;
  /** 0..1 lerp factor per frame. */
  ease?: number;
  className?: string;
}

export function CursorGradientBlobFollow({
  heading = 'Follow the light',
  copy = 'A soft gradient blob eases after your pointer.',
  ease = 0.12,
  className = '',
}: CursorGradientBlobFollowProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const blob = blobRef.current;
    if (!stage || !blob) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rect = stage.getBoundingClientRect();
    let tx = rect.width / 2, ty = rect.height / 2, cx = tx, cy = ty, raf = 0;
    blob.style.left = '0'; blob.style.top = '0';
    const loop = (): void => {
      cx += (tx - cx) * ease; cy += (ty - cy) * ease;
      blob.style.transform = 'translate3d(' + (cx - 64) + 'px,' + (cy - 64) + 'px,0)';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); };
    const onMove = (e: PointerEvent): void => { tx = e.clientX - rect.left; ty = e.clientY - rect.top; };
    const onLeave = (): void => { tx = rect.width / 2; ty = rect.height / 2; };

    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [ease]);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 \${className}\`}
    >
      <div
        ref={blobRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.7),transparent_70%)] blur-2xl"
        aria-hidden="true"
      />
      <div className="relative flex h-56 flex-col items-center justify-center gap-2 px-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{heading}</h3>
        <p className="max-w-xs text-sm text-gray-600 dark:text-gray-400">{copy}</p>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cursor-crosshair-precision',
    category: 'cursors',
    tags: ['cursor', 'crosshair', 'coordinates', 'precision', 'guides'],
    difficulty: 'intermediate',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 401, copies: 104, downloads: 25 },
    props: [
      { name: 'hint', type: 'string', default: "'Precision crosshair with live coordinates'", descriptionKey: 'hint' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  Two 1px guides track the pointer via transform (translateX on the vertical,
  translateY on the horizontal) and a chip prints the local coordinates. The
  guides move 1:1 with the hand, so no reduced-motion opt-out is needed.
-->
<div id="cursor-cross-stage" class="relative h-56 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
  <div class="flex h-full items-center justify-center px-6 text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">Precision crosshair with live coordinates</p>
  </div>
  <div id="cursor-cross" class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150" aria-hidden="true">
    <div id="cursor-cross-v" class="absolute inset-y-0 left-0 w-px bg-blue-500/70 dark:bg-blue-400/70"></div>
    <div id="cursor-cross-h" class="absolute inset-x-0 top-0 h-px bg-blue-500/70 dark:bg-blue-400/70"></div>
    <div id="cursor-cross-label" class="absolute left-0 top-0 ml-2 mt-2 rounded bg-gray-900 px-1.5 py-0.5 font-mono text-[10px] text-white">0, 0</div>
  </div>
</div>

<script>
  (() => {
    const stage = document.getElementById('cursor-cross-stage');
    const wrap = document.getElementById('cursor-cross');
    const v = document.getElementById('cursor-cross-v');
    const h = document.getElementById('cursor-cross-h');
    const label = document.getElementById('cursor-cross-label');
    if (!stage || !wrap || !v || !h || !label || !matchMedia('(pointer: fine)').matches) return;
    let rect = stage.getBoundingClientRect();
    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', () => { rect = stage.getBoundingClientRect(); wrap.style.opacity = '1'; });
    stage.addEventListener('pointerleave', () => { wrap.style.opacity = '0'; });
    stage.addEventListener('pointermove', (e) => {
      const x = Math.round(e.clientX - rect.left), y = Math.round(e.clientY - rect.top);
      v.style.transform = 'translateX(' + x + 'px)';
      h.style.transform = 'translateY(' + y + 'px)';
      label.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      label.textContent = x + ', ' + y;
    });
  })();
</script>`,
      react: `import { useEffect, useRef } from 'react';

export function CursorCrosshairPrecision({
  hint = 'Precision crosshair with live coordinates',
  className = '',
}) {
  const stageRef = useRef(null);
  const wrapRef = useRef(null);
  const vRef = useRef(null);
  const hRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    const v = vRef.current;
    const h = hRef.current;
    const label = labelRef.current;
    if (!stage || !wrap || !v || !h || !label) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = stage.getBoundingClientRect();
    const onEnter = () => { rect = stage.getBoundingClientRect(); wrap.style.opacity = '1'; };
    const onLeave = () => { wrap.style.opacity = '0'; };
    const onMove = (e) => {
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      v.style.transform = 'translateX(' + x + 'px)';
      h.style.transform = 'translateY(' + y + 'px)';
      label.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      label.textContent = x + ', ' + y;
    };

    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.style.cursor = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={\`relative h-56 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div ref={wrapRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150" aria-hidden="true">
        <div ref={vRef} className="absolute inset-y-0 left-0 w-px bg-blue-500/70 dark:bg-blue-400/70" />
        <div ref={hRef} className="absolute inset-x-0 top-0 h-px bg-blue-500/70 dark:bg-blue-400/70" />
        <div ref={labelRef} className="absolute left-0 top-0 ml-2 mt-2 rounded bg-gray-900 px-1.5 py-0.5 font-mono text-[10px] text-white">0, 0</div>
      </div>
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef } from 'react';

export interface CursorCrosshairPrecisionProps {
  hint?: string;
  className?: string;
}

export function CursorCrosshairPrecision({
  hint = 'Precision crosshair with live coordinates',
  className = '',
}: CursorCrosshairPrecisionProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLDivElement>(null);
  const hRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const wrap = wrapRef.current;
    const v = vRef.current;
    const h = hRef.current;
    const label = labelRef.current;
    if (!stage || !wrap || !v || !h || !label) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let rect = stage.getBoundingClientRect();
    const onEnter = (): void => { rect = stage.getBoundingClientRect(); wrap.style.opacity = '1'; };
    const onLeave = (): void => { wrap.style.opacity = '0'; };
    const onMove = (e: PointerEvent): void => {
      const x = Math.round(e.clientX - rect.left);
      const y = Math.round(e.clientY - rect.top);
      v.style.transform = 'translateX(' + x + 'px)';
      h.style.transform = 'translateY(' + y + 'px)';
      label.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
      label.textContent = x + ', ' + y;
    };

    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.style.cursor = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={\`relative h-56 w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div ref={wrapRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150" aria-hidden="true">
        <div ref={vRef} className="absolute inset-y-0 left-0 w-px bg-blue-500/70 dark:bg-blue-400/70" />
        <div ref={hRef} className="absolute inset-x-0 top-0 h-px bg-blue-500/70 dark:bg-blue-400/70" />
        <div ref={labelRef} className="absolute left-0 top-0 ml-2 mt-2 rounded bg-gray-900 px-1.5 py-0.5 font-mono text-[10px] text-white">0, 0</div>
      </div>
    </div>
  );
}`,
    },
  },
  {
    slug: 'cursor-custom-svg',
    category: 'cursors',
    tags: ['cursor', 'svg', 'custom', 'rotate', 'pointer'],
    difficulty: 'beginner',
    author: 'ADYSRE',
    createdAt: '2026-07-17',
    updatedAt: '2026-07-17',
    license: 'MIT',
    version: '1.0.0',
    stats: { views: 468, copies: 132, downloads: 33 },
    props: [
      { name: 'hint', type: 'string', default: "'A custom SVG pointer that leans into your motion'", descriptionKey: 'hint' },
      { name: 'className', type: 'string', descriptionKey: 'className' },
    ],
    code: {
      tailwind: `<!--
  An inline SVG replaces the native cursor and tilts toward the direction of
  travel. cursor:none is set by the script so the panel keeps a real cursor if
  JS never runs; the tilt is decoration, so reduced motion skips the rotation
  and the arrow simply follows.
-->
<div id="cursor-svg-stage" class="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
  <div class="flex h-56 items-center justify-center px-6 text-center">
    <p class="text-sm text-gray-600 dark:text-gray-400">A custom SVG pointer that leans into your motion</p>
  </div>
  <div id="cursor-svg" class="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150" aria-hidden="true">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" class="drop-shadow">
      <path d="M4 2 L20 12 L12 13 L9 21 Z" fill="#2563eb" stroke="#fff" stroke-width="1.5" stroke-linejoin="round" />
    </svg>
  </div>
</div>

<script>
  (() => {
    const stage = document.getElementById('cursor-svg-stage');
    const cur = document.getElementById('cursor-svg');
    if (!stage || !cur || !matchMedia('(pointer: fine)').matches) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let rect = stage.getBoundingClientRect();
    let lx = 0, ly = 0, angle = 0;
    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', (e) => {
      rect = stage.getBoundingClientRect();
      lx = e.clientX - rect.left; ly = e.clientY - rect.top; cur.style.opacity = '1';
    });
    stage.addEventListener('pointerleave', () => { cur.style.opacity = '0'; });
    stage.addEventListener('pointermove', (e) => {
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (!reduce) {
        const dx = x - lx, dy = y - ly;
        if (dx * dx + dy * dy > 4) angle = Math.atan2(dy, dx) * 180 / Math.PI - 45;
      }
      cur.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) rotate(' + angle + 'deg)';
      lx = x; ly = y;
    });
  })();
</script>`,
      react: `import { useEffect, useRef } from 'react';

export function CursorCustomSvg({
  hint = 'A custom SVG pointer that leans into your motion',
  className = '',
}) {
  const stageRef = useRef(null);
  const curRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const cur = curRef.current;
    if (!stage || !cur) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    // The rotation is decoration; reduced motion keeps the arrow upright.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rect = stage.getBoundingClientRect();
    let lx = 0, ly = 0, angle = 0;
    const onEnter = (e) => {
      rect = stage.getBoundingClientRect();
      lx = e.clientX - rect.left; ly = e.clientY - rect.top; cur.style.opacity = '1';
    };
    const onLeave = () => { cur.style.opacity = '0'; };
    const onMove = (e) => {
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (!reduce) {
        const dx = x - lx, dy = y - ly;
        // Ignore sub-pixel jitter so the arrow does not spin when nearly still.
        if (dx * dx + dy * dy > 4) angle = Math.atan2(dy, dx) * 180 / Math.PI - 45;
      }
      cur.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) rotate(' + angle + 'deg)';
      lx = x; ly = y;
    };

    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.style.cursor = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex h-56 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div ref={curRef} className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="drop-shadow">
          <path d="M4 2 L20 12 L12 13 L9 21 Z" fill="#2563eb" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}`,
      typescript: `'use client';

import { useEffect, useRef } from 'react';

export interface CursorCustomSvgProps {
  hint?: string;
  className?: string;
}

export function CursorCustomSvg({
  hint = 'A custom SVG pointer that leans into your motion',
  className = '',
}: CursorCustomSvgProps): JSX.Element {
  const stageRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const cur = curRef.current;
    if (!stage || !cur) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rect = stage.getBoundingClientRect();
    let lx = 0, ly = 0, angle = 0;
    const onEnter = (e: PointerEvent): void => {
      rect = stage.getBoundingClientRect();
      lx = e.clientX - rect.left; ly = e.clientY - rect.top; cur.style.opacity = '1';
    };
    const onLeave = (): void => { cur.style.opacity = '0'; };
    const onMove = (e: PointerEvent): void => {
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (!reduce) {
        const dx = x - lx, dy = y - ly;
        if (dx * dx + dy * dy > 4) angle = Math.atan2(dy, dx) * 180 / Math.PI - 45;
      }
      cur.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) rotate(' + angle + 'deg)';
      lx = x; ly = y;
    };

    stage.style.cursor = 'none';
    stage.addEventListener('pointerenter', onEnter);
    stage.addEventListener('pointerleave', onLeave);
    stage.addEventListener('pointermove', onMove);
    return () => {
      stage.style.cursor = '';
      stage.removeEventListener('pointerenter', onEnter);
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className={\`relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900 \${className}\`}
    >
      <div className="flex h-56 items-center justify-center px-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">{hint}</p>
      </div>
      <div ref={curRef} className="pointer-events-none absolute left-0 top-0 opacity-0 transition-opacity duration-150" aria-hidden="true">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="drop-shadow">
          <path d="M4 2 L20 12 L12 13 L9 21 Z" fill="#2563eb" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}`,
    },
  },
];
