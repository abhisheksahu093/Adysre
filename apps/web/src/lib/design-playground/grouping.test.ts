import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { insertNodes } from './commands';
import { createDocument, createNode } from './document';
import { nodesInMarquee, planGroup, planUngroup } from './grouping';
import { deserializeDocument, serializeDocument } from './schema';
import type { Document, Node, Transform } from './types';

/**
 * Grouping is where the coordinate maths is easiest to get wrong: a child's
 * transform is parent-relative, so wrapping nodes in a group must rebase them
 * or everything visibly jumps. These tests pin that down without a canvas.
 */

const box = (x: number, y: number, width = 100, height = 100): Transform => ({
  x,
  y,
  width,
  height,
  rotation: 0,
});

/** A page with `count` rectangles laid out at increasing offsets. */
function seed(count = 2): { doc: Document; rootId: string; ids: string[] } {
  let doc = createDocument('Test', 'Page 1');
  const rootId = doc.pages[0]!.rootId;
  const ids: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const node = createNode('rectangle', box(100 + i * 200, 50 + i * 100), { parentId: rootId });
    ids.push(node.id);
    doc = insertNodes({ [node.id]: node }, [node.id], rootId, i).apply(doc);
  }
  return { doc, rootId, ids };
}

/** The single node the group command added. */
function addedNode(before: Document, after: Document): Node {
  const id = Object.keys(after.nodes).find((key) => before.nodes[key] === undefined)!;
  return after.nodes[id]!;
}

describe('grouping', () => {
  it('wraps siblings in a group placed at their top-left corner', () => {
    const { doc, rootId, ids } = seed(2);
    const after = planGroup(doc, ids)!.apply(doc);
    const group = addedNode(doc, after);

    assert.equal(group.type, 'group');
    assert.equal(group.parentId, rootId);
    assert.deepEqual([group.transform.x, group.transform.y], [100, 50]);
    assert.deepEqual(group.children, ids);
  });

  it('rebases children so nothing moves on screen', () => {
    const { doc, ids } = seed(2);
    const after = planGroup(doc, ids)!.apply(doc);
    const group = addedNode(doc, after);

    for (const id of ids) {
      const before = doc.nodes[id]!.transform;
      const now = after.nodes[id]!.transform;
      // Absolute position = group origin + child offset; it must be unchanged.
      assert.equal(now.x + group.transform.x, before.x);
      assert.equal(now.y + group.transform.y, before.y);
    }
  });

  it('refuses to group a single node', () => {
    const { doc, ids } = seed(2);
    assert.equal(planGroup(doc, [ids[0]!]), null);
  });

  it('refuses to group nodes with different parents', () => {
    // One seed, then build on it: a second seed() would be a different document
    // and the ids would not belong to it.
    const seeded = seed(1);
    const { rootId, ids } = seeded;
    let doc = seeded.doc;
    const frame = createNode('frame', box(0, 0, 400, 400), { parentId: rootId });
    doc = insertNodes({ [frame.id]: frame }, [frame.id], rootId, 1).apply(doc);
    const nested = createNode('rectangle', box(10, 10), { parentId: frame.id });
    doc = insertNodes({ [nested.id]: nested }, [nested.id], frame.id, 0).apply(doc);

    // Only the first node's siblings are grouped, so this is a one-node group.
    assert.equal(planGroup(doc, [ids[0]!, nested.id]), null);
  });

  it('round-trips through ungroup with positions intact', () => {
    const { doc, ids } = seed(3);
    const grouped = planGroup(doc, ids)!.apply(doc);
    const group = addedNode(doc, grouped);

    const ungrouped = planUngroup(grouped, [group.id])!.apply(grouped);

    assert.equal(ungrouped.nodes[group.id], undefined, 'the empty group is removed');
    for (const id of ids) {
      assert.deepEqual(ungrouped.nodes[id]?.transform, doc.nodes[id]?.transform);
      assert.equal(ungrouped.nodes[id]?.parentId, doc.nodes[id]?.parentId);
    }
  });

  it('is undoable as one step', () => {
    const { doc, ids } = seed(2);
    const command = planGroup(doc, ids)!;
    const restored = command.invert(doc).apply(command.apply(doc));
    assert.deepEqual(restored, doc);
  });

  it('ignores a selection with no groups in it', () => {
    const { doc, ids } = seed(2);
    assert.equal(planUngroup(doc, ids), null);
  });
});

describe('marquee', () => {
  it('selects the nodes a band touches', () => {
    const { doc, rootId, ids } = seed(2);
    // Covers the first rectangle (100,50) but not the second (300,150).
    const hit = nodesInMarquee(doc, rootId, { x: 90, y: 40, width: 60, height: 60 });
    assert.deepEqual(hit, [ids[0]]);
  });

  it('counts a partial overlap as a hit', () => {
    const { doc, rootId, ids } = seed(1);
    const hit = nodesInMarquee(doc, rootId, { x: 150, y: 100, width: 500, height: 500 });
    assert.deepEqual(hit, [ids[0]]);
  });

  it('skips locked and hidden nodes', () => {
    const { doc, rootId, ids } = seed(2);
    const guarded: Document = {
      ...doc,
      nodes: {
        ...doc.nodes,
        [ids[0]!]: { ...doc.nodes[ids[0]!]!, locked: true },
        [ids[1]!]: { ...doc.nodes[ids[1]!]!, hidden: true },
      },
    };
    assert.deepEqual(nodesInMarquee(guarded, rootId, { x: 0, y: 0, width: 9999, height: 9999 }), []);
  });

  it('returns nothing for an empty band', () => {
    const { doc, rootId } = seed(2);
    assert.deepEqual(nodesInMarquee(doc, rootId, { x: 5000, y: 5000, width: 10, height: 10 }), []);
  });
});

describe('import', () => {
  it('reopens a document exported as json', () => {
    const { doc } = seed(3);
    const reopened = deserializeDocument(serializeDocument(doc));
    assert.deepEqual(reopened, doc);
  });

  it('rejects a file that is not a document', () => {
    assert.equal(deserializeDocument('{"hello":"world"}'), null);
    assert.equal(deserializeDocument('not json at all'), null);
  });
});
