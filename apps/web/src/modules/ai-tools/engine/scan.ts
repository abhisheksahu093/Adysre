import { loadImage } from './image';

/**
 * QR and barcode scanning via the browser's native BarcodeDetector.
 *
 * It runs on-device with no download and no network, which fits the offline /
 * files-never-leave constraint exactly. It is a Chromium API today; where it is
 * missing the tools say so rather than failing silently (a bundled WASM decoder
 * is the planned fallback for other browsers).
 */

export interface DetectedCode {
  rawValue: string;
  format: string;
}

interface BarcodeDetectorLike {
  detect(source: CanvasImageSource | Blob | ImageData): Promise<DetectedCode[]>;
}

interface BarcodeDetectorCtor {
  new (options?: { formats?: string[] }): BarcodeDetectorLike;
  getSupportedFormats?(): Promise<string[]>;
}

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorCtor;
  }
}

export function scanSupported(): boolean {
  return typeof window !== 'undefined' && typeof window.BarcodeDetector === 'function';
}

/** Detect all codes of the given formats in an image file. */
export async function detectCodes(file: Blob, formats: string[]): Promise<DetectedCode[]> {
  if (!scanSupported()) {
    throw new Error('This browser cannot scan codes. Open ADYSRE in Chrome or Edge.');
  }
  const detector = new window.BarcodeDetector!({ formats });
  const { bitmap } = await loadImage(file);
  try {
    return await detector.detect(bitmap);
  } finally {
    bitmap.close();
  }
}

export const QR_FORMATS = ['qr_code'];
export const BARCODE_FORMATS = ['code_128', 'code_39', 'ean_13', 'ean_8', 'upc_a', 'upc_e', 'itf', 'codabar'];
