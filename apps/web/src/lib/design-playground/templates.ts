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

import { createNode, type NodeOverrides } from './document';
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
    const overrides: NodeOverrides = { parentId: parent };
    if (current.name !== undefined) overrides.name = current.name;
    if (current.style) overrides.style = current.style;
    if (current.layout) overrides.layout = current.layout;
    if (current.text) overrides.text = current.text;
    if (current.image) overrides.image = current.image;

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

/**
 * Resize a whole template by `factor`, geometry and typography together.
 *
 * Sections are authored at one width (1440, the desktop artboard). Dropped into
 * a narrower frame they would hang off the right edge and be clipped, which
 * reads as a broken section rather than a mismatched size. Scaling the subtree
 * uniformly is the only transform that preserves the design: changing the root's
 * width alone would leave every child at coordinates meant for the old one.
 *
 * Everything measured in pixels scales - offsets, sizes, font size, letter
 * spacing, radii, stroke widths, shadow geometry. `lineHeight` is a RATIO and
 * `opacity` is unitless, so both are left alone.
 *
 * Results are rounded to whole pixels. A 1440 section scaled to 1280 otherwise
 * lands on heights like 78.222, and stacking those leaves hairline seams between
 * sections that no amount of zooming makes look deliberate.
 */
export function scaleTemplate(spec: TemplateSpec, factor: number): TemplateSpec {
  if (factor === 1) return spec;
  const px = (value: number): number => Math.round(value * factor);

  const scaled: TemplateSpec = {
    ...spec,
    transform: {
      ...spec.transform,
      x: px(spec.transform.x),
      y: px(spec.transform.y),
      width: px(spec.transform.width),
      height: px(spec.transform.height),
    },
  };

  if (spec.style) {
    scaled.style = {
      ...spec.style,
      ...(spec.style.radius !== undefined ? { radius: px(spec.style.radius) } : {}),
      ...(spec.style.strokeWidth !== undefined
        ? { strokeWidth: px(spec.style.strokeWidth) }
        : {}),
      ...(spec.style.shadow
        ? {
            shadow: {
              ...spec.style.shadow,
              blur: px(spec.style.shadow.blur),
              offsetX: px(spec.style.shadow.offsetX),
              offsetY: px(spec.style.shadow.offsetY),
            },
          }
        : {}),
    };
  }

  if (spec.layout) {
    scaled.layout = {
      ...spec.layout,
      ...(spec.layout.gap !== undefined ? { gap: px(spec.layout.gap) } : {}),
      ...(spec.layout.padding !== undefined ? { padding: px(spec.layout.padding) } : {}),
    };
  }

  if (spec.text) {
    scaled.text = {
      ...spec.text,
      ...(spec.text.fontSize !== undefined ? { fontSize: px(spec.text.fontSize) } : {}),
      ...(spec.text.letterSpacing !== undefined
        ? { letterSpacing: px(spec.text.letterSpacing) }
        : {}),
    };
  }

  if (spec.children) scaled.children = spec.children.map((child) => scaleTemplate(child, factor));

  return scaled;
}

/**
 * The factor that makes a template span `containerWidth`.
 *
 * Only near-spanning templates are fitted: a 200px button dropped into a 1440
 * artboard is meant to be a button, not a banner. The 60% floor is what
 * separates "this was designed to be full width" from "this is a component".
 */
export function fitFactor(specWidth: number, containerWidth: number): number {
  if (specWidth <= 0 || containerWidth <= 0) return 1;
  const ratio = containerWidth / specWidth;
  return specWidth >= containerWidth * 0.6 ? ratio : 1;
}
