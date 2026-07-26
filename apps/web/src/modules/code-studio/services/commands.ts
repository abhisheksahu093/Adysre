/**
 * The command registry shared by the command palette (and available to the
 * terminal). Each command is an id, a translated title and a thunk; the UI never
 * hardcodes what a command does. Actions that live in the shell (run, save,
 * share) arrive through the context so there is one source of truth.
 */
export interface StudioCommand {
  id: string;
  title: string;
  hint?: string;
  run: () => void;
}

export interface CommandContext {
  t: (key: string) => string;
  newFile: () => void;
  format: () => void;
  run: () => void;
  save: () => void;
  download: () => void;
  openShare: () => void;
  openSearch: () => void;
  toggleTheme: () => void;
  toggleWordWrap: () => void;
  toggleMinimap: () => void;
}

export function buildCommands(ctx: CommandContext): StudioCommand[] {
  const label = (id: string) => ctx.t(`commands.${id}`);
  return [
    { id: 'newFile', title: label('newFile'), run: ctx.newFile },
    { id: 'format', title: label('format'), hint: 'Shift+Alt+F', run: ctx.format },
    { id: 'run', title: label('run'), run: ctx.run },
    { id: 'save', title: label('save'), hint: 'Ctrl+S', run: ctx.save },
    { id: 'download', title: label('download'), run: ctx.download },
    { id: 'share', title: label('share'), run: ctx.openShare },
    { id: 'search', title: label('search'), hint: 'Ctrl+Shift+F', run: ctx.openSearch },
    { id: 'toggleTheme', title: label('toggleTheme'), run: ctx.toggleTheme },
    { id: 'toggleWordWrap', title: label('toggleWordWrap'), run: ctx.toggleWordWrap },
    { id: 'toggleMinimap', title: label('toggleMinimap'), run: ctx.toggleMinimap },
  ];
}

/** Case-insensitive subsequence match, so "nf" finds "New file". */
export function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q) return true;
  const haystack = text.toLowerCase();
  if (haystack.includes(q)) return true;
  let index = 0;
  for (const char of q) {
    index = haystack.indexOf(char, index);
    if (index === -1) return false;
    index += 1;
  }
  return true;
}
