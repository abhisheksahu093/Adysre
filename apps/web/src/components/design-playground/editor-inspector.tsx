'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowRight,
  MousePointerSquareDashed,
} from 'lucide-react';
import { INSPECTOR_GROUPS, type InspectorGroupId } from '@/config/design-playground';
import { DEFAULT_SHADOW } from '@/lib/design-playground/document';
import {
  BLEND_MODES,
  isContainer,
  type BlendMode,
  type LayoutSpec,
  type Node,
  type ShadowSpec,
  type TextSpec,
} from '@/lib/design-playground/types';
import { useDesignDocumentStore } from '@/stores/design-document-store';
import { useDesignPlaygroundStore } from '@/stores/design-playground-store';
import { SelectionActions } from './selection-actions';
import { cn } from '@adysre/ui';
import { ExportSelection } from './panels/export-selection';
import { FramesPanel } from './panels/frames-panel';
import {
  ColorField,
  FieldRow,
  InspectorSection,
  NumberField,
  SegmentedField,
  SelectField,
  TextAreaField,
  type SegmentedOption,
} from './panels/inspector-field';

/**
 * The right inspector: one section per property group, bound to the selection.
 *
 * It is a pure projection of the document store. Reading is a fold over the
 * selected nodes (agree → show the value, disagree → show "mixed"); writing is
 * always `patchSelection`, so one edit is one command and undo treats a
 * multi-select change as the single action the user perceived.
 *
 * Which groups appear is decided by the selection's types, but their ORDER is
 * the config's - a new group is an entry in `INSPECTOR_GROUPS`, not a block
 * moved around in here.
 */
export function EditorInspector() {
  const t = useTranslations('designPlayground');
  const open = useDesignPlaygroundStore((s) => s.inspectorOpen);
  const tab = useDesignPlaygroundStore((s) => s.inspectorTab);
  const setTab = useDesignPlaygroundStore((s) => s.setInspectorTab);

  const doc = useDesignDocumentStore((s) => s.document);
  const selection = useDesignDocumentStore((s) => s.selection);
  const patchSelection = useDesignDocumentStore((s) => s.patchSelection);

  // A selected id can outlive its node for a frame (undo, remote delete), so
  // resolve defensively rather than trusting `selection` to be in sync.
  const nodes = useMemo(
    () =>
      selection
        .map((id) => doc.nodes[id])
        .filter((node): node is Node => node !== undefined),
    [selection, doc],
  );

  if (!open) return null;

  const mixed = t('inspector.mixed');

  return (
    <aside
      aria-label={t('inspector.title')}
      className="hidden w-64 shrink-0 flex-col overflow-y-auto border-l border-border bg-card lg:flex"
    >
      <div role="tablist" aria-label={t('inspector.tabs')} className="flex border-b border-border">
        {(['properties', 'frames'] as const).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`inspector-tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`inspector-panel-${id}`}
            // Only the active tab is in the tab order; arrow keys move between
            // them, which is the tablist pattern screen-reader users expect.
            tabIndex={tab === id ? 0 : -1}
            onClick={() => setTab(id)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
              event.preventDefault();
              setTab(id === 'properties' ? 'frames' : 'properties');
            }}
            className={cn(
              'flex-1 border-b-2 px-3 py-2 text-xs font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
              tab === id
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t(`inspector.tabLabels.${id}`)}
          </button>
        ))}
      </div>

      {tab === 'frames' ? (
        <div role="tabpanel" id="inspector-panel-frames" aria-labelledby="inspector-tab-frames">
          <FramesPanel />
        </div>
      ) : (
        <div
          role="tabpanel"
          id="inspector-panel-properties"
          aria-labelledby="inspector-tab-properties"
        >
          {nodes.length > 0 && (
            <p className="truncate border-b border-border px-3 py-1.5 text-[11px] text-muted-foreground">
              {nodes.length === 1 && nodes[0]
                ? nodes[0].name
                : t('inspector.multiple', { count: nodes.length })}
            </p>
          )}

          <SelectionActions />

          {nodes.length === 0 ? (
        <div className="p-3">
          <div className="rounded-lg border border-dashed border-border p-3 text-center">
            <MousePointerSquareDashed
              className="mx-auto h-5 w-5 text-muted-foreground"
              aria-hidden
            />
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {t('inspector.empty')}
            </p>
          </div>
        </div>
          ) : (
            INSPECTOR_GROUPS.filter((groupId) => appliesTo(groupId, nodes)).map((groupId) => (
              <InspectorSection key={groupId} title={t(`inspector.groups.${groupId}`)}>
                {renderGroup({ groupId, nodes, patchSelection, t, mixed })}
              </InspectorSection>
            ))
          )}
        </div>
      )}
    </aside>
  );
}

/* ------------------------------------------------------------ shared values */

/** The value every selected node agrees on, or null when they differ. */
function shared<T>(nodes: Node[], read: (node: Node) => T): T | null {
  const first = nodes[0];
  if (!first) return null;
  const value = read(first);
  return nodes.every((node) => Object.is(read(node), value)) ? value : null;
}

/**
 * Colours need `mixed` reported separately from the value: `null` is a legal
 * paint ("none") and must not be confused with disagreement.
 */
function sharedColor(
  nodes: Node[],
  read: (node: Node) => string | null,
): { value: string | null; mixed: boolean } {
  const first = nodes[0];
  if (!first) return { value: null, mixed: false };
  const value = read(first);
  const agree = nodes.every((node) => read(node) === value);
  return { value: agree ? value : null, mixed: !agree };
}

/** Text fields only exist on text nodes; a defaulted read keeps callers total. */
function sharedText<K extends keyof TextSpec>(nodes: Node[], key: K, fallback: TextSpec[K]) {
  return shared(nodes, (node) => node.text?.[key] ?? fallback);
}

/* ------------------------------------------------------------ applicability */

/** Which groups make sense for this selection. */
function appliesTo(groupId: InspectorGroupId, nodes: Node[]): boolean {
  switch (groupId) {
    // Layout is a container concern: only a node that can hold children
    // arranges anything.
    case 'layout':
      return nodes.every(isContainer);
    // A text patch is dropped for a node without a `text` spec, so offering the
    // group on a mixed selection would silently do nothing.
    case 'typography':
      return nodes.every((node) => node.type === 'text');
    default:
      return true;
  }
}

/* -------------------------------------------------------------------- group */

type Translate = (key: string, values?: Record<string, string | number>) => string;

function renderGroup({
  groupId,
  nodes,
  patchSelection,
  t,
  mixed,
}: {
  groupId: InspectorGroupId;
  nodes: Node[];
  patchSelection: ReturnType<typeof useDesignDocumentStore.getState>['patchSelection'];
  t: Translate;
  mixed: string;
}): React.ReactNode {
  const field = (key: string) => t(`inspector.fields.${key}`);
  const option = (key: string) => t(`inspector.options.${key}`);

  switch (groupId) {
    case 'transform':
      return (
        <>
          <FieldRow>
            <NumberField
              label={field('x')}
              mixedLabel={mixed}
              value={shared(nodes, (n) => n.transform.x)}
              onCommit={(x) => patchSelection({ transform: { x } })}
            />
            <NumberField
              label={field('y')}
              mixedLabel={mixed}
              value={shared(nodes, (n) => n.transform.y)}
              onCommit={(y) => patchSelection({ transform: { y } })}
            />
          </FieldRow>
          <FieldRow>
            <NumberField
              label={field('width')}
              mixedLabel={mixed}
              min={0}
              value={shared(nodes, (n) => n.transform.width)}
              onCommit={(width) => patchSelection({ transform: { width } })}
            />
            <NumberField
              label={field('height')}
              mixedLabel={mixed}
              min={0}
              value={shared(nodes, (n) => n.transform.height)}
              onCommit={(height) => patchSelection({ transform: { height } })}
            />
          </FieldRow>
          <FieldRow>
            <NumberField
              label={field('rotation')}
              mixedLabel={mixed}
              suffix="°"
              value={shared(nodes, (n) => n.transform.rotation)}
              onCommit={(rotation) => patchSelection({ transform: { rotation } })}
            />
          </FieldRow>
        </>
      );

    case 'layout': {
      const mode = shared(nodes, (n) => n.layout.mode);
      const modes: readonly SegmentedOption<LayoutSpec['mode']>[] = [
        { value: 'none', label: option('none') },
        { value: 'flex', label: option('flex') },
      ];
      const directions: readonly SegmentedOption<LayoutSpec['direction']>[] = [
        { value: 'row', label: option('row'), icon: ArrowRight },
        { value: 'column', label: option('column'), icon: ArrowDown },
      ];
      return (
        <>
          <SegmentedField
            label={field('mode')}
            value={mode}
            options={modes}
            onChange={(next) => patchSelection({ layout: { mode: next } })}
          />
          {/* Direction, gap and padding only mean something under flex; showing
              them for absolute positioning would promise an effect there is none. */}
          {mode === 'flex' ? (
            <>
              <SegmentedField
                label={field('direction')}
                value={shared(nodes, (n) => n.layout.direction)}
                options={directions}
                onChange={(next) => patchSelection({ layout: { direction: next } })}
              />
              <FieldRow>
                <NumberField
                  label={field('gap')}
                  mixedLabel={mixed}
                  min={0}
                  value={shared(nodes, (n) => n.layout.gap)}
                  onCommit={(gap) => patchSelection({ layout: { gap } })}
                />
                <NumberField
                  label={field('padding')}
                  mixedLabel={mixed}
                  min={0}
                  value={shared(nodes, (n) => n.layout.padding)}
                  onCommit={(padding) => patchSelection({ layout: { padding } })}
                />
              </FieldRow>
            </>
          ) : null}
        </>
      );
    }

    case 'style': {
      const fill = sharedColor(nodes, (n) => n.style.fill);
      const stroke = sharedColor(nodes, (n) => n.style.stroke);
      const opacity = shared(nodes, (n) => n.style.opacity);
      const colorProps = {
        mixedLabel: mixed,
        noneLabel: t('inspector.colorNone'),
        pickerLabel: t('inspector.colorPicker'),
        hexLabel: t('inspector.colorHex'),
      };
      return (
        <>
          <ColorField
            label={field('fill')}
            value={fill.value}
            mixed={fill.mixed}
            onCommit={(next) => patchSelection({ style: { fill: next } })}
            {...colorProps}
          />
          <ColorField
            label={field('stroke')}
            value={stroke.value}
            mixed={stroke.mixed}
            onCommit={(next) => patchSelection({ style: { stroke: next } })}
            {...colorProps}
          />
          <FieldRow>
            <NumberField
              label={field('strokeWidth')}
              mixedLabel={mixed}
              min={0}
              value={shared(nodes, (n) => n.style.strokeWidth)}
              onCommit={(strokeWidth) => patchSelection({ style: { strokeWidth } })}
            />
            <NumberField
              label={field('radius')}
              mixedLabel={mixed}
              min={0}
              value={shared(nodes, (n) => n.style.radius)}
              onCommit={(radius) => patchSelection({ style: { radius } })}
            />
          </FieldRow>
          <FieldRow>
            {/* The model stores 0-1; people think in percent. Convert here, at
                the boundary, so nothing downstream has to know about the UI. */}
            <NumberField
              label={field('opacity')}
              mixedLabel={mixed}
              min={0}
              max={100}
              suffix="%"
              value={opacity === null ? null : opacity * 100}
              onCommit={(percent) => patchSelection({ style: { opacity: percent / 100 } })}
            />
          </FieldRow>
        </>
      );
    }

    case 'typography': {
      const text = sharedText(nodes, 'text', '');
      const aligns: readonly SegmentedOption<TextSpec['align']>[] = [
        { value: 'left', label: option('left'), icon: AlignLeft },
        { value: 'center', label: option('center'), icon: AlignCenter },
        { value: 'right', label: option('right'), icon: AlignRight },
      ];
      return (
        <>
          <TextAreaField
            label={field('text')}
            value={text ?? ''}
            mixed={text === null}
            mixedLabel={mixed}
            onCommit={(next) => patchSelection({ text: { text: next } })}
          />
          <FieldRow>
            <NumberField
              label={field('fontSize')}
              mixedLabel={mixed}
              min={1}
              value={sharedText(nodes, 'fontSize', 0)}
              onCommit={(fontSize) => patchSelection({ text: { fontSize } })}
            />
            <NumberField
              label={field('fontWeight')}
              mixedLabel={mixed}
              min={100}
              max={900}
              step={100}
              value={sharedText(nodes, 'fontWeight', 0)}
              onCommit={(fontWeight) => patchSelection({ text: { fontWeight } })}
            />
          </FieldRow>
          <FieldRow>
            <NumberField
              label={field('lineHeight')}
              mixedLabel={mixed}
              min={0}
              step={0.1}
              value={sharedText(nodes, 'lineHeight', 0)}
              onCommit={(lineHeight) => patchSelection({ text: { lineHeight } })}
            />
            <NumberField
              label={field('letterSpacing')}
              mixedLabel={mixed}
              value={sharedText(nodes, 'letterSpacing', 0)}
              onCommit={(letterSpacing) => patchSelection({ text: { letterSpacing } })}
            />
          </FieldRow>
          <SegmentedField
            label={field('align')}
            value={sharedText(nodes, 'align', 'left')}
            options={aligns}
            onChange={(align) => patchSelection({ text: { align } })}
          />
        </>
      );
    }

    case 'effects': {
      // A group has no geometry of its own, so neither the canvas nor an export
      // can cast a shadow from it. Offering the control there would promise an
      // effect there is none; blend mode still applies, so only the shadow goes.
      const castsShadow = nodes.every((node) => node.type !== 'group');
      const enabled = shared(nodes, (n) => n.style.shadow !== null);
      const color = sharedColor(nodes, (n) => n.style.shadow?.color ?? null);
      const blur = shared(nodes, (n) => n.style.shadow?.blur ?? null);
      const offsetX = shared(nodes, (n) => n.style.shadow?.offsetX ?? null);
      const offsetY = shared(nodes, (n) => n.style.shadow?.offsetY ?? null);
      const shadowOpacity = shared(nodes, (n) => n.style.shadow?.opacity ?? null);

      // A shadow is patched WHOLE (see `NodePatch`), so every edit rebuilds it
      // from what the panel currently shows. On a selection that disagrees the
      // untouched fields therefore land on the shown default - which is the same
      // thing the user reads on screen, so the write matches the promise.
      const base: ShadowSpec = {
        color: color.value ?? DEFAULT_SHADOW.color,
        blur: blur ?? DEFAULT_SHADOW.blur,
        offsetX: offsetX ?? DEFAULT_SHADOW.offsetX,
        offsetY: offsetY ?? DEFAULT_SHADOW.offsetY,
        opacity: shadowOpacity ?? DEFAULT_SHADOW.opacity,
      };
      const setShadow = (part: Partial<ShadowSpec>) =>
        patchSelection({ style: { shadow: { ...base, ...part } } });

      const toggles: readonly SegmentedOption<'off' | 'on'>[] = [
        { value: 'off', label: option('none') },
        { value: 'on', label: option('dropShadow') },
      ];
      const blendModes: readonly SegmentedOption<BlendMode>[] = BLEND_MODES.map((mode) => ({
        value: mode,
        label: option(mode),
      }));

      return (
        <>
          {castsShadow ? (
            <>
              <SegmentedField
                label={field('shadow')}
                value={enabled === null ? null : enabled ? 'on' : 'off'}
                options={toggles}
                onChange={(next) =>
                  patchSelection({ style: { shadow: next === 'on' ? base : null } })
                }
              />
              {/* The detail fields only exist while there is a shadow to detail. */}
              {enabled ? (
                <>
                  <ColorField
                    label={field('shadowColor')}
                    value={color.value}
                    mixed={color.mixed}
                    onCommit={(next) => setShadow({ color: next ?? DEFAULT_SHADOW.color })}
                    mixedLabel={mixed}
                    noneLabel={t('inspector.colorNone')}
                    pickerLabel={t('inspector.colorPicker')}
                    hexLabel={t('inspector.colorHex')}
                  />
                  <FieldRow>
                    <NumberField
                      label={field('shadowBlur')}
                      mixedLabel={mixed}
                      min={0}
                      value={blur}
                      onCommit={(next) => setShadow({ blur: next })}
                    />
                    <NumberField
                      label={field('shadowOpacity')}
                      mixedLabel={mixed}
                      min={0}
                      max={100}
                      suffix="%"
                      value={shadowOpacity === null ? null : shadowOpacity * 100}
                      onCommit={(percent) => setShadow({ opacity: percent / 100 })}
                    />
                  </FieldRow>
                  <FieldRow>
                    <NumberField
                      label={field('shadowOffsetX')}
                      mixedLabel={mixed}
                      value={offsetX}
                      onCommit={(next) => setShadow({ offsetX: next })}
                    />
                    <NumberField
                      label={field('shadowOffsetY')}
                      mixedLabel={mixed}
                      value={offsetY}
                      onCommit={(next) => setShadow({ offsetY: next })}
                    />
                  </FieldRow>
                </>
              ) : null}
            </>
          ) : null}
          {/* Six modes will not fit side by side in a 16rem panel, so this one
              choice uses a select where the rest of the inspector segments. */}
          <SelectField
            label={field('blendMode')}
            mixedLabel={mixed}
            value={shared(nodes, (n) => n.style.blendMode)}
            options={blendModes}
            onChange={(blendMode) => patchSelection({ style: { blendMode } })}
          />
        </>
      );
    }

    // Export acts on the selection, so it lives with the selection's other
    // properties rather than in the page-level menu.
    default:
      return <ExportSelection />;
  }
}
