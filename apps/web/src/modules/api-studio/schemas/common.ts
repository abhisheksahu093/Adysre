/**
 * ADYSRE API Studio - shared schema primitives.
 *
 * The types in `../types` are the domain language; these schemas are how
 * untrusted JSON becomes one of them. Each schema is annotated with
 * {@link Parser}, which pins its OUTPUT to the hand-written type: if a field is
 * added to a type and not to its schema, the build fails. That is the whole
 * point of writing them separately rather than inferring the types from Zod -
 * the domain model stays readable, and parity is still checked by the compiler.
 */

import { z } from 'zod';
import type { ApiVariable, KeyValueEntry, NodeColor } from '../types';
import { NODE_COLORS } from '../types';
import { MAX_HEADER_VALUE_LENGTH } from '../constants/limits';

/**
 * A schema that parses arbitrary input into `T`.
 *
 * The `unknown` input parameter is what allows `.default()` and `.catch()`
 * inside: the parsed result must be exactly `T`, while the accepted input stays
 * as loose as a real import file needs it to be.
 */
export type Parser<T> = z.ZodType<T, z.ZodTypeDef, unknown>;

/** Ids are UUIDs (UUIDv7 in the database; the client generates them too). */
export const idSchema = z.string().uuid();

/** A user-facing name. Trimmed, bounded, never empty. */
export const nameSchema = z.string().trim().min(1).max(200);

export const descriptionSchema = z.string().max(4_000).default('');

export const tagsSchema = z.array(z.string().trim().min(1).max(40)).max(50).default([]);

export const colorSchema: Parser<NodeColor | null> = z
  .enum(NODE_COLORS)
  .nullable()
  .default(null);

/**
 * One header / query / form row.
 *
 * Keys are not validated against the HTTP token grammar here: the builder must
 * let someone type a half-finished header without being shouted at. The runner
 * rejects malformed names at the boundary where it matters.
 */
export const keyValueEntrySchema: Parser<KeyValueEntry> = z.object({
  id: idSchema,
  key: z.string().max(1_024).default(''),
  value: z.string().max(MAX_HEADER_VALUE_LENGTH).default(''),
  enabled: z.boolean().default(true),
  description: descriptionSchema,
});

export const variableSchema: Parser<ApiVariable> = z.object({
  id: idSchema,
  key: z
    .string()
    .trim()
    .min(1)
    .max(200)
    // The resolver's `{{name}}` grammar: anything else could not be referenced.
    .regex(/^[A-Za-z0-9_.-]+$/, 'Use letters, numbers, dot, dash or underscore'),
  value: z.string().max(100_000).default(''),
  initialValue: z.string().max(100_000).default(''),
  secret: z.boolean().default(false),
  enabled: z.boolean().default(true),
  description: descriptionSchema,
});
