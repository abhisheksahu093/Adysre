import type { RuleDocument } from '@adysre/rules-types';

/**
 * Whether a `rule` prop is a DIFFERENT document that has to be loaded.
 *
 * The builder's store is created once, so a host swapping the rule has to be
 * noticed. The trap is that the obvious test - "the prop is not the object we
 * were given last" - is true after every single edit for the commonest wiring
 * there is:
 *
 *     const [rule, setRule] = useState(starter);
 *     <RuleBuilder rule={rule} onChange={setRule} />
 *
 * Each keystroke produces a new document, `onChange` hands it to the host, the
 * host re-renders with it, and a builder that reloaded on identity alone would
 * call `load` - which CLEARS the history. Undo would silently stop working, and
 * only for hosts that echoed the rule back, which is most of them.
 *
 * So there are two ways to say "nothing to do": the prop has not changed, or
 * the prop is what the store itself just emitted. Anything else is a document
 * the author has not seen in this session, and loading it - history and all -
 * is right.
 *
 * A pure function rather than a condition inside the effect, because it is the
 * kind of decision that is wrong in a way no type catches and no render shows.
 */
export function isDifferentDocument(
  incoming: RuleDocument,
  lastProp: RuleDocument,
  current: RuleDocument,
): boolean {
  if (incoming === lastProp) return false;
  if (incoming === current) return false;
  return true;
}
