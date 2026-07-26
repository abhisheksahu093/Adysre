/**
 * The shape of a partial update.
 *
 * `Partial<T>` is not it. The repo compiles with `exactOptionalPropertyTypes`,
 * under which `Partial<T>` means "the key may be absent" but NOT "the key may
 * be present holding undefined" - while every parsed optional field from Zod is
 * exactly the latter. `Patch<T>` says both, which is what a PATCH body actually
 * is: a set of fields, each of which may be missing.
 */
export type Patch<T> = { [K in keyof T]?: T[K] | undefined };

/**
 * Drop the keys whose value is `undefined`.
 *
 * A parsed PATCH body distinguishes "absent" from "present and undefined" only
 * in the type system; Prisma's update input refuses the latter outright, and
 * rightly so: `{ name: undefined }` in an update reads as an instruction that
 * means nothing. Stripping them turns a partial body into exactly the set of
 * columns the caller asked to change.
 */
export function defined<T extends object>(patch: T): { [K in keyof T]?: Exclude<T[K], undefined> } {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    if (value !== undefined) out[key] = value;
  }
  return out as { [K in keyof T]?: Exclude<T[K], undefined> };
}
