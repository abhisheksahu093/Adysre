'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from 'adysre';
import { CANVAS_LINKS, CANVAS_MOTION } from '@/config/canvas-motion';

/** Reads a length token off the canvas, so JS measures the grid CSS actually drew. */
function readLength(styles: CSSStyleDeclaration, name: string): number {
  return Number.parseFloat(styles.getPropertyValue(name)) || 0;
}

/**
 * How far the drift has carried the field, in px, read back off its transform.
 *
 * The drift is a composited transform rather than a custom property, which is
 * what keeps it off the main thread; the cost is that its current value is a
 * matrix rather than a length. `none` is what an element reports before its
 * animation has produced a first frame, and both axes carry the same distance
 * by construction, so one number describes the whole field.
 */
function readDrift(styles: CSSStyleDeclaration): number {
  const transform = styles.transform;
  if (!transform || transform === 'none') return 0;
  try {
    return new DOMMatrixReadOnly(transform).m41;
  } catch {
    return 0;
  }
}

/**
 * The four edges drawn from each dot, as `[stepX, stepY, unitX, unitY]`.
 *
 * Steps are in tiles; the unit vector is the same edge normalised, which is what
 * the direction of travel is compared against - without it a diagonal would
 * score half again as aligned as a straight edge pointing the same way.
 */
const DIAGONAL = Math.SQRT1_2;
const LINKS = [
  [1, 0, 1, 0],
  [0, 1, 0, 1],
  [1, 1, DIAGONAL, DIAGONAL],
  [1, -1, DIAGONAL, -DIAGONAL],
] as const;

/**
 * The work surface the whole home page rests on.
 *
 * One canvas from the announcement bar to the footer: the dot grid is the page,
 * and every section is a panel floating over it. The surface itself is drawn in
 * CSS - a static wash on this element (`.canvas-wash`) and the drifting dot
 * field on a layer of its own (`.canvas-field`) - and this component adds the
 * two things that need the browser, both driven by the pointer.
 *
 * First, weight: a pointer move pushes the field the way it travelled, friction
 * bleeds the push off and a spring returns the field to rest, so the grid reads
 * as something being nudged rather than a layer glued to the cursor.
 *
 * Second, the mesh: a `<canvas>` behind the content wires up the dots around the
 * pointer, brightest along the line the hand is travelling, and lets the links
 * fade once it stops. It reads the same grid tokens the CSS uses and the live
 * value of the drift, so the links land exactly on the dots rather than on a
 * second grid that happens to look similar.
 *
 * Neither loop holds React state or re-renders; both stop themselves when the
 * page is still, so an untouched page costs nothing. `children` arrives already
 * rendered from the page, so every section under it stays a Server Component.
 */
export function WorkbenchCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const meshRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const surface = ref.current;
    const mesh = meshRef.current;
    const field = fieldRef.current;
    const drift = driftRef.current;
    if (!surface || !mesh || !field || !drift) return;

    const context = mesh.getContext('2d');
    if (!context) return;

    const { maxShift, push, friction, pull, rest } = CANVAS_MOTION;
    const {
      reach,
      peakOpacity,
      peakWidth,
      directionBias,
      directionFocus,
      fullChargeSpeed,
      decay,
      faint,
    } = CANVAS_LINKS;
    const stillness = window.matchMedia('(prefers-reduced-motion: reduce)');

    let shiftX = 0;
    let shiftY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let pointerX: number | null = null;
    let pointerY: number | null = null;
    // Where the mesh is centred, and how strongly it is lit. Charge rises with
    // pointer speed and decays on its own, which is what makes the links trail
    // the cursor instead of appearing and vanishing with it.
    let meshX = 0;
    let meshY = 0;
    let charge = 0;
    let frame = 0;
    let ratio = 1;

    const clamp = (value: number) => Math.min(maxShift, Math.max(-maxShift, value));

    // The push is written on the field itself, not on the surface. The field is
    // the element the transform is on, and it has no children, so a value that
    // changes with every pointer move has one element's style to invalidate
    // rather than the page's.
    const write = () => {
      field.style.setProperty('--grid-shift-x', `${shiftX.toFixed(2)}px`);
      field.style.setProperty('--grid-shift-y', `${shiftY.toFixed(2)}px`);
    };

    const resize = () => {
      ratio = Math.min(2, window.devicePixelRatio || 1);
      mesh.width = Math.round(window.innerWidth * ratio);
      mesh.height = Math.round(window.innerHeight * ratio);
      mesh.style.width = `${window.innerWidth}px`;
      mesh.style.height = `${window.innerHeight}px`;
    };

    const clear = () => context.clearRect(0, 0, mesh.width, mesh.height);

    const drawMesh = () => {
      clear();
      if (charge < faint) return;

      // The grid as CSS currently has it: tile, dot radius, and how far the
      // pattern has drifted and been dragged. Read off the drifting layer, which
      // is the element the animation is on, and read live so the mesh cannot
      // fall out of step with the dots it is drawing between.
      const styles = getComputedStyle(drift);
      const tile = readLength(styles, '--grid-tile');
      const dot = readLength(styles, '--grid-dot-size');
      if (tile <= 0) return;

      // Both the field and the mesh are fixed to the viewport now, so there is
      // no scroll offset between them to correct for.
      const carried = readDrift(styles);
      const originX = carried + shiftX + dot;
      const originY = carried + shiftY + dot;

      const speed = Math.hypot(velocityX, velocityY);
      const directionX = speed > 0 ? velocityX / speed : 0;
      const directionY = speed > 0 ? velocityY / speed : 0;
      const directed = directionX !== 0 || directionY !== 0;

      const first = (origin: number, edge: number) => Math.ceil((edge - origin) / tile);
      const last = (origin: number, edge: number) => Math.floor((edge - origin) / tile);
      const columns = { from: first(originX, meshX - reach), to: last(originX, meshX + reach) };
      const rows = { from: first(originY, meshY - reach), to: last(originY, meshY + reach) };

      context.save();
      context.scale(ratio, ratio);
      context.strokeStyle = styles.getPropertyValue('--signal').trim() || 'currentColor';
      context.lineCap = 'round';

      for (let column = columns.from; column <= columns.to; column += 1) {
        for (let row = rows.from; row <= rows.to; row += 1) {
          const x = originX + column * tile;
          const y = originY + row * tile;

          // East, south and both diagonals: four of the eight edges around a
          // dot, which draws every edge in the mesh exactly once.
          for (const [stepX, stepY, unitX, unitY] of LINKS) {
            const toX = x + stepX * tile;
            const toY = y + stepY * tile;
            const distance = Math.hypot((x + toX) / 2 - meshX, (y + toY) / 2 - meshY);
            if (distance > reach) continue;

            const nearness = 1 - distance / reach;
            // Alignment is |cos| between the link and the travel, so a link is
            // just as lit whichever way the hand crossed it. Raising it to a
            // power narrows the beam without dimming the links dead on it.
            const alignment = directed
              ? Math.abs(unitX * directionX + unitY * directionY) ** directionFocus
              : 1;
            const strength = 1 - directionBias + directionBias * alignment;
            const opacity = charge * nearness * nearness * strength * peakOpacity;
            if (opacity < faint) continue;

            context.globalAlpha = opacity;
            // Light alone would make the heading dim its surroundings; weight
            // lets it stand out while the rest of the mesh stays drawn.
            context.lineWidth = 1 + (peakWidth - 1) * strength;
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(toX, toY);
            context.stroke();
          }
        }
      }

      context.restore();
    };

    const step = () => {
      velocityX *= friction;
      velocityY *= friction;
      shiftX = clamp(shiftX + velocityX - shiftX * pull);
      shiftY = clamp(shiftY + velocityY - shiftY * pull);
      charge = Math.min(1, charge * decay + Math.hypot(velocityX, velocityY) / fullChargeSpeed);
      write();
      drawMesh();

      // Rest is both ends of the spring being spent and the mesh gone dark:
      // checking only one would freeze the field off-centre or leave links lit.
      const moving =
        Math.abs(velocityX) + Math.abs(velocityY) + Math.abs(shiftX) + Math.abs(shiftY) > rest ||
        charge > faint;
      frame = moving ? requestAnimationFrame(step) : 0;
      if (!moving) {
        shiftX = 0;
        shiftY = 0;
        charge = 0;
        write();
        clear();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      meshX = event.clientX;
      meshY = event.clientY;
      if (pointerX !== null && pointerY !== null) {
        velocityX += (event.clientX - pointerX) * push;
        velocityY += (event.clientY - pointerY) * push;
        if (!frame) frame = requestAnimationFrame(step);
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
    };

    // A pointer that left the window tells us nothing about where it re-enters:
    // without this the next move is measured from a stale point and the field
    // jumps the width of the gap.
    const onPointerOut = () => {
      pointerX = null;
      pointerY = null;
    };

    // A hidden tab stops serving animation frames, which would leave the mesh
    // frozen mid-fade until the pointer moves again. Coming back to a page
    // should not mean coming back to the last frame someone left behind.
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'hidden') return;
      onPointerOut();
      charge = 0;
      clear();
    };

    const listen = () => {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('resize', resize, { passive: true });
      document.addEventListener('pointerleave', onPointerOut);
      document.addEventListener('visibilitychange', onVisibilityChange);
      window.addEventListener('blur', onPointerOut);
    };

    const stop = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('pointerleave', onPointerOut);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onPointerOut);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      shiftX = 0;
      shiftY = 0;
      velocityX = 0;
      velocityY = 0;
      charge = 0;
      write();
      clear();
    };

    const onStillnessChange = () => {
      stop();
      if (!stillness.matches) listen();
    };

    resize();
    if (!stillness.matches) listen();
    stillness.addEventListener('change', onStillnessChange);

    return () => {
      stop();
      stillness.removeEventListener('change', onStillnessChange);
    };
  }, []);

  return (
    // `isolate` is what keeps the mesh in its place: it makes this element a
    // stacking context, so the canvas below can sit behind every panel on the
    // page and still be painted over the surface's own background.
    <div
      ref={ref}
      className={cn(
        'workbench-theme canvas-grid canvas-wash isolate min-h-screen bg-canvas font-display',
        className,
      )}
    >
      {/* The dot field: one layer for the pointer's push, one for the endless
          drift, so both are composited transforms rather than a repaint of the
          page. Fixed to the viewport, so the layer is a screen and not a
          document. */}
      <div ref={fieldRef} aria-hidden className="canvas-field canvas-field--viewport">
        <div ref={driftRef} className="canvas-field-drift" />
      </div>
      <canvas ref={meshRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10" />
      {children}
    </div>
  );
}
