import { DEFAULT_MAX_DEPTH } from '@adysre/rules-core';
import type {
  ActionNode,
  FunctionPlugin,
  GroupNode,
  ConditionNode,
  Operand,
  OperatorPlugin,
  RuleDocument,
  RuleNode,
} from '@adysre/rules-types';
import { formatValue, humaniseId, humanisePath, joinList } from './format.ts';
import { fill, phrasesWith, type Phrases } from './phrases.ts';
import { lineText, slot, weave, type RenderedLine, type RenderedRule, type Segment } from './segments.ts';

/**
 * The natural-language renderer.
 *
 * One direction only: AST to language, never language back to AST. A rule
 * builder that also parsed prose would be two systems that eventually disagree,
 * and the one that loses is always the tree, because prose is what people edit.
 *
 * The sentence for each operator comes from the OPERATOR, through `toText`, so
 * this file does not contain a second implementation of the operator set that
 * has to be kept in step with the first. What lives here is everything the
 * plugins deliberately do not know: connective words, value formatting, field
 * labels, and the shape of the outline.
 */

/** The lookup the renderer needs. A `Registry` satisfies it as it stands. */
export interface PluginLookup {
  operator(id: string): OperatorPlugin | undefined;
  function(id: string): FunctionPlugin | undefined;
}

/** The markers a host override splices its operands into. */
export interface ActionSlots {
  action: string;
  target: string | undefined;
  value: string | undefined;
}

export interface RenderOptions {
  /**
   * Where operator and function sentences come from. Absent renders every
   * condition as "not described", which is honest and useless: a renderer
   * without plugins cannot know what `equals` means.
   */
  plugins?: PluginLookup;
  /** BCP 47 tag, for number and date formatting. */
  locale?: string;
  /** Real labels for field paths, usually from `FieldDescriptor.label`. */
  fields?: Readonly<Record<string, string>>;
  /** Replace any of the connective words. This is how a locale is added. */
  phrases?: Partial<Phrases>;
  /** Ceiling on nested function operands, matching the executor's. */
  maxDepth?: number;
  /**
   * Override one operator's sentence. Receives markers, not text: return a
   * template containing them and the renderer splices the operands back in.
   */
  operatorText?: (id: string, left: string, args: string[]) => string | undefined;
  /** The same, for actions. */
  actionText?: (action: ActionNode, slots: ActionSlots) => string | undefined;
}

interface Context {
  plugins: PluginLookup | undefined;
  locale: string | undefined;
  fields: Readonly<Record<string, string>>;
  phrases: Phrases;
  maxDepth: number;
  operatorText: RenderOptions['operatorText'];
  actionText: RenderOptions['actionText'];
}

function contextFrom(options: RenderOptions = {}): Context {
  return {
    plugins: options.plugins,
    locale: options.locale,
    fields: options.fields ?? {},
    phrases: phrasesWith(options.phrases),
    maxDepth: options.maxDepth ?? DEFAULT_MAX_DEPTH,
    operatorText: options.operatorText,
    actionText: options.actionText,
  };
}

/* ── operands ─────────────────────────────────────────────────────────── */

function fieldSegment(path: string, context: Context): Segment {
  return { type: 'field', text: context.fields[path] ?? humanisePath(path), path };
}

function renderOperand(operand: Operand, context: Context, depth: number): Segment[] {
  switch (operand.source) {
    case 'literal':
      return [
        {
          type: 'value',
          text: formatValue(operand.value, { locale: context.locale, phrases: context.phrases }),
          value: operand.value,
        },
      ];

    case 'field':
      return [fieldSegment(operand.path, context)];

    case 'variable':
      return [
        {
          type: 'variable',
          text: context.fields[operand.name] ?? humaniseId(operand.name),
          name: operand.name,
        },
      ];

    case 'function':
      return renderFunction(operand, context, depth);

    default:
      return [
        { type: 'unknown', text: context.phrases.unknownSource, reason: 'operand_source_unknown' },
      ];
  }
}

function renderFunction(
  operand: Extract<Operand, { source: 'function' }>,
  context: Context,
  depth: number,
): Segment[] {
  if (depth >= context.maxDepth) {
    return [{ type: 'unknown', text: context.phrases.tooDeep, reason: 'operand_too_deep' }];
  }

  const plugin = context.plugins?.function(operand.name);
  if (plugin === undefined) {
    return [
      {
        type: 'unknown',
        text: fill(context.phrases.unknownFunction, { id: operand.name }),
        reason: `unknown_function:${operand.name}`,
      },
    ];
  }

  const parts: Segment[][] = [];
  const tokens = operand.args.map((argument) => {
    parts.push(renderOperand(argument, context, depth + 1));
    return slot(parts.length - 1);
  });

  const template =
    plugin.toText?.(tokens) ??
    // No sentence of its own: the id, humanised, applied to its arguments.
    (tokens.length === 0
      ? humaniseId(operand.name)
      : `${humaniseId(operand.name)} ${joinList(tokens, context.phrases)}`);

  const segments = weave(template, parts);

  // A function that mentioned none of its operands - `today`, `now` - is a word
  // in its own right, and worth keeping as one segment a UI can label.
  const usedOperands = segments.some((segment) => segment.type !== 'text');
  if (usedOperands) return segments;

  return [
    { type: 'function', text: segments.map((segment) => segment.text).join(''), id: operand.name },
  ];
}

/* ── conditions ───────────────────────────────────────────────────────── */

/** One comparison, as a sentence written by its own operator. */
export function describeCondition(node: ConditionNode, options: RenderOptions = {}): Segment[] {
  return renderCondition(node, contextFrom(options));
}

function renderCondition(node: ConditionNode, context: Context): Segment[] {
  const parts: Segment[][] = [];
  const push = (segments: Segment[]): string => {
    parts.push(segments);
    return slot(parts.length - 1);
  };

  const left = push(renderOperand(node.left, context, 0));
  const args = node.args.map((operand) => push(renderOperand(operand, context, 0)));

  const plugin = context.plugins?.operator(node.operator);
  const override = context.operatorText?.(node.operator, left, args);

  let segments: Segment[];

  if (override !== undefined) {
    segments = weave(override, parts);
  } else if (plugin === undefined) {
    // Nothing to describe with. Collapse to a single segment saying so, rather
    // than inventing a sentence around an operator whose meaning is unknown.
    const rendered = weave(
      fill(context.phrases.unknownOperator, { left, id: node.operator }),
      parts,
    );
    segments = [
      {
        type: 'unknown',
        text: rendered.map((segment) => segment.text).join(''),
        reason: `unknown_operator:${node.operator}`,
      },
    ];
  } else if (plugin.toText !== undefined) {
    segments = weave(plugin.toText(left, args), parts);
  } else {
    const tail = args.length === 0 ? '' : ` ${joinList(args, context.phrases)}`;
    segments = weave(`${left} ${humaniseId(node.operator)}${tail}`, parts);
  }

  if (node.negate !== true) return segments;
  return weave(fill(context.phrases.notCondition, { condition: slot(0) }), [segments]);
}

/* ── groups ───────────────────────────────────────────────────────────── */

function headingFor(node: GroupNode, context: Context): string {
  const { phrases } = context;
  if (node.children.length === 0) return phrases.always;

  const negated = node.negate === true;
  switch (node.combinator) {
    case 'all':
      return negated ? phrases.notAll : phrases.all;
    case 'any':
      return negated ? phrases.notAny : phrases.any;
    case 'none':
      return negated ? phrases.notNone : phrases.none;
    default:
      return phrases.unknownSource;
  }
}

/**
 * A group holding exactly one child says nothing that the child does not.
 *
 * `all(X)` is X, and rendering "all of these are true:" above a single bullet
 * is noise a reader has to see past. `none` is excluded because it inverts, and
 * a negated group is excluded because it does too.
 */
function unwrap(node: RuleNode): RuleNode {
  let current = node;

  while (
    current.kind === 'group' &&
    current.negate !== true &&
    current.combinator !== 'none' &&
    current.children.length === 1
  ) {
    const only = current.children[0];
    if (only === undefined) break;
    current = only;
  }

  return current;
}

/**
 * The outline for one node.
 *
 * Iterative, for the same reason the walker and the executor are: an imported
 * tree was not authored by anyone you know.
 */
export function describeNode(
  node: RuleNode,
  options: RenderOptions = {},
  startDepth = 0,
): RenderedLine[] {
  return renderTree(node, contextFrom(options), startDepth);
}

function renderTree(root: RuleNode, context: Context, startDepth: number): RenderedLine[] {
  const lines: RenderedLine[] = [];
  const stack: { node: RuleNode; depth: number }[] = [{ node: root, depth: startDepth }];

  while (stack.length > 0) {
    const item = stack.pop();
    if (item === undefined) break;

    const node = unwrap(item.node);

    if (node.kind === 'condition') {
      lines.push({
        nodeId: node.id,
        role: 'condition',
        depth: item.depth,
        segments: renderCondition(node, context),
      });
      continue;
    }

    if (node.kind !== 'group') {
      const unknown = node as { id?: unknown; kind?: unknown };
      lines.push({
        ...(typeof unknown.id === 'string' ? { nodeId: unknown.id } : {}),
        role: 'condition',
        depth: item.depth,
        segments: [
          {
            type: 'unknown',
            text: context.phrases.unknownSource,
            reason: `unknown_node_kind:${String(unknown.kind)}`,
          },
        ],
      });
      continue;
    }

    lines.push({
      nodeId: node.id,
      role: 'heading',
      depth: item.depth,
      segments: [{ type: 'text', text: headingFor(node, context) }],
    });

    for (let index = node.children.length - 1; index >= 0; index -= 1) {
      const child = node.children[index];
      if (child !== undefined) stack.push({ node: child, depth: item.depth + 1 });
    }
  }

  return lines;
}

/* ── actions ──────────────────────────────────────────────────────────── */

function renderAction(node: ActionNode, context: Context): Segment[] {
  const parts: Segment[][] = [];
  const push = (segments: Segment[]): string => {
    parts.push(segments);
    return slot(parts.length - 1);
  };

  const actionSlot = push([{ type: 'text', text: humaniseId(node.type) }]);
  const targetSlot = node.target === undefined ? undefined : push([fieldSegment(node.target, context)]);
  const valueSlot = node.value === undefined ? undefined : push(renderOperand(node.value, context, 0));

  const slots: ActionSlots = { action: actionSlot, target: targetSlot, value: valueSlot };
  const { phrases } = context;

  const template =
    context.actionText?.(node, slots) ??
    // Action plugins describe an APPLIED action, with its operands already
    // resolved; this is an action still in the tree, so the default is built
    // from what the AST actually holds. A host with better words passes
    // `actionText`.
    (targetSlot !== undefined && valueSlot !== undefined
      ? fill(phrases.actionWithTargetAndValue, {
          action: actionSlot,
          target: targetSlot,
          value: valueSlot,
        })
      : targetSlot !== undefined
        ? fill(phrases.actionWithTarget, { action: actionSlot, target: targetSlot })
        : valueSlot !== undefined
          ? fill(phrases.actionWithValue, { action: actionSlot, value: valueSlot })
          : fill(phrases.actionPlain, { action: actionSlot }));

  return weave(template, parts);
}

/* ── rules ────────────────────────────────────────────────────────────── */

/** The whole rule: a title, its conditions, and what it does. */
export function describeRule(rule: RuleDocument, options: RenderOptions = {}): RenderedRule {
  const context = contextFrom(options);
  const { phrases } = context;
  const lines: RenderedLine[] = [{ role: 'title', depth: 0, segments: [{ type: 'text', text: rule.name }] }];

  lines.push(...conditionLines(rule.when, context));
  lines.push(...actionLines(rule.then ?? [], phrases.then, phrases.thenHeading, context));
  lines.push(...actionLines(rule.otherwise ?? [], phrases.otherwise, phrases.otherwiseHeading, context));

  return {
    ruleId: rule.id,
    title: rule.name,
    lines,
    text: toPlainText(lines, phrases),
  };
}

function conditionLines(when: GroupNode, context: Context): RenderedLine[] {
  const root = unwrap(when);
  const wrap = (segments: Segment[]): Segment[] =>
    weave(fill(context.phrases.when, { conditions: slot(0) }), [segments]);

  // One condition, or none at all: the whole rule fits on the "When" line, and
  // a heading above a single bullet is noise.
  if (root.kind === 'condition') {
    return [
      { nodeId: root.id, role: 'condition', depth: 0, segments: wrap(renderCondition(root, context)) },
    ];
  }

  if (root.kind === 'group' && root.children.length === 0) {
    return [
      {
        nodeId: root.id,
        role: 'condition',
        depth: 0,
        segments: wrap([{ type: 'text', text: context.phrases.always }]),
      },
    ];
  }

  const [head, ...rest] = renderTree(root, context, 0);
  if (head === undefined) return [];
  return [{ ...head, segments: wrap(head.segments) }, ...rest];
}

function actionLines(
  actions: readonly ActionNode[],
  inline: string,
  heading: string,
  context: Context,
): RenderedLine[] {
  if (actions.length === 0) return [];

  const first = actions[0];
  if (actions.length === 1 && first !== undefined) {
    return [
      {
        nodeId: first.id,
        role: 'action',
        depth: 0,
        segments: weave(fill(inline, { actions: slot(0) }), [renderAction(first, context)]),
      },
    ];
  }

  return [
    { role: 'heading', depth: 0, segments: [{ type: 'text', text: heading }] },
    ...actions.map((action): RenderedLine => ({
      nodeId: action.id,
      role: 'action',
      depth: 1,
      segments: renderAction(action, context),
    })),
  ];
}

/**
 * The outline as text.
 *
 * Indentation and a bullet per level, and no invented punctuation: headings
 * carry their own colon as part of the phrase, because where a colon goes is a
 * fact about a language rather than about a rule.
 */
export function toPlainText(lines: readonly RenderedLine[], phrases: Phrases): string {
  return lines
    .map((line) => {
      const indent = phrases.indent.repeat(line.depth);
      const bullet = line.depth > 0 ? phrases.bullet : '';
      return `${indent}${bullet}${lineText(line)}`;
    })
    .join('\n');
}
