/**
 * A tiny imperative bridge to the single live Monaco instance.
 *
 * The command palette, search panel and terminal need to format the open file
 * or jump the cursor to a line, but Monaco is not in the store (it is not
 * serialisable). Rather than thread refs through the tree, the editor registers
 * these callbacks here on mount and the features call them. One editor exists at
 * a time, so a module singleton is the honest model.
 */
export interface EditorBridge {
  format: (() => void) | null;
  revealPosition: ((line: number, column?: number) => void) | null;
}

export const editorBridge: EditorBridge = {
  format: null,
  revealPosition: null,
};
