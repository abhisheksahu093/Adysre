import type {
  ActionNode,
  AppliedAction,
  ConditionNode,
  Diagnostic,
  EvaluationContext,
  EvaluationOptions,
  GroupNode,
  JsonValue,
  RuleDocument,
  RuleEvaluator,
  RuleNode,
  RuleOutcome,
  RuleSet,
  SetOutcome,
  TraceEvent,
  Verdict,
} from '@adysre/rules-types';
import { RuleError } from './errors';
import type { Registry } from './registry';
import { DEFAULT_MAX_DEPTH, resolveOperand, type MissingKind, type ResolveScope } from './resolve';

/**
 * The executor: an AST, a context and a registry in; a verdict, actions and a
 * trace out.
 *
 * The decisions worth knowing before reading the code.
 *
 * **An error is not a `false`.** When a condition cannot be evaluated - an
 * unknown operator, a type mismatch, a function that threw - the node's verdict
 * is `errored`, and any group containing it is `errored`, and so is the rule.
 * An errored rule applies NO actions. The alternative is a rule that silently
 * stops firing because one branch is broken, which is the failure mode that
 * makes people stop trusting a rules engine. Error wins over a combinator's
 * answer even when the combinator had already decided: a rule you could not
 * fully evaluate does not get to claim it matched.
 *
 * **An empty group matches.** Not because an empty `any` is mathematically
 * true - it is not - but because an empty group means "nothing has been said
 * yet", and every rule starts as one. A builder whose brand-new rule matches
 * nothing, and a `none` that starts out matching everything, are both worse
 * than one consistent answer that reads as "no restriction stated".
 *
 * **Short-circuiting is on, and visible.** `all` stops at the first unmatched
 * child, `any` and `none` at the first matched one, and the trace records only
 * the children that actually ran, so nobody mistakes a skipped branch for a
 * passing one. A debugger turns it off to make every branch report.
 *
 * **The tree is walked iteratively.** Same reason as `walk`: an imported rule
 * was not authored by anyone you know, and a stack overflow inside a rules
 * engine has no useful message.
 */

/** The default ceiling on a single rule. Generous: a rule is not a query. */
export const DEFAULT_TIMEOUT_MS = 1_000;

const monotonic: () => number = (() => {
  const perf = (globalThis as { performance?: { now?: () => number } }).performance;
  return typeof perf?.now === 'function' ? () => perf.now!() : () => Date.now();
})();

interface Settings {
  trace: boolean;
  shortCircuit: boolean;
  maxDepth: number;
  timeoutMs: number;
  clock: () => number;
}

function settingsFrom(options: EvaluationOptions | undefined): Settings {
  return {
    trace: options?.trace ?? true,
    shortCircuit: options?.shortCircuit ?? true,
    maxDepth: options?.maxDepth ?? DEFAULT_MAX_DEPTH,
    timeoutMs: options?.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    clock: options?.clock ?? monotonic,
  };
}

/** Everything one rule's evaluation accumulates. */
interface Run {
  registry: Registry;
  context: EvaluationContext;
  settings: Settings;
  diagnostics: Diagnostic[];
  trace: TraceEvent[];
  startedAt: number;
  timedOut: boolean;
  /** Missing paths already reported, so one absent field is one warning. */
  reported: Set<string>;
}

function report(run: Run, diagnostic: Diagnostic): void {
  run.diagnostics.push(diagnostic);
}

/** A missing field or variable: a warning, named once, never an error. */
function noteMissing(run: Run, kind: MissingKind, name: string): void {
  const key = `${kind}:${name}`;
  if (run.reported.has(key)) return;
  run.reported.add(key);

  report(run, {
    severity: 'warning',
    code: kind === 'field' ? 'field_missing' : 'variable_missing',
    message:
      kind === 'field'
        ? `The subject has no \`${name}\`, so it was read as empty.`
        : `No variable named \`${name}\` was supplied, so it was read as empty.`,
    path: name,
  });
}

function scopeFor(run: Run): ResolveScope {
  return {
    registry: run.registry,
    context: run.context,
    maxDepth: run.settings.maxDepth,
    onMissing: (kind, name) => noteMissing(run, kind, name),
  };
}

/** Time is checked between nodes; see the note on `EvaluationOptions.timeout`. */
function outOfTime(run: Run): boolean {
  if (run.timedOut) return true;
  if (run.settings.clock() - run.startedAt < run.settings.timeoutMs) return false;

  run.timedOut = true;
  report(run, {
    severity: 'error',
    code: 'timeout',
    message: `The rule took longer than ${run.settings.timeoutMs}ms and was abandoned.`,
  });
  return true;
}

/** Inverting an answer. An error and a skip are not answers, so they survive. */
function negated(verdict: Verdict): Verdict {
  if (verdict === 'matched') return 'unmatched';
  if (verdict === 'unmatched') return 'matched';
  return verdict;
}

/** Turn whatever a plugin threw into a diagnostic, and say which it was. */
function diagnoseThrown(error: unknown, node: RuleNode, operator: string): Diagnostic {
  if (error instanceof RuleError) {
    return { severity: 'error', code: error.code, message: error.message, nodeId: node.id };
  }

  // Not a RuleError: the plugin did not decline to answer, it broke. Saying so
  // separately is what keeps "your rule compares text to a number" and "the
  // operator has a bug" from looking like the same event to whoever is on call.
  const message = error instanceof Error ? error.message : String(error);
  return {
    severity: 'error',
    code: 'plugin_failed',
    message: `The operator "${operator}" failed: ${message}`,
    nodeId: node.id,
  };
}

function evaluateCondition(node: ConditionNode, run: Run): Verdict {
  const startedAt = run.settings.clock();
  let left: JsonValue | undefined;
  let args: JsonValue[] | undefined;
  let verdict: Verdict;
  let error: string | undefined;

  try {
    const scope = scopeFor(run);
    left = resolveOperand(node.left, scope);
    args = node.args.map((operand) => resolveOperand(operand, scope));

    const operator = run.registry.operator(node.operator);
    if (operator === undefined) {
      throw new RuleError(
        'unknown_plugin',
        `No operator named "${node.operator}" is registered.`,
        node.operator,
      );
    }

    if (operator.arity !== null && args.length !== operator.arity) {
      throw new RuleError(
        'arity_mismatch',
        `The operator "${node.operator}" expects ${operator.arity} value(s), and the condition supplies ${args.length}.`,
        node.operator,
      );
    }

    const answer = operator.evaluate(left, args, run.context);
    if (typeof answer !== 'boolean') {
      throw new RuleError(
        'invalid_argument',
        `The operator "${node.operator}" answered with something other than true or false.`,
        node.operator,
      );
    }

    verdict = answer ? 'matched' : 'unmatched';
    if (node.negate === true) verdict = negated(verdict);
  } catch (thrown) {
    const diagnostic = diagnoseThrown(thrown, node, node.operator);
    report(run, diagnostic);
    error = diagnostic.message;
    verdict = 'errored';
  }

  if (run.settings.trace) {
    run.trace.push({
      nodeId: node.id,
      kind: 'condition',
      verdict,
      operator: node.operator,
      ...(left === undefined ? {} : { left }),
      ...(args === undefined ? {} : { args }),
      ms: run.settings.clock() - startedAt,
      ...(error === undefined ? {} : { error }),
    });
  }

  return verdict;
}

/** One group's progress through its children. */
interface Frame {
  node: GroupNode;
  index: number;
  ran: string[];
  matched: number;
  errored: number;
  startedAt: number;
  /** Set when short-circuiting has already settled the combinator's answer. */
  decided: Verdict | null;
}

function frameFor(node: GroupNode, run: Run): Frame {
  return {
    node,
    index: 0,
    ran: [],
    matched: 0,
    errored: 0,
    startedAt: run.settings.clock(),
    decided: null,
  };
}

function absorb(frame: Frame, childId: string, verdict: Verdict, shortCircuit: boolean): void {
  frame.ran.push(childId);
  if (verdict === 'matched') frame.matched += 1;
  if (verdict === 'errored') frame.errored += 1;

  if (!shortCircuit || frame.decided !== null) return;

  switch (frame.node.combinator) {
    case 'all':
      if (verdict === 'unmatched') frame.decided = 'unmatched';
      break;
    case 'any':
      if (verdict === 'matched') frame.decided = 'matched';
      break;
    case 'none':
      if (verdict === 'matched') frame.decided = 'unmatched';
      break;
  }
}

function settle(frame: Frame, run: Run): Verdict {
  let verdict: Verdict;

  if (frame.errored > 0) {
    verdict = 'errored';
  } else if (frame.node.children.length === 0) {
    verdict = 'matched';
  } else if (frame.decided !== null) {
    verdict = frame.decided;
  } else {
    const ran = frame.ran.length;
    switch (frame.node.combinator) {
      case 'all':
        verdict = frame.matched === ran ? 'matched' : 'unmatched';
        break;
      case 'any':
        verdict = frame.matched > 0 ? 'matched' : 'unmatched';
        break;
      case 'none':
        verdict = frame.matched === 0 ? 'matched' : 'unmatched';
        break;
      default: {
        // A combinator the engine does not know is not a reason to guess.
        report(run, {
          severity: 'error',
          code: 'combinator_unknown',
          message: `\`${String(frame.node.combinator)}\` is not a way to combine conditions.`,
          nodeId: frame.node.id,
        });
        verdict = 'errored';
      }
    }
  }

  if (frame.node.negate === true) verdict = negated(verdict);

  if (run.settings.trace) {
    run.trace.push({
      nodeId: frame.node.id,
      kind: 'group',
      verdict,
      ms: run.settings.clock() - frame.startedAt,
      children: frame.ran,
    });
  }

  return verdict;
}

/**
 * Walk the condition tree.
 *
 * An explicit stack rather than recursion, and an explicit frame rather than a
 * closure per group, so the cost of a 20,000-deep imported tree is heap the
 * process can measure instead of a stack it cannot.
 */
function evaluateTree(root: GroupNode, run: Run): Verdict {
  const stack: Frame[] = [frameFor(root, run)];
  let fromChild: Verdict | null = null;
  let fromChildId = '';

  while (stack.length > 0) {
    const frame = stack[stack.length - 1]!;

    if (fromChild !== null) {
      absorb(frame, fromChildId, fromChild, run.settings.shortCircuit);
      fromChild = null;
    }

    if (outOfTime(run)) return 'errored';

    const done = frame.decided !== null || frame.index >= frame.node.children.length;
    if (done) {
      const verdict = settle(frame, run);
      stack.pop();
      if (stack.length === 0) return verdict;
      fromChild = verdict;
      fromChildId = frame.node.id;
      continue;
    }

    const child: RuleNode = frame.node.children[frame.index]!;
    frame.index += 1;

    if (child.kind === 'group') {
      stack.push(frameFor(child, run));
      continue;
    }

    if (child.kind === 'condition') {
      absorb(frame, child.id, evaluateCondition(child, run), run.settings.shortCircuit);
      continue;
    }

    // Only reachable from JSON that never went through `validateRule`.
    const unknown = child as { id?: unknown; kind?: unknown };
    report(run, {
      severity: 'error',
      code: 'node_kind_unknown',
      message: `\`${String(unknown.kind)}\` is not a kind of node.`,
      ...(typeof unknown.id === 'string' ? { nodeId: unknown.id } : {}),
    });
    absorb(frame, String(unknown.id ?? ''), 'errored', run.settings.shortCircuit);
  }

  // Unreachable: the loop returns when the root frame settles or when time runs
  // out, and the stack cannot empty any other way. Here because the compiler
  // cannot see that, and a guess is worse than an error.
  return 'errored';
}

/**
 * Resolve the operands an action carries.
 *
 * The engine never PERFORMS an action - it says what should happen and hands
 * that to the host - but it does resolve the value, because `setField` with an
 * unresolved operand would push the whole plugin registry into the host.
 *
 * @returns `null` when an action could not be resolved, which fails the whole
 * rule. Applying the actions that happened to work would be a rule that did
 * half of what it says.
 */
function applyActions(nodes: readonly ActionNode[], run: Run): AppliedAction[] | null {
  const applied: AppliedAction[] = [];
  const scope = scopeFor(run);

  for (const node of nodes) {
    const action: AppliedAction = {
      actionId: node.id,
      type: node.type,
      ...(node.target === undefined ? {} : { target: node.target }),
      ...(node.params === undefined ? {} : { params: node.params }),
    };

    if (node.value !== undefined) {
      try {
        action.value = resolveOperand(node.value, scope);
      } catch (thrown) {
        // The rule matched and then could not say what it wanted done. Dropping
        // the action quietly is the same silent failure this engine refuses
        // everywhere else, so the whole run errors and nothing is applied.
        const message = thrown instanceof Error ? thrown.message : String(thrown);
        report(run, {
          severity: 'error',
          code: thrown instanceof RuleError ? thrown.code : 'action_failed',
          message: `The action "${node.type}" could not resolve its value: ${message}`,
          nodeId: node.id,
        });
        return null;
      }
    }

    applied.push(action);
  }

  return applied;
}

/** Evaluate one rule against one context. */
export function evaluateRule(
  registry: Registry,
  rule: RuleDocument,
  context: EvaluationContext,
  options?: EvaluationOptions,
): RuleOutcome {
  const settings = settingsFrom(options);
  const run: Run = {
    registry,
    context,
    settings,
    diagnostics: [],
    trace: [],
    startedAt: settings.clock(),
    timedOut: false,
    reported: new Set(),
  };

  const finish = (verdict: Verdict, actions: AppliedAction[]): RuleOutcome => ({
    ruleId: rule.id,
    ...(rule.key === undefined ? {} : { ruleKey: rule.key }),
    verdict,
    actions,
    diagnostics: run.diagnostics,
    trace: run.trace,
    ms: settings.clock() - run.startedAt,
  });

  // A disabled rule is skipped rather than unmatched: "this did not run" and
  // "this ran and did not apply" are different answers, and a report that
  // conflates them cannot explain why nothing happened.
  if (rule.enabled === false) return finish('skipped', []);

  if (rule.when === null || typeof rule.when !== 'object' || rule.when.kind !== 'group') {
    report(run, {
      severity: 'error',
      code: 'when_not_group',
      message: "A rule's conditions have to be a group.",
      nodeId: rule.id,
    });
    return finish('errored', []);
  }

  const verdict = evaluateTree(rule.when, run);

  if (verdict === 'errored' || verdict === 'skipped') return finish(verdict, []);

  const pending = (verdict === 'matched' ? rule.then : rule.otherwise) ?? [];
  const applied = applyActions(pending, run);

  return applied === null ? finish('errored', []) : finish(verdict, applied);
}

/**
 * Evaluate a set.
 *
 * Rules run in `priority` order, low first, and ties keep the order they were
 * written in: a set whose behaviour depends on an unstable sort is a set that
 * behaves differently on two machines.
 */
export function evaluateSet(
  registry: Registry,
  set: RuleSet,
  context: EvaluationContext,
  options?: EvaluationOptions,
): SetOutcome {
  const settings = settingsFrom(options);
  const startedAt = settings.clock();

  const ordered = set.rules
    .map((rule, index) => ({ rule, index }))
    .sort((left, right) => left.rule.priority - right.rule.priority || left.index - right.index);

  const outcomes: RuleOutcome[] = [];
  const actions: AppliedAction[] = [];
  const diagnostics: Diagnostic[] = [];

  for (const { rule } of ordered) {
    const outcome = evaluateRule(registry, rule, context, options);
    outcomes.push(outcome);
    actions.push(...outcome.actions);
    diagnostics.push(...outcome.diagnostics);

    if (set.strategy === 'first-match' && outcome.verdict === 'matched') break;
  }

  return { setId: set.id, outcomes, actions, diagnostics, ms: settings.clock() - startedAt };
}

/**
 * An evaluator bound to a registry.
 *
 * The registry is fixed at construction because it is the one thing that must
 * not change between two runs of the same rule: an engine whose capabilities
 * depend on the call site cannot be reasoned about.
 */
export interface Evaluator extends RuleEvaluator {
  readonly registry: Registry;
  evaluateSet(set: RuleSet, context: EvaluationContext, options?: EvaluationOptions): SetOutcome;
}

export function createEvaluator(registry: Registry): Evaluator {
  return Object.freeze({
    registry,
    evaluate: (rule: RuleDocument, context: EvaluationContext, options?: EvaluationOptions) =>
      evaluateRule(registry, rule, context, options),
    evaluateSet: (set: RuleSet, context: EvaluationContext, options?: EvaluationOptions) =>
      evaluateSet(registry, set, context, options),
  });
}

/**
 * A context with the parts a caller usually does not care about filled in.
 *
 * `now` defaults to the wall clock HERE and nowhere deeper: one place reads the
 * time, at the edge, by choice. Everything below takes it as data, so a rule
 * that fired last Tuesday can be replayed exactly.
 */
export function createContext(
  data: JsonValue,
  overrides: Partial<Omit<EvaluationContext, 'data'>> = {},
): EvaluationContext {
  return {
    data,
    variables: overrides.variables ?? {},
    now: overrides.now ?? Date.now(),
    ...(overrides.locale === undefined ? {} : { locale: overrides.locale }),
    ...(overrides.extras === undefined ? {} : { extras: overrides.extras }),
  };
}
