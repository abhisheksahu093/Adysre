'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  LUMEN_CART,
  findLumenProduct,
  type LumenArt,
  type LumenCartLine,
} from '@/data/templates/lumen-store-content';

/**
 * LUMEN - the basket.
 *
 * Local React state and nothing else: no storage, no API, no context provider.
 * A template is a design artifact, and a basket that persisted would be a
 * commitment about where a real store keeps its state - a decision the person
 * downloading this should make, not one they should have to unpick.
 *
 * State lives in the root component so the header count and the basket page read
 * the same array. Navigating between pages is a real document load, so the demo
 * basket resets to `LUMEN_CART`; that is honest rather than a bug.
 */

/** A basket line joined to its product, which is what every view actually wants. */
export interface LumenCartEntry extends LumenCartLine {
  /** `productId:swatchId` - stable across reorders, unlike an array index. */
  key: string;
  name: string;
  price: number;
  category: string;
  /** The CSS composition that draws it, joined from the catalogue. */
  art: LumenArt;
  swatchLabel: string;
  lineTotal: number;
}

export interface LumenCart {
  entries: LumenCartEntry[];
  count: number;
  subtotal: number;
  /** Free over the threshold; the number, not the label, so pages can format it. */
  shipping: number;
  total: number;
  add: (productId: string, swatchId: string, quantity: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
}

/** Orders over this clear free UK delivery. Mirrors `LUMEN_SHOP.cart.shippingNote`. */
const FREE_SHIPPING_OVER = 150;
const STANDARD_SHIPPING = 6.5;
/** A basket line is capped rather than unbounded, as a real stock system would. */
const MAX_QUANTITY = 9;

const keyOf = (productId: string, swatchId: string) => `${productId}:${swatchId}`;

export function useLumenCart(): LumenCart {
  const [lines, setLines] = useState<LumenCartLine[]>(LUMEN_CART);

  const add = useCallback((productId: string, swatchId: string, quantity: number) => {
    setLines((current) => {
      const existing = current.findIndex(
        (line) => line.productId === productId && line.swatchId === swatchId,
      );
      // Same product in the same finish is one line with a larger quantity -
      // two identical rows in a basket is the classic sign of a naive cart.
      if (existing >= 0) {
        return current.map((line, index) =>
          index === existing
            ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + quantity) }
            : line,
        );
      }
      return [...current, { productId, swatchId, quantity }];
    });
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((current) =>
      current.map((line) =>
        keyOf(line.productId, line.swatchId) === key
          ? { ...line, quantity: Math.min(MAX_QUANTITY, Math.max(1, quantity)) }
          : line,
      ),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((current) => current.filter((line) => keyOf(line.productId, line.swatchId) !== key));
  }, []);

  return useMemo(() => {
    const entries = lines.flatMap<LumenCartEntry>((line) => {
      const product = findLumenProduct(line.productId);
      // A line whose product left the catalogue is dropped rather than rendered
      // as a blank row - flatMap makes that a data decision, not a null check.
      if (!product) return [];
      const swatch = product.swatches.find((option) => option.id === line.swatchId);
      return [
        {
          ...line,
          key: keyOf(line.productId, line.swatchId),
          name: product.name,
          price: product.price,
          category: product.category,
          art: product.art,
          swatchLabel: swatch?.label ?? product.swatches[0]?.label ?? '',
          lineTotal: product.price * line.quantity,
        },
      ];
    });

    const subtotal = entries.reduce((sum, entry) => sum + entry.lineTotal, 0);
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : STANDARD_SHIPPING;

    return {
      entries,
      count: entries.reduce((sum, entry) => sum + entry.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
      add,
      setQuantity,
      remove,
    };
  }, [lines, add, setQuantity, remove]);
}
