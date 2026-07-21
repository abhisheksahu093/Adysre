/**
 * Design Playground - node templates.
 *
 * A template is the shape of a subtree, written by hand once and stamped onto
 * the canvas any number of times: a button, a card, a hero section, an uploaded
 * image. It carries no ids - `materialize` mints those - so the same template
 * can be placed repeatedly without collisions.
 *
 * This is what every left-rail panel (components, sections, assets, images, AI)
 * produces. Panels never build `Node`s directly, so a template can gain fields
 * without touching each panel.
 */

import { createNode } from './document';
import type { Node, NodeType, Transform } from './types';

/** A node in a template: like `Node`, but id-free and recursive. */
export interface TemplateSpec {
  type: NodeType;
  name?: string;
  /** Position is relative to the template root; the root's is its drop point. */
  transform: Transform;
  style?: Partial<Node['style']>;
  layout?: Partial<Node['layout']>;
  text?: Partial<NonNullable<Node['text']>>;
  image?: Partial<NonNullable<Node['image']>>;
  children?: TemplateSpec[];
}

/**
 * Turn a template into concrete nodes.
 *
 * Returns the flat node map the insert command wants, plus the root id. The
 * root's transform is overridden by `at` when the caller has a drop point;
 * children keep their template-relative coordinates.
 */
export function materialize(
  spec: TemplateSpec,
  parentId: string,
  at?: { x: number; y: number },
): { nodes: Record<string, Node>; rootId: string } {
  const nodes: Record<string, Node> = {};

  function build(current: TemplateSpec, parent: string, origin?: { x: number; y: number }): string {
    const transform: Transform = origin
      ? { ...current.transform, x: origin.x, y: origin.y }
      : current.transform;

    // Each spec field is optional and `createNode` merges it over the type's
    // defaults, so only the keys the template actually sets are forwarded -
    // passing an explicit `undefined` would fail `exactOptionalPropertyTypes`.
    const overrides: Partial<Node> = { parentId: parent };
    if (current.name !== undefined) overrides.name = current.name;
    if (current.style) overrides.style = current.style as Node['style'];
    if (current.layout) overrides.layout = current.layout as Node['layout'];
    if (current.text) overrides.text = current.text as NonNullable<Node['text']>;
    if (current.image) overrides.image = current.image as NonNullable<Node['image']>;

    const node = createNode(current.type, transform, overrides);

    nodes[node.id] = node;
    const childIds = (current.children ?? []).map((child) => build(child, node.id));
    nodes[node.id] = { ...node, children: childIds };
    return node.id;
  }

  return { nodes, rootId: build(spec, parentId, at) };
}

/** Convenience for the common "a box of this size" template root. */
export function box(width: number, height: number): Transform {
  return { x: 0, y: 0, width, height, rotation: 0 };
}
