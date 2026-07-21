'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { TextSpec } from '@/lib/design-playground/types';

/** The node being edited, resolved to absolute canvas space by the workspace. */
export interface TextEditTarget {
  id: string;
  /** Absolute canvas-space box of the node. */
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  spec: TextSpec;
  /** The node's own fill; `null` means "no paint", so fall back to the theme. */
  color: string | null;
  /** True for a node the text tool just created: typing replaces the placeholder. */
  selectAll: boolean;
}

interface TextEditorOverlayProps {
  target: TextEditTarget;
  /** Top-left of the view, in canvas coordinates - same value the stage uses. */
  viewport: { x: number; y: number };
  zoom: number;
  /**
   * Called exactly once, when the session ends. `height` is the measured height
   * of the typed content in canvas units.
   */
  onCommit: (id: string, value: string, height: number) => void;
}

/**
 * Type directly on the canvas.
 *
 * A DOM `<textarea>` laid over the Konva text node, rather than a Konva-native
 * caret: the browser already owns text input, IME composition, selection and
 * accessibility, and reimplementing any of it on a canvas is how editors get
 * this wrong. The Konva node is hidden for the duration (see `CanvasStage`), so
 * only one of the two is ever visible.
 *
 * The session commits ONCE - on blur, or on Escape (which blurs). Every
 * keystroke dispatching a command would flood the undo stack with one entry per
 * character; `Enter` therefore inserts a newline, because this is content, not a
 * form field.
 *
 * Nothing here animates, so there is no `prefers-reduced-motion` branch to make:
 * the overlay appears and disappears with the edit session.
 */
export function TextEditorOverlay({ target, viewport, zoom, onCommit }: TextEditorOverlayProps) {
  const t = useTranslations('designPlayground');
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(target.spec.text);
  // Blur can fire after Escape has already committed (Escape blurs on purpose),
  // and React may run the handler during unmount; one latch keeps it to one
  // command per session.
  const committed = useRef(false);
  /** Lets the outside-press listener call the latest `commit` without
   * re-subscribing on every keystroke. */
  const commitRef = useRef<() => void>(() => {});

  const { spec } = target;
  const fontSize = spec.fontSize * zoom;
  const lineHeight = spec.fontSize * spec.lineHeight * zoom;

  // Focus as soon as the overlay exists, so the user can simply start typing.
  // A freshly created node arrives with its placeholder selected, so the first
  // keystroke replaces "Text" instead of appending to it.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.focus({ preventScroll: true });
    if (target.selectAll) element.select();
    else element.setSelectionRange(element.value.length, element.value.length);
  }, [target.id, target.selectAll]);

  // Grow the field to fit what has been typed, so the text never scrolls out of
  // view mid-sentence. Driven imperatively because the natural height is only
  // knowable after layout, and `scrollHeight` is only honest once the element
  // has been collapsed first.
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = '0px';
    element.style.height = `${Math.max(element.scrollHeight, target.height * zoom)}px`;
  }, [value, target.height, zoom, fontSize, lineHeight]);

  // Commit when the press lands anywhere outside the field.
  //
  // Blur alone is not enough: the Konva stage calls `preventDefault` on its
  // pointer events, so clicking the canvas never moves focus and the session
  // would stay open with the caret still in the text - the user clicks away,
  // nothing commits, and the edit looks lost.
  useEffect(() => {
    const onPointerDown = (event: PointerEvent): void => {
      if (ref.current?.contains(event.target as globalThis.Node)) return;
      commitRef.current();
    };
    // Capture phase, so it runs before the stage handler that starts a new
    // draw or selection with the same press.
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, []);

  const commit = useCallback((): void => {
    if (committed.current) return;
    committed.current = true;
    const element = ref.current;
    // scrollHeight is in CSS pixels; the model stores canvas units.
    const measured = element ? element.scrollHeight / zoom : target.height;
    onCommit(target.id, value, Math.max(1, Math.round(measured)));
  }, [onCommit, target.height, target.id, value, zoom]);

  commitRef.current = commit;

  return (
    <textarea
      ref={ref}
      aria-label={t('canvas.editText')}
      value={value}
      spellCheck={false}
      onChange={(event) => setValue(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        // The canvas shortcut handler ignores events whose target is a field, so
        // 'r' types an r here rather than arming the rectangle tool. Stopping
        // propagation as well keeps that true for any future ancestor handler.
        event.stopPropagation();
        if (event.key === 'Escape') {
          event.preventDefault();
          // Blur rather than commit directly: it ends the session the same way a
          // click away does, through a single path.
          ref.current?.blur();
        }
      }}
      // Pointer events must not reach the stage underneath, or clicking to place
      // the caret would also start a marquee drag.
      onPointerDown={(event) => event.stopPropagation()}
      onWheel={(event) => event.stopPropagation()}
      className="absolute z-10 m-0 resize-none overflow-hidden border-0 bg-transparent p-0 outline-none ring-2 ring-ring"
      style={{
        // Geometry and typography are USER DATA (the node's transform and text
        // spec) mapped through the live viewport - continuous values that no
        // utility class can express, and that must match the Konva render
        // exactly or the text visibly jumps when editing starts.
        left: (target.x + viewport.x) * zoom,
        top: (target.y + viewport.y) * zoom,
        width: target.width * zoom,
        transform: `rotate(${target.rotation}deg)`,
        transformOrigin: 'top left',
        fontFamily: spec.fontFamily,
        fontSize,
        fontWeight: spec.fontWeight,
        lineHeight: `${lineHeight}px`,
        letterSpacing: `${spec.letterSpacing * zoom}px`,
        textAlign: spec.align,
        color: target.color ?? 'currentColor',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
      }}
    />
  );
}
