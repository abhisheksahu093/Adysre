/**
 * Pixel filters for the enhancer: a 3x3 convolution (used for unsharp masking)
 * and a box-blur blend (used for denoise). Brightness/contrast/saturation are
 * done with the far cheaper canvas `ctx.filter`, so these only run when the user
 * actually asks for sharpen or denoise. All in-memory, no network.
 */

/** Edge-clamped 3x3 convolution over RGB; alpha is preserved. */
export function convolve3x3(image: ImageData, kernel: number[]): ImageData {
  const { width, height, data } = image;
  const out = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let ky = 0; ky < 3; ky++) {
        for (let kx = 0; kx < 3; kx++) {
          const px = Math.min(width - 1, Math.max(0, x + kx - 1));
          const py = Math.min(height - 1, Math.max(0, y + ky - 1));
          const idx = (py * width + px) * 4;
          const k = kernel[ky * 3 + kx]!;
          r += data[idx]! * k;
          g += data[idx + 1]! * k;
          b += data[idx + 2]! * k;
        }
      }
      const o = (y * width + x) * 4;
      out[o] = r;
      out[o + 1] = g;
      out[o + 2] = b;
      out[o + 3] = data[o + 3]!;
    }
  }
  return new ImageData(out, width, height);
}

/** Unsharp-mask kernel for a 0..1 sharpen amount. */
export function sharpenKernel(amount: number): number[] {
  const a = Math.max(0, amount);
  return [0, -a, 0, -a, 1 + 4 * a, -a, 0, -a, 0];
}

/** Denoise: blend the image toward a 3x3 box blur by `amount` (0..1). */
export function denoise(image: ImageData, amount: number): ImageData {
  const a = Math.min(1, Math.max(0, amount));
  if (a === 0) return image;
  const blurred = convolve3x3(image, new Array(9).fill(1 / 9));
  const out = new Uint8ClampedArray(image.data.length);
  for (let i = 0; i < out.length; i++) {
    if ((i + 1) % 4 === 0) out[i] = image.data[i]!; // keep alpha
    else out[i] = image.data[i]! * (1 - a) + blurred.data[i]! * a;
  }
  return new ImageData(out, image.width, image.height);
}
