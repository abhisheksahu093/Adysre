import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlaygroundSelections, PlaygroundSlotId } from '@/data/playground';
import { PLAYGROUND_SLOTS } from '@/data/playground';
import { tourStepsForStage, type PlaygroundStage } from '@/data/playground/tour';
import type { PreviewDeviceId } from '@/components/components/preview-devices';
import type { Palette } from '@/data/palettes';
import type { EditableField } from '@/lib/playground/content';
import type { SectionStyle, SectionStylePatch } from '@/lib/playground/section-style';

/** Summary of the generated template, shown on the result screen. */
export interface GeneratedSummary {
  sectionCount: number;
  tone: 'light' | 'dark';
}

interface PlaygroundStore {
  /** Playground mode on/off. Session-only - reloading returns to the library. */
  active: boolean;
  /**
   * Where in the flow the user is:
   * start (choose a path) → generating (analyzing a reference) → result
   * (review generated template) → builder (hand-assemble). Session-only.
   */
  stage: PlaygroundStage;
  /** Slot → chosen slug (`null` = removed). Persisted; validated on read. */
  selections: PlaygroundSelections;
  /** The project's colour palette, shipped with the exported code. Persisted. */
  palette: Palette | null;
  activeSlotId: PlaygroundSlotId;
  device: PreviewDeviceId;

  /**
   * Per-component text edits, keyed by component slug then by the original
   * rendered string → the user's replacement. Persisted so a customised page
   * survives a reload; applied live to the preview and baked into the export.
   */
  contentOverrides: Record<string, Record<string, string>>;
  /**
   * The editable strings a section's live preview reported, keyed by slug.
   * Session-only - re-read from the iframe each visit, never persisted.
   */
  sectionFields: Record<string, EditableField[]>;
  /**
   * Per-section background / text / border customization, keyed by SLOT id
   * rather than slug: styling belongs to the section's place in the page, so
   * swapping the hero for another variation keeps the look the user chose.
   * Persisted, applied live to the preview, and baked into every export.
   */
  sectionStyles: Partial<Record<PlaygroundSlotId, SectionStyle>>;

  /** The uploaded reference, held only for the current session. */
  referenceFile: File | null;
  /** Object URL for previewing the reference; revoked when replaced/cleared. */
  referenceUrl: string | null;
  /** Populated when generation succeeds; drives the result screen. */
  generated: GeneratedSummary | null;
  /** Set when generation fails, shown back on the start screen. */
  generationError: string | null;

  /** Index into the CURRENT stage's tour steps, or -1 when not running. */
  tourStep: number;
  /** Which stages' tours the user has already seen. Persisted. */
  tourDone: Partial<Record<PlaygroundStage, boolean>>;

  enter: () => void;
  exit: () => void;
  goToStage: (stage: PlaygroundStage) => void;
  startFromScratch: () => void;
  beginGeneration: (file: File, url: string) => void;
  generationSucceeded: (selections: PlaygroundSelections, summary: GeneratedSummary) => void;
  generationFailed: (message: string) => void;
  customizeGenerated: () => void;
  startOver: () => void;

  setDevice: (device: PreviewDeviceId) => void;
  setActiveSlot: (slotId: PlaygroundSlotId) => void;
  select: (slotId: PlaygroundSlotId, slug: string | null) => void;
  setPalette: (palette: Palette | null) => void;

  /** Record the editable strings a section's preview reported. */
  setSectionFields: (slug: string, fields: EditableField[]) => void;
  /** Set (or, when the value equals the original / is blank, clear) one edit. */
  setContentOverride: (slug: string, original: string, value: string) => void;
  /** Drop every edit for one component, reverting it to its shipped content. */
  resetContent: (slug: string) => void;

  /** Merge a partial style into a slot's styling (undefined values clear it). */
  setSectionStyle: (slotId: PlaygroundSlotId, patch: SectionStylePatch) => void;
  /** Drop a slot's styling entirely, back to the section's own design. */
  resetSectionStyle: (slotId: PlaygroundSlotId) => void;

  startTour: () => void;
  goToTourStep: (step: number) => void;
  endTour: () => void;
}

const FIRST_SLOT_ID: PlaygroundSlotId = PLAYGROUND_SLOTS[0].id;

/** Revoke a previous object URL before dropping our reference to it. */
function revoke(url: string | null): void {
  if (url && typeof URL !== 'undefined') URL.revokeObjectURL(url);
}

export const usePlaygroundStore = create<PlaygroundStore>()(
  persist(
    (set, get) => ({
      active: false,
      stage: 'start',
      selections: {},
      palette: null,
      activeSlotId: FIRST_SLOT_ID,
      device: 'desktop',
      contentOverrides: {},
      sectionFields: {},
      sectionStyles: {},
      referenceFile: null,
      referenceUrl: null,
      generated: null,
      generationError: null,
      tourStep: -1,
      tourDone: {},

      // Entering always lands on the start screen; the tour auto-runs the first
      // time a given stage is seen.
      enter: () =>
        set((s) => ({
          active: true,
          stage: 'start',
          generationError: null,
          tourStep: s.tourDone.start ? -1 : 0,
        })),
      exit: () => {
        revoke(get().referenceUrl);
        set({
          active: false,
          stage: 'start',
          referenceFile: null,
          referenceUrl: null,
          generated: null,
          generationError: null,
          tourStep: -1,
        });
      },
      goToStage: (stage) =>
        set((s) => ({ stage, tourStep: s.tourDone[stage] ? -1 : 0 })),
      startFromScratch: () =>
        set((s) => ({ stage: 'builder', tourStep: s.tourDone.builder ? -1 : 0 })),
      beginGeneration: (file, url) => {
        revoke(get().referenceUrl);
        set({
          referenceFile: file,
          referenceUrl: url,
          stage: 'generating',
          generationError: null,
          tourStep: -1,
        });
      },
      generationSucceeded: (selections, summary) =>
        set((s) => ({
          selections,
          generated: summary,
          stage: 'result',
          tourStep: s.tourDone.result ? -1 : 0,
        })),
      generationFailed: (message) => {
        revoke(get().referenceUrl);
        set({
          stage: 'start',
          referenceFile: null,
          referenceUrl: null,
          generationError: message,
          tourStep: -1,
        });
      },
      customizeGenerated: () =>
        set((s) => ({ stage: 'builder', tourStep: s.tourDone.builder ? -1 : 0 })),
      startOver: () => {
        revoke(get().referenceUrl);
        set({
          stage: 'start',
          referenceFile: null,
          referenceUrl: null,
          generated: null,
          generationError: null,
          tourStep: -1,
        });
      },

      setDevice: (device) => set({ device }),
      setActiveSlot: (activeSlotId) => set({ activeSlotId }),
      select: (slotId, slug) =>
        set((state) => ({
          selections: { ...state.selections, [slotId]: slug },
          activeSlotId: slotId,
        })),
      setPalette: (palette) => set({ palette }),

      setSectionFields: (slug, fields) =>
        set((s) => ({ sectionFields: { ...s.sectionFields, [slug]: fields } })),
      setContentOverride: (slug, original, value) =>
        set((s) => {
          const current = { ...(s.contentOverrides[slug] ?? {}) };
          // A blank field or a value back at the original is "no edit" - drop it
          // so exports and the reset button reflect only genuine changes.
          if (value.trim() === '' || value === original) delete current[original];
          else current[original] = value;
          const next = { ...s.contentOverrides };
          if (Object.keys(current).length === 0) delete next[slug];
          else next[slug] = current;
          return { contentOverrides: next };
        }),
      resetContent: (slug) =>
        set((s) => {
          if (!s.contentOverrides[slug]) return {};
          const next = { ...s.contentOverrides };
          delete next[slug];
          return { contentOverrides: next };
        }),

      setSectionStyle: (slotId, patch) =>
        set((s) => {
          const next: SectionStylePatch = { ...(s.sectionStyles[slotId] ?? {}), ...patch };
          // An explicit `undefined` in the patch means "clear this part"; drop
          // the key so `hasSectionStyle` and the exporters see a clean object.
          for (const key of Object.keys(next) as (keyof SectionStyle)[]) {
            if (next[key] === undefined) delete next[key];
          }
          const styles = { ...s.sectionStyles };
          // Every remaining key is defined, so this is a complete SectionStyle.
          if (Object.keys(next).length === 0) delete styles[slotId];
          else styles[slotId] = next as SectionStyle;
          return { sectionStyles: styles };
        }),
      resetSectionStyle: (slotId) =>
        set((s) => {
          if (!s.sectionStyles[slotId]) return {};
          const styles = { ...s.sectionStyles };
          delete styles[slotId];
          return { sectionStyles: styles };
        }),

      startTour: () => set({ tourStep: 0 }),
      goToTourStep: (step) => {
        const stepCount = tourStepsForStage(get().stage).length;
        if (step < 0 || step >= stepCount) {
          set((s) => ({ tourStep: -1, tourDone: { ...s.tourDone, [s.stage]: true } }));
        } else {
          set({ tourStep: step });
        }
      },
      endTour: () =>
        set((s) => ({ tourStep: -1, tourDone: { ...s.tourDone, [s.stage]: true } })),
    }),
    {
      name: 'adysre:playground',
      // Session-only: mode, stage, the reference image and live tour position.
      // Persist only the user's page, device, and which tours they've seen.
      partialize: (state) => ({
        selections: state.selections,
        palette: state.palette,
        device: state.device,
        tourDone: state.tourDone,
        contentOverrides: state.contentOverrides,
        sectionStyles: state.sectionStyles,
      }),
    },
  ),
);
