/**
 * Quick-tour script for the playground, as data.
 *
 * A step points at a `data-tour` attribute rather than a component: the tour
 * knows nothing about the UI tree, and the UI can be rearranged freely as long
 * as the attributes survive. Copy lives in the message catalogues under
 * `components.playground.tour.steps.<id>` - nothing here is user-facing text.
 *
 * Steps are grouped by `stage`: the playground moves through start → generating
 * → result → builder, and only one stage is mounted at a time. The tour shows
 * the steps for the current stage, so every spotlight always has a live target.
 */

export type PlaygroundStage = 'start' | 'generating' | 'result' | 'builder';

export interface PlaygroundTourStep {
  /** Message key segment and React key. */
  id: string;
  /** Value of the `data-tour` attribute to spotlight; `null` centres the card. */
  target: string | null;
  /** Which flow stage this step belongs to. */
  stage: PlaygroundStage;
}

export const PLAYGROUND_TOUR_STEPS: readonly PlaygroundTourStep[] = [
  // Start screen - choose a path.
  { id: 'welcome', target: null, stage: 'start' },
  { id: 'upload', target: 'reference-upload', stage: 'start' },
  { id: 'scratch', target: 'start-scratch', stage: 'start' },
  // Result - after a template is generated.
  { id: 'result', target: 'result-actions', stage: 'result' },
  // Builder - hand-assembly.
  { id: 'slots', target: 'slots', stage: 'builder' },
  { id: 'variations', target: 'variations', stage: 'builder' },
  { id: 'content', target: 'content', stage: 'builder' },
  { id: 'canvas', target: 'canvas', stage: 'builder' },
  { id: 'device', target: 'device', stage: 'builder' },
  { id: 'export', target: 'export', stage: 'builder' },
];

/** The tour steps that belong to a stage, in order. */
export function tourStepsForStage(stage: PlaygroundStage): PlaygroundTourStep[] {
  return PLAYGROUND_TOUR_STEPS.filter((s) => s.stage === stage);
}
