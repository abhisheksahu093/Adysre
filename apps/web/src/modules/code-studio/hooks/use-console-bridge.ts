'use client';

import { useEffect } from 'react';
import { useStudioStore } from '../store/use-studio-store';
import type { ConsoleLevel } from '../types';

interface BridgeMessage {
  source?: string;
  kind?: 'console' | 'error';
  level?: ConsoleLevel;
  parts?: string[];
  message?: string;
  filename?: string;
  line?: number;
  column?: number;
}

const LEVELS: ConsoleLevel[] = ['log', 'info', 'warn', 'error', 'table', 'debug'];

/**
 * Listens for the messages the preview iframe posts (see the console bridge in
 * the compiler) and feeds them into the store's console and diagnostics.
 */
export function useConsoleBridge() {
  const pushConsole = useStudioStore((s) => s.pushConsole);
  const setDiagnostics = useStudioStore((s) => s.setDiagnostics);

  useEffect(() => {
    const onMessage = (event: MessageEvent<BridgeMessage>) => {
      const data = event.data;
      if (!data || data.source !== 'adysre-studio') return;

      if (data.kind === 'console') {
        const level = data.level && LEVELS.includes(data.level) ? data.level : 'log';
        pushConsole({ level, parts: data.parts ?? [] });
      } else if (data.kind === 'error') {
        const message = data.message ?? 'Unknown error';
        pushConsole({ level: 'error', parts: [message] });
        setDiagnostics([
          {
            message,
            ...(data.filename ? { file: data.filename } : {}),
            ...(data.line ? { line: data.line } : {}),
            ...(data.column ? { column: data.column } : {}),
          },
        ]);
      }
    };

    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [pushConsole, setDiagnostics]);
}
