import {
  Boxes,
  Braces,
  Bug,
  Cable,
  Database,
  FileJson2,
  Import,
  Languages,
  Palette,
  PlayCircle,
  PanelsTopLeft,
  Settings2,
  type LucideIcon,
} from 'lucide-react';

import { builtinFunctions, builtinOperators } from '@adysre/rules-core';
import { COMBINATORS, RULE_KINDS } from '@adysre/rules-types';
import { EXAMPLES } from '@adysre/rules-playground';

import corePkg from '@adysre/rules-core/package.json';
import devtoolsPkg from '@adysre/rules-devtools/package.json';
import nextPkg from '@adysre/rules-next/package.json';
import parserPkg from '@adysre/rules-parser/package.json';
import playgroundPkg from '@adysre/rules-playground/package.json';
import reactPkg from '@adysre/rules-react/package.json';
import rendererPkg from '@adysre/rules-renderer/package.json';
import storagePkg from '@adysre/rules-storage/package.json';
import themePkg from '@adysre/rules-theme/package.json';
import typesPkg from '@adysre/rules-types/package.json';
import uiPkg from '@adysre/rules-ui/package.json';

/**
 * The Business Rules Engine, as the showcase page needs to describe it.
 *
 * ─── Nothing here is typed twice ────────────────────────────────────────────
 * Package names, versions and one-line summaries are read from the real
 * manifests, and every FIGURE derives from the engine itself: the operator
 * count is `builtinOperators.length`, the rule kinds are `RULE_KINDS`, the
 * example count is the verified `EXAMPLES` array. Registering a twenty-eighth
 * operator updates this page with no edit, and the page can never claim a
 * number the engine does not have. (Rule 6, and the same rule
 * `@/data/library-stats` already follows for the library.)
 *
 * Package summaries ship as DATA rather than translation keys, the same way the
 * tech-stack names in `website-intelligence.ts` do: `@adysre/rules-core` is a
 * proper noun, and the engine is English-only by decision - see the note in
 * `documents/RULES_ENGINE.md`. Everything the PAGE says on its own behalf is a
 * key under `rules.*`.
 */

export interface RulesPackage {
  /** Stable id, and the key under `rules.packages.<id>` for its role label. */
  id: string;
  name: string;
  version: string;
  /** From the manifest: the one line the package describes itself with. */
  description: string;
  icon: LucideIcon;
}

/** Read a manifest without repeating its shape at each call site. */
function fromManifest(
  id: string,
  manifest: { name: string; version: string; description?: string },
  icon: LucideIcon,
): RulesPackage {
  return {
    id,
    name: manifest.name,
    version: manifest.version,
    description: manifest.description ?? '',
    icon,
  };
}

/**
 * Every package, in dependency order rather than alphabetical.
 *
 * A reader meeting this list wants to know what sits on what: the vocabulary,
 * then the engine, then the things that project it. Alphabetical would open
 * with the debugger, which is the last thing anybody needs.
 */
export const RULES_PACKAGES: RulesPackage[] = [
  fromManifest('types', typesPkg, Braces),
  fromManifest('core', corePkg, Boxes),
  fromManifest('parser', parserPkg, Import),
  fromManifest('renderer', rendererPkg, Languages),
  fromManifest('storage', storagePkg, Database),
  fromManifest('react', reactPkg, Settings2),
  fromManifest('ui', uiPkg, PanelsTopLeft),
  fromManifest('devtools', devtoolsPkg, Bug),
  fromManifest('next', nextPkg, Cable),
  fromManifest('theme', themePkg, Palette),
  fromManifest('playground', playgroundPkg, PlayCircle),
];

export const PACKAGE_COUNT = RULES_PACKAGES.length;
export const OPERATOR_COUNT = builtinOperators.length;
export const FUNCTION_COUNT = builtinFunctions.length;
export const RULE_KIND_COUNT = RULE_KINDS.length;
export const COMBINATOR_COUNT = COMBINATORS.length;
export const EXAMPLE_COUNT = EXAMPLES.length;

export interface RulesStat {
  /** Key under `rules.stats.<id>`. */
  id: string;
  value: number;
}

/**
 * The figures the page leads with.
 *
 * No `+` suffix on any of them, unlike the library's stats band. These are
 * exact and knowable - there are twenty-seven operators, not "27+" - and a
 * floor reads as marketing where a count reads as a fact.
 */
export const RULES_STATS: RulesStat[] = [
  { id: 'packages', value: PACKAGE_COUNT },
  { id: 'operators', value: OPERATOR_COUNT },
  { id: 'functions', value: FUNCTION_COUNT },
  { id: 'kinds', value: RULE_KIND_COUNT },
];

export interface RulesCapability {
  /** Key under `rules.capabilities.<id>.title` and `.desc`. */
  id: string;
  icon: LucideIcon;
}

/** What the engine does, in the order it does it. */
export const RULES_CAPABILITIES: RulesCapability[] = [
  { id: 'ast', icon: FileJson2 },
  { id: 'plugins', icon: Boxes },
  { id: 'execute', icon: PlayCircle },
  { id: 'explain', icon: Languages },
  { id: 'debug', icon: Bug },
  { id: 'build', icon: PanelsTopLeft },
  { id: 'import', icon: Import },
  { id: 'store', icon: Database },
];

/**
 * The decisions worth knowing before adopting it.
 *
 * Ids resolve to `rules.decisions.<id>.title` and `.desc`. These are the claims
 * that separate this from a rules engine somebody wrote in an afternoon, and
 * each one is something the packages actually enforce rather than aspire to.
 */
export const RULES_DECISIONS = [
  'sourceOfTruth',
  'errorIsNotFalse',
  'noSideEffects',
  'immutableRegistry',
  'traceable',
  'noParsing',
] as const;

/** The formats the parser imports from. Proper nouns, so data rather than keys. */
export const IMPORT_FORMATS = [
  'ADYSRE AST',
  'jsonLogic',
  'json-rules-engine',
  'MongoDB query filters',
] as const;
