/**
 * `@adysre/rules-parser` - rules written somewhere else, brought in here.
 *
 * Two rules govern the whole package.
 *
 * NOTHING THROWS. A bad import is a message to show a person, so every importer
 * returns diagnostics carrying the path into the SOURCE document, because the
 * person fixing it is looking at their file rather than at ours.
 *
 * NEVER A PARTIAL IMPORT. If any part of a source rule cannot be converted, the
 * whole import fails. A rule that quietly does less than the one it came from is
 * discovered in production; an import that refused is discovered in the dialog.
 *
 * Between them sits the distinction most of this package is about: an exact
 * equivalent converts silently, a near equivalent converts with a WARNING naming
 * the difference, and no equivalent is an ERROR.
 */

export * from './import';
export * from './importers/ast';
export * from './importers/json-logic';
export * from './importers/json-rules-engine';
export * from './importers/mongo';
export * from './types';
