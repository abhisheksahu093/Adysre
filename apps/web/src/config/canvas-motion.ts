/**
 * How the home page's dot grid answers the cursor.
 *
 * The canvas is dragged, not tilted: a pointer move adds velocity to the field,
 * friction bleeds it off, and a spring pulls the field back to rest, so the dots
 * travel the way the hand travelled and settle a moment after it stops. These
 * five numbers are the whole feel of that, kept here rather than buried in the
 * component so the motion can be tuned without reading the loop, and so nothing
 * in `@/data/workbench` (server-only, it imports the catalogues) has to be
 * pulled into the browser to get them.
 *
 * Distances are in CSS pixels; the rest are per-frame factors at 60fps.
 */
export const CANVAS_MOTION = {
  /**
   * Furthest the field may be dragged from rest. Held under one grid tile
   * (`--grid-tile`, 26px): past that the dots land where their neighbours were
   * and the movement stops reading as movement.
   */
  maxShift: 16,
  /** Share of a pointer move that becomes velocity. Higher follows the hand more literally. */
  push: 0.12,
  /** Velocity kept each frame. Lower stops the field sooner after the cursor does. */
  friction: 0.86,
  /** Share of the remaining distance the spring reclaims each frame. */
  pull: 0.06,
  /** Below this much combined movement the field is at rest and the loop stops. */
  rest: 0.02,
} as const;

/**
 * The links the cursor draws between dots.
 *
 * Moving the pointer wires the grid up around it: neighbouring dots join, most
 * brightly along the line the hand is travelling, and the mesh fades out again
 * once it stops. Only the dots inside `reach` are ever considered, so the work
 * per frame is a fixed small square of the grid however long the page is.
 */
export const CANVAS_LINKS = {
  /** Radius around the cursor, in pixels, where dots can link at all. */
  reach: 190,
  /** Strongest a link ever gets, at the cursor, along the direction of travel. */
  peakOpacity: 0.75,
  /**
   * Width in pixels of a link dead on the heading. Off-axis links thin back down
   * to a hairline, so the direction of travel reads as a drawn stroke through a
   * mesh rather than as the only thing lit.
   */
  peakWidth: 1.8,
  /**
   * Share of a link's strength that comes from alignment with the movement
   * rather than from proximity. At 0 the mesh is a plain circle; at 1 only the
   * lines pointing the way the hand went are drawn at all.
   */
  directionBias: 0.8,
  /**
   * How sharply alignment falls off either side of the direction of travel.
   * Alignment is raised to this power, so 1 is a soft lean and 5 is a beam: a
   * link 30 degrees off the heading keeps 87% of its light at 1 and 56% at 4,
   * and one 60 degrees off drops from 50% to 6%.
   */
  directionFocus: 4,
  /** Pointer speed, in pixels per frame, that fully charges the mesh. */
  fullChargeSpeed: 26,
  /** Share of the charge kept each frame once the pointer stops. */
  decay: 0.93,
  /** Below this charge nothing is drawn and the canvas is cleared. */
  faint: 0.02,
} as const;
