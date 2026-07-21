/**
 * Design Playground - the contract for AI-generated sections.
 *
 * The model returns a DESIGN, not code: a shallow tree of boxes and text that
 * `templates.materialize` turns into real nodes. Two consequences follow, and
 * both are deliberate:
 *
 *  - The schema is deliberately small (a frame with one level of children).
 *    A generator constrained to shapes it can fill reliably beats a richer one
 *    that half-fails, and the result is editable either way.
 *  - Model output is DATA, never instructions. `toTemplate` re-validates every
 *    field and clamps it into range, so a malformed or hostile response can
 *    only ever produce a boring rectangle - never a crash, and never a value
 *    the canvas has not vetted.
 */

import { box, type TemplateSpec } from './templates';

/** The JSON Schema handed to the model. Kept flat on purpose (see above). */
export const AI_SECTION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['name', 'width', 'height', 'background', 'children'],
  properties: {
    name: { type: 'string', description: 'Short name for the section, e.g. "Hero".' },
    width: { type: 'integer', description: 'Section width in pixels, 320-1920.' },
    height: { type: 'integer', description: 'Section height in pixels, 120-2000.' },
    background: { type: 'string', description: 'Background colour as #rrggbb.' },
    children: {
      type: 'array',
      description: 'Elements laid out inside the section, positioned absolutely.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['type', 'name', 'x', 'y', 'width', 'height'],
        properties: {
          type: { type: 'string', enum: ['rectangle', 'ellipse', 'text'] },
          name: { type: 'string', description: 'Layer name, e.g. "Headline".' },
          x: { type: 'integer', description: 'Left edge, relative to the section.' },
          y: { type: 'integer', description: 'Top edge, relative to the section.' },
          width: { type: 'integer' },
          height: { type: 'integer' },
          fill: { type: 'string', description: 'Fill colour as #rrggbb.' },
          radius: { type: 'integer', description: 'Corner radius in pixels.' },
          text: { type: 'string', description: 'Copy, for text elements only.' },
          fontSize: { type: 'integer', description: 'Font size in pixels.' },
          fontWeight: { type: 'integer', description: '400 for body, 700 for headings.' },
          align: { type: 'string', enum: ['left', 'center', 'right'] },
        },
      },
    },
  },
} as const;

/** What the route returns, and the panel consumes. */
export interface AiSection {
  name: string;
  width: number;
  height: number;
  background: string;
  children: AiChild[];
}

interface AiChild {
  type: 'rectangle' | 'ellipse' | 'text';
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  radius?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number;
  align?: 'left' | 'center' | 'right';
}

const LIMITS = {
  width: { min: 320, max: 1920 },
  height: { min: 120, max: 2000 },
  child: { min: 1, max: 4000 },
  fontSize: { min: 8, max: 200 },
  /** A section the user cannot select through would be worse than a short one. */
  children: 40,
} as const;

const clamp = (value: number, min: number, max: number): number =>
  Math.round(Math.min(max, Math.max(min, Number.isFinite(value) ? value : min)));

/** A colour we are willing to paint with, or null to leave it unset. */
function colour(value: unknown): string | null {
  return typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value) ? value : null;
}

function text(value: unknown, fallback = ''): string {
  // Cap length so one runaway string cannot dominate a layer name or the canvas.
  return typeof value === 'string' ? value.slice(0, 400) : fallback;
}

/**
 * Convert a validated model response into a template.
 *
 * Every numeric field is clamped rather than rejected: a section that is 10px
 * tall because the model guessed badly is still something the user can drag
 * into shape, whereas a hard failure gives them nothing.
 */
export function toTemplate(section: AiSection): TemplateSpec {
  const width = clamp(section.width, LIMITS.width.min, LIMITS.width.max);
  const height = clamp(section.height, LIMITS.height.min, LIMITS.height.max);

  const children: TemplateSpec[] = (Array.isArray(section.children) ? section.children : [])
    .slice(0, LIMITS.children)
    .map((child): TemplateSpec => {
      const childWidth = clamp(child.width, LIMITS.child.min, LIMITS.child.max);
      const childHeight = clamp(child.height, LIMITS.child.min, LIMITS.child.max);
      const type = child.type === 'ellipse' || child.type === 'text' ? child.type : 'rectangle';
      const fill = colour(child.fill);

      return {
        type,
        name: text(child.name, 'Layer').slice(0, 60) || 'Layer',
        transform: {
          x: clamp(child.x, -LIMITS.child.max, LIMITS.child.max),
          y: clamp(child.y, -LIMITS.child.max, LIMITS.child.max),
          width: childWidth,
          height: childHeight,
          rotation: 0,
        },
        style: {
          fill: fill ?? (type === 'text' ? '#111827' : '#e5e7eb'),
          stroke: null,
          strokeWidth: 0,
          radius: clamp(child.radius ?? 0, 0, Math.min(childWidth, childHeight) / 2),
          opacity: 1,
        },
        ...(type === 'text'
          ? {
              text: {
                text: text(child.text, 'Text') || 'Text',
                fontSize: clamp(child.fontSize ?? 16, LIMITS.fontSize.min, LIMITS.fontSize.max),
                fontWeight: child.fontWeight === 700 ? 700 : 400,
                align:
                  child.align === 'center' || child.align === 'right' ? child.align : 'left',
              },
            }
          : {}),
      };
    });

  return {
    type: 'frame',
    name: text(section.name, 'Section').slice(0, 60) || 'Section',
    transform: box(width, height),
    style: {
      fill: colour(section.background) ?? '#ffffff',
      stroke: null,
      strokeWidth: 0,
      radius: 0,
      opacity: 1,
    },
    children,
  };
}
