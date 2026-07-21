import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { insertNodes, updateNode } from './commands';
import { createDocument, createNode, DEFAULT_SHADOW } from './document';
import { fileName, pageBounds, toHtml, toJson, toSvg, toSvgForSelection } from './export';
import { parseDocument } from './schema';
import { toTemplate, type AiSection } from './ai-template';
import { materialize, type TemplateSpec } from './templates';
import type { Document, Page, ShadowSpec, Transform } from './types';

/**
 * Export, templates and the AI contract are pure functions over a document, so
 * they are tested directly. These cover the parts a user would notice breaking:
 * output that silently loses a layer, a template that collides with itself, and
 * a model response that escapes its bounds.
 */

const box = (x: number, y: number, width = 100, height = 100): Transform => ({
  x,
  y,
  width,
  height,
  rotation: 0,
});

/** A document with one frame containing a rectangle and a text node. */
function seed(): { doc: Document; page: Page } {
  let doc = createDocument('My project', 'Page 1');
  const page = doc.pages[0]!;

  const frame = createNode('frame', box(0, 0, 400, 300), { parentId: page.rootId });
  doc = insertNodes({ [frame.id]: frame }, [frame.id], page.rootId, 0).apply(doc);

  const rect = createNode('rectangle', box(20, 20, 100, 50), { parentId: frame.id });
  doc = insertNodes({ [rect.id]: rect }, [rect.id], frame.id, 0).apply(doc);

  const label = createNode('text', box(20, 90, 200, 30), { parentId: frame.id });
  doc = insertNodes({ [label.id]: label }, [label.id], frame.id, 1).apply(doc);

  return { doc, page };
}

describe('export', () => {
  it('measures the page bounds from the top-level nodes', () => {
    const { doc, page } = seed();
    assert.deepEqual(pageBounds(doc, page), { x: 0, y: 0, width: 400, height: 300 });
  });

  it('emits svg for every visible node', () => {
    const { doc, page } = seed();
    const svg = toSvg(doc, page);

    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="400" height="300"/);
    // frame background + rectangle
    assert.equal(svg.match(/<rect /g)?.length, 2);
    assert.match(svg, /<text /);
  });

  it('skips hidden nodes in svg', () => {
    const { doc, page } = seed();
    const rectId = Object.values(doc.nodes).find((n) => n.type === 'rectangle')!.id;
    const hidden: Document = {
      ...doc,
      nodes: { ...doc.nodes, [rectId]: { ...doc.nodes[rectId]!, hidden: true } },
    };
    assert.equal(toSvg(hidden, page).match(/<rect /g)?.length, 1);
  });

  it('escapes text content so copy cannot break the markup', () => {
    const { doc, page } = seed();
    const textId = Object.values(doc.nodes).find((n) => n.type === 'text')!.id;
    const node = doc.nodes[textId]!;
    const withMarkup: Document = {
      ...doc,
      nodes: {
        ...doc.nodes,
        [textId]: { ...node, text: { ...node.text!, text: '<script>alert(1)</script>' } },
      },
    };

    for (const output of [toSvg(withMarkup, page), toHtml(withMarkup, page)]) {
      assert.ok(!output.includes('<script>'), 'raw markup must not survive');
      assert.match(output, /&lt;script&gt;/);
    }
  });

  it('emits an html document sized to the artwork', () => {
    const { doc, page } = seed();
    const html = toHtml(doc, page);
    assert.match(html, /^<!doctype html>/);
    assert.match(html, /width: 400px; height: 300px/);
  });

  it('round-trips json through the document parser', () => {
    const { doc } = seed();
    assert.deepEqual(JSON.parse(toJson(doc)), JSON.parse(JSON.stringify(doc)));
  });

  it('builds a file name that is safe on a file system', () => {
    assert.equal(fileName('My Project!', 'Page 1', 'png'), 'my-project-page-1.png');
    assert.equal(fileName('', '', 'json'), 'untitled-untitled.adysre.json');
  });
});

describe('selection export', () => {
  it('crops to the selection and emits only what was selected', () => {
    const { doc, page } = seed();
    const rect = Object.values(doc.nodes).find((n) => n.type === 'rectangle')!;

    const svg = toSvgForSelection(doc, page, [rect.id])!;
    // The rectangle is 100x50 at (20,20) inside the frame, so the file is the
    // rectangle's own size, not the frame's.
    assert.match(svg, /width="100" height="50"/);
    // One rect, and no <text> - the sibling text node must not come along.
    assert.equal(svg.match(/<rect /g)?.length, 1);
    assert.ok(!svg.includes('<text'));
  });

  it('places a nested node at the origin of its own export', () => {
    const { doc, page } = seed();
    const rect = Object.values(doc.nodes).find((n) => n.type === 'rectangle')!;
    const svg = toSvgForSelection(doc, page, [rect.id])!;
    // Its stored transform is parent-relative (20,20); cropped to itself it
    // must sit at 0,0 or it would be clipped out of its own file.
    assert.match(svg, /<rect x="0" y="0"/);
  });

  it('spans every selected node', () => {
    const { doc, page } = seed();
    const ids = Object.values(doc.nodes)
      .filter((n) => n.type === 'rectangle' || n.type === 'text')
      .map((n) => n.id);

    const svg = toSvgForSelection(doc, page, ids)!;
    // rect (20,20 100x50) + text (20,90 200x30) => 200 wide, 100 tall.
    assert.match(svg, /width="200" height="100"/);
  });

  it('returns null when there is nothing exportable', () => {
    const { doc, page } = seed();
    assert.equal(toSvgForSelection(doc, page, []), null);
    assert.equal(toSvgForSelection(doc, page, ['does-not-exist']), null);
  });
});

describe('effects', () => {
  const shadow: ShadowSpec = {
    color: '#112233',
    blur: 10,
    offsetX: 2,
    offsetY: 6,
    opacity: 0.5,
  };

  /** The seeded document with a shadow on its rectangle. */
  function withShadow(): { doc: Document; page: Page; rectId: string } {
    const { doc, page } = seed();
    const rectId = Object.values(doc.nodes).find((n) => n.type === 'rectangle')!.id;
    return { doc: updateNode(rectId, { style: { shadow } }).apply(doc), page, rectId };
  }

  it('starts a new node with no shadow and normal blending', () => {
    const node = createNode('rectangle', box(0, 0));
    assert.equal(node.style.shadow, null);
    assert.equal(node.style.blendMode, 'normal');
  });

  it('round-trips a shadow and a blend mode through the document parser', () => {
    const { doc, rectId } = withShadow();
    const blended = updateNode(rectId, { style: { blendMode: 'multiply' } }).apply(doc);

    const parsed = parseDocument(JSON.parse(toJson(blended)));
    assert.ok(parsed, 'a document carrying effects must still parse');
    assert.deepEqual(parsed.nodes[rectId]!.style.shadow, shadow);
    assert.equal(parsed.nodes[rectId]!.style.blendMode, 'multiply');
  });

  it('defaults effects for a document written before they existed', () => {
    const { doc } = seed();
    const legacy = JSON.parse(toJson(doc)) as { nodes: Record<string, { style: object }> };
    for (const node of Object.values(legacy.nodes)) {
      delete (node.style as { shadow?: unknown }).shadow;
      delete (node.style as { blendMode?: unknown }).blendMode;
    }

    const parsed = parseDocument(legacy);
    assert.ok(parsed);
    for (const node of Object.values(parsed.nodes)) {
      assert.equal(node.style.shadow, null);
      assert.equal(node.style.blendMode, 'normal');
    }
  });

  it('rejects a shadow colour that is not a hex value and clamps its numbers', () => {
    const { doc, rectId } = withShadow();
    const raw = JSON.parse(toJson(doc)) as {
      nodes: Record<string, { style: { shadow: Record<string, unknown> } }>;
    };
    raw.nodes[rectId]!.style.shadow = {
      color: 'url(https://example.com/x.png)',
      blur: -50,
      offsetX: 1e9,
      offsetY: Number.NaN,
      opacity: 4,
    };

    const parsed = parseDocument(raw);
    assert.deepEqual(parsed!.nodes[rectId]!.style.shadow, {
      color: '#000000',
      blur: 0,
      offsetX: 5000,
      offsetY: 0,
      opacity: 1,
    });
  });

  it('restores the previous shadow on undo', () => {
    const { doc, rectId } = withShadow();
    const command = updateNode(rectId, { style: { shadow: null } });
    const cleared = command.apply(doc);
    assert.equal(cleared.nodes[rectId]!.style.shadow, null);

    const undone = command.invert(doc).apply(cleared);
    assert.deepEqual(undone.nodes[rectId]!.style.shadow, shadow);
  });

  it('emits one svg filter per distinct shadow and references it', () => {
    const { doc, page } = withShadow();
    const svg = toSvg(doc, page);

    assert.equal(svg.match(/<filter /g)?.length, 1);
    // CSS blur is twice the Gaussian deviation an SVG filter takes.
    assert.match(svg, /<feDropShadow dx="2" dy="6" stdDeviation="5" flood-color="#112233" flood-opacity="0.5" \/>/);

    const id = /<filter id="([^"]+)"/.exec(svg)?.[1];
    assert.ok(id);
    assert.match(svg, new RegExp(`filter="url\\(#${id}\\)"`));
    // Only the shadowed node references it.
    assert.equal(svg.match(/filter="url\(#/g)?.length, 1);
  });

  it('shares one filter between two identical shadows', () => {
    const { doc, page } = withShadow();
    const textId = Object.values(doc.nodes).find((n) => n.type === 'text')!.id;
    const svg = toSvg(updateNode(textId, { style: { shadow } }).apply(doc), page);

    assert.equal(svg.match(/<filter /g)?.length, 1);
    assert.equal(svg.match(/filter="url\(#/g)?.length, 2);
  });

  it('emits no filter at all when nothing has a shadow', () => {
    const { doc, page } = seed();
    const svg = toSvg(doc, page);
    assert.ok(!svg.includes('<defs>'), 'an unshadowed page needs no defs');
    assert.ok(!svg.includes('<filter'));
    assert.ok(!svg.includes('filter="url('));
  });

  it('emits a box-shadow in html, and a text-shadow for text', () => {
    const { doc, page } = withShadow();
    const textId = Object.values(doc.nodes).find((n) => n.type === 'text')!.id;
    const html = toHtml(updateNode(textId, { style: { shadow } }).apply(doc), page);

    assert.match(html, /box-shadow:2px 6px 10px rgba\(17, 34, 51, 0\.5\)/);
    assert.match(html, /text-shadow:2px 6px 10px rgba\(17, 34, 51, 0\.5\)/);
  });

  it('emits mix-blend-mode in html but never in svg', () => {
    const { doc, page, rectId } = withShadow();
    const blended = updateNode(rectId, { style: { blendMode: 'multiply' } }).apply(doc);

    assert.match(toHtml(blended, page), /mix-blend-mode:multiply/);
    // SVG has no honest equivalent, so it emits nothing rather than a guess.
    assert.ok(!toSvg(blended, page).includes('blend'));
  });

  it('emits no shadow rule for a node without one', () => {
    const { doc, page } = seed();
    const html = toHtml(doc, page);
    assert.ok(!html.includes('box-shadow'));
    assert.ok(!html.includes('text-shadow'));
    assert.ok(!html.includes('mix-blend-mode'));
    assert.ok(DEFAULT_SHADOW.blur > 0, 'the toggle-on default must be visible');
  });
});

describe('templates', () => {
  const button: TemplateSpec = {
    type: 'frame',
    name: 'Button',
    transform: box(0, 0, 140, 44),
    children: [{ type: 'text', name: 'Label', transform: box(12, 12, 116, 20) }],
  };

  it('materialises a subtree with fresh ids and correct links', () => {
    const { nodes, rootId } = materialize(button, 'parent-1');
    const root = nodes[rootId]!;

    assert.equal(root.parentId, 'parent-1');
    assert.equal(root.children.length, 1);
    assert.equal(nodes[root.children[0]!]!.parentId, rootId);
    assert.equal(Object.keys(nodes).length, 2);
  });

  it('mints distinct ids for every placement', () => {
    const first = materialize(button, 'parent-1');
    const second = materialize(button, 'parent-1');
    assert.notEqual(first.rootId, second.rootId);
  });

  it('places the root at the drop point and leaves children relative', () => {
    const { nodes, rootId } = materialize(button, 'parent-1', { x: 300, y: 200 });
    const root = nodes[rootId]!;
    assert.deepEqual([root.transform.x, root.transform.y], [300, 200]);
    assert.deepEqual(
      [nodes[root.children[0]!]!.transform.x, nodes[root.children[0]!]!.transform.y],
      [12, 12],
    );
  });
});

describe('ai template', () => {
  const base: AiSection = {
    name: 'Hero',
    width: 1440,
    height: 600,
    background: '#0f172a',
    children: [
      {
        type: 'text',
        name: 'Headline',
        x: 80,
        y: 200,
        width: 800,
        height: 60,
        fill: '#ffffff',
        text: 'Ship faster',
        fontSize: 56,
        fontWeight: 700,
        align: 'left',
      },
    ],
  };

  it('converts a well-formed response', () => {
    const spec = toTemplate(base);
    assert.equal(spec.type, 'frame');
    assert.equal(spec.style?.fill, '#0f172a');
    assert.equal(spec.children?.length, 1);
    assert.equal(spec.children?.[0]?.text?.text, 'Ship faster');
  });

  it('clamps sizes that fall outside what the canvas accepts', () => {
    const spec = toTemplate({ ...base, width: 99999, height: 1 });
    assert.equal(spec.transform.width, 1920);
    assert.equal(spec.transform.height, 120);
  });

  it('rejects a colour that is not a hex value', () => {
    // A CSS expression or a url() would be a paint the canvas never vetted.
    const spec = toTemplate({ ...base, background: 'url(https://example.com/x.png)' });
    assert.equal(spec.style?.fill, '#ffffff');
  });

  it('falls back to a rectangle for an unknown child type', () => {
    const spec = toTemplate({
      ...base,
      // Deliberately invalid: models can and do return unexpected enums.
      children: [{ ...base.children[0]!, type: 'iframe' as unknown as 'rectangle' }],
    });
    assert.equal(spec.children?.[0]?.type, 'rectangle');
  });

  it('caps the number of children so one response cannot flood the page', () => {
    const many = Array.from({ length: 200 }, () => base.children[0]!);
    assert.equal(toTemplate({ ...base, children: many }).children?.length, 40);
  });

  it('survives a response with no children at all', () => {
    const spec = toTemplate({ ...base, children: [] });
    assert.deepEqual(spec.children, []);
  });
});
