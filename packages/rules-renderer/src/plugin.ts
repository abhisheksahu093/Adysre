import type { RendererPlugin, RuleDocument, RuleNode } from '@adysre/rules-types';
import { describeNode, describeRule, toPlainText, type RenderOptions } from './render.ts';
import { phrasesWith } from './phrases.ts';

/**
 * The renderer, as a plugin.
 *
 * Registering it is what lets everything downstream ask for "the `nrl` form of
 * this rule" without knowing which package produces it - which is the point of
 * addressing renderers by FORMAT rather than by plugin id. A host that prefers
 * its own wording registers a different plugin under the same format, and the
 * builder, the debugger and the audit log all change together.
 */
export function createNrlRenderer(options: RenderOptions = {}): RendererPlugin<string> {
  const phrases = phrasesWith(options.phrases);

  return {
    id: 'nrl',
    labelKey: 'renderers.nrl',
    format: 'nrl',
    renderRule: (rule: RuleDocument) => describeRule(rule, options).text,
    renderNode: (node: RuleNode) => toPlainText(describeNode(node, options), phrases),
  };
}
