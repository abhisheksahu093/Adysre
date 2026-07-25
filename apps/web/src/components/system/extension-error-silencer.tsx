/**
 * Drops uncaught errors that originate in a browser EXTENSION, before they reach
 * anyone else.
 *
 * Extensions inject scripts into the page's main world (e.g. a shortcut manager's
 * `main-world.js`). When one of those throws, the error is dispatched on our
 * `window`, so Next's dev overlay catches it and blames the app for a bug it did
 * not cause and cannot fix. We register a CAPTURE-phase listener, which runs
 * before Next's bubble-phase one, and stop propagation only for errors whose
 * source is an `*-extension://` URL. App errors are untouched and still surface.
 *
 * This is an inline script rather than a `useEffect`, so it is attached during
 * HTML parse, before React hydrates and before the overlay wires up its own
 * handlers. Rendered once, high in the tree.
 */

const SILENCER = `(function () {
  if (typeof window === 'undefined' || window.__adysreExtSilencer) return;
  window.__adysreExtSilencer = true;
  function fromExtension(text) {
    return typeof text === 'string' && text.indexOf('-extension://') !== -1;
  }
  window.addEventListener(
    'error',
    function (event) {
      var stack = event && event.error && event.error.stack;
      if (fromExtension(event && event.filename) || fromExtension(stack)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true,
  );
  window.addEventListener(
    'unhandledrejection',
    function (event) {
      var reason = event && event.reason;
      var stack = reason && (reason.stack || (typeof reason === 'string' ? reason : ''));
      if (fromExtension(stack)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true,
  );
})();`;

export function ExtensionErrorSilencer() {
  // A fixed, static, self-authored script; no user input flows into it.
  return <script dangerouslySetInnerHTML={{ __html: SILENCER }} />;
}
