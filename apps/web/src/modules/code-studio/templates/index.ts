import type { ProjectFile } from '../types';
import { createId } from '../utils/files';

/**
 * Starter templates. Each is a list of {path, content}; the studio turns them
 * into a project (assigning ids) on demand. `entry` names the script the
 * preview should compile from when it is not obvious from index.html.
 */
export interface StudioTemplate {
  id: string;
  /** Key under `codeStudio.templates.<id>` for the label. */
  labelKey: string;
  files: { path: string; content: string }[];
  entry?: string;
}

const HTML_INDEX = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <title>ADYSRE Studio</title>
  </head>
  <body>
    <main class="page">
      <h1>Hello from ADYSRE Code Studio</h1>
      <p>Edit the files on the left and watch this preview update live.</p>
      <button id="cta">Click me</button>
    </main>
    <script src="script.js"></script>
  </body>
</html>
`;

const HTML_CSS = `:root { color-scheme: dark; }
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background: #0b0b0f;
  color: #e7e7ea;
  display: grid;
  place-items: center;
  min-height: 100vh;
}
.page { text-align: center; padding: 2rem; }
h1 { font-size: 1.75rem; margin: 0 0 0.5rem; }
button {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  border: 0;
  border-radius: 8px;
  background: #6366f1;
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
}
button:hover { background: #4f46e5; }
`;

const HTML_JS = `const button = document.getElementById('cta');
let count = 0;
button.addEventListener('click', () => {
  count += 1;
  button.textContent = 'Clicked ' + count + ' time' + (count === 1 ? '' : 's');
  console.log('clicked', count);
});
`;

const REACT_APP_JSX = `import React, { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="app">
      <h1>React in ADYSRE Studio</h1>
      <p>A live React app, compiled in your browser.</p>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
    </div>
  );
}
`;

const REACT_MAIN_JSX = `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
`;

const REACT_APP_TSX = `import React, { useState } from 'react';

export default function App(): React.ReactElement {
  const [count, setCount] = useState<number>(0);
  return (
    <div className="app">
      <h1>React + TypeScript</h1>
      <p>Typed React, compiled in your browser.</p>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
    </div>
  );
}
`;

const REACT_MAIN_TSX = `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

const root = document.getElementById('root');
if (root) createRoot(root).render(<App />);
`;

const REACT_CSS = `body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background: #0b0b0f;
  color: #e7e7ea;
  display: grid;
  place-items: center;
  min-height: 100vh;
}
.app { text-align: center; padding: 2rem; }
button {
  margin-top: 1rem; padding: 0.6rem 1.2rem; border: 0; border-radius: 8px;
  background: #6366f1; color: white; font-size: 0.95rem; cursor: pointer;
}
button:hover { background: #4f46e5; }
`;

const REACT_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="style.css" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

const VUE_APP = `<template>
  <div class="app">
    <h1>Vue in ADYSRE Studio</h1>
    <p>A live Vue SFC, compiled in your browser.</p>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>

<style>
body { margin: 0; font-family: ui-sans-serif, system-ui, sans-serif; background: #0b0b0f; color: #e7e7ea; display: grid; place-items: center; min-height: 100vh; }
.app { text-align: center; padding: 2rem; }
button { margin-top: 1rem; padding: 0.6rem 1.2rem; border: 0; border-radius: 8px; background: #42b883; color: white; font-size: 0.95rem; cursor: pointer; }
</style>
`;

const VUE_MAIN = `import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
`;

const VUE_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vue App</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`;

const TS_MAIN = `interface Task {
  id: number;
  title: string;
  done: boolean;
}

const tasks: Task[] = [
  { id: 1, title: 'Learn TypeScript', done: true },
  { id: 2, title: 'Ship in the browser', done: false },
];

const list = document.createElement('ul');
for (const task of tasks) {
  const item = document.createElement('li');
  item.textContent = (task.done ? '✓ ' : '• ') + task.title;
  list.appendChild(item);
}
document.body.appendChild(list);
console.log('rendered', tasks.length, 'tasks');
`;

const TS_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <style>
      body { font-family: ui-sans-serif, system-ui, sans-serif; background: #0b0b0f; color: #e7e7ea; padding: 2rem; }
      li { margin: 0.25rem 0; }
    </style>
    <title>TypeScript</title>
  </head>
  <body>
    <h1>TypeScript Playground</h1>
    <script src="main.ts"></script>
  </body>
</html>
`;

export const TEMPLATES: StudioTemplate[] = [
  {
    id: 'html',
    labelKey: 'html',
    files: [
      { path: 'index.html', content: HTML_INDEX },
      { path: 'style.css', content: HTML_CSS },
      { path: 'script.js', content: HTML_JS },
    ],
    entry: 'script.js',
  },
  {
    id: 'typescript',
    labelKey: 'typescript',
    files: [
      { path: 'index.html', content: TS_HTML },
      { path: 'main.ts', content: TS_MAIN },
    ],
    entry: 'main.ts',
  },
  {
    id: 'react',
    labelKey: 'react',
    files: [
      { path: 'index.html', content: REACT_HTML },
      { path: 'style.css', content: REACT_CSS },
      { path: 'main.jsx', content: REACT_MAIN_JSX },
      { path: 'App.jsx', content: REACT_APP_JSX },
    ],
    entry: 'main.jsx',
  },
  {
    id: 'reactTs',
    labelKey: 'reactTs',
    files: [
      { path: 'index.html', content: REACT_HTML },
      { path: 'style.css', content: REACT_CSS },
      { path: 'main.tsx', content: REACT_MAIN_TSX },
      { path: 'App.tsx', content: REACT_APP_TSX },
    ],
    entry: 'main.tsx',
  },
  {
    id: 'vue',
    labelKey: 'vue',
    files: [
      { path: 'index.html', content: VUE_HTML },
      { path: 'main.js', content: VUE_MAIN },
      { path: 'App.vue', content: VUE_APP },
    ],
    entry: 'main.js',
  },
];

export function templateFiles(template: StudioTemplate): ProjectFile[] {
  return template.files.map((f) => ({ id: createId(), path: f.path, content: f.content }));
}
