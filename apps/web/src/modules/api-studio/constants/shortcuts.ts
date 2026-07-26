/**
 * ADYSRE API Studio - the keyboard map.
 *
 * One declarative table drives three things that otherwise drift apart: the
 * global key handler, the shortcut hints on menus and buttons, and the help
 * dialog. Chords are written with `mod`, which is Cmd on macOS and Ctrl
 * everywhere else, so the table stays platform-neutral and the renderer does
 * the substitution.
 *
 * Labels are translation keys under `apiStudio.shortcuts`, never text.
 */

export const SHORTCUT_ACTIONS = [
  'sendRequest',
  'saveRequest',
  'commandPalette',
  'search',
  'toggleSidebar',
  'newTab',
  'duplicateTab',
  'closeTab',
  'reopenTab',
  'nextTab',
  'previousTab',
  'focusUrl',
  'toggleEnvironment',
  'copyAsCurl',
  'clearResponse',
  'showShortcuts',
] as const;

export type ShortcutAction = (typeof SHORTCUT_ACTIONS)[number];

export interface ShortcutBinding {
  action: ShortcutAction;
  /** Chord in `mod+shift+p` form; `mod` resolves per platform at render time. */
  keys: string;
  /** Second chord for the same action, when one exists. */
  altKeys: string | null;
  /** Key under `apiStudio.shortcuts` for the human description. */
  labelKey: string;
}

export const SHORTCUTS: readonly ShortcutBinding[] = [
  { action: 'sendRequest', keys: 'mod+enter', altKeys: null, labelKey: 'sendRequest' },
  { action: 'saveRequest', keys: 'mod+s', altKeys: null, labelKey: 'saveRequest' },
  { action: 'commandPalette', keys: 'mod+shift+p', altKeys: 'mod+k', labelKey: 'commandPalette' },
  { action: 'search', keys: 'mod+f', altKeys: null, labelKey: 'search' },
  { action: 'toggleSidebar', keys: 'mod+b', altKeys: null, labelKey: 'toggleSidebar' },
  { action: 'newTab', keys: 'mod+t', altKeys: null, labelKey: 'newTab' },
  { action: 'duplicateTab', keys: 'mod+d', altKeys: null, labelKey: 'duplicateTab' },
  { action: 'closeTab', keys: 'mod+w', altKeys: null, labelKey: 'closeTab' },
  { action: 'reopenTab', keys: 'mod+shift+t', altKeys: null, labelKey: 'reopenTab' },
  { action: 'nextTab', keys: 'mod+alt+right', altKeys: 'ctrl+tab', labelKey: 'nextTab' },
  { action: 'previousTab', keys: 'mod+alt+left', altKeys: 'ctrl+shift+tab', labelKey: 'previousTab' },
  { action: 'focusUrl', keys: 'mod+l', altKeys: null, labelKey: 'focusUrl' },
  { action: 'toggleEnvironment', keys: 'mod+e', altKeys: null, labelKey: 'toggleEnvironment' },
  { action: 'copyAsCurl', keys: 'mod+shift+c', altKeys: null, labelKey: 'copyAsCurl' },
  { action: 'clearResponse', keys: 'mod+shift+backspace', altKeys: null, labelKey: 'clearResponse' },
  { action: 'showShortcuts', keys: 'mod+/', altKeys: null, labelKey: 'showShortcuts' },
];
