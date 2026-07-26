/**
 * ADYSRE API Studio - validation.
 *
 * Two postures, on purpose:
 * - `request` and `collection` schemas are FORGIVING. They parse imports and
 *   restored drafts, where a missing field should become a default rather than
 *   fail the whole file.
 * - `execution` schemas are STRICT. They parse the instruction to make a
 *   network call, where anything unrecognised is a reason to refuse.
 */

export * from './api';
export * from './collection';
export * from './common';
export * from './execution';
export * from './request';
