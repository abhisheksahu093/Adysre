import type { ActionNode, ActionPlugin, RuleKind } from '@adysre/rules-types';

/**
 * Which outcomes a rule of this kind can have, and which boxes each one draws.
 *
 * Actions are entirely the host's: nothing ships with the engine, because what
 * a matching rule DOES is the one thing a rules engine cannot know. So the
 * builder reads the plugin and, when there is no plugin, admits it rather than
 * guessing.
 */

/**
 * The actions worth offering for a rule of this kind.
 *
 * A plugin with no `kinds` fits every kind. That is the same fall-open default
 * as an operator with no `accepts`, and for the same reason: hiding an action
 * somebody needed is worse than offering one that turns out not to suit.
 */
export function actionsFor(
  actions: Iterable<ActionPlugin>,
  kind: RuleKind | undefined,
): ActionPlugin[] {
  const all = [...actions];
  if (kind === undefined) return all;
  return all.filter((plugin) => plugin.kinds === undefined || plugin.kinds.includes(kind));
}

/**
 * Whether to draw the target box.
 *
 * Three ways to say yes, in order of how much they know:
 *
 * 1. the plugin declares `requiresTarget`;
 * 2. the action already HAS a target, so an imported rule does not lose it the
 *    moment somebody opens it in a builder that decided not to show it;
 * 3. there is no plugin at all, in which case the honest answer is that we do
 *    not know, and an editable box is recoverable where a hidden one is not.
 */
export function showsTarget(plugin: ActionPlugin | undefined, node: ActionNode): boolean {
  if (plugin === undefined) return true;
  return plugin.requiresTarget === true || node.target !== undefined;
}

export function showsValue(plugin: ActionPlugin | undefined, node: ActionNode): boolean {
  if (plugin === undefined) return true;
  return plugin.requiresValue === true || node.value !== undefined;
}
