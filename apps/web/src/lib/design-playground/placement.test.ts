import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { insertNodes } from './commands';
import { createDocument, createNode } from './document';
import {
  STACK_GAP,
  activeFrame,
  anyNodeVisible,
  grownHeight,
  stackPosition,
  topSelectable,
} from './placement';
import { box as templateBox, fitFactor, scaleTemplate, type TemplateSpec } from './templates';
import type { Document, Page, Transform } from './types';

/**
 * Placement decides where a panel click lands, which is the difference between
 * "clicking three components builds a page" and "clicking three components
 * stacks three things on the origin". The maths is small and entirely
 * coordinate-based, so it is pinned here rather than discovered on a canvas.
 */

const box = (x: number, y: number, width = 100, height = 100): Transform => ({
  x,
  y,
  width,
  height,
  rotation: 0,
});

interface Seed {
  doc: Document;
  page: Page;
  rootId: string;
}

function seed(): Seed {
  const doc = createDocument('Test', 'Page 1');
  const page = doc.pages[0]!;
  return { doc, page, rootId: page.rootId };
}

/** Append a node under `parentId` and return the new document plus its id. */
function add(
  doc: Document,
  parentId: string,
  type: Parameters<typeof createNode>[0],
  transform: Transform,
): { doc: Document; id: string } {
  const node = createNode(type, transform, { parentId });
  const index = doc.nodes[parentId]?.children.length ?? 0;
  return { doc: insertNodes({ [node.id]: node }, [node.id], parentId, index).apply(doc), id: node.id };
}

describe('stackPosition', () => {
  it('puts the first drop at the container origin', () => {
    const { doc, rootId } = seed();
    assert.deepEqual(stackPosition(doc, rootId, { width: 100, height: 50 }), { x: 0, y: 0 });
  });

  it('stacks below the lowest existing child', () => {
    const { doc: base, rootId } = seed();
    const { doc } = add(base, rootId, 'rectangle', box(0, 0, 200, 300));

    const at = stackPosition(doc, rootId, { width: 200, height: 100 });
    assert.equal(at.y, 300 + STACK_GAP);
  });

  it('leaves no seam under a section that spans its frame', () => {
    const { doc: base, rootId } = seed();
    const framed = add(base, rootId, 'frame', box(0, 0, 1440, 1024));
    const { doc } = add(framed.doc, framed.id, 'rectangle', box(0, 0, 1440, 80));

    // A full-width section butts against the one above it: a gap between a
    // navbar and a hero would be a visible defect, not a nicety.
    const at = stackPosition(doc, framed.id, { width: 1440, height: 600 });
    assert.deepEqual(at, { x: 0, y: 80 });
  });

  it('centres content narrower than its container', () => {
    const { doc: base, rootId } = seed();
    const { doc, id } = add(base, rootId, 'frame', box(0, 0, 1000, 800));

    assert.equal(stackPosition(doc, id, { width: 200, height: 50 }).x, 400);
  });

  it('ignores hidden children when finding the bottom', () => {
    const { doc: base, rootId } = seed();
    const first = add(base, rootId, 'rectangle', box(0, 0, 100, 100));
    const doc: Document = {
      ...first.doc,
      nodes: { ...first.doc.nodes, [first.id]: { ...first.doc.nodes[first.id]!, hidden: true } },
    };

    assert.equal(stackPosition(doc, rootId, { width: 100, height: 100 }).y, 0);
  });
});

describe('grownHeight', () => {
  it('reports the height a frame needs when content overflows it', () => {
    const { doc: base, rootId } = seed();
    const framed = add(base, rootId, 'frame', box(0, 0, 1440, 500));
    const { doc } = add(framed.doc, framed.id, 'rectangle', box(0, 400, 1440, 300));

    assert.equal(grownHeight(doc, framed.id), 700);
  });

  it('returns null when everything already fits', () => {
    const { doc: base, rootId } = seed();
    const framed = add(base, rootId, 'frame', box(0, 0, 1440, 1024));
    const { doc } = add(framed.doc, framed.id, 'rectangle', box(0, 0, 1440, 300));

    assert.equal(grownHeight(doc, framed.id), null);
  });
});

describe('activeFrame', () => {
  it('prefers the frame holding the selection', () => {
    const { doc: base, page, rootId } = seed();
    const first = add(base, rootId, 'frame', box(0, 0, 400, 400));
    const second = add(first.doc, rootId, 'frame', box(600, 0, 400, 400));
    const child = add(second.doc, first.id, 'rectangle', box(10, 10));

    // The selection is deep inside the FIRST frame, so that is where new
    // content belongs - not the most recently added frame.
    assert.equal(activeFrame(child.doc, page, [child.id])?.id, first.id);
  });

  it('falls back to the last frame when nothing is selected', () => {
    const { doc: base, page, rootId } = seed();
    const first = add(base, rootId, 'frame', box(0, 0, 400, 400));
    const second = add(first.doc, rootId, 'frame', box(600, 0, 400, 400));

    assert.equal(activeFrame(second.doc, page, [])?.id, second.id);
    assert.notEqual(activeFrame(second.doc, page, [])?.id, first.id);
  });

  it('is null on a page with no frame', () => {
    const { doc, page } = seed();
    assert.equal(activeFrame(doc, page, []), null);
  });
});

describe('topSelectable', () => {
  it('resolves a click inside a section to the whole section', () => {
    const { doc: base, page, rootId } = seed();
    const artboard = add(base, rootId, 'frame', box(0, 0, 1440, 1024));
    const section = add(artboard.doc, artboard.id, 'group', box(0, 0, 1440, 400));
    const heading = add(section.doc, section.id, 'text', box(120, 40, 600, 60));

    // One drag should move the hero, not just its heading.
    assert.equal(topSelectable(heading.doc, page, heading.id), section.id);
  });

  it('selects the artboard when the artboard itself is hit', () => {
    const { doc: base, page, rootId } = seed();
    const artboard = add(base, rootId, 'frame', box(0, 0, 1440, 1024));

    assert.equal(topSelectable(artboard.doc, page, artboard.id), artboard.id);
  });

  it('leaves loose top-level content alone', () => {
    const { doc: base, page, rootId } = seed();
    const loose = add(base, rootId, 'rectangle', box(10, 10));

    assert.equal(topSelectable(loose.doc, page, loose.id), loose.id);
  });
});

describe('anyNodeVisible', () => {
  const view = { x: 0, y: 0, width: 800, height: 600 };

  it('sees content overlapping the viewport', () => {
    const { doc: base, page, rootId } = seed();
    const { doc } = add(base, rootId, 'rectangle', box(700, 500, 400, 400));

    assert.equal(anyNodeVisible(doc, page, view), true);
  });

  it('reports nothing visible once the viewport has panned away', () => {
    const { doc: base, page, rootId } = seed();
    const { doc } = add(base, rootId, 'rectangle', box(5000, 5000));

    assert.equal(anyNodeVisible(doc, page, view), false);
  });

  it('accounts for a child sitting inside a frame elsewhere', () => {
    const { doc: base, page, rootId } = seed();
    const framed = add(base, rootId, 'frame', box(4000, 4000, 100, 100));
    const { doc } = add(framed.doc, framed.id, 'rectangle', box(0, 0, 50, 50));

    // The child's own transform is (0,0) - only accumulating the frame's origin
    // keeps it from looking like it is under the viewport.
    assert.equal(anyNodeVisible(doc, page, view), false);
  });
});

describe('fitting a template to its frame', () => {
  const section: TemplateSpec = {
    type: 'frame',
    transform: templateBox(1440, 600),
    style: { radius: 16, strokeWidth: 2 },
    children: [
      {
        type: 'text',
        transform: { ...templateBox(600, 60), x: 120, y: 40 },
        text: { fontSize: 48, letterSpacing: 2, lineHeight: 1.2 },
      },
    ],
  };

  it('shrinks a full-width section to the frame it lands in', () => {
    const factor = fitFactor(1440, 1280);
    const fitted = scaleTemplate(section, factor);

    assert.equal(fitted.transform.width, 1280, 'the section spans the frame exactly');
    assert.equal(fitted.children![0]!.transform.x, Math.round(120 * factor), 'the gutter scales with it');
    assert.equal(fitted.children![0]!.text!.fontSize, Math.round(48 * factor), 'and so does the type');
  });

  it('leaves ratios and unitless values alone', () => {
    const fitted = scaleTemplate(section, 0.5);
    // A line height of 1.2 is a MULTIPLE of the font size; scaling it would
    // compound with the font size and squash the text.
    assert.equal(fitted.children![0]!.text!.lineHeight, 1.2);
  });

  it('does not stretch a component into a banner', () => {
    // A 200px button dropped on a 1440 artboard is meant to stay a button.
    assert.equal(fitFactor(200, 1440), 1);
    assert.equal(scaleTemplate(section, fitFactor(200, 1440)).transform.width, 1440);
  });

  it('rounds to whole pixels so stacked sections leave no seam', () => {
    const fitted = scaleTemplate(section, 1280 / 1440);
    assert.equal(fitted.transform.height, Math.round(600 * (1280 / 1440)));
    assert.equal(Number.isInteger(fitted.transform.height), true);
  });

  it('scales stroke and corner radius so the design holds together', () => {
    const fitted = scaleTemplate(section, 0.5);
    assert.equal(fitted.style!.radius, 8);
    assert.equal(fitted.style!.strokeWidth, 1);
  });
});
