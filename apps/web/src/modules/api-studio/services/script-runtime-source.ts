/**
 * ADYSRE API Studio - the script runtime, as source.
 *
 * A STRING rather than a module, because this code has to run inside a Web
 * Worker built from a Blob. A bundled worker entry would work too, but a Blob
 * needs no bundler configuration to be correct, cannot accidentally pull the
 * app's own modules into the sandbox, and behaves identically in dev and in a
 * production build.
 *
 * Keeping it as source also makes it TESTABLE without a browser: the tests
 * evaluate this exact string in Node and drive `runScript` directly, so what is
 * verified is the code that actually runs, not a parallel implementation.
 *
 * Written in plain ES2020 with no template literals, since the whole thing is
 * itself inside one.
 */
export const SCRIPT_RUNTIME_SOURCE = String.raw`
function runScript(source, context) {
  var logs = [];
  var tests = [];
  var setVariables = {};
  var unsetVariables = [];

  function record(level, args) {
    var parts = [];
    for (var i = 0; i < args.length; i += 1) {
      var value = args[i];
      if (typeof value === 'string') parts.push(value);
      else {
        try { parts.push(JSON.stringify(value)); } catch (e) { parts.push(String(value)); }
      }
    }
    // Bounded: a script looping over a log is a script that would otherwise
    // fill the tab's memory before the timeout could stop it.
    if (logs.length < 200) logs.push({ level: level, message: parts.join(' ') });
  }

  var sandboxConsole = {
    log: function () { record('log', arguments); },
    info: function () { record('log', arguments); },
    warn: function () { record('warn', arguments); },
    error: function () { record('error', arguments); },
  };

  function headerBag(list) {
    return {
      get: function (name) {
        var wanted = String(name).toLowerCase();
        for (var i = 0; i < list.length; i += 1) {
          if (list[i].name.toLowerCase() === wanted) return list[i].value;
        }
        return undefined;
      },
      has: function (name) { return this.get(name) !== undefined; },
      all: function () { return list.slice(); },
    };
  }

  function fail(message) {
    var error = new Error(message);
    error.name = 'AssertionError';
    throw error;
  }

  function show(value) {
    if (typeof value === 'string') return JSON.stringify(value);
    try { return JSON.stringify(value); } catch (e) { return String(value); }
  }

  /**
   * A small assertion chain in the shape people already know from Postman, so
   * a pasted script mostly works. Deliberately small: each method exists
   * because a real test needs it, not to complete an imitation.
   */
  function expect(actual) {
    var negated = false;

    var chain = {
      get not() { negated = true; return chain; },
      get to() { return chain; },
      get be() { return chain; },
      get have() { return chain; },
      get that() { return chain; },
      get is() { return chain; },
      get and() { return chain; },

      equal: function (expected) {
        var ok = actual === expected;
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to equal ' + show(expected));
        return chain;
      },
      eql: function (expected) {
        var ok = JSON.stringify(actual) === JSON.stringify(expected);
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to deeply equal ' + show(expected));
        return chain;
      },
      above: function (limit) {
        var ok = Number(actual) > Number(limit);
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to be above ' + limit);
        return chain;
      },
      below: function (limit) {
        var ok = Number(actual) < Number(limit);
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to be below ' + limit);
        return chain;
      },
      include: function (part) {
        var ok = false;
        if (typeof actual === 'string') ok = actual.indexOf(String(part)) !== -1;
        else if (Array.isArray(actual)) ok = actual.indexOf(part) !== -1;
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to include ' + show(part));
        return chain;
      },
      match: function (pattern) {
        var ok = new RegExp(pattern).test(String(actual));
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to match ' + pattern);
        return chain;
      },
      property: function (name) {
        var ok = actual !== null && actual !== undefined &&
          Object.prototype.hasOwnProperty.call(actual, name);
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to have property ' + name);
        return chain;
      },
      oneOf: function (allowed) {
        var ok = Array.isArray(allowed) && allowed.indexOf(actual) !== -1;
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to be one of ' + show(allowed));
        return chain;
      },
      get exist() {
        var ok = actual !== null && actual !== undefined;
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to exist');
        return chain;
      },
      get true() {
        var ok = actual === true;
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to be true');
        return chain;
      },
      get false() {
        var ok = actual === false;
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to be false');
        return chain;
      },
      get ok() {
        var ok = Boolean(actual);
        if (ok === negated) fail('expected ' + show(actual) + (negated ? ' not' : '') + ' to be truthy');
        return chain;
      },
    };

    return chain;
  }

  var response = context.response
    ? {
        code: context.response.status,
        status: context.response.statusText,
        responseTime: context.response.responseTime,
        headers: headerBag(context.response.headers),
        text: function () { return context.response.body; },
        json: function () {
          try {
            return JSON.parse(context.response.body);
          } catch (e) {
            throw new Error('The response body is not JSON.');
          }
        },
      }
    : undefined;

  var pm = {
    request: {
      method: context.request.method,
      url: context.request.url,
      headers: headerBag(context.request.headers),
      body: context.request.body,
    },
    response: response,
    environment: {
      get: function (key) { return context.variables[key]; },
      set: function (key, value) { setVariables[String(key)] = String(value); },
      unset: function (key) { unsetVariables.push(String(key)); },
      has: function (key) { return Object.prototype.hasOwnProperty.call(context.variables, key); },
    },
    variables: {
      get: function (key) {
        return Object.prototype.hasOwnProperty.call(setVariables, key)
          ? setVariables[key]
          : context.variables[key];
      },
    },
    expect: expect,
    test: function (name, fn) {
      // A failing test is a RESULT, not a crash: the script keeps going so one
      // broken expectation does not hide the five checks after it.
      try {
        fn();
        tests.push({ name: String(name), passed: true, error: null });
      } catch (error) {
        tests.push({
          name: String(name),
          passed: false,
          error: error && error.message ? String(error.message) : String(error),
        });
      }
    },
  };

  var outcome = {
    logs: logs,
    tests: tests,
    setVariables: setVariables,
    unsetVariables: unsetVariables,
    error: null,
  };

  try {
    var fn = new Function('pm', 'console', 'expect', '"use strict";' + source);
    fn(pm, sandboxConsole, expect);
  } catch (error) {
    outcome.error = error && error.message ? String(error.message) : String(error);
  }

  return outcome;
}
`;

/**
 * The worker's whole program: the runtime, plus the message plumbing and the
 * removal of everything a script has no business reaching.
 *
 * The stripped globals are defence in depth rather than a claim of true
 * isolation. The threat this actually addresses is a SHARED collection whose
 * script runs in a colleague's browser: without `fetch`, `XMLHttpRequest`,
 * `WebSocket` or `importScripts`, such a script cannot phone home with what it
 * saw, and without storage APIs it cannot read what else is on the origin.
 */
export const SCRIPT_WORKER_SOURCE = `
self.fetch = undefined;
self.XMLHttpRequest = undefined;
self.WebSocket = undefined;
self.EventSource = undefined;
self.importScripts = undefined;
self.indexedDB = undefined;
self.caches = undefined;
self.Worker = undefined;
self.SharedWorker = undefined;
self.Notification = undefined;
self.navigator = undefined;

${SCRIPT_RUNTIME_SOURCE}

self.onmessage = function (event) {
  var data = event.data || {};
  try {
    self.postMessage(runScript(data.source || '', data.context || { request: {}, variables: {} }));
  } catch (error) {
    self.postMessage({
      logs: [],
      tests: [],
      setVariables: {},
      unsetVariables: [],
      error: error && error.message ? String(error.message) : 'The script could not be run.',
    });
  }
};
`;
