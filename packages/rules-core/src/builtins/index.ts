import type { PluginSet } from '@adysre/rules-types';
import { builtinFunctions } from './functions.ts';
import { builtinOperators } from './operators.ts';

/**
 * The plugins that ship with the engine.
 *
 * Offered, not imposed: `createRegistry()` starts empty, and a host passes this
 * in when it wants the usual vocabulary. A deployment that lets untrusted
 * authors write rules can take the operators it wants and leave `matches`
 * behind, which is only possible because they are plugins rather than a
 * built-in switch statement.
 */
export const builtinPlugins: PluginSet = {
  operators: builtinOperators,
  functions: builtinFunctions,
};

export { builtinFunctions, builtinOperators };
export {
  compareValues,
  isDateString,
  isEmptyValue,
  toList,
  toNumber,
  toText,
  valuesEqual,
} from './compare.ts';
