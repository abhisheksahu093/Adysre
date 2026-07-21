'use client';

import type Konva from 'konva';

/**
 * A handle on the live Konva stage, for the one job that genuinely needs it:
 * rasterising the canvas for PNG/JPEG export.
 *
 * A module-level registry rather than context or a store, because the stage is
 * an imperative object, there is exactly one of it, and the exporter sits in the
 * toolbar - far from the canvas in the tree. Threading a ref through would put
 * a Konva type into every component in between, and re-rendering the toolbar
 * whenever the stage re-mounts would buy nothing.
 */
let stage: Konva.Stage | null = null;

export function registerStage(instance: Konva.Stage | null): void {
  stage = instance;
}

/**
 * Rasterise specific nodes, isolated from everything around them.
 *
 * Konva can export a single node directly, which is what makes a one-node
 * selection export honest: a neighbour that merely overlaps its box is not
 * captured. A multi-node selection falls back to the combined bounding box,
 * which CAN pick up whatever sits between the chosen shapes - grouping them
 * first is the way to get a clean cut, and that is a choice for the user
 * rather than something to fake here.
 */
export function getNodesDataUrl(
  ids: string[],
  options: { mimeType: string; pixelRatio: number },
): string | null {
  if (!stage || ids.length === 0) return null;

  const shapes = ids
    .map((id) => stage?.findOne(`#${id}`))
    .filter((shape): shape is Konva.Node => shape !== undefined);
  if (shapes.length === 0) return null;

  const first = shapes[0];
  if (shapes.length === 1 && first) {
    return first.toDataURL({ mimeType: options.mimeType, pixelRatio: options.pixelRatio });
  }

  // Combined bounds in stage space, then capture that rectangle of the layer
  // the shapes live on. `relativeTo` the stage keeps the box independent of the
  // current pan and zoom.
  // `stage` is non-null here (guarded above); the local binding keeps that
  // narrowing through the closure.
  const target = stage;
  const boxes = shapes.map((shape) => shape.getClientRect({ relativeTo: target }));
  const x = Math.min(...boxes.map((b) => b.x));
  const y = Math.min(...boxes.map((b) => b.y));
  const width = Math.max(...boxes.map((b) => b.x + b.width)) - x;
  const height = Math.max(...boxes.map((b) => b.y + b.height)) - y;
  if (width <= 0 || height <= 0) return null;

  return getStageDataUrl({ ...options, bounds: { x, y, width, height } });
}

/**
 * Rasterise the whole page, independent of the current pan and zoom: the stage
 * transform is saved, reset to 1:1 at the artwork's origin, captured, and put
 * back. Without that, an export would silently inherit whatever the user last
 * scrolled to.
 */
export function getStageDataUrl(options: {
  mimeType: string;
  pixelRatio: number;
  bounds?: { x: number; y: number; width: number; height: number };
}): string | null {
  if (!stage) return null;

  const previous = {
    x: stage.x(),
    y: stage.y(),
    scaleX: stage.scaleX(),
    scaleY: stage.scaleY(),
    width: stage.width(),
    height: stage.height(),
  };

  try {
    const bounds = options.bounds ?? stage.getClientRect({ skipTransform: true });
    if (bounds.width <= 0 || bounds.height <= 0) return null;

    stage.scale({ x: 1, y: 1 });
    stage.position({ x: -bounds.x, y: -bounds.y });
    stage.size({ width: Math.ceil(bounds.width), height: Math.ceil(bounds.height) });
    stage.draw();

    return stage.toDataURL({
      mimeType: options.mimeType,
      pixelRatio: options.pixelRatio,
      // JPEG has no alpha; a middling quality would be a silent downgrade.
      quality: 1,
    });
  } finally {
    stage.scale({ x: previous.scaleX, y: previous.scaleY });
    stage.position({ x: previous.x, y: previous.y });
    stage.size({ width: previous.width, height: previous.height });
    stage.draw();
  }
}
