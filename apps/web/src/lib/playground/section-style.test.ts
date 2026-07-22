import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  SECTION_ATTR,
  hasSectionStyle,
  pageSectionStylesCss,
  sectionStyleCss,
  sectionStyleEditCount,
  sectionStyleToInline,
  type SectionStyle,
} from './section-style';
import type { Gradient } from '@/data/gradients';
import type { Pattern } from '@/data/patterns';

/**
 * The styling a user sets in the playground has to survive three trips: into
 * the live preview, into the exported stylesheet, and back out of persisted
 * state. These cover the parts they would notice breaking - a background that
 * doesn't render, a text colour the section's own utilities beat, or a
 * stylesheet that names sections the page never wrapped.
 */

const gradient: Gradient = {
  id: 'g1',
  name: 'Dusk',
  type: 'linear',
  angle: 90,
  stops: [
    { color: '#000000', position: 0 },
    { color: '#ffffff', position: 100 },
  ],
  tags: [],
  likes: 0,
};

const pattern: Pattern = {
  id: 'p1',
  name: 'Dots',
  type: 'dots',
  fg: '#111111',
  bg: '#eeeeee',
  size: 20,
  angle: 0,
  tags: [],
  likes: 0,
};

describe('section style', () => {
  it('renders each background kind as real CSS values', () => {
    assert.equal(
      sectionStyleToInline({ background: { kind: 'color', color: '#ff0000' } }).backgroundColor,
      '#ff0000',
    );

    const asGradient = sectionStyleToInline({ background: { kind: 'gradient', gradient } });
    assert.match(String(asGradient.backgroundImage), /^linear-gradient\(90deg, #000000 0%/);
    // The first stop doubles as a flat fallback before the image paints.
    assert.equal(asGradient.backgroundColor, '#000000');

    const asPattern = sectionStyleToInline({ background: { kind: 'pattern', pattern } });
    assert.equal(asPattern.backgroundColor, '#eeeeee');
    assert.equal(asPattern.backgroundSize, '20px 20px');
  });

  it('treats "none" as no styling at all', () => {
    assert.equal(hasSectionStyle({ background: { kind: 'none' } }), false);
    assert.equal(hasSectionStyle(undefined), false);
    assert.equal(sectionStyleCss('[x]', { background: { kind: 'none' } }), '');
  });

  it('counts each customized group once', () => {
    const style: SectionStyle = {
      background: { kind: 'color', color: '#fff' },
      textColor: '#000',
      border: { width: 2, style: 'solid', color: '#ccc', radius: 0 },
    };
    assert.equal(sectionStyleEditCount(style), 3);
    // A zero-width, zero-radius border changes nothing on screen.
    assert.equal(
      sectionStyleEditCount({ border: { width: 0, style: 'solid', color: '#ccc', radius: 0 } }),
      0,
    );
  });

  it('forces the text colour past the section’s own utility classes', () => {
    const css = sectionStyleCss('[data-x]', { textColor: '#123456' });
    assert.match(css, /\[data-x\] h1:not\(a\):not\(button\)/);
    assert.match(css, /color: #123456 !important/);
    // Links and buttons are left alone so filled CTAs keep their contrast.
    assert.doesNotMatch(css, /\[data-x\] a\b(?!:)/);
  });

  it('clears only the section root’s own background', () => {
    const css = sectionStyleCss('[data-x]', { background: { kind: 'color', color: '#abcdef' } });
    assert.match(css, /\[data-x\] > \* \{/);
    assert.match(css, /background-image: none !important/);
    // Nested elements (cards, filled buttons) are untouched.
    assert.doesNotMatch(css, /\[data-x\] \* \{/);
  });

  it('leaves backgrounds alone when only the text colour is set', () => {
    assert.doesNotMatch(sectionStyleCss('[data-x]', { textColor: '#fff' }), /> \*/);
  });

  it('rounds corners only with the background clipped to them', () => {
    const css = sectionStyleCss('[data-x]', {
      border: { width: 0, style: 'solid', color: '#ccc', radius: 12 },
    });
    assert.match(css, /border-radius: 12px;/);
    assert.match(css, /overflow: hidden;/);
    assert.doesNotMatch(css, /border-width/);
  });

  it('writes a page stylesheet keyed by slot, skipping unstyled sections', () => {
    const css = pageSectionStylesCss([
      { slotId: 'hero', title: 'Hero', style: { textColor: '#fff' } },
      { slotId: 'footer', title: 'Footer', style: undefined },
    ]);
    assert.match(css, new RegExp(`\\[${SECTION_ATTR}="hero"\\]`));
    assert.doesNotMatch(css, /footer/);
  });

  it('produces nothing when no section is styled', () => {
    assert.equal(pageSectionStylesCss([{ slotId: 'hero', title: 'Hero', style: {} }]), '');
  });
});
