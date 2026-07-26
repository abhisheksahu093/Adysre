import {
  AST_SCHEMA_VERSION,
  COMBINATORS,
  RULE_KINDS,
  RULE_STATUSES,
  type Diagnostic,
  type JsonValue,
  type Operand,
  type RuleDocument,
  type RuleNode,
} from '@adysre/rules-types';

/**
 * Structural validation of an AST.
 *
 * Hand-written, with no schema library, and that is a deliberate cost. This
 * package has ZERO runtime dependencies, which is what lets it run in a browser
 * bundle, a Node service, an edge function or a worker without dragging a tree
 * of transitive packages into each. A rules engine that is awkward to embed is
 * a rules engine nobody embeds.
 *
 * It also buys precision a generic validator cannot give: every problem comes
 * back with the AST PATH that caused it (`when.children[2].args[0]`) and the
 * node id, so the builder can put the message on the offending row instead of
 * at the top of the form.
 *
 * Structure only. Whether `equals` exists, or accepts the type of the field it
 * was pointed at, is the registry's business and belongs to the phase that
 * introduces it - this layer must be usable before any plugin is registered.
 */

export interface ValidationResult {
  valid: boolean;
  diagnostics: Diagnostic[];
}

interface Problem {
  code: string;
  message: string;
  path: string;
  nodeId?: string;
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

/** Whether a value is JSON: no functions, no undefined, no cycles. */
function isJsonValue(value: unknown, seen = new Set<unknown>()): value is JsonValue {
  if (value === null) return true;
  const type = typeof value;
  if (type === 'string' || type === 'boolean') return true;
  if (type === 'number') return Number.isFinite(value as number);

  if (Array.isArray(value)) {
    if (seen.has(value)) return false;
    seen.add(value);
    return value.every((entry) => isJsonValue(entry, seen));
  }

  if (isObject(value)) {
    if (seen.has(value)) return false;
    seen.add(value);
    return Object.values(value).every((entry) => isJsonValue(entry, seen));
  }

  return false;
}

/** A field path: dotted segments, with optional numeric array indexes. */
const FIELD_PATH = /^[A-Za-z_$][A-Za-z0-9_$]*(\.[A-Za-z_$][A-Za-z0-9_$]*|\[\d+\])*$/;

function validateOperand(operand: unknown, path: string, problems: Problem[], depth = 0): void {
  if (depth > 32) {
    problems.push({ code: 'operand_too_deep', message: 'Operands are nested too deeply.', path });
    return;
  }

  if (!isObject(operand)) {
    problems.push({ code: 'operand_invalid', message: 'An operand must be an object.', path });
    return;
  }

  switch (operand.source) {
    case 'literal':
      if (!isJsonValue(operand.value)) {
        problems.push({
          code: 'literal_not_json',
          message: 'A literal must be a JSON value.',
          path: `${path}.value`,
        });
      }
      return;

    case 'field':
      if (!isNonEmptyString(operand.path)) {
        problems.push({ code: 'field_path_missing', message: 'A field needs a path.', path });
        return;
      }
      if (!FIELD_PATH.test(operand.path)) {
        problems.push({
          code: 'field_path_invalid',
          message: `\`${operand.path}\` is not a field path.`,
          path: `${path}.path`,
        });
      }
      return;

    case 'variable':
      if (!isNonEmptyString(operand.name)) {
        problems.push({ code: 'variable_name_missing', message: 'A variable needs a name.', path });
      }
      return;

    case 'function': {
      if (!isNonEmptyString(operand.name)) {
        problems.push({ code: 'function_name_missing', message: 'A function needs a name.', path });
      }
      if (!Array.isArray(operand.args)) {
        problems.push({
          code: 'function_args_invalid',
          message: 'A function needs an argument list.',
          path: `${path}.args`,
        });
        return;
      }
      operand.args.forEach((argument, index) =>
        validateOperand(argument, `${path}.args[${index}]`, problems, depth + 1),
      );
      return;
    }

    default:
      problems.push({
        code: 'operand_source_unknown',
        message: `\`${String(operand.source)}\` is not an operand source.`,
        path: `${path}.source`,
      });
  }
}

function validateNode(node: unknown, path: string, problems: Problem[], seen: Set<string>): void {
  if (!isObject(node)) {
    problems.push({ code: 'node_invalid', message: 'A node must be an object.', path });
    return;
  }

  const id = typeof node.id === 'string' ? node.id : undefined;
  if (!isNonEmptyString(node.id)) {
    problems.push({ code: 'node_id_missing', message: 'Every node needs an id.', path });
  } else if (seen.has(node.id)) {
    // Duplicate ids break everything that addresses a node by one: the trace
    // points at two rows, and editing one edits both.
    problems.push({
      code: 'node_id_duplicate',
      message: `The id \`${node.id}\` is used more than once.`,
      path: `${path}.id`,
      nodeId: node.id,
    });
  } else {
    seen.add(node.id);
  }

  if (node.kind === 'condition') {
    if (!isNonEmptyString(node.operator)) {
      problems.push({
        code: 'operator_missing',
        message: 'A condition needs an operator.',
        path: `${path}.operator`,
        ...(id ? { nodeId: id } : {}),
      });
    }
    validateOperand(node.left, `${path}.left`, problems);

    if (!Array.isArray(node.args)) {
      problems.push({
        code: 'args_invalid',
        message: 'A condition needs an argument list.',
        path: `${path}.args`,
        ...(id ? { nodeId: id } : {}),
      });
      return;
    }
    node.args.forEach((argument, index) =>
      validateOperand(argument, `${path}.args[${index}]`, problems),
    );
    return;
  }

  if (node.kind === 'group') {
    if (!COMBINATORS.includes(node.combinator as never)) {
      problems.push({
        code: 'combinator_invalid',
        message: `\`${String(node.combinator)}\` is not a combinator.`,
        path: `${path}.combinator`,
        ...(id ? { nodeId: id } : {}),
      });
    }
    if (!Array.isArray(node.children)) {
      problems.push({
        code: 'children_invalid',
        message: 'A group needs a list of children.',
        path: `${path}.children`,
        ...(id ? { nodeId: id } : {}),
      });
      return;
    }
    node.children.forEach((child, index) =>
      validateNode(child, `${path}.children[${index}]`, problems, seen),
    );
    return;
  }

  problems.push({
    code: 'node_kind_unknown',
    message: `\`${String(node.kind)}\` is not a node kind.`,
    path: `${path}.kind`,
    ...(id ? { nodeId: id } : {}),
  });
}

function validateActions(actions: unknown, path: string, problems: Problem[], seen: Set<string>): void {
  if (!Array.isArray(actions)) {
    problems.push({ code: 'actions_invalid', message: 'Actions must be a list.', path });
    return;
  }

  actions.forEach((action, index) => {
    const at = `${path}[${index}]`;
    if (!isObject(action)) {
      problems.push({ code: 'action_invalid', message: 'An action must be an object.', path: at });
      return;
    }
    if (!isNonEmptyString(action.id)) {
      problems.push({ code: 'action_id_missing', message: 'Every action needs an id.', path: at });
    } else if (seen.has(action.id)) {
      problems.push({
        code: 'node_id_duplicate',
        message: `The id \`${action.id}\` is used more than once.`,
        path: `${at}.id`,
        nodeId: action.id,
      });
    } else {
      seen.add(action.id);
    }
    if (!isNonEmptyString(action.type)) {
      problems.push({
        code: 'action_type_missing',
        message: 'An action needs a type.',
        path: `${at}.type`,
      });
    }
    if (action.target !== undefined && !isNonEmptyString(action.target)) {
      problems.push({
        code: 'action_target_invalid',
        message: 'An action target must be a field path.',
        path: `${at}.target`,
      });
    }
    if (action.value !== undefined) validateOperand(action.value, `${at}.value`, problems);
    if (action.params !== undefined && !isJsonValue(action.params)) {
      problems.push({
        code: 'action_params_invalid',
        message: 'Action parameters must be JSON.',
        path: `${at}.params`,
      });
    }
  });
}

/**
 * Check a value is a well-formed rule document.
 *
 * Accepts `unknown` on purpose: the interesting callers are the ones holding
 * data they did not create - an imported file, a row from a database, a request
 * body. A function that only accepted `RuleDocument` would be a function that
 * could only check documents already assumed to be valid.
 */
export function validateRule(input: unknown): ValidationResult {
  const problems: Problem[] = [];

  if (!isObject(input)) {
    return {
      valid: false,
      diagnostics: [
        { severity: 'error', code: 'rule_invalid', message: 'A rule must be an object.', path: '$' },
      ],
    };
  }

  if (typeof input.schemaVersion !== 'number') {
    problems.push({
      code: 'schema_version_missing',
      message: 'A rule needs a schemaVersion.',
      path: '$.schemaVersion',
    });
  } else if (input.schemaVersion > AST_SCHEMA_VERSION) {
    // Forward compatibility is not silent: a newer document may use node kinds
    // this build does not know, and guessing is how a rule quietly changes
    // meaning between two versions of the engine.
    problems.push({
      code: 'schema_version_ahead',
      message: `This rule was written by a newer engine (schema ${input.schemaVersion} > ${AST_SCHEMA_VERSION}).`,
      path: '$.schemaVersion',
    });
  }

  if (!isNonEmptyString(input.id)) {
    problems.push({ code: 'rule_id_missing', message: 'A rule needs an id.', path: '$.id' });
  }
  if (!isNonEmptyString(input.name)) {
    problems.push({ code: 'rule_name_missing', message: 'A rule needs a name.', path: '$.name' });
  }
  if (!RULE_KINDS.includes(input.kind as never)) {
    problems.push({
      code: 'rule_kind_invalid',
      message: `\`${String(input.kind)}\` is not a rule kind.`,
      path: '$.kind',
    });
  }
  if (!RULE_STATUSES.includes(input.status as never)) {
    problems.push({
      code: 'rule_status_invalid',
      message: `\`${String(input.status)}\` is not a rule status.`,
      path: '$.status',
    });
  }

  const seen = new Set<string>();

  if (!isObject(input.when) || input.when.kind !== 'group') {
    problems.push({
      code: 'when_not_group',
      message: 'A rule’s conditions must be a group.',
      path: '$.when',
    });
  } else {
    validateNode(input.when, '$.when', problems, seen);
  }

  validateActions(input.then, '$.then', problems, seen);
  if (input.otherwise !== undefined) {
    validateActions(input.otherwise, '$.otherwise', problems, seen);
  }

  return {
    valid: problems.length === 0,
    diagnostics: problems.map((problem) => ({
      severity: 'error' as const,
      code: problem.code,
      message: problem.message,
      path: problem.path,
      ...(problem.nodeId ? { nodeId: problem.nodeId } : {}),
    })),
  };
}

/** Narrowing guard for callers that only need a yes or no. */
export function isRuleDocument(input: unknown): input is RuleDocument {
  return validateRule(input).valid;
}

/** The same structural check for a bare node, for a builder editing a subtree. */
export function validateNodeTree(node: unknown): ValidationResult {
  const problems: Problem[] = [];
  validateNode(node, '$', problems, new Set());
  return {
    valid: problems.length === 0,
    diagnostics: problems.map((problem) => ({
      severity: 'error' as const,
      code: problem.code,
      message: problem.message,
      path: problem.path,
      ...(problem.nodeId ? { nodeId: problem.nodeId } : {}),
    })),
  };
}

export type { RuleNode, Operand };
