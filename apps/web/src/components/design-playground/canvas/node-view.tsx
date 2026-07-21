'use client';

import { Ellipse, Group, Image as KonvaImage, Rect, Text } from 'react-konva';
import type Konva from 'konva';
import { DEFAULT_TEXT } from '@/lib/design-playground/document';
import { useImage } from './use-image';
import type { BlendMode, Document, Node, ShadowSpec } from '@/lib/design-playground/types';

/**
 * Konva's prop types reject an explicit `undefined` (the repo compiles with
 * `exactOptionalPropertyTypes`), and the model uses `null` for "no paint". So
 * omit the key entirely rather than passing undefined through.
 */
function paint(fill: string | null, stroke: string | null): { fill?: string; stroke?: string } {
  return { ...(fill !== null ? { fill } : {}), ...(stroke !== null ? { stroke } : {}) };
}

/**
 * Drop shadow, as Konva's native shape props.
 *
 * Same omit-rather-than-undefined rule as `paint`. Konva takes the blur as a
 * pixel radius, which is the CSS `box-shadow` blur the inspector edits, so the
 * number passes through untouched here (only the SVG filter has to halve it).
 */
function shadowProps(shadow: ShadowSpec | null): {
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
} {
  if (!shadow) return {};
  return {
    shadowColor: shadow.color,
    shadowBlur: shadow.blur,
    shadowOffsetX: shadow.offsetX,
    shadowOffsetY: shadow.offsetY,
    shadowOpacity: shadow.opacity,
  };
}

/**
 * Blend mode, as a canvas composite operation.
 *
 * Every mode in the model is also a canvas operation name, with one exception:
 * `normal` is the *absence* of blending, spelled `source-over` on a canvas, so
 * it is omitted rather than set - leaving Konva on its own default.
 */
function blendProps(blendMode: BlendMode): {
  globalCompositeOperation?: Exclude<BlendMode, 'normal'>;
} {
  return blendMode === 'normal' ? {} : { globalCompositeOperation: blendMode };
}

/**
 * Draw one node and its children.
 *
 * Recursive by design: a node's transform is relative to its parent, so nesting
 * Konva `Group`s makes the maths the renderer's job rather than ours - a child
 * inside a frame moves with it for free.
 *
 * Every shape carries `id` so the stage can map a click back to a node, and
 * `name="node"` so hit-testing can tell document content from chrome.
 */
export function NodeView({
  doc,
  node,
  onSelect,
  onDragEnd,
  drawing = false,
}: {
  doc: Document;
  node: Node;
  onSelect: (id: string, additive: boolean) => void;
  /** True while a drawing tool is armed; shapes must not intercept the press. */
  drawing?: boolean;
  onDragEnd: (id: string, position: { x: number; y: number }) => void;
}) {
  if (node.hidden) return null;

  const { x, y, width, height, rotation } = node.transform;
  const { fill, stroke, strokeWidth, radius, opacity, shadow, blendMode } = node.style;
  // A shadow belongs on a SHAPE: Konva containers do not paint one, so a frame
  // hands it to its backdrop rect and a group has nothing to cast.
  const effect = shadowProps(shadow);

  const common = {
    id: node.id,
    name: 'node',
    x,
    y,
    rotation,
    opacity,
    ...blendProps(blendMode),
    // A locked node is visible but inert - it must not drag or take a click.
    // While a drawing tool is armed the shape steps out of the way entirely:
    // otherwise pressing over an existing shape swallows the press and the new
    // rectangle never starts, which reads as "drawing is broken".
    draggable: !node.locked && !drawing,
    listening: !node.locked && !drawing,
    onMouseDown: (event: Konva.KonvaEventObject<MouseEvent>) => {
      // Stop the stage handler from clearing the selection we are making.
      if (drawing) return;
      event.cancelBubble = true;
      onSelect(node.id, event.evt.shiftKey || event.evt.metaKey || event.evt.ctrlKey);
    },
    onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => {
      onDragEnd(node.id, { x: event.target.x(), y: event.target.y() });
    },
  };

  const children = node.children
    .map((id) => doc.nodes[id])
    .filter((child): child is Node => child !== undefined)
    .map((child) => (
      <NodeView
        key={child.id}
        doc={doc}
        node={child}
        onSelect={onSelect}
        onDragEnd={onDragEnd}
        drawing={drawing}
      />
    ));

  switch (node.type) {
    case 'frame':
      return (
        <Group {...common}>
          {/* The frame's own background is a sibling of the clip, not a child of
              it: clipping must contain the frame's CONTENT, while the backdrop -
              and the shadow it casts - has to be free to paint outside the box. */}
          <Rect
            width={width}
            height={height}
            {...paint(fill, stroke)}
            {...effect}
            strokeWidth={strokeWidth}
            cornerRadius={radius}
            listening={false}
          />
          <Group clipX={0} clipY={0} clipWidth={width} clipHeight={height}>
            {children}
          </Group>
        </Group>
      );

    case 'group':
      return <Group {...common}>{children}</Group>;

    case 'ellipse':
      return (
        <Ellipse
          {...common}
          // Konva measures an ellipse from its centre; the model stores a box.
          x={x + width / 2}
          y={y + height / 2}
          radiusX={width / 2}
          radiusY={height / 2}
          {...paint(fill, stroke)}
          {...effect}
          strokeWidth={strokeWidth}
        />
      );

    case 'text': {
      // A text node always carries its text spec; fall back rather than crash
      // if an older document is missing it.
      const text = node.text ?? DEFAULT_TEXT;
      return (
        <Text
          {...common}
          width={width}
          text={text.text}
          fontSize={text.fontSize}
          fontFamily={text.fontFamily}
          fontStyle={text.fontWeight >= 600 ? 'bold' : 'normal'}
          lineHeight={text.lineHeight}
          letterSpacing={text.letterSpacing}
          align={text.align}
          {...paint(fill, null)}
          {...effect}
        />
      );
    }

    case 'image':
      // An image is a shape, so the shadow rides along with the rest of its props
      // - including on the placeholder, so the box does not jump once it decodes.
      return <ImageNode node={node} common={{ ...common, ...effect }} />;

    case 'rectangle':
    default:
      return (
        <Rect
          {...common}
          width={width}
          height={height}
          {...paint(fill, stroke)}
          {...effect}
          strokeWidth={strokeWidth}
          cornerRadius={radius}
        />
      );
  }
}

/**
 * An image node.
 *
 * Split into its own component because loading a bitmap needs a hook, and
 * `NodeView` is a switch that must stay hook-free to keep its call order stable
 * across node types.
 */
function ImageNode({
  node,
  common,
}: {
  node: Node;
  common: Record<string, unknown>;
}) {
  const bitmap = useImage(node.image?.src);
  const { width, height } = node.transform;
  const fit = node.image?.fit ?? 'cover';

  // Placeholder while the bitmap decodes (or if it failed): the box stays
  // selectable, so a broken image can still be moved or replaced.
  if (!bitmap) {
    return (
      <Rect
        {...common}
        width={width}
        height={height}
        fill="rgba(148, 163, 184, 0.25)"
        cornerRadius={node.style.radius}
      />
    );
  }

  // `cover`/`contain` are expressed as a crop over the source bitmap, which is
  // how Konva models object-fit; `fill` simply stretches.
  const crop =
    fit === 'fill'
      ? undefined
      : cropFor(bitmap.width, bitmap.height, width, height, fit === 'cover');

  return (
    <KonvaImage
      {...common}
      image={bitmap}
      width={width}
      height={height}
      cornerRadius={node.style.radius}
      {...(crop ? { crop } : {})}
    />
  );
}

/** The source rectangle that makes a bitmap cover (or fit inside) a box. */
function cropFor(
  sourceWidth: number,
  sourceHeight: number,
  boxWidth: number,
  boxHeight: number,
  cover: boolean,
): { x: number; y: number; width: number; height: number } {
  const sourceRatio = sourceWidth / sourceHeight;
  const boxRatio = boxWidth / boxHeight;
  const wide = cover ? sourceRatio > boxRatio : sourceRatio < boxRatio;

  const width = wide ? sourceHeight * boxRatio : sourceWidth;
  const height = wide ? sourceHeight : sourceWidth / boxRatio;
  return {
    x: (sourceWidth - width) / 2,
    y: (sourceHeight - height) / 2,
    width,
    height,
  };
}
