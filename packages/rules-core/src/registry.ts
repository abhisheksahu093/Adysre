import type {
  ActionPlugin,
  FieldProviderPlugin,
  FunctionPlugin,
  OperatorPlugin,
  Plugin,
  PluginSet,
  RendererPlugin,
  StoragePlugin,
  ThemePlugin,
  ValidatorPlugin,
  VariableProviderPlugin,
} from '@adysre/rules-types';
import { RuleError } from './errors';

/**
 * The plugin registry: what this engine can do, right now.
 *
 * Two decisions shape it.
 *
 * It is IMMUTABLE. `extend` returns a new registry rather than mutating one, so
 * an executor holding a registry cannot have the ground move under it
 * mid-evaluation, and two tenants or two tests can hold different capabilities
 * at the same time without one leaking into the other. A registry that could be
 * mutated globally is a registry where the answer to a rule depends on what
 * else the process happened to load.
 *
 * Registering a duplicate id THROWS, at registration. That is a programming
 * error - two plugins claiming `equals` - and the moment to discover it is when
 * the application starts, not when a rule runs at three in the morning and
 * silently gets the wrong one. Lookups, by contrast, never throw: an unknown
 * operator is a fact about a stored rule, which the executor reports as a
 * diagnostic pointing at the node.
 */

export interface Registry {
  readonly operators: ReadonlyMap<string, OperatorPlugin>;
  readonly functions: ReadonlyMap<string, FunctionPlugin>;
  readonly actions: ReadonlyMap<string, ActionPlugin>;
  readonly fieldProviders: readonly FieldProviderPlugin[];
  readonly variableProviders: readonly VariableProviderPlugin[];
  readonly renderers: ReadonlyMap<string, RendererPlugin<unknown>>;
  readonly validators: readonly ValidatorPlugin[];
  readonly storage: ReadonlyMap<string, StoragePlugin>;
  readonly themes: ReadonlyMap<string, ThemePlugin>;

  operator(id: string): OperatorPlugin | undefined;
  function(id: string): FunctionPlugin | undefined;
  action(id: string): ActionPlugin | undefined;
  renderer(format: string): RendererPlugin<unknown> | undefined;

  /** A new registry with these plugins added. The original is untouched. */
  extend(set: PluginSet): Registry;

  /** Everything registered, for a builder's pickers and for diagnostics. */
  describe(): RegistrySummary;
}

export interface RegistrySummary {
  operators: string[];
  functions: string[];
  actions: string[];
  renderers: string[];
  storage: string[];
  themes: string[];
  fieldProviders: number;
  variableProviders: number;
  validators: number;
}

/** Build a map, refusing a second plugin that claims an id already taken. */
function indexById<T extends Plugin>(
  kind: string,
  existing: ReadonlyMap<string, T>,
  incoming: readonly T[] | undefined,
): Map<string, T> {
  const next = new Map(existing);

  for (const plugin of incoming ?? []) {
    if (!plugin.id || plugin.id.trim() === '') {
      throw new RuleError('invalid_argument', `A ${kind} plugin has no id.`);
    }
    if (next.has(plugin.id)) {
      throw new RuleError(
        'invalid_argument',
        `Two ${kind} plugins claim the id "${plugin.id}". Ids are the contract stored rules refer to, so they have to be unique.`,
        plugin.id,
      );
    }
    next.set(plugin.id, plugin);
  }

  return next;
}

/** Renderers are addressed by output format, not by plugin id. */
function indexByFormat(
  existing: ReadonlyMap<string, RendererPlugin<unknown>>,
  incoming: readonly RendererPlugin<unknown>[] | undefined,
): Map<string, RendererPlugin<unknown>> {
  const next = new Map(existing);

  for (const plugin of incoming ?? []) {
    if (next.has(plugin.format)) {
      throw new RuleError(
        'invalid_argument',
        `Two renderers claim the format "${plugin.format}".`,
        plugin.id,
      );
    }
    next.set(plugin.format, plugin);
  }

  return next;
}

interface RegistryState {
  operators: ReadonlyMap<string, OperatorPlugin>;
  functions: ReadonlyMap<string, FunctionPlugin>;
  actions: ReadonlyMap<string, ActionPlugin>;
  fieldProviders: readonly FieldProviderPlugin[];
  variableProviders: readonly VariableProviderPlugin[];
  renderers: ReadonlyMap<string, RendererPlugin<unknown>>;
  validators: readonly ValidatorPlugin[];
  storage: ReadonlyMap<string, StoragePlugin>;
  themes: ReadonlyMap<string, ThemePlugin>;
}

const EMPTY: RegistryState = {
  operators: new Map(),
  functions: new Map(),
  actions: new Map(),
  fieldProviders: [],
  variableProviders: [],
  renderers: new Map(),
  validators: [],
  storage: new Map(),
  themes: new Map(),
};

function build(state: RegistryState): Registry {
  const registry: Registry = {
    ...state,

    operator: (id) => state.operators.get(id),
    function: (id) => state.functions.get(id),
    action: (id) => state.actions.get(id),
    renderer: (format) => state.renderers.get(format),

    extend: (set) =>
      build({
        operators: indexById('operator', state.operators, set.operators),
        functions: indexById('function', state.functions, set.functions),
        actions: indexById('action', state.actions, set.actions),
        // Providers and validators are LISTS, not maps: several may contribute
        // at once, and a builder shows the union of every provider's fields.
        fieldProviders: [...state.fieldProviders, ...(set.fields ?? [])],
        variableProviders: [...state.variableProviders, ...(set.variables ?? [])],
        renderers: indexByFormat(state.renderers, set.renderers),
        validators: [...state.validators, ...(set.validators ?? [])],
        storage: indexById('storage', state.storage, set.storage),
        themes: indexById('theme', state.themes, set.themes),
      }),

    describe: () => ({
      operators: [...state.operators.keys()].sort(),
      functions: [...state.functions.keys()].sort(),
      actions: [...state.actions.keys()].sort(),
      renderers: [...state.renderers.keys()].sort(),
      storage: [...state.storage.keys()].sort(),
      themes: [...state.themes.keys()].sort(),
      fieldProviders: state.fieldProviders.length,
      variableProviders: state.variableProviders.length,
      validators: state.validators.length,
    }),
  };

  // Frozen so a caller cannot reach in and add a plugin behind `extend`'s back,
  // which would defeat the point of an immutable registry.
  return Object.freeze(registry);
}

/**
 * A registry holding the given plugin sets.
 *
 * Deliberately empty by default: a host chooses what its rules may do, and
 * "everything that ships with the engine" is a choice rather than a default.
 * Pass `builtinPlugins` for the usual set.
 *
 * @example
 * const registry = createRegistry(builtinPlugins, { operators: [withinBusinessHours] });
 */
export function createRegistry(...sets: readonly PluginSet[]): Registry {
  return sets.reduce<Registry>((registry, set) => registry.extend(set), build(EMPTY));
}

/**
 * What a presence check needs: which plugins EXIST, not what they do.
 *
 * Narrower than `Registry` on purpose. An importer holds the ids a rule refers
 * to and wants to know whether this deployment has them; asking it to carry a
 * whole registry to answer that would make the check harder to use than to skip.
 */
export interface PluginPresence {
  operators: ReadonlyMap<string, unknown>;
  functions: ReadonlyMap<string, unknown>;
}

/**
 * Which plugins a rule needs that a registry does not have.
 *
 * The check a host runs before saving or importing: a rule referring to an
 * operator nobody registered is a rule that will error at evaluation, and
 * saying so at import time is the difference between a clear message and a
 * mystery in production.
 */
export function missingPlugins(
  registry: PluginPresence,
  required: { operators: readonly string[]; functions: readonly string[] },
): { operators: string[]; functions: string[] } {
  return {
    operators: required.operators.filter((id) => !registry.operators.has(id)),
    functions: required.functions.filter((id) => !registry.functions.has(id)),
  };
}
