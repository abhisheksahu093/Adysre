/**
 * Curated CSS gradients - the set the Gradients page opens on.
 *
 * Plain data: id, display name, gradient type, angle, ordered colour stops,
 * search tags. Everything the page does (quick view, edit, export, similar) is
 * derived from this shape, so adding a gradient is one entry here.
 */

import { colorDistance, hexToHsl } from '@/lib/palettes/color';

export type GradientType = 'linear' | 'radial' | 'conic';

export interface GradientStop {
  color: string;
  /** 0..100 position along the gradient. */
  position: number;
}

export interface Gradient {
  id: string;
  name: string;
  type: GradientType;
  /** Degrees - direction for linear, start angle for conic (ignored for radial). */
  angle: number;
  stops: GradientStop[];
  tags: string[];
  /** Static popularity, until real analytics exist - drives "trending". */
  likes: number;
}

export const GRADIENTS: Gradient[] = [
  { id: 'warm-flame', name: 'Warm Flame', type: 'linear', angle: 45, stops: [{ color: '#ff9a9e', position: 0 }, { color: '#fad0c4', position: 100 }], tags: ['warm', 'pink', 'soft'], likes: 81 },
  { id: 'sunny-morning', name: 'Sunny Morning', type: 'linear', angle: 120, stops: [{ color: '#f6d365', position: 0 }, { color: '#fda085', position: 100 }], tags: ['warm', 'orange', 'sunset'], likes: 53 },
  { id: 'juicy-peach', name: 'Juicy Peach', type: 'linear', angle: 135, stops: [{ color: '#ffecd2', position: 0 }, { color: '#fcb69f', position: 100 }], tags: ['warm', 'peach', 'soft'], likes: 97 },
  { id: 'true-sunset', name: 'True Sunset', type: 'linear', angle: 135, stops: [{ color: '#fa709a', position: 0 }, { color: '#fee140', position: 100 }], tags: ['warm', 'sunset', 'vibrant'], likes: 52 },
  { id: 'ripe-malinka', name: 'Ripe Malinka', type: 'linear', angle: 135, stops: [{ color: '#f093fb', position: 0 }, { color: '#f5576c', position: 100 }], tags: ['pink', 'vibrant', 'warm'], likes: 63 },
  { id: 'phoenix-start', name: 'Phoenix Start', type: 'linear', angle: 135, stops: [{ color: '#f83600', position: 0 }, { color: '#f9d423', position: 100 }], tags: ['warm', 'orange', 'fire'], likes: 79 },
  { id: 'young-passion', name: 'Young Passion', type: 'linear', angle: 135, stops: [{ color: '#ff8177', position: 0 }, { color: '#cf556c', position: 100 }], tags: ['red', 'warm', 'vibrant'], likes: 83 },
  { id: 'sweet-morning', name: 'Sweet Morning', type: 'linear', angle: 135, stops: [{ color: '#ff5f6d', position: 0 }, { color: '#ffc371', position: 100 }], tags: ['warm', 'sunset', 'orange'], likes: 48 },
  { id: 'malibu-beach', name: 'Malibu Beach', type: 'linear', angle: 135, stops: [{ color: '#4facfe', position: 0 }, { color: '#00f2fe', position: 100 }], tags: ['cool', 'blue', 'ocean'], likes: 28 },
  { id: 'tempting-azure', name: 'Tempting Azure', type: 'linear', angle: 135, stops: [{ color: '#84fab0', position: 0 }, { color: '#8fd3f4', position: 100 }], tags: ['cool', 'green', 'fresh'], likes: 80 },
  { id: 'winter-neva', name: 'Winter Neva', type: 'linear', angle: 135, stops: [{ color: '#a1c4fd', position: 0 }, { color: '#c2e9fb', position: 100 }], tags: ['cool', 'blue', 'pastel'], likes: 71 },
  { id: 'happy-fisher', name: 'Happy Fisher', type: 'linear', angle: 135, stops: [{ color: '#89f7fe', position: 0 }, { color: '#66a6ff', position: 100 }], tags: ['cool', 'blue', 'fresh'], likes: 77 },
  { id: 'aqua-splash', name: 'Aqua Splash', type: 'linear', angle: 135, stops: [{ color: '#13547a', position: 0 }, { color: '#80d0c7', position: 100 }], tags: ['cool', 'teal', 'ocean'], likes: 7 },
  { id: 'sharp-blues', name: 'Sharp Blues', type: 'linear', angle: 135, stops: [{ color: '#00c6fb', position: 0 }, { color: '#005bea', position: 100 }], tags: ['blue', 'vibrant', 'cool'], likes: 95 },
  { id: 'shady-water', name: 'Shady Water', type: 'linear', angle: 135, stops: [{ color: '#74ebd5', position: 0 }, { color: '#9face6', position: 100 }], tags: ['cool', 'teal', 'pastel'], likes: 16 },
  { id: 'itmeo-branding', name: 'Itmeo Branding', type: 'linear', angle: 135, stops: [{ color: '#2af598', position: 0 }, { color: '#009efd', position: 100 }], tags: ['green', 'blue', 'vibrant'], likes: 92 },
  { id: 'night-fade', name: 'Night Fade', type: 'linear', angle: 135, stops: [{ color: '#a18cd1', position: 0 }, { color: '#fbc2eb', position: 100 }], tags: ['purple', 'pink', 'pastel'], likes: 25 },
  { id: 'plum-plate', name: 'Plum Plate', type: 'linear', angle: 135, stops: [{ color: '#667eea', position: 0 }, { color: '#764ba2', position: 100 }], tags: ['purple', 'cool'], likes: 6 },
  { id: 'deep-blue', name: 'Deep Blue', type: 'linear', angle: 135, stops: [{ color: '#6a11cb', position: 0 }, { color: '#2575fc', position: 100 }], tags: ['purple', 'blue', 'vibrant'], likes: 44 },
  { id: 'october-silence', name: 'October Silence', type: 'linear', angle: 135, stops: [{ color: '#b721ff', position: 0 }, { color: '#21d4fd', position: 100 }], tags: ['purple', 'blue', 'vibrant'], likes: 94 },
  { id: 'morpheus-den', name: 'Morpheus Den', type: 'linear', angle: 135, stops: [{ color: '#30cfd0', position: 0 }, { color: '#330867', position: 100 }], tags: ['teal', 'purple', 'dark'], likes: 9 },
  { id: 'near-moon', name: 'Near Moon', type: 'linear', angle: 135, stops: [{ color: '#5ee7df', position: 0 }, { color: '#b490ca', position: 100 }], tags: ['teal', 'purple', 'pastel'], likes: 34 },
  { id: 'zeus-miracle', name: 'Zeus Miracle', type: 'linear', angle: 135, stops: [{ color: '#cd9cf2', position: 0 }, { color: '#f6f3ff', position: 100 }], tags: ['purple', 'pastel', 'soft'], likes: 85 },
  { id: 'new-life', name: 'New Life', type: 'linear', angle: 135, stops: [{ color: '#43e97b', position: 0 }, { color: '#38f9d7', position: 100 }], tags: ['green', 'fresh', 'vibrant'], likes: 17 },
  { id: 'dusty-grass', name: 'Dusty Grass', type: 'linear', angle: 135, stops: [{ color: '#d4fc79', position: 0 }, { color: '#96e6a1', position: 100 }], tags: ['green', 'pastel', 'fresh'], likes: 51 },
  { id: 'grown-early', name: 'Grown Early', type: 'linear', angle: 135, stops: [{ color: '#0ba360', position: 0 }, { color: '#3cba92', position: 100 }], tags: ['green', 'nature'], likes: 13 },
  { id: 'little-leaf', name: 'Little Leaf', type: 'linear', angle: 135, stops: [{ color: '#76b852', position: 0 }, { color: '#8dc26f', position: 100 }], tags: ['green', 'nature', 'muted'], likes: 81 },
  { id: 'lemon-gate', name: 'Lemon Gate', type: 'linear', angle: 135, stops: [{ color: '#96fbc4', position: 0 }, { color: '#f9f586', position: 100 }], tags: ['green', 'yellow', 'pastel'], likes: 87 },
  { id: 'rare-wind', name: 'Rare Wind', type: 'linear', angle: 135, stops: [{ color: '#a8edea', position: 0 }, { color: '#fed6e3', position: 100 }], tags: ['pastel', 'soft', 'cool'], likes: 9 },
  { id: 'rainy-ashville', name: 'Rainy Ashville', type: 'linear', angle: 135, stops: [{ color: '#fbc2eb', position: 0 }, { color: '#a6c1ee', position: 100 }], tags: ['pastel', 'pink', 'soft'], likes: 52 },
  { id: 'frozen-dreams', name: 'Frozen Dreams', type: 'linear', angle: 135, stops: [{ color: '#fdcbf1', position: 0 }, { color: '#e6dee9', position: 100 }], tags: ['pastel', 'pink', 'soft'], likes: 87 },
  { id: 'saint-petersburg', name: 'Saint Petersburg', type: 'linear', angle: 135, stops: [{ color: '#f5f7fa', position: 0 }, { color: '#c3cfe2', position: 100 }], tags: ['neutral', 'pastel', 'soft'], likes: 32 },
  { id: 'teen-notebook', name: 'Teen Notebook', type: 'linear', angle: 135, stops: [{ color: '#9795f0', position: 0 }, { color: '#fbc8d4', position: 100 }], tags: ['purple', 'pink', 'pastel'], likes: 12 },
  { id: 'blessing', name: 'Blessing', type: 'linear', angle: 135, stops: [{ color: '#fddb92', position: 0 }, { color: '#d1fdff', position: 100 }], tags: ['pastel', 'yellow', 'cool'], likes: 76 },
  { id: 'king-yna', name: 'King Yna', type: 'linear', angle: 135, stops: [{ color: '#1a2a6c', position: 0 }, { color: '#b21f1f', position: 50 }, { color: '#fdbb2d', position: 100 }], tags: ['vibrant', 'contrast', 'warm'], likes: 35 },
  { id: 'timber', name: 'Timber', type: 'linear', angle: 135, stops: [{ color: '#fc00ff', position: 0 }, { color: '#00dbde', position: 100 }], tags: ['neon', 'pink', 'vibrant'], likes: 15 },
  { id: 'cosmic-fusion', name: 'Cosmic Fusion', type: 'linear', angle: 135, stops: [{ color: '#ff00cc', position: 0 }, { color: '#333399', position: 100 }], tags: ['purple', 'pink', 'vibrant'], likes: 85 },
  { id: 'passionate-bed', name: 'Passionate Bed', type: 'linear', angle: 135, stops: [{ color: '#ff512f', position: 0 }, { color: '#dd2476', position: 100 }], tags: ['red', 'pink', 'vibrant'], likes: 33 },
  { id: 'mystic-forest', name: 'Mystic Forest', type: 'linear', angle: 135, stops: [{ color: '#134e5e', position: 0 }, { color: '#71b280', position: 100 }], tags: ['green', 'teal', 'nature'], likes: 64 },
  { id: 'cheer-up', name: 'Cheer Up Emo Kid', type: 'linear', angle: 135, stops: [{ color: '#556270', position: 0 }, { color: '#ff6b6b', position: 100 }], tags: ['warm', 'muted', 'contrast'], likes: 81 },
  { id: 'night-sky', name: 'Night Sky', type: 'linear', angle: 135, stops: [{ color: '#0f2027', position: 0 }, { color: '#203a43', position: 50 }, { color: '#2c5364', position: 100 }], tags: ['dark', 'cool', 'moody'], likes: 42 },
  { id: 'midnight-city', name: 'Midnight City', type: 'linear', angle: 135, stops: [{ color: '#232526', position: 0 }, { color: '#414345', position: 100 }], tags: ['dark', 'neutral', 'moody'], likes: 28 },
  { id: 'deep-space', name: 'Deep Space', type: 'linear', angle: 135, stops: [{ color: '#000000', position: 0 }, { color: '#434343', position: 100 }], tags: ['dark', 'neutral'], likes: 49 },
  { id: 'royal-navy', name: 'Royal Navy', type: 'linear', angle: 135, stops: [{ color: '#141e30', position: 0 }, { color: '#243b55', position: 100 }], tags: ['dark', 'blue', 'cool'], likes: 92 },
  { id: 'purple-bliss', name: 'Purple Bliss', type: 'linear', angle: 135, stops: [{ color: '#360033', position: 0 }, { color: '#0b8793', position: 100 }], tags: ['dark', 'purple', 'teal'], likes: 83 },
  { id: 'kashmir', name: 'Kashmir', type: 'linear', angle: 135, stops: [{ color: '#614385', position: 0 }, { color: '#516395', position: 100 }], tags: ['dark', 'purple', 'muted'], likes: 69 },
  { id: 'dark-ocean', name: 'Dark Ocean', type: 'linear', angle: 135, stops: [{ color: '#373b44', position: 0 }, { color: '#4286f4', position: 100 }], tags: ['dark', 'blue', 'cool'], likes: 39 },
  { id: 'moonlit-asteroid', name: 'Moonlit Asteroid', type: 'linear', angle: 135, stops: [{ color: '#0f0c29', position: 0 }, { color: '#302b63', position: 50 }, { color: '#24243e', position: 100 }], tags: ['dark', 'purple', 'moody'], likes: 63 },
  { id: 'eternal-constance', name: 'Eternal Constance', type: 'linear', angle: 135, stops: [{ color: '#09203f', position: 0 }, { color: '#537895', position: 100 }], tags: ['dark', 'blue', 'cool'], likes: 75 },
  { id: 'premium-dark', name: 'Premium Dark', type: 'linear', angle: 135, stops: [{ color: '#434343', position: 0 }, { color: '#000000', position: 100 }], tags: ['dark', 'neutral', 'corporate'], likes: 73 },
  { id: 'ibiza-sunset', name: 'Ibiza Sunset', type: 'linear', angle: 135, stops: [{ color: '#ee0979', position: 0 }, { color: '#ff6a00', position: 100 }], tags: ['warm', 'sunset', 'vibrant'], likes: 14 },
  { id: 'dark-knight', name: 'Dark Knight', type: 'linear', angle: 135, stops: [{ color: '#ba8b02', position: 0 }, { color: '#181818', position: 100 }], tags: ['dark', 'gold', 'luxury'], likes: 46 },
  { id: 'radial-ember', name: 'Radial Ember', type: 'radial', angle: 0, stops: [{ color: '#ff9a9e', position: 0 }, { color: '#fad0c4', position: 50 }, { color: '#fbc2eb', position: 100 }], tags: ['warm', 'radial', 'soft'], likes: 15 },
  { id: 'radial-aurora', name: 'Radial Aurora', type: 'radial', angle: 0, stops: [{ color: '#43e97b', position: 0 }, { color: '#38f9d7', position: 50 }, { color: '#4facfe', position: 100 }], tags: ['cool', 'radial', 'fresh'], likes: 58 },
  { id: 'radial-dusk', name: 'Radial Dusk', type: 'radial', angle: 0, stops: [{ color: '#6a11cb', position: 0 }, { color: '#2575fc', position: 50 }, { color: '#000000', position: 100 }], tags: ['dark', 'radial', 'purple'], likes: 44 },
  { id: 'conic-spectrum', name: 'Conic Spectrum', type: 'conic', angle: 0, stops: [{ color: '#ff0000', position: 0 }, { color: '#ffb700', position: 20 }, { color: '#00ff5e', position: 40 }, { color: '#00d9ff', position: 60 }, { color: '#8b00ff', position: 80 }, { color: '#ff0000', position: 100 }], tags: ['vibrant', 'conic', 'rainbow'], likes: 98 },
  { id: 'conic-sunset-wheel', name: 'Sunset Wheel', type: 'conic', angle: 90, stops: [{ color: '#fa709a', position: 0 }, { color: '#fee140', position: 50 }, { color: '#fa709a', position: 100 }], tags: ['warm', 'conic', 'sunset'], likes: 66 },
  { id: 'conic-cool-wheel', name: 'Cool Wheel', type: 'conic', angle: 180, stops: [{ color: '#4facfe', position: 0 }, { color: '#00f2fe', position: 33 }, { color: '#43e97b', position: 67 }, { color: '#4facfe', position: 100 }], tags: ['cool', 'conic', 'ocean'], likes: 77 },
  { id: 'lush-green', name: 'Lush Green', type: 'linear', angle: 135, stops: [{ color: '#56ab2f', position: 0 }, { color: '#a8e063', position: 100 }], tags: ['green', 'fresh', 'nature'], likes: 28 },
  { id: 'burning-orange', name: 'Burning Orange', type: 'linear', angle: 135, stops: [{ color: '#ff416c', position: 0 }, { color: '#ff4b2b', position: 100 }], tags: ['red', 'warm', 'fire'], likes: 77 },
  { id: 'vanusa', name: 'Vanusa', type: 'linear', angle: 135, stops: [{ color: '#da4453', position: 0 }, { color: '#89216b', position: 100 }], tags: ['pink', 'purple', 'vibrant'], likes: 23 },
  { id: 'purple-love', name: 'Purple Love', type: 'linear', angle: 135, stops: [{ color: '#cc2b5e', position: 0 }, { color: '#753a88', position: 100 }], tags: ['purple', 'pink', 'vibrant'], likes: 17 },
  { id: 'sunkist', name: 'Sunkist', type: 'linear', angle: 135, stops: [{ color: '#f2994a', position: 0 }, { color: '#f2c94c', position: 100 }], tags: ['warm', 'orange', 'yellow'], likes: 16 },
  { id: 'blue-skies', name: 'Blue Skies', type: 'linear', angle: 135, stops: [{ color: '#56ccf2', position: 0 }, { color: '#2f80ed', position: 100 }], tags: ['blue', 'cool', 'ocean'], likes: 8 },
  { id: 'crimson-blush', name: 'Crimson Blush', type: 'linear', angle: 135, stops: [{ color: '#ee9ca7', position: 0 }, { color: '#ffdde1', position: 100 }], tags: ['pink', 'soft', 'pastel'], likes: 38 },
  { id: 'evening-clash', name: 'Evening Clash', type: 'linear', angle: 135, stops: [{ color: '#b92b27', position: 0 }, { color: '#1565c0', position: 100 }], tags: ['red', 'blue', 'contrast'], likes: 30 },
  { id: 'moonrise', name: 'Moonrise', type: 'linear', angle: 135, stops: [{ color: '#dae2f8', position: 0 }, { color: '#d6a4a4', position: 100 }], tags: ['pastel', 'soft', 'muted'], likes: 27 },
  { id: 'amethyst-veil', name: 'Amethyst Veil', type: 'linear', angle: 135, stops: [{ color: '#9d50bb', position: 0 }, { color: '#6e48aa', position: 100 }], tags: ['purple', 'vibrant'], likes: 39 },
  { id: 'cheerful-caramel', name: 'Cheerful Caramel', type: 'linear', angle: 135, stops: [{ color: '#e6b980', position: 0 }, { color: '#eacda3', position: 100 }], tags: ['warm', 'brown', 'soft'], likes: 95 },
  { id: 'emerald-water', name: 'Emerald Water', type: 'linear', angle: 135, stops: [{ color: '#348f50', position: 0 }, { color: '#56b4d3', position: 100 }], tags: ['green', 'teal', 'ocean'], likes: 65 },
  { id: 'solar-flare', name: 'Solar Flare', type: 'linear', angle: 135, stops: [{ color: '#f12711', position: 0 }, { color: '#f5af19', position: 100 }], tags: ['warm', 'orange', 'fire'], likes: 67 },
  { id: 'witching-hour', name: 'Witching Hour', type: 'linear', angle: 135, stops: [{ color: '#c31432', position: 0 }, { color: '#240b36', position: 100 }], tags: ['dark', 'red', 'moody'], likes: 89 },
  { id: 'azur-lane', name: 'Azur Lane', type: 'linear', angle: 135, stops: [{ color: '#7f7fd5', position: 0 }, { color: '#86a8e7', position: 50 }, { color: '#91eae4', position: 100 }], tags: ['cool', 'blue', 'gradient'], likes: 53 },
  { id: 'red-dusk', name: 'Red Dusk', type: 'linear', angle: 135, stops: [{ color: '#355c7d', position: 0 }, { color: '#6c5b7b', position: 50 }, { color: '#c06c84', position: 100 }], tags: ['muted', 'purple', 'sunset'], likes: 90 },
  { id: 'deep-violet', name: 'Deep Violet', type: 'linear', angle: 135, stops: [{ color: '#673ab7', position: 0 }, { color: '#512da8', position: 100 }], tags: ['purple', 'dark'], likes: 24 },
  { id: 'steel-shadow', name: 'Steel Shadow', type: 'linear', angle: 135, stops: [{ color: '#1f1c2c', position: 0 }, { color: '#928dab', position: 100 }], tags: ['dark', 'neutral', 'moody'], likes: 8 },
  { id: 'radial-neon', name: 'Radial Neon', type: 'radial', angle: 0, stops: [{ color: '#00f5a0', position: 0 }, { color: '#00d9f5', position: 100 }], tags: ['neon', 'cool', 'radial'], likes: 38 },
  { id: 'conic-candy', name: 'Conic Candy', type: 'conic', angle: 45, stops: [{ color: '#ff9a9e', position: 0 }, { color: '#fecfef', position: 50 }, { color: '#ff9a9e', position: 100 }], tags: ['pink', 'conic', 'soft'], likes: 25 },
];

/** Total number of curated gradients - the single source of truth for counts. */
export const GRADIENT_COUNT = GRADIENTS.length;

/** Gradients closest in overall colour to `gradient`, for "explore similar". */
export function similarGradients(gradient: Gradient, all: Gradient[], limit = 6): Gradient[] {
  const meanHue = (g: Gradient): number => {
    let x = 0;
    let y = 0;
    for (const s of g.stops) {
      const { h } = hexToHsl(s.color);
      x += Math.cos((h * Math.PI) / 180);
      y += Math.sin((h * Math.PI) / 180);
    }
    return Math.atan2(y, x);
  };
  const targetHue = meanHue(gradient);
  const score = (g: Gradient): number => {
    const dh = Math.abs(
      Math.atan2(Math.sin(meanHue(g) - targetHue), Math.cos(meanHue(g) - targetHue)),
    );
    const a = g.stops[0]?.color ?? '#000';
    const b = gradient.stops[0]?.color ?? '#000';
    return dh * 300 + colorDistance(a, b);
  };
  return all
    .filter((g) => g.id !== gradient.id)
    .sort((x, y) => score(x) - score(y))
    .slice(0, limit);
}

/** Every tag in use, deduped and sorted - drives the filter chips. */
export const ALL_GRADIENT_TAGS: string[] = [
  ...new Set(GRADIENTS.flatMap((g) => g.tags)),
].sort();
