'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PREVIEWS, type PreviewModule } from './registry';
import { decodePaletteParam, paletteToCssVars } from '@/lib/palettes/apply-to-preview';
import type {
  EditableField,
  EditableFieldKind,
  PreviewContentMessage,
  PreviewFieldsMessage,
} from '@/lib/playground/content';
import {
  SECTION_ATTR,
  sectionStyleCss,
  type PreviewStyleMessage,
  type SectionStyle,
} from '@/lib/playground/section-style';

/** A single editable spot in the rendered preview, plus how to rewrite it. */
interface EditableTarget {
  /** The original, trimmed text - the override key shared with the editor. */
  text: string;
  kind: EditableFieldKind;
  /** Apply an override value, or revert to the original when it's undefined. */
  apply: (value: string | undefined) => void;
}

const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH']);
const MAX_FIELDS = 60;
const MAX_LEN = 300;

/** Classify a text node by its nearest meaningful ancestor element. */
function kindOf(el: Element | null): EditableFieldKind {
  for (let n: Element | null = el; n; n = n.parentElement) {
    const tag = n.tagName;
    if (/^H[1-6]$/.test(tag)) return 'heading';
    if (tag === 'BUTTON' || tag === 'A' || n.getAttribute('role') === 'button') return 'button';
    if (tag === 'LABEL') return 'label';
    if (tag === 'P' || tag === 'LI' || tag === 'SPAN' || tag === 'DIV') return 'text';
  }
  return 'text';
}

/**
 * Read every editable string out of the rendered preview.
 *
 * The library's sections bake their sample text in, so the reliable source of
 * "what text is on screen" is the DOM itself - not the code string, where a
 * heading may be a `{title}` prop whose default lives elsewhere. We keep a
 * handle to each node so the same list can rewrite it in place.
 */
function collectTargets(root: HTMLElement): { targets: EditableTarget[]; fields: EditableField[] } {
  const targets: EditableTarget[] = [];

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      const parent = node.parentElement;
      if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
      const raw = node.textContent ?? '';
      const trimmed = raw.trim();
      if (trimmed.length === 0 || trimmed.length > MAX_LEN) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const textNode = node as Text;
    const raw = textNode.textContent ?? '';
    const trimmed = raw.trim();
    targets.push({
      text: trimmed,
      kind: kindOf(textNode.parentElement),
      // Preserve the node's surrounding whitespace by swapping only the trimmed
      // span; revert restores the exact original run. split/join (not replace)
      // so a `$` in the new text - e.g. a price - is taken literally.
      apply: (value) => {
        textNode.textContent = value === undefined ? raw : raw.split(trimmed).join(value);
      },
    });
  }

  // Editable attributes that carry visible copy: input placeholders.
  root.querySelectorAll('input, textarea').forEach((el) => {
    const input = el as HTMLInputElement | HTMLTextAreaElement;
    const placeholder = input.getAttribute('placeholder');
    if (placeholder && placeholder.trim() && placeholder.length <= MAX_LEN) {
      const original = placeholder;
      targets.push({
        text: placeholder.trim(),
        kind: 'placeholder',
        apply: (value) => input.setAttribute('placeholder', value ?? original),
      });
    }
  });

  // One field per distinct string (first occurrence wins its label); every
  // matching node still updates when that string is edited.
  const fields: EditableField[] = [];
  const seen = new Set<string>();
  for (const target of targets) {
    if (seen.has(target.text)) continue;
    seen.add(target.text);
    fields.push({ text: target.text, kind: target.kind });
    if (fields.length >= MAX_FIELDS) break;
  }

  return { targets, fields };
}

/**
 * Renders one live component, centred, inside the iframe document.
 *
 * Owns two bits of iframe-specific plumbing:
 *  - reads `?theme=` so the parent's per-preview toggle wins over whatever
 *    next-themes read from localStorage (the iframe shares the parent's origin
 *    and therefore its storage).
 *  - reports its content height to the parent via postMessage, so the iframe
 *    can size itself instead of guessing and clipping the component.
 */
export function PreviewStage({ slug, bleed = false }: { slug: string; bleed?: boolean }) {
  const [mod, setMod] = useState<PreviewModule | null>(null);
  /** Live handles to the rendered text, rebuilt whenever the component mounts. */
  const targetsRef = useRef<EditableTarget[]>([]);
  const overridesRef = useRef<Record<string, string>>({});
  /** The section styling the playground last sent, or `null` for none. */
  const [sectionStyle, setSectionStyle] = useState<SectionStyle | null>(null);

  useEffect(() => {
    const load = PREVIEWS[slug];
    if (!load) return;
    let alive = true;
    void load().then((m) => {
      if (alive) setMod(m);
    });
    return () => {
      alive = false;
    };
  }, [slug]);

  /**
   * Pin this preview to the theme the parent asked for.
   *
   * Two problems, one solution:
   *  1. The iframe is same-origin, so it shares the parent's localStorage.
   *     Calling next-themes' `setTheme` wrote the shared `theme` key and got
   *     broadcast - flipping one preview re-themed the whole app. So we never
   *     call it; we write the class ourselves.
   *  2. The root layout's ThemeProvider still lives in this document and
   *     re-applies the STORED theme after mount, overwriting us. Racing it with
   *     effect ordering is luck, so we observe the class and re-assert. The
   *     observer is the only thing that makes the forced theme authoritative.
   */
  useLayoutEffect(() => {
    const theme = new URLSearchParams(window.location.search).get('theme');
    if (theme !== 'dark' && theme !== 'light') return;

    const root = document.documentElement;
    const apply = () => {
      const wantDark = theme === 'dark';
      if (root.classList.contains('dark') === wantDark) return;
      root.classList.toggle('dark', wantDark);
      root.classList.toggle('light', !wantDark);
      root.style.colorScheme = theme;
    };

    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  /**
   * Apply the project palette (when the parent passes `?palette=`) by
   * overriding Tailwind's accent colour variables on this document. The library
   * components use raw palette utilities (`bg-blue-600`), so this recolours them
   * to the chosen palette without touching their markup.
   */
  useLayoutEffect(() => {
    const colors = decodePaletteParam(new URLSearchParams(window.location.search).get('palette'));
    if (colors.length === 0) return;
    const root = document.documentElement;
    const vars = paletteToCssVars(colors);
    for (const [name, value] of Object.entries(vars)) root.style.setProperty(name, value);
    return () => {
      for (const name of Object.keys(vars)) root.style.removeProperty(name);
    };
  }, []);

  /**
   * Content editing (playground only, gated by `?edit=1`).
   *
   * After the component paints, read its editable strings and report them to the
   * parent; listen for the parent's override map and rewrite the matching nodes
   * in place. The detail-page previews don't pass `edit=1`, so they pay nothing.
   */
  useEffect(() => {
    if (!mod) return;
    if (new URLSearchParams(window.location.search).get('edit') !== '1') return;

    const post = (): void => {
      const { targets, fields } = collectTargets(document.body);
      targetsRef.current = targets;
      for (const target of targets) target.apply(overridesRef.current[target.text]);
      const message: PreviewFieldsMessage = { type: 'adysre:preview-fields', slug, fields };
      window.parent.postMessage(message, window.location.origin);
    };
    // Collect after paint so prop-driven text is in the DOM before we read it.
    const raf = requestAnimationFrame(post);

    const onMessage = (event: MessageEvent): void => {
      if (event.origin !== window.location.origin) return;
      const data = event.data as PreviewContentMessage | PreviewStyleMessage | undefined;
      if (!data || data.slug !== slug) return;
      if (data.type === 'adysre:preview-style') {
        setSectionStyle(data.style);
        return;
      }
      if (data.type !== 'adysre:preview-content') return;
      overridesRef.current = data.overrides ?? {};
      for (const target of targetsRef.current) target.apply(overridesRef.current[target.text]);
    };
    window.addEventListener('message', onMessage);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('message', onMessage);
    };
  }, [mod, slug]);

  // Report height after the component mounts and whenever it reflows.
  useEffect(() => {
    if (!mod) return;
    const send = () =>
      window.parent.postMessage(
        { type: 'adysre:preview-height', slug, height: document.body.scrollHeight },
        window.location.origin,
      );
    send();
    const ro = new ResizeObserver(send);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, [mod, slug]);

  if (!mod) {
    // Matches the stage padding so the iframe doesn't jump on load.
    return <div className="min-h-48" aria-hidden />;
  }

  const { Component } = mod;
  // The playground's per-section styling, as real CSS scoped to this wrapper.
  // A stylesheet rather than an inline style because the text colour has to
  // reach the section's own children, which carry their own colour utilities -
  // and it is the exact CSS the export writes, so preview and download agree.
  const styleCss = sectionStyle ? sectionStyleCss(`[${SECTION_ATTR}]`, sectionStyle) : '';

  // A page section brings its own padding and spans the frame; anything smaller
  // gets the padded, centred stage it was authored for.
  return (
    <div
      {...{ [SECTION_ATTR]: '' }}
      className={
        bleed
          ? 'w-full bg-background'
          : 'flex min-h-48 w-full items-center justify-center bg-background p-6'
      }
    >
      {/* Our own generated CSS - colours and lengths from the style editor,
          never user-authored markup. */}
      {styleCss && <style dangerouslySetInnerHTML={{ __html: styleCss }} />}
      <Component />
    </div>
  );
}
