import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { batch, insertNodes, moveNode, removeNodes, updateNode } from './commands';
import {
  ancestorsOf,
  boundsOf,
  createDocument,
  createNode,
  descendantsOf,
  frameAt,
} from './document';
import { commit, emptyHistory, redo, undo } from './history';
import { deserializeDocument, parseDocument, serializeDocument } from './schema';
import type { Document, Node, Transform } from './types';

/**
 * The document model is pure, so it is tested directly - no DOM, no canvas.
 * These cover the invariants the editor leans on: commands are reversible,
 * history round-trips, the graph never holds a dangling id, and a saved
 * document survives a reload.
 */

const box = (x: number, y: number, width = 100, height = 100): Transform => ({
  x,
  y,
  width,
  height,
  rotation: 0,
});

/** A document with one page and `count` rectangles at the top level. */
function seed(count = 1): { doc: Document; rootId: string; ids: string[] } {
  let doc = createDocument('Test', 'Page 1');
  const rootId = doc.pages[0]!.rootId;
  const ids: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const node = createNode('rectangle', box(i * 10, i * 10), { parentId: rootId });
    ids.push(node.id);
    doc = insertNodes({ [node.id]: node }, [node.id], rootId, i).apply(doc);
  }
  return { doc, rootId, ids };
}

describe('document', () => {
  it('creates a document with one page and a root node', () => {
    const doc = createDocument('Test', 'Page 1');
    assert.equal(doc.pages.length, 1);
    assert.ok(doc.nodes[doc.pages[0]!.rootId]);
  });

  it('walks ancestors and descendants', () => {
    let doc = createDocument('Test', 'Page 1');
    const rootId = doc.pages[0]!.rootId;
    const frame = createNode('frame', box(0, 0, 400, 300), { parentId: rootId });
    doc = insertNodes({ [frame.id]: frame }, [frame.id], rootId, 0).apply(doc);
    const child = createNode('rectangle', box(10, 10), { parentId: frame.id });
    doc = insertNodes({ [child.id]: child }, [child.id], frame.id, 0).apply(doc);

    assert.deepEqual(
      ancestorsOf(doc, child.id).map((n) => n.id),
      [frame.id, rootId],
    );
    assert.equal(descendantsOf(doc, frame.id).length, 2);
  });

  it('measures the bounds of a selection', () => {
    const { doc, ids } = seed(2);
    const bounds = boundsOf(doc, ids);
    assert.deepEqual(bounds, { x: 0, y: 0, width: 110, height: 110 });
  });

  it('finds the frame under a point, topmost first', () => {
    let doc = createDocument('Test', 'Page 1');
    const page = doc.pages[0]!;
    const under = createNode('frame', box(0, 0, 200, 200), { parentId: page.rootId });
    const over = createNode('frame', box(50, 50, 200, 200), { parentId: page.rootId });
    doc = insertNodes({ [under.id]: under }, [under.id], page.rootId, 0).apply(doc);
    doc = insertNodes({ [over.id]: over }, [over.id], page.rootId, 1).apply(doc);

    assert.equal(frameAt(doc, page, { x: 100, y: 100 })?.id, over.id);
    assert.equal(frameAt(doc, page, { x: 10, y: 10 })?.id, under.id);
    assert.equal(frameAt(doc, page, { x: 500, y: 500 }), null);
  });
});

describe('commands', () => {
  it('inserts and links a node to its parent', () => {
    const { doc, rootId, ids } = seed(1);
    assert.equal(doc.nodes[ids[0]!]?.parentId, rootId);
    assert.deepEqual(doc.nodes[rootId]?.children, ids);
  });

  it('removes a whole subtree and leaves no dangling ids', () => {
    let doc = createDocument('Test', 'Page 1');
    const rootId = doc.pages[0]!.rootId;
    const frame = createNode('frame', box(0, 0, 400, 300), { parentId: rootId });
    doc = insertNodes({ [frame.id]: frame }, [frame.id], rootId, 0).apply(doc);
    const child = createNode('rectangle', box(10, 10), { parentId: frame.id });
    doc = insertNodes({ [child.id]: child }, [child.id], frame.id, 0).apply(doc);

    const after = removeNodes([frame.id]).apply(doc);
    assert.equal(after.nodes[frame.id], undefined);
    assert.equal(after.nodes[child.id], undefined, 'child must not be orphaned');
    assert.deepEqual(after.nodes[rootId]?.children, []);
  });

  it('inverts a remove back to the exact subtree and position', () => {
    const { doc, rootId, ids } = seed(3);
    const command = removeNodes([ids[1]!]);
    const inverse = command.invert(doc);
    const restored = inverse.apply(command.apply(doc));

    assert.deepEqual(restored.nodes[rootId]?.children, ids, 'restored at its old index');
    assert.deepEqual(restored.nodes[ids[1]!], doc.nodes[ids[1]!]);
  });

  it('inverts an update to only the fields it touched', () => {
    const { doc, ids } = seed(1);
    const id = ids[0]!;
    const command = updateNode(id, { transform: { x: 999 }, name: 'Renamed' });
    const inverse = command.invert(doc);
    const round = inverse.apply(command.apply(doc));

    assert.equal(round.nodes[id]?.transform.x, doc.nodes[id]?.transform.x);
    assert.equal(round.nodes[id]?.name, doc.nodes[id]?.name);
    assert.equal(round.nodes[id]?.transform.y, doc.nodes[id]?.transform.y, 'y untouched');
  });

  it('reorders within a parent', () => {
    const { doc, rootId, ids } = seed(3);
    const after = moveNode(ids[0]!, rootId, 2).apply(doc);
    assert.deepEqual(after.nodes[rootId]?.children, [ids[1], ids[2], ids[0]]);
  });

  it('refuses to move a node inside its own descendant', () => {
    let doc = createDocument('Test', 'Page 1');
    const rootId = doc.pages[0]!.rootId;
    const outer = createNode('frame', box(0, 0, 400, 400), { parentId: rootId });
    doc = insertNodes({ [outer.id]: outer }, [outer.id], rootId, 0).apply(doc);
    const inner = createNode('frame', box(10, 10, 100, 100), { parentId: outer.id });
    doc = insertNodes({ [inner.id]: inner }, [inner.id], outer.id, 0).apply(doc);

    const after = moveNode(outer.id, inner.id, 0).apply(doc);
    assert.deepEqual(after, doc, 'a cyclic move is a no-op');
  });

  it('inverts a batch in reverse order', () => {
    const { doc, ids } = seed(2);
    const command = batch([
      updateNode(ids[0]!, { transform: { x: 500 } }),
      removeNodes([ids[1]!]),
    ]);
    const inverse = command.invert(doc);
    const round = inverse.apply(command.apply(doc));

    assert.equal(round.nodes[ids[0]!]?.transform.x, doc.nodes[ids[0]!]?.transform.x);
    assert.ok(round.nodes[ids[1]!], 'the removed node comes back');
  });
});

describe('history', () => {
  it('undoes and redoes a change', () => {
    const { doc, ids } = seed(1);
    const id = ids[0]!;

    const committed = commit(doc, emptyHistory, updateNode(id, { transform: { x: 42 } }));
    assert.equal(committed.doc.nodes[id]?.transform.x, 42);

    const undone = undo(committed.doc, committed.history);
    assert.equal(undone.doc.nodes[id]?.transform.x, 0);

    const redone = redo(undone.doc, undone.history);
    assert.equal(redone.doc.nodes[id]?.transform.x, 42);
  });

  it('drops the redo stack once a new change is made', () => {
    const { doc, ids } = seed(1);
    const id = ids[0]!;
    const first = commit(doc, emptyHistory, updateNode(id, { transform: { x: 10 } }));
    const undone = undo(first.doc, first.history);
    assert.equal(undone.history.future.length, 1);

    const second = commit(undone.doc, undone.history, updateNode(id, { transform: { y: 20 } }));
    assert.equal(second.history.future.length, 0);
  });

  it('is a no-op at either end of the stack', () => {
    const { doc } = seed(1);
    assert.deepEqual(undo(doc, emptyHistory).doc, doc);
    assert.deepEqual(redo(doc, emptyHistory).doc, doc);
  });
});

describe('schema', () => {
  it('round-trips a document', () => {
    const { doc } = seed(2);
    const parsed = deserializeDocument(serializeDocument(doc));
    assert.deepEqual(parsed, doc);
  });

  it('rejects a document with a dangling child reference', () => {
    const { doc, rootId } = seed(1);
    const broken: Document = {
      ...doc,
      nodes: {
        ...doc.nodes,
        [rootId]: { ...(doc.nodes[rootId] as Node), children: ['does-not-exist'] },
      },
    };
    assert.equal(parseDocument(JSON.parse(JSON.stringify(broken))), null);
  });

  it('rejects a document whose page root is missing', () => {
    const { doc } = seed(1);
    const broken = { ...doc, pages: [{ ...doc.pages[0]!, rootId: 'nope' }] };
    assert.equal(parseDocument(JSON.parse(JSON.stringify(broken))), null);
  });

  it('fills defaults for missing presentation fields', () => {
    const { doc, ids } = seed(1);
    const raw = JSON.parse(serializeDocument(doc)) as Record<string, unknown>;
    const nodes = raw.nodes as Record<string, Record<string, unknown>>;
    delete nodes[ids[0]!]!.style;

    const parsed = parseDocument(raw);
    assert.ok(parsed, 'a missing style must not reject the document');
    assert.equal(parsed?.nodes[ids[0]!]?.style.opacity, 1);
  });

  it('returns null for malformed json', () => {
    assert.equal(deserializeDocument('{ not json'), null);
  });
});
