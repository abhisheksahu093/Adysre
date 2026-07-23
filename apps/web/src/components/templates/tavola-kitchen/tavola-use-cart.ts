'use client';

import { useCallback, useMemo, useState } from 'react';

/**
 * TAVOLA - the basket.
 *
 * Lines hold a dish ID and a quantity, never a name or a price: the name is
 * localised and the price is converted, so storing either would freeze the
 * basket in whatever language and currency it was added in. Everything visible
 * is resolved from the active bundle at render.
 */
export interface TavolaCartLine {
  dishId: string;
  quantity: number;
}

export interface TavolaCart {
  lines: TavolaCartLine[];
  count: number;
  add: (dishId: string) => void;
  setQuantity: (dishId: string, quantity: number) => void;
  remove: (dishId: string) => void;
}

export function useTavolaCart(): TavolaCart {
  const [lines, setLines] = useState<TavolaCartLine[]>([]);

  const add = useCallback((dishId: string) => {
    setLines((current) => {
      const existing = current.find((line) => line.dishId === dishId);
      if (!existing) return [...current, { dishId, quantity: 1 }];
      return current.map((line) =>
        line.dishId === dishId ? { ...line, quantity: line.quantity + 1 } : line,
      );
    });
  }, []);

  const setQuantity = useCallback((dishId: string, quantity: number) => {
    // Zero removes the line rather than leaving a row that means nothing.
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.dishId !== dishId)
        : current.map((line) => (line.dishId === dishId ? { ...line, quantity } : line)),
    );
  }, []);

  const remove = useCallback((dishId: string) => {
    setLines((current) => current.filter((line) => line.dishId !== dishId));
  }, []);

  const count = useMemo(() => lines.reduce((total, line) => total + line.quantity, 0), [lines]);

  return { lines, count, add, setQuantity, remove };
}
