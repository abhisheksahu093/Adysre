import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  builtinPlugins,
  createEvaluator,
  createContext,
  createRegistry,
  sequentialIds,
  stringifyRule,
  validateRule,
} from '@adysre/rules-core';
import { describeRule } from '@adysre/rules-renderer';
import type { Diagnostic, JsonValue, RuleDocument } from '@adysre/rules-types';

import {
  detectFormat,
  importAst,
  importJsonLogic,
  importJsonRulesEngine,
  importMongoFilter,
  importRule,
  type ImportResult,
} from './index.ts';

/**
 * Importer tests.
 *
 * The assertion that matters most is not "it produced a tree". It is that the
 * tree AGREES WITH THE SOURCE: most of these import a rule and then run it,
 * because a converter that produces a valid rule meaning something else is
 * exactly the failure this package exists to prevent, and only evaluation
 * catches it.
 */

const registry = createRegistry(builtinPlugins);
const evaluator = createEvaluator(registry);
const options = () => ({ ids: sequentialIds(), now: () => 1_700_000_000_000 });

function expectOk(result: ImportResult): RuleDocument {
  assert.equal(result.ok, true, JSON.stringify(result.diagnostics, null, 2));
  if (!result.ok) throw new Error('unreachable');
  assert.equal(validateRule(result.rule).valid, true);
  return result.rule;
}

/** Import, then run: the only check that catches a converter that lies. */
function verdictOf(rule: RuleDocument, data: JsonValue): string {
  return evaluator.evaluate(rule, createContext(data, { now: 1_700_000_000_000 })).verdict;
}

function codes(diagnostics: readonly Diagnostic[]): string[] {
  return diagnostics.map((entry) => entry.code);
}

describe('jsonLogic', () => {
  it('imports a comparison and gets the same answer the source would', () => {
    const rule = expectOk(
      importJsonLogic({ '>': [{ var: 'order.total' }, 1000] }, options()),
    );

    assert.equal(verdictOf(rule, { order: { total: 2500 } }), 'matched');
    assert.equal(verdictOf(rule, { order: { total: 500 } }), 'unmatched');
  });

  it('imports and, or and nested groups', () => {
    const rule = expectOk(
      importJsonLogic(
        {
          and: [
            { '>': [{ var: 'total' }, 100] },
            { or: [{ '==': [{ var: 'tier' }, 'new'] }, { '===': [{ var: 'flagged' }, true] }] },
          ],
        },
        options(),
      ),
    );

    assert.equal(verdictOf(rule, { total: 200, tier: 'new', flagged: false }), 'matched');
    assert.equal(verdictOf(rule, { total: 200, tier: 'old', flagged: true }), 'matched');
    assert.equal(verdictOf(rule, { total: 200, tier: 'old', flagged: false }), 'unmatched');
    assert.equal(verdictOf(rule, { total: 50, tier: 'new', flagged: true }), 'unmatched');
  });

  it('turns an exclusive three-part comparison into two conditions, not into `between`', () => {
    // `between` is inclusive at both ends. Two conditions are exact, and nearly
    // right is the one thing an importer must never be.
    const exclusive = expectOk(importJsonLogic({ '<': [1, { var: 'n' }, 10] }, options()));
    assert.equal(verdictOf(exclusive, { n: 1 }), 'unmatched');
    assert.equal(verdictOf(exclusive, { n: 5 }), 'matched');
    assert.equal(verdictOf(exclusive, { n: 10 }), 'unmatched');

    const inclusive = expectOk(importJsonLogic({ '<=': [1, { var: 'n' }, 10] }, options()));
    assert.equal(verdictOf(inclusive, { n: 1 }), 'matched');
    assert.equal(verdictOf(inclusive, { n: 10 }), 'matched');
  });

  it('reads `in` as a list test or a substring test, depending on what follows it', () => {
    const list = expectOk(
      importJsonLogic({ in: [{ var: 'tier' }, ['gold', 'silver']] }, options()),
    );
    assert.equal(verdictOf(list, { tier: 'gold' }), 'matched');
    assert.equal(verdictOf(list, { tier: 'bronze' }), 'unmatched');

    // The sides swap: `contains` reads the other way round.
    const substring = expectOk(importJsonLogic({ in: ['@acme.com', 'a@acme.com'] }, options()));
    assert.equal(verdictOf(substring, {}), 'matched');
  });

  it('warns that a truthiness test is not an emptiness test', () => {
    const result = importJsonLogic({ '!!': { var: 'discount' } }, options());
    const rule = expectOk(result);

    assert.deepEqual(codes(result.diagnostics), ['truthiness_is_not_emptiness']);
    // The difference the warning names: jsonLogic calls 0 false, this engine
    // calls it a value somebody chose.
    assert.equal(verdictOf(rule, { discount: 0 }), 'matched');
    assert.equal(verdictOf(rule, { discount: '' }), 'unmatched');
  });

  it('warns that loose equality is not this engine s equality', () => {
    const result = importJsonLogic({ '==': [{ var: 'n' }, 1] }, options());
    assert.deepEqual(codes(result.diagnostics), ['loose_equality']);
    assert.deepEqual(codes(importJsonLogic({ '===': [{ var: 'n' }, 1] }, options()).diagnostics), []);
  });

  it('negates a condition, and tests a value, from the same operator', () => {
    const negated = expectOk(importJsonLogic({ '!': { '>': [{ var: 'n' }, 5] } }, options()));
    assert.equal(verdictOf(negated, { n: 1 }), 'matched');
    assert.equal(verdictOf(negated, { n: 9 }), 'unmatched');

    const emptiness = expectOk(importJsonLogic({ '!': { var: 'name' } }, options()));
    assert.equal(verdictOf(emptiness, { name: '' }), 'matched');
    assert.equal(verdictOf(emptiness, { name: 'x' }), 'unmatched');
  });

  it('maps the arithmetic that has an exact function, and refuses the rest', () => {
    const summed = importJsonLogic(
      { '>': [{ '+': [{ var: 'a' }, { var: 'b' }] }, 10] },
      options(),
    );
    assert.equal(verdictOf(expectOk(summed), { a: 6, b: 7 }), 'matched');
    assert.deepEqual(codes(summed.diagnostics), ['plus_is_numeric']);

    const divided = importJsonLogic({ '>': [{ '/': [{ var: 'a' }, 2] }, 10] }, options());
    assert.equal(divided.ok, false);
    assert.equal(divided.diagnostics[0]?.code, 'operand_unsupported');
  });

  it('refuses what it cannot express, and says where', () => {
    const result = importJsonLogic(
      { and: [{ '>': [{ var: 'a' }, 1] }, { if: [true, 1, 2] }] },
      options(),
    );

    assert.equal(result.ok, false);
    assert.equal(result.diagnostics[0]?.code, 'operator_unsupported');
    assert.equal(result.diagnostics[0]?.path, '$.and[1]');
    assert.match(result.diagnostics[0]?.message ?? '', /conditional values/);
  });

  it('refuses a variable with a fallback rather than dropping the fallback', () => {
    const result = importJsonLogic({ '>': [{ var: ['a', 0] }, 1] }, options());
    assert.equal(result.ok, false);
    assert.equal(result.diagnostics[0]?.code, 'var_default_unsupported');
  });
});

describe('json-rules-engine', () => {
  const source = {
    name: 'Approve large orders',
    priority: 10,
    conditions: {
      all: [
        { fact: 'order', path: '$.total', operator: 'greaterThan', value: 1000 },
        {
          any: [
            { fact: 'customer', path: '$.tier', operator: 'equal', value: 'new' },
            { fact: 'customer', path: '$.riskScore', operator: 'greaterThanInclusive', value: 80 },
          ],
        },
      ],
    },
    event: { type: 'needs-approval', params: { queue: 'finance' } },
  };

  it('imports facts, paths, groups and the event', () => {
    const result = importJsonRulesEngine(source, options());
    const rule = expectOk(result);

    assert.equal(rule.name, 'Approve large orders');
    assert.deepEqual(rule.then.map((entry) => entry.type), ['needs-approval']);
    assert.deepEqual(rule.then[0]?.params, { queue: 'finance' });

    assert.equal(verdictOf(rule, { order: { total: 2000 }, customer: { tier: 'new' } }), 'matched');
    assert.equal(
      verdictOf(rule, { order: { total: 2000 }, customer: { tier: 'old', riskScore: 80 } }),
      'matched',
    );
    assert.equal(
      verdictOf(rule, { order: { total: 2000 }, customer: { tier: 'old', riskScore: 10 } }),
      'unmatched',
    );
  });

  it('inverts priority, because the two engines order rules in opposite directions', () => {
    const result = importJsonRulesEngine(source, options());
    const rule = expectOk(result);

    assert.equal(rule.priority, -10, 'the number changes so that the order does not');
    assert.ok(codes(result.diagnostics).includes('priority_inverted'));
  });

  it('compares a fact to another fact', () => {
    const rule = expectOk(
      importJsonRulesEngine(
        {
          conditions: {
            all: [{ fact: 'order', path: '$.total', operator: 'greaterThan', value: { fact: 'limits', path: '$.max' } }],
          },
        },
        options(),
      ),
    );

    assert.equal(verdictOf(rule, { order: { total: 20 }, limits: { max: 10 } }), 'matched');
    assert.equal(verdictOf(rule, { order: { total: 5 }, limits: { max: 10 } }), 'unmatched');
  });

  it('imports `not` as a negated group', () => {
    const rule = expectOk(
      importJsonRulesEngine(
        { conditions: { not: { fact: 'tier', operator: 'equal', value: 'gold' } } },
        options(),
      ),
    );

    assert.equal(verdictOf(rule, { tier: 'silver' }), 'matched');
    assert.equal(verdictOf(rule, { tier: 'gold' }), 'unmatched');
  });

  it('refuses a fact that is a call, and a path that selects many values', () => {
    const withParams = importJsonRulesEngine(
      { conditions: { all: [{ fact: 'account', params: { id: 1 }, operator: 'equal', value: 1 }] } },
      options(),
    );
    assert.equal(withParams.ok, false);
    assert.equal(withParams.diagnostics[0]?.code, 'fact_params_unsupported');
    assert.equal(withParams.diagnostics[0]?.path, '$.conditions.all[0].params');

    const wildcard = importJsonRulesEngine(
      { conditions: { all: [{ fact: 'order', path: '$.items[*].price', operator: 'greaterThan', value: 1 }] } },
      options(),
    );
    assert.equal(wildcard.ok, false);
    assert.equal(wildcard.diagnostics[0]?.code, 'path_unsupported');
  });

  it('refuses a reference to a condition stored somewhere else', () => {
    const result = importJsonRulesEngine(
      { conditions: { all: [{ condition: 'isVip' }] } },
      options(),
    );
    assert.equal(result.ok, false);
    assert.equal(result.diagnostics[0]?.code, 'shared_condition_unsupported');
  });

  it('takes a host mapping for an operator it does not know', () => {
    const source2 = { conditions: { all: [{ fact: 'name', operator: 'startsWithIgnoringCase', value: 'a' }] } };

    assert.equal(importJsonRulesEngine(source2, options()).ok, false);
    assert.equal(
      importJsonRulesEngine(source2, { ...options(), operators: { startsWithIgnoringCase: 'startsWith' } }).ok,
      true,
    );
  });
});

describe('query filters', () => {
  it('imports an implicit all, and every comparison in it', () => {
    const rule = expectOk(
      importMongoFilter(
        { 'order.total': { $gte: 100, $lt: 1000 }, 'customer.tier': 'gold' },
        options(),
      ),
    );

    assert.equal(verdictOf(rule, { order: { total: 500 }, customer: { tier: 'gold' } }), 'matched');
    assert.equal(verdictOf(rule, { order: { total: 50 }, customer: { tier: 'gold' } }), 'unmatched');
    assert.equal(verdictOf(rule, { order: { total: 500 }, customer: { tier: 'silver' } }), 'unmatched');
  });

  it('imports $and, $or and $nor', () => {
    const rule = expectOk(
      importMongoFilter(
        { $or: [{ tier: 'gold' }, { $and: [{ spend: { $gt: 100 } }, { active: true }] }] },
        options(),
      ),
    );

    assert.equal(verdictOf(rule, { tier: 'gold', spend: 0, active: false }), 'matched');
    assert.equal(verdictOf(rule, { tier: 'x', spend: 200, active: true }), 'matched');
    assert.equal(verdictOf(rule, { tier: 'x', spend: 200, active: false }), 'unmatched');

    const nor = expectOk(importMongoFilter({ $nor: [{ tier: 'gold' }, { banned: true }] }, options()));
    assert.equal(verdictOf(nor, { tier: 'silver', banned: false }), 'matched');
    assert.equal(verdictOf(nor, { tier: 'gold', banned: false }), 'unmatched');
  });

  it('imports $exists, $in, $size and $all', () => {
    const exists = expectOk(importMongoFilter({ email: { $exists: true } }, options()));
    assert.equal(verdictOf(exists, { email: 'a@b.c' }), 'matched');
    assert.equal(verdictOf(exists, {}), 'unmatched');

    const oneOf = expectOk(importMongoFilter({ tier: { $in: ['gold', 'silver'] } }, options()));
    assert.equal(verdictOf(oneOf, { tier: 'silver' }), 'matched');

    const size = expectOk(importMongoFilter({ tags: { $size: 2 } }, options()));
    assert.equal(verdictOf(size, { tags: ['a', 'b'] }), 'matched');

    const every = expectOk(importMongoFilter({ tags: { $all: ['a', 'b'] } }, options()));
    assert.equal(verdictOf(every, { tags: ['a', 'b', 'c'] }), 'matched');
    assert.equal(verdictOf(every, { tags: ['a'] }), 'unmatched');
  });

  it('imports $not as a negated group', () => {
    const rule = expectOk(importMongoFilter({ n: { $not: { $gt: 5 } } }, options()));
    assert.equal(verdictOf(rule, { n: 1 }), 'matched');
    assert.equal(verdictOf(rule, { n: 9 }), 'unmatched');
  });

  it('refuses pattern flags rather than dropping them', () => {
    // Dropping `i` would change which values match, silently.
    const result = importMongoFilter({ name: { $regex: '^a', $options: 'i' } }, options());
    assert.equal(result.ok, false);
    assert.equal(result.diagnostics[0]?.code, 'regex_options_unsupported');

    assert.equal(importMongoFilter({ name: { $regex: '^a' } }, options()).ok, true);
  });

  it('refuses the operators a database evaluates for itself', () => {
    for (const filter of [{ $where: 'this.a > 1' }, { items: { $elemMatch: { price: { $gt: 1 } } } }]) {
      const result = importMongoFilter(filter, options());
      assert.equal(result.ok, false, JSON.stringify(filter));
      assert.equal(result.diagnostics[0]?.code, 'operator_unsupported');
    }
  });

  it('warns when a whole structure is compared for equality', () => {
    const result = importMongoFilter({ tags: ['a', 'b'] }, options());
    assert.deepEqual(codes(result.diagnostics), ['exact_match_on_structure']);
    // Mongo would also match a document whose `tags` merely contains both.
    assert.equal(verdictOf(expectOk(result), { tags: ['a', 'b'] }), 'matched');
    assert.equal(verdictOf(expectOk(result), { tags: ['b', 'a'] }), 'unmatched');
  });
});

describe('this engine s own format', () => {
  it('round-trips a rule through export and import', () => {
    const original = expectOk(importJsonLogic({ '>': [{ var: 'n' }, 1] }, options()));
    const reimported = expectOk(importAst(stringifyRule(original)));
    assert.deepEqual(reimported, original);
  });

  it('reads an object as readily as a string', () => {
    const original = expectOk(importJsonLogic({ '>': [{ var: 'n' }, 1] }, options()));
    assert.equal(importAst(original).ok, true);
  });

  it('reports why a document could not be read', () => {
    assert.equal(importAst('{ not json').ok, false);
    const notARule = importAst({ schemaVersion: 1, when: 'nope' });
    assert.equal(notARule.ok, false);
    assert.ok(notARule.diagnostics.length > 0);
  });
});

describe('choosing an importer', () => {
  it('recognises each format, and tries the permissive one last', () => {
    assert.equal(detectFormat({ '>': [{ var: 'a' }, 1] }), 'json-logic');
    assert.equal(detectFormat({ conditions: { all: [] }, event: { type: 'x' } }), 'json-rules-engine');
    assert.equal(detectFormat({ 'order.total': { $gt: 1 } }), 'mongo');
    assert.equal(detectFormat({ schemaVersion: 1, when: {} }), 'ast');
    assert.equal(detectFormat('not json at all'), null);
    assert.equal(detectFormat(42), null);
  });

  it('imports without being told the format', () => {
    const rule = expectOk(importRule({ 'order.total': { $gt: 1000 } }, options()));
    assert.equal(verdictOf(rule, { order: { total: 2000 } }), 'matched');
  });

  it('says so when nothing recognises the input, instead of throwing', () => {
    const result = importRule([1, 2, 3], options());
    assert.equal(result.ok, false);
    assert.equal(result.diagnostics[0]?.code, 'format_unrecognised');
  });

  it('can be told a format, including one nobody handles', () => {
    assert.equal(importRule({ '>': [{ var: 'a' }, 1] }, { ...options(), format: 'json-logic' }).ok, true);

    const unknown = importRule({}, { ...options(), format: 'drools' });
    assert.equal(unknown.ok, false);
    assert.equal(unknown.diagnostics[0]?.code, 'format_unknown');
  });
});

describe('what an import guarantees', () => {
  it('refuses a rule this deployment could not run', () => {
    // The operator maps fine; the deployment simply does not have it.
    const bare = createRegistry();
    const result = importJsonLogic({ '>': [{ var: 'a' }, 1] }, { ...options(), registry: bare });

    assert.equal(result.ok, false);
    assert.equal(result.diagnostics[0]?.code, 'operator_not_registered');
    assert.equal(importJsonLogic({ '>': [{ var: 'a' }, 1] }, { ...options(), registry }).ok, true);
  });

  it('never imports half a rule', () => {
    const result = importJsonLogic(
      { and: [{ '>': [{ var: 'a' }, 1] }, { '*': [{ var: 'b' }, 2] }] },
      options(),
    );

    // The first condition converts perfectly. That is not a reason to keep it:
    // a rule that does less than the one it came from is discovered in
    // production rather than in the import dialog.
    assert.equal(result.ok, false);
    assert.equal('rule' in result, false);
  });

  it('produces a rule reproducibly, so two imports of one file compare equal', () => {
    const source = { and: [{ '>': [{ var: 'a' }, 1] }, { '<': [{ var: 'b' }, 2] }] };
    assert.equal(
      stringifyRule(expectOk(importJsonLogic(source, options()))),
      stringifyRule(expectOk(importJsonLogic(source, options()))),
    );
  });

  it('produces a rule the renderer can read back in words', () => {
    const rule = expectOk(
      importMongoFilter({ 'order.total': { $gte: 1000 }, 'customer.tier': 'gold' }, options()),
    );

    assert.equal(
      describeRule(rule, { plugins: registry, locale: 'en-GB' }).text,
      [
        'Imported from a query filter',
        'When all of these are true:',
        '  - order total is at least 1,000',
        '  - customer tier is "gold"',
      ].join('\n'),
    );
  });
});
