'use client';

import { useEffect, useRef } from 'react';
import { Layer, Rect, Stage, Transformer } from 'react-konva';
import type Konva from 'konva';
import { useMediaQuery } from '@/hooks/use-media-query';
import { topLevelNodes } from '@/lib/design-playground/document';
import { topSelectable } from '@/lib/design-playground/placement';
import type { Document, Node, Page } from '@/lib/design-playground/types';
import { NodeView } from './node-view';
import { registerStage } from './stage-registry';

/** A rubber-band rectangle in canvas space, while the user drags one out. */
export interface DraftRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CanvasStageProps {
  doc: Document;
  page: Page;
  /** Stage size in CSS pixels - the measured size of the workspace. */
  size: { width: number; height: number };
  /** Top-left of the view, in canvas coordinates. */
  viewport: { x: number; y: number };
  zoom: number;
  selection: string[];
  /** The shape being dragged out right now, if any. */
  draft: DraftRect | null;
  /** Selection is inert while a drawing tool is armed. */
  drawing: boolean;
  /** Node currently being typed into, if any: its Konva shape is hidden. */
  editingId: string | null;
  onSelect: (ids: string[]) => void;
  /** A double-click on a node - the gesture that starts editing its text. */
  onNodeDoubleClick: (id: string) => void;
  onNodeMoved: (id: string, position: { x: number; y: number }) => void;
  onNodeTransformed: (id: string, box: DraftRect & { rotation: number }) => void;
  onBackgroundPointerDown: (point: { x: number; y: number }) => void;
  onPointerMove: (point: { x: number; y: number }) => void;
  onPointerUp: () => void;
}

/**
 * The Konva stage: the document, drawn.
 *
 * The viewport lives on the STAGE (its position and scale), not on the nodes, so
 * pan and zoom cost one transform instead of touching every node - which is what
 * keeps the frame budget with thousands of objects (PRD §9).
 *
 * This component owns no document state. It reports intents (selected, moved,
 * transformed) and the workspace turns them into commands.
 */
export function CanvasStage({
  doc,
  page,
  size,
  viewport,
  zoom,
  selection,
  draft,
  drawing,
  editingId,
  onSelect,
  onNodeDoubleClick,
  onNodeMoved,
  onNodeTransformed,
  onBackgroundPointerDown,
  onPointerMove,
  onPointerUp,
}: CanvasStageProps) {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  // A 7px anchor is a comfortable mouse target and an impossible finger one, so
  // the handles grow on a touch screen rather than staying honest to the pixel.
  const coarsePointer = useMediaQuery('(pointer: coarse)') === true;

  // Hand the stage to the exporter, which needs the real renderer to rasterise.
  useEffect(() => {
    registerStage(stageRef.current);
    return () => registerStage(null);
  }, []);

  // Keep the transformer bound to whatever is selected. Konva needs the actual
  // shape instances, so this runs after the layer has rendered them.
  useEffect(() => {
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    if (!transformer || !stage) return;

    const shapes = selection
      .map((id) => stage.findOne(`#${id}`))
      .filter((shape): shape is Konva.Node => shape !== undefined);
    // Resize handles around a node that is being typed into would sit on top of
    // the text field and invite a drag mid-sentence, so editing suppresses them.
    transformer.nodes(editingId === null ? shapes : []);
    transformer.getLayer()?.batchDraw();
  }, [selection, doc, page.id, editingId]);

  /**
   * Hide the Konva text while its DOM editor is open, so the two do not show
   * through each other.
   *
   * Done imperatively rather than as a `NodeView` prop: visibility is a
   * transient view concern of a single shape, and threading it through the
   * recursive renderer would make every node re-render for it.
   */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !editingId) return;
    const shape = stage.findOne(`#${editingId}`);
    if (!shape) return;
    shape.visible(false);
    shape.getLayer()?.batchDraw();
    return () => {
      shape.visible(true);
      shape.getLayer()?.batchDraw();
    };
  }, [editingId, doc]);

  /** Pointer position in canvas coordinates, undoing pan and zoom. */
  function pointerPosition(): { x: number; y: number } | null {
    const stage = stageRef.current;
    const point = stage?.getPointerPosition();
    if (!point) return null;
    return { x: point.x / zoom - viewport.x, y: point.y / zoom - viewport.y };
  }

  /**
   * Turn a hit on a shape into a selection.
   *
   * A click resolves UP to the outermost node inside the artboard, so clicking a
   * heading inside a hero hands the user the hero and one drag moves the whole
   * section. Once something inside that subtree is already selected the click
   * stops resolving and picks the exact node - which is how a second click
   * drills in without needing a modifier, the same bargain Figma makes.
   */
  function handleSelect(id: string, additive: boolean): void {
    if (drawing) return;

    const inside = selection.some(
      (selected) => selected === id || isWithin(selected, id),
    );
    const target = inside ? id : topSelectable(doc, page, id);

    if (!additive) {
      onSelect([target]);
      return;
    }
    onSelect(
      selection.includes(target)
        ? selection.filter((s) => s !== target)
        : [...selection, target],
    );
  }

  /** True when `id` sits at or under `ancestorId` in the current document. */
  function isWithin(ancestorId: string, id: string): boolean {
    let current = doc.nodes[id]?.parentId ?? null;
    while (current) {
      if (current === ancestorId) return true;
      current = doc.nodes[current]?.parentId ?? null;
    }
    return false;
  }

  /**
   * Turn a finished transform back into model values.
   *
   * Konva expresses a resize as a SCALE on the shape; the model stores width and
   * height. Baking the scale into the size here (and resetting it to 1) keeps
   * stroke widths, corner radii and font sizes from being silently distorted.
   */
  function handleTransformEnd(event: Konva.KonvaEventObject<Event>): void {
    const shape = event.target;
    const id = shape.id();
    const node = doc.nodes[id];
    if (!node) return;

    const scaleX = shape.scaleX();
    const scaleY = shape.scaleY();
    shape.scaleX(1);
    shape.scaleY(1);

    const width = Math.max(1, Math.round(node.transform.width * scaleX));
    const height = Math.max(1, Math.round(node.transform.height * scaleY));
    // An ellipse is positioned from its centre on the stage but stored as a box.
    const x = node.type === 'ellipse' ? shape.x() - width / 2 : shape.x();
    const y = node.type === 'ellipse' ? shape.y() - height / 2 : shape.y();

    onNodeTransformed(id, {
      x: Math.round(x),
      y: Math.round(y),
      width,
      height,
      rotation: Math.round(shape.rotation()),
    });
  }

  const roots = topLevelNodes(doc, page);

  return (
    <Stage
      ref={stageRef}
      width={size.width}
      height={size.height}
      scaleX={zoom}
      scaleY={zoom}
      x={viewport.x * zoom}
      y={viewport.y * zoom}
      onMouseDown={(event) => {
        // Only a press on empty canvas starts a draw / clears the selection;
        // presses on a shape are handled by the shape itself.
        if (event.target !== event.target.getStage()) return;
        const point = pointerPosition();
        if (point) onBackgroundPointerDown(point);
      }}
      onMouseMove={() => {
        const point = pointerPosition();
        if (point) onPointerMove(point);
      }}
      onMouseUp={onPointerUp}
      // Konva does not synthesise mouse events from touch, so the same three
      // intents have to be wired twice. Without these a finger could neither
      // draw a shape nor drag out a selection - the canvas looked inert on a
      // phone even though every panel around it worked.
      onTouchStart={(event) => {
        if (event.target !== event.target.getStage()) return;
        const point = pointerPosition();
        if (point) onBackgroundPointerDown(point);
      }}
      onTouchMove={() => {
        const point = pointerPosition();
        if (point) onPointerMove(point);
      }}
      onTouchEnd={onPointerUp}
      onDblClick={(event) => {
        // Konva events bubble to the stage, so one handler here covers every
        // node without the recursive renderer having to know about editing.
        const id = event.target.id();
        if (id) onNodeDoubleClick(id);
      }}
      onDblTap={(event) => {
        const id = event.target.id();
        if (id) onNodeDoubleClick(id);
      }}
    >
      <Layer>
        {roots.map((node: Node) => (
          <NodeView
            key={node.id}
            doc={doc}
            node={node}
            onSelect={handleSelect}
            onDragEnd={onNodeMoved}
            drawing={drawing}
            // Only top-level frames are titled - a nested frame's tag would sit
            // inside its parent's content and read as artwork.
            {...(node.type === 'frame' ? { labelScale: 1 / zoom } : {})}
          />
        ))}
      </Layer>

      {/* Chrome layer: selection handles and the drawing preview never take
          part in hit-testing, so they cannot be selected or dragged. */}
      <Layer listening={!drawing}>
        <Transformer
          ref={transformerRef}
          rotateEnabled
          ignoreStroke
          padding={2}
          anchorSize={coarsePointer ? 14 : 7}
          onTransformEnd={handleTransformEnd}
          boundBoxFunc={(oldBox, newBox) =>
            // Refuse degenerate boxes; a zero-size node cannot be grabbed again.
            newBox.width < 4 || newBox.height < 4 ? oldBox : newBox
          }
        />
        {draft && (
          <Rect
            x={draft.x}
            y={draft.y}
            width={draft.width}
            height={draft.height}
            fill="rgba(59, 130, 246, 0.12)"
            stroke="rgb(59, 130, 246)"
            strokeWidth={1 / zoom}
            listening={false}
          />
        )}
      </Layer>
    </Stage>
  );
}
