import type { Finding, PageFacts, Rule } from './types';
import { RULES } from './rules';

/**
 * The rule engine: evaluate every rule against the page facts and flatten the
 * violations into findings. Deliberately trivial - the intelligence lives in
 * the rules, and keeping the engine a one-liner is what makes 500+ rules cheap.
 */
export function evaluateRules(facts: PageFacts, rules: readonly Rule[] = RULES): Finding[] {
  const findings: Finding[] = [];
  for (const rule of rules) {
    if (!rule.test(facts)) continue;
    findings.push({
      ruleId: rule.id,
      category: rule.category,
      severity: rule.severity,
      description: rule.description,
      fix: rule.fix,
      impact: rule.impact,
      ...(rule.estimatedSavings ? { estimatedSavings: rule.estimatedSavings } : {}),
      ...(rule.documentation ? { documentation: rule.documentation } : {}),
    });
  }
  return findings;
}

/**
 * Guard used by the tests: rule ids must be unique, or one silently shadows the
 * other in any id-keyed lookup. Returns the duplicated ids (empty when clean).
 */
export function duplicateRuleIds(rules: readonly Rule[] = RULES): string[] {
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const rule of rules) {
    if (seen.has(rule.id)) dupes.add(rule.id);
    seen.add(rule.id);
  }
  return [...dupes];
}
