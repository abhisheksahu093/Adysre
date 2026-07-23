import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type {
  PlaygroundPage,
  PlaygroundSelections,
  PlaygroundSlotId,
} from '@/data/playground';
import {
  DEFAULT_PAGE_ORDER,
  PLAYGROUND_SLOTS,
  createPlaygroundPage,
  isSiteSlot,
  normalizePageOrder,
  reorder,
} from '@/data/playground';
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
  /**
   * SITE-scoped choices only: the header and footer every page shares.
   *
   * Page-scoped choices live on the page (`pages[].selections`). Slot ids are
   * disjoint by scope, so the two merge without ambiguity - see
   * `activeSelections`.
   */
  selections: PlaygroundSelections;
  /** The site's pages, in tab order. Always at least one. Persisted. */
  pages: PlaygroundPage[];
  /** Which page the builder is editing. Persisted. */
  activePageId: string;
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

  /** Add a page and switch to it. */
  addPage: (name: string) => void;
  renamePage: (pageId: string, name: string) => void;
  /** Remove a page. The last one is never removed - a site needs a page. */
  removePage: (pageId: string) => void;
  setActivePage: (pageId: string) => void;
  /** Move a body section within the active page's order, by position. */
  moveSection: (from: number, to: number) => void;

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
const HOME_PAGE_ID = 'home';

/**
 * What actually reaches storage - the user's SITE, plus their preferences.
 *
 * Named rather than inferred from `partialize` because `migrate` has to build a
 * complete one, and inferring it there is what lets a half-migrated shape
 * through the type checker.
 */
interface PersistedPlayground {
  selections: PlaygroundSelections;
  pages: PlaygroundPage[];
  activePageId: string;
  palette: Palette | null;
  device: PreviewDeviceId;
  tourDone: Partial<Record<PlaygroundStage, boolean>>;
  contentOverrides: Record<string, Record<string, string>>;
  sectionStyles: Partial<Record<PlaygroundSlotId, SectionStyle>>;
}

/** Revoke a previous object URL before dropping our reference to it. */
function revoke(url: string | null): void {
  if (url && typeof URL !== 'undefined') URL.revokeObjectURL(url);
}

/**
 * Ids only have to be unique within one browser's saved site, so a counter off
 * the existing ids is enough - and unlike `crypto.randomUUID` it is stable
 * across a server render.
 */
function nextPageId(pages: readonly PlaygroundPage[]): string {
  let n = pages.length + 1;
  const taken = new Set(pages.map((page) => page.id));
  while (taken.has(`page-${n}`)) n += 1;
  return `page-${n}`;
}

/**
 * One scope's half of a flat slot-keyed record.
 *
 * Used wherever a map covering every slot has to be split between the site and a
 * page - the v1 migration and the generator's output both arrive that way.
 */
function scopedSelections<T>(
  record: Partial<Record<PlaygroundSlotId, T>>,
  site: boolean,
): Partial<Record<PlaygroundSlotId, T>> {
  return Object.fromEntries(
    Object.entries(record).filter(([id]) => isSiteSlot(id as PlaygroundSlotId) === site),
  ) as Partial<Record<PlaygroundSlotId, T>>;
}

/**
 * Stand-in for a store with no pages at all, which the reducers never produce.
 *
 * A module constant rather than a fresh `createPlaygroundPage()` per call: these
 * selectors run on every store read, and a new object each time would make even
 * the fallback path a new snapshot.
 */
const EMPTY_PAGE: PlaygroundPage = createPlaygroundPage(HOME_PAGE_ID, 'Home');

/** The page being edited, falling back to the first so callers stay total. */
function activePage(state: {
  pages: PlaygroundPage[];
  activePageId: string;
}): PlaygroundPage {
  return (
    state.pages.find((page) => page.id === state.activePageId) ?? state.pages[0] ?? EMPTY_PAGE
  );
}

/** Replace the active page with `update(page)`, leaving the rest untouched. */
function patchActivePage(
  state: { pages: PlaygroundPage[]; activePageId: string },
  update: (page: PlaygroundPage) => PlaygroundPage,
): { pages: PlaygroundPage[] } {
  const current = activePage(state);
  return {
    pages: state.pages.map((page) => (page.id === current.id ? update(page) : page)),
  };
}

/**
 * Every choice in force for the page being edited: the site's shared chrome
 * plus that page's own body sections.
 *
 * Site and page slot ids are disjoint, so this merge cannot lose a key - and it
 * lets every consumer keep asking one question ("what fills this slot?") rather
 * than branching on scope.
 */
export function activeSelections(state: PlaygroundStore): PlaygroundSelections {
  return { ...state.selections, ...activePage(state).selections };
}

/** The same merge for styling. */
export function activeSectionStyles(
  state: PlaygroundStore,
): Partial<Record<PlaygroundSlotId, SectionStyle>> {
  return { ...state.sectionStyles, ...activePage(state).sectionStyles };
}

/** One slot's style, from whichever scope owns it. */
export function sectionStyleOf(
  state: PlaygroundStore,
  slotId: PlaygroundSlotId,
): SectionStyle | undefined {
  return isSiteSlot(slotId)
    ? state.sectionStyles[slotId]
    : activePage(state).sectionStyles[slotId];
}

/** The active page's body order, reconciled with today's slot list. */
export function activeOrder(state: PlaygroundStore): PlaygroundSlotId[] {
  return normalizePageOrder(activePage(state).order);
}

/* --------------------------------------------------------------- hooks
 *
 * The three selectors above all BUILD their result - a merge, or a normalised
 * copy - so each call returns a new reference. Zustand reads through
 * `useSyncExternalStore`, which compares snapshots by identity and re-renders
 * when they differ: passing one of them directly re-renders forever ("The result
 * of getSnapshot should be cached").
 *
 * `useShallow` is the fix, and wrapping it here rather than at each call site is
 * what stops the next consumer from reintroducing the loop. Shallow comparison
 * is sufficient because every value in these results is either a primitive or a
 * reference the store itself keeps stable.
 */

/** Every choice in force on the page being edited: shared chrome + its body. */
export function useActiveSelections(): PlaygroundSelections {
  return usePlaygroundStore(useShallow(activeSelections));
}

/** The same merge for styling. */
export function useActiveSectionStyles(): Partial<Record<PlaygroundSlotId, SectionStyle>> {
  return usePlaygroundStore(useShallow(activeSectionStyles));
}

/** The active page's body order. */
export function useActiveOrder(): PlaygroundSlotId[] {
  return usePlaygroundStore(useShallow(activeOrder));
}

export const usePlaygroundStore = create<PlaygroundStore>()(
  persist(
    (set, get) => ({
      active: false,
      stage: 'start',
      selections: {},
      pages: [createPlaygroundPage(HOME_PAGE_ID, 'Home')],
      activePageId: HOME_PAGE_ID,
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
          // The generator speaks in one flat map of slots. Split it by scope, or
          // the body sections it picked would land at site level and repeat
          // themselves on every page the user later adds.
          selections: scopedSelections(selections, true),
          ...patchActivePage(s, (page) => ({
            ...page,
            selections: scopedSelections(selections, false),
          })),
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
          activeSlotId: slotId,
          // Header and footer are the site's, so choosing one changes every
          // page; everything else belongs to the page being edited.
          ...(isSiteSlot(slotId)
            ? { selections: { ...state.selections, [slotId]: slug } }
            : patchActivePage(state, (page) => ({
                ...page,
                selections: { ...page.selections, [slotId]: slug },
              }))),
        })),
      setPalette: (palette) => set({ palette }),

      addPage: (name) =>
        set((state) => {
          const id = nextPageId(state.pages);
          const trimmed = name.trim();
          return {
            // A new page starts empty rather than cloning Home: "About us" that
            // arrives full of the pricing table is more to undo than to build.
            pages: [...state.pages, createPlaygroundPage(id, trimmed || id)],
            activePageId: id,
          };
        }),

      renamePage: (pageId, name) =>
        set((state) => {
          const trimmed = name.trim();
          if (!trimmed) return {};
          return {
            pages: state.pages.map((page) =>
              page.id === pageId ? { ...page, name: trimmed } : page,
            ),
          };
        }),

      removePage: (pageId) =>
        set((state) => {
          // A site always has a page; removing the last would leave the canvas
          // with nothing to render and no way back.
          if (state.pages.length <= 1) return {};
          const pages = state.pages.filter((page) => page.id !== pageId);
          return {
            pages,
            activePageId:
              state.activePageId === pageId ? (pages[0]?.id ?? HOME_PAGE_ID) : state.activePageId,
          };
        }),

      setActivePage: (activePageId) =>
        set((state) =>
          state.pages.some((page) => page.id === activePageId) ? { activePageId } : {},
        ),

      moveSection: (from, to) =>
        set((state) =>
          patchActivePage(state, (page) => ({
            ...page,
            order: reorder(normalizePageOrder(page.order), from, to),
          })),
        ),

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
          const owner = isSiteSlot(slotId) ? s.sectionStyles : activePage(s).sectionStyles;
          const next: SectionStylePatch = { ...(owner[slotId] ?? {}), ...patch };
          // An explicit `undefined` in the patch means "clear this part"; drop
          // the key so `hasSectionStyle` and the exporters see a clean object.
          for (const key of Object.keys(next) as (keyof SectionStyle)[]) {
            if (next[key] === undefined) delete next[key];
          }
          const styles = { ...owner };
          // Every remaining key is defined, so this is a complete SectionStyle.
          if (Object.keys(next).length === 0) delete styles[slotId];
          else styles[slotId] = next as SectionStyle;

          // Chrome styling is the site's, so it follows the header and footer
          // onto every page; body styling stays with the page it was made on.
          return isSiteSlot(slotId)
            ? { sectionStyles: styles }
            : patchActivePage(s, (page) => ({ ...page, sectionStyles: styles }));
        }),
      resetSectionStyle: (slotId) =>
        set((s) => {
          if (isSiteSlot(slotId)) {
            if (!s.sectionStyles[slotId]) return {};
            const styles = { ...s.sectionStyles };
            delete styles[slotId];
            return { sectionStyles: styles };
          }
          if (!activePage(s).sectionStyles[slotId]) return {};
          return patchActivePage(s, (page) => {
            const styles = { ...page.sectionStyles };
            delete styles[slotId];
            return { ...page, sectionStyles: styles };
          });
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
      // v1 was a single flat page; v2 splits the site's chrome from its pages.
      version: 2,
      /**
       * Carry a v1 site forward rather than dropping it.
       *
       * A v1 state has one flat `selections` covering every slot. Everything
       * page-scoped moves onto a "Home" page and the chrome stays at site level,
       * so a user who had built a page finds it exactly where they left it -
       * now with the ability to add a second page beside it.
       */
      migrate: (persisted, version): PersistedPlayground => {
        const state = (persisted ?? {}) as Partial<PersistedPlayground>;
        const base: PersistedPlayground = {
          selections: state.selections ?? {},
          pages: state.pages ?? [],
          activePageId: state.activePageId ?? HOME_PAGE_ID,
          palette: state.palette ?? null,
          device: state.device ?? 'desktop',
          tourDone: state.tourDone ?? {},
          contentOverrides: state.contentOverrides ?? {},
          sectionStyles: state.sectionStyles ?? {},
        };
        if (version >= 2 && base.pages.length > 0) return base;

        return {
          ...base,
          selections: scopedSelections(base.selections, true),
          sectionStyles: scopedSelections(base.sectionStyles, true),
          pages: [
            {
              ...createPlaygroundPage(HOME_PAGE_ID, 'Home'),
              selections: scopedSelections(base.selections, false),
              sectionStyles: scopedSelections(base.sectionStyles, false),
              order: [...DEFAULT_PAGE_ORDER],
            },
          ],
          activePageId: HOME_PAGE_ID,
        };
      },
      // Session-only: mode, stage, the reference image and live tour position.
      // Persist the whole site, the device, and which tours they've seen.
      partialize: (state) => ({
        selections: state.selections,
        pages: state.pages,
        activePageId: state.activePageId,
        palette: state.palette,
        device: state.device,
        tourDone: state.tourDone,
        contentOverrides: state.contentOverrides,
        sectionStyles: state.sectionStyles,
      }),
    },
  ),
);
