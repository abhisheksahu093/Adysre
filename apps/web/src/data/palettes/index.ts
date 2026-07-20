/**
 * Curated colour palettes - the "trending" seed set the page opens on.
 *
 * Palettes are plain data: an id, a display name (a proper noun, never
 * translated - same rule as component framework names), an ordered list of
 * hex colours, and search tags. Everything the page does - quick view, edit,
 * export, "explore similar" - is derived from this shape, so adding a palette
 * is one entry here and nothing else.
 */

import { colorDistance, hexToHsl } from '@/lib/palettes/color';

export interface Palette {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
  /** Static popularity, until real analytics exist - drives "trending". */
  likes: number;
}

export const PALETTES: Palette[] = [
  { id: 'sunset-drive', name: 'Sunset Drive', colors: ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d'], tags: ['warm', 'vibrant', 'sunset'], likes: 57 },
  { id: 'deep-ocean', name: 'Deep Ocean', colors: ['#03045e', '#0077b6', '#00b4d8', '#90e0ef', '#caf0f8'], tags: ['cool', 'blue', 'ocean'], likes: 77 },
  { id: 'forest-floor', name: 'Forest Floor', colors: ['#283618', '#606c38', '#fefae0', '#dda15e', '#bc6c25'], tags: ['earthy', 'nature', 'warm'], likes: 44 },
  { id: 'berry-smoothie', name: 'Berry Smoothie', colors: ['#590d22', '#a4133c', '#ff4d6d', '#ff8fa3', '#ffccd5'], tags: ['pink', 'warm', 'gradient'], likes: 35 },
  { id: 'mint-condition', name: 'Mint Condition', colors: ['#004b23', '#006400', '#38b000', '#9ef01a', '#ccff33'], tags: ['green', 'vibrant', 'nature'], likes: 78 },
  { id: 'royal-velvet', name: 'Royal Velvet', colors: ['#10002b', '#3c096c', '#7b2cbf', '#c77dff', '#e0aaff'], tags: ['purple', 'cool', 'luxury'], likes: 61 },
  { id: 'desert-dusk', name: 'Desert Dusk', colors: ['#463f3a', '#8a817c', '#bcb8b1', '#f4f3ee', '#e0afa0'], tags: ['neutral', 'earthy', 'muted'], likes: 44 },
  { id: 'candy-pop', name: 'Candy Pop', colors: ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'], tags: ['vibrant', 'rainbow', 'playful'], likes: 44 },
  { id: 'nordic-frost', name: 'Nordic Frost', colors: ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'], tags: ['cool', 'corporate', 'red'], likes: 98 },
  { id: 'matcha-latte', name: 'Matcha Latte', colors: ['#344e41', '#3a5a40', '#588157', '#a3b18a', '#dad7cd'], tags: ['green', 'muted', 'nature'], likes: 11 },
  { id: 'coral-reef', name: 'Coral Reef', colors: ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#845ec2'], tags: ['vibrant', 'playful', 'rainbow'], likes: 48 },
  { id: 'espresso-bar', name: 'Espresso Bar', colors: ['#231709', '#3f2d1a', '#6f4e37', '#a9744f', '#d9b382'], tags: ['brown', 'warm', 'earthy'], likes: 84 },
  { id: 'cotton-candy', name: 'Cotton Candy', colors: ['#ffcfd2', '#fde2e4', '#fad2e1', '#c5dedd', '#dbe7e4'], tags: ['pastel', 'soft', 'pink'], likes: 36 },
  { id: 'neon-nights', name: 'Neon Nights', colors: ['#0d0221', '#241734', '#ff2a6d', '#05d9e8', '#d1f7ff'], tags: ['neon', 'dark', 'cyberpunk'], likes: 43 },
  { id: 'autumn-harvest', name: 'Autumn Harvest', colors: ['#582f0e', '#7f4f24', '#936639', '#a68a64', '#c2c5aa'], tags: ['earthy', 'warm', 'autumn'], likes: 82 },
  { id: 'blue-hour', name: 'Blue Hour', colors: ['#012a4a', '#013a63', '#01497c', '#2a6f97', '#61a5c2'], tags: ['blue', 'cool', 'corporate'], likes: 95 },
  { id: 'flamingo-beach', name: 'Flamingo Beach', colors: ['#f72585', '#b5179e', '#7209b7', '#3a0ca3', '#4361ee'], tags: ['vibrant', 'gradient', 'purple'], likes: 15 },
  { id: 'sage-stone', name: 'Sage & Stone', colors: ['#cad2c5', '#84a98c', '#52796f', '#354f52', '#2f3e46'], tags: ['green', 'muted', 'calm'], likes: 26 },
  { id: 'golden-hour', name: 'Golden Hour', colors: ['#ffba08', '#faa307', '#f48c06', '#e85d04', '#dc2f02'], tags: ['warm', 'orange', 'sunset'], likes: 57 },
  { id: 'lavender-fields', name: 'Lavender Fields', colors: ['#b8c0ff', '#bbd0ff', '#c8b6ff', '#e7c6ff', '#ffd6ff'], tags: ['pastel', 'purple', 'soft'], likes: 96 },
  { id: 'charcoal-ember', name: 'Charcoal Ember', colors: ['#1a1a1d', '#4e4e50', '#6f2232', '#950740', '#c3073f'], tags: ['dark', 'red', 'moody'], likes: 59 },
  { id: 'tropical-punch', name: 'Tropical Punch', colors: ['#00afb9', '#fdfcdc', '#fed9b7', '#f07167', '#0081a7'], tags: ['vibrant', 'summer', 'teal'], likes: 99 },
  { id: 'slate-professional', name: 'Slate Professional', colors: ['#0b132b', '#1c2541', '#3a506b', '#5bc0be', '#6fffe9'], tags: ['corporate', 'cool', 'tech'], likes: 16 },
  { id: 'peaches-cream', name: 'Peaches & Cream', colors: ['#ffcdb2', '#ffb4a2', '#e5989b', '#b5838d', '#6d6875'], tags: ['muted', 'warm', 'soft'], likes: 79 },
  { id: 'emerald-city', name: 'Emerald City', colors: ['#004b23', '#006400', '#007200', '#008000', '#38b000'], tags: ['green', 'monochrome', 'nature'], likes: 47 },
  { id: 'cyber-grape', name: 'Cyber Grape', colors: ['#231942', '#5e548e', '#9f86c0', '#be95c4', '#e0b1cb'], tags: ['purple', 'muted', 'luxury'], likes: 49 },
  { id: 'clay-terracotta', name: 'Clay & Terracotta', colors: ['#edc4b3', '#e6b8a2', '#deab90', '#d69f7e', '#cd9777'], tags: ['earthy', 'monochrome', 'warm'], likes: 91 },
  { id: 'arctic-tech', name: 'Arctic Tech', colors: ['#e9ecef', '#ced4da', '#adb5bd', '#495057', '#212529'], tags: ['neutral', 'monochrome', 'corporate'], likes: 8 },
  { id: 'mango-tango', name: 'Mango Tango', colors: ['#ff9f1c', '#ffbf69', '#ffffff', '#cbf3f0', '#2ec4b6'], tags: ['vibrant', 'summer', 'teal'], likes: 12 },
  { id: 'midnight-bloom', name: 'Midnight Bloom', colors: ['#22223b', '#4a4e69', '#9a8c98', '#c9ada7', '#f2e9e4'], tags: ['muted', 'calm', 'neutral'], likes: 74 },
  { id: 'electric-lime', name: 'Electric Lime', colors: ['#2b9348', '#55a630', '#80b918', '#aacc00', '#d4d700'], tags: ['green', 'vibrant', 'neon'], likes: 42 },
  { id: 'raspberry-noir', name: 'Raspberry Noir', colors: ['#03071e', '#370617', '#6a040f', '#9d0208', '#d00000'], tags: ['dark', 'red', 'moody'], likes: 74 },
  { id: 'midnight-teal', name: 'Midnight Teal', colors: ['#001219', '#005f73', '#0a9396', '#94d2bd', '#e9d8a6'], tags: ['cool', 'teal', 'ocean'], likes: 47 },
  { id: 'rose-quartz', name: 'Rose Quartz', colors: ['#ff99c8', '#fcf6bd', '#d0f4de', '#a9def9', '#e4c1f9'], tags: ['pastel', 'soft', 'rainbow'], likes: 40 },
  { id: 'burnt-umber', name: 'Burnt Umber', colors: ['#7f5539', '#9c6644', '#b08968', '#ddb892', '#e6ccb2'], tags: ['earthy', 'brown', 'warm'], likes: 99 },
  { id: 'ocean-breeze', name: 'Ocean Breeze', colors: ['#0096c7', '#48cae4', '#90e0ef', '#ade8f4', '#caf0f8'], tags: ['cool', 'blue', 'ocean'], likes: 43 },
  { id: 'plum-wine', name: 'Plum Wine', colors: ['#240046', '#3c096c', '#5a189a', '#7b2cbf', '#9d4edd'], tags: ['purple', 'dark', 'luxury'], likes: 75 },
  { id: 'citrus-grove', name: 'Citrus Grove', colors: ['#d4d700', '#dddf00', '#eeef20', '#f7f052', '#fdf5a0'], tags: ['yellow', 'vibrant', 'summer'], likes: 38 },
  { id: 'dusty-rose', name: 'Dusty Rose', colors: ['#eaac8b', '#e88c7d', '#e56b6f', '#b56576', '#6d597a'], tags: ['muted', 'pink', 'warm'], likes: 62 },
  { id: 'steel-grey', name: 'Steel Grey', colors: ['#f8f9fa', '#dee2e6', '#adb5bd', '#6c757d', '#343a40'], tags: ['neutral', 'monochrome', 'corporate'], likes: 72 },
  { id: 'spring-meadow', name: 'Spring Meadow', colors: ['#ccd5ae', '#e9edc9', '#fefae0', '#faedcd', '#d4a373'], tags: ['pastel', 'green', 'nature'], likes: 13 },
  { id: 'crimson-tide', name: 'Crimson Tide', colors: ['#641220', '#6e1423', '#85182a', '#a11d33', '#c71f37'], tags: ['red', 'dark', 'moody'], likes: 33 },
  { id: 'bubblegum', name: 'Bubblegum', colors: ['#ffb3c1', '#ffa5ab', '#da627d', '#a53860', '#450920'], tags: ['pink', 'vibrant', 'playful'], likes: 16 },
  { id: 'forest-mist', name: 'Forest Mist', colors: ['#2d6a4f', '#40916c', '#52b788', '#74c69d', '#95d5b2'], tags: ['green', 'nature', 'calm'], likes: 24 },
  { id: 'amber-glow', name: 'Amber Glow', colors: ['#ffe066', '#ffd23f', '#f4a259', '#ee6c4d', '#e63946'], tags: ['warm', 'orange', 'sunset'], likes: 94 },
  { id: 'indigo-night', name: 'Indigo Night', colors: ['#10002b', '#240046', '#3c096c', '#5a189a', '#7b2cbf'], tags: ['purple', 'dark', 'cool'], likes: 22 },
  { id: 'peach-fuzz', name: 'Peach Fuzz', colors: ['#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff'], tags: ['pastel', 'soft', 'rainbow'], likes: 69 },
  { id: 'graphite', name: 'Graphite', colors: ['#212529', '#343a40', '#495057', '#6c757d', '#868e96'], tags: ['neutral', 'dark', 'monochrome'], likes: 68 },
  { id: 'tangerine-dream', name: 'Tangerine Dream', colors: ['#ff7b00', '#ff8800', '#ff9500', '#ffa200', '#ffb700'], tags: ['orange', 'vibrant', 'monochrome'], likes: 20 },
  { id: 'seafoam', name: 'Seafoam', colors: ['#d8f3dc', '#b7e4c7', '#95d5b2', '#74c69d', '#52b788'], tags: ['green', 'pastel', 'nature'], likes: 98 },
  { id: 'berry-frost', name: 'Berry Frost', colors: ['#ffb3c6', '#ff8fab', '#fb6f92', '#ff477e', '#f72585'], tags: ['pink', 'vibrant', 'gradient'], likes: 93 },
  { id: 'sandstone', name: 'Sandstone', colors: ['#e9c46a', '#f4a261', '#e76f51', '#2a9d8f', '#264653'], tags: ['earthy', 'warm', 'teal'], likes: 93 },
  { id: 'cobalt-amber', name: 'Cobalt & Amber', colors: ['#003049', '#005f73', '#0a9396', '#ee9b00', '#ca6702'], tags: ['cool', 'blue', 'contrast'], likes: 61 },
  { id: 'mauve-mist', name: 'Mauve Mist', colors: ['#e0c3fc', '#ddbdfc', '#c8b6ff', '#b8c0ff', '#bbd0ff'], tags: ['pastel', 'purple', 'soft'], likes: 78 },
  { id: 'moss-green', name: 'Moss Green', colors: ['#386641', '#6a994e', '#a7c957', '#f2e8cf', '#bc4749'], tags: ['green', 'earthy', 'nature'], likes: 55 },
  { id: 'sunset-blush', name: 'Sunset Blush', colors: ['#ffcad4', '#f4acb7', '#9d8189', '#d8e2dc', '#ffe5d9'], tags: ['pastel', 'muted', 'soft'], likes: 25 },
  { id: 'deep-plum', name: 'Deep Plum', colors: ['#4a0e4e', '#772e7a', '#a53ca5', '#cf6cd9', '#e3aaf0'], tags: ['purple', 'vibrant', 'luxury'], likes: 70 },
  { id: 'arctic-blue', name: 'Arctic Blue', colors: ['#caf0f8', '#ade8f4', '#90e0ef', '#48cae4', '#00b4d8'], tags: ['cool', 'blue', 'ocean'], likes: 10 },
  { id: 'rust-copper', name: 'Rust & Copper', colors: ['#582f0e', '#7f4f24', '#936639', '#b6ad90', '#c2c5aa'], tags: ['brown', 'earthy', 'warm'], likes: 55 },
  { id: 'neon-mint', name: 'Neon Mint', colors: ['#d9ed92', '#b5e48c', '#99d98c', '#76c893', '#52b69a'], tags: ['green', 'vibrant', 'neon'], likes: 46 },
  { id: 'blush-linen', name: 'Blush Linen', colors: ['#f5ebe0', '#e3d5ca', '#d5bdaf', '#f0efeb', '#edede9'], tags: ['neutral', 'soft', 'muted'], likes: 63 },
  { id: 'electric-violet', name: 'Electric Violet', colors: ['#7400b8', '#6930c3', '#5e60ce', '#5390d9', '#48bfe3'], tags: ['purple', 'gradient', 'vibrant'], likes: 76 },
  { id: 'terracotta-sky', name: 'Terracotta Sky', colors: ['#eae2b7', '#fcbf49', '#f77f00', '#d62828', '#003049'], tags: ['warm', 'contrast', 'earthy'], likes: 30 },
  { id: 'jade-deep', name: 'Jade Deep', colors: ['#006466', '#065a60', '#0b525b', '#144552', '#1b3a4b'], tags: ['teal', 'dark', 'cool'], likes: 31 },
  { id: 'cherry-blossom', name: 'Cherry Blossom', colors: ['#fff0f3', '#ffccd5', '#ffb3c1', '#ff8fa3', '#ff758f'], tags: ['pink', 'pastel', 'soft'], likes: 12 },
  { id: 'navy-sage', name: 'Navy & Sage', colors: ['#01161e', '#124559', '#598392', '#aec3b0', '#eff6e0'], tags: ['cool', 'neutral', 'calm'], likes: 71 },
  { id: 'golden-sand', name: 'Golden Sand', colors: ['#fefae0', '#faedcd', '#e9edc9', '#ccd5ae', '#d4a373'], tags: ['pastel', 'earthy', 'warm'], likes: 80 },
  { id: 'dracula-dark', name: 'Dracula', colors: ['#282a36', '#44475a', '#bd93f9', '#ff79c6', '#50fa7b'], tags: ['dark', 'purple', 'moody'], likes: 82 },
  { id: 'nord-dark', name: 'Nord Dark', colors: ['#2e3440', '#3b4252', '#434c5e', '#81a1c1', '#88c0d0'], tags: ['dark', 'corporate', 'moody'], likes: 88 },
  { id: 'tokyo-night', name: 'Tokyo Night', colors: ['#1a1b26', '#24283b', '#414868', '#7aa2f7', '#bb9af7'], tags: ['dark', 'corporate', 'moody'], likes: 49 },
  { id: 'one-dark', name: 'One Dark', colors: ['#282c34', '#3e4451', '#61afef', '#98c379', '#e06c75'], tags: ['dark', 'corporate', 'moody'], likes: 98 },
  { id: 'gruvbox-dark', name: 'Gruvbox Dark', colors: ['#282828', '#3c3836', '#504945', '#fabd2f', '#fe8019'], tags: ['dark', 'corporate', 'moody'], likes: 18 },
  { id: 'monokai', name: 'Monokai', colors: ['#272822', '#383830', '#a6e22e', '#f92672', '#66d9ef'], tags: ['dark', 'corporate', 'moody'], likes: 59 },
  { id: 'github-dark', name: 'GitHub Dark', colors: ['#0d1117', '#161b22', '#21262d', '#58a6ff', '#3fb950'], tags: ['dark', 'corporate', 'moody'], likes: 26 },
  { id: 'obsidian-glow', name: 'Obsidian Glow', colors: ['#0b0c10', '#1f2833', '#45a29e', '#66fcf1', '#c5c6c7'], tags: ['dark', 'corporate', 'moody'], likes: 78 },
  { id: 'deep-space', name: 'Deep Space', colors: ['#03071e', '#14213d', '#1b263b', '#415a77', '#778da9'], tags: ['dark', 'corporate', 'moody'], likes: 49 },
  { id: 'neon-noir', name: 'Neon Noir', colors: ['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460', '#e94560'], tags: ['dark', 'corporate', 'moody'], likes: 76 },
  { id: 'cyber-dark', name: 'Cyber Dark', colors: ['#000000', '#1a0033', '#2d0052', '#6a00f4', '#00d9ff'], tags: ['dark', 'corporate', 'moody'], likes: 92 },
  { id: 'forest-night', name: 'Forest Night', colors: ['#0b1d13', '#14342b', '#1f5f3f', '#2d8659', '#6ee7b7'], tags: ['dark', 'corporate', 'moody'], likes: 99 },
  { id: 'crimson-abyss', name: 'Crimson Abyss', colors: ['#0a0a0a', '#1c0a0a', '#3d0a0a', '#8b0000', '#ff4d4d'], tags: ['dark', 'corporate', 'moody'], likes: 15 },
  { id: 'amethyst-dark', name: 'Amethyst Dark', colors: ['#13111c', '#1e1a2e', '#2d2640', '#6d5b9e', '#b39ddb'], tags: ['dark', 'corporate', 'moody'], likes: 56 },
  { id: 'teal-abyss', name: 'Teal Abyss', colors: ['#011f26', '#023436', '#044f4a', '#0b9a8d', '#2fe6b7'], tags: ['dark', 'corporate', 'moody'], likes: 31 },
  { id: 'ember-dark', name: 'Ember Dark', colors: ['#0c0a09', '#1c1917', '#292524', '#ea580c', '#fbbf24'], tags: ['dark', 'corporate', 'moody'], likes: 50 },
  { id: 'rose-noir', name: 'Rose Noir', colors: ['#1a0f14', '#2d1b25', '#4a2c3d', '#d6336c', '#ffa8c5'], tags: ['dark', 'corporate', 'moody'], likes: 24 },
  { id: 'slate-cobalt', name: 'Slate Cobalt', colors: ['#020617', '#0f172a', '#1e293b', '#3b82f6', '#93c5fd'], tags: ['dark', 'corporate', 'moody'], likes: 30 },
  { id: 'carbon-lime', name: 'Carbon Lime', colors: ['#0f0f0f', '#1a1a1a', '#2a2a2a', '#84cc16', '#bef264'], tags: ['dark', 'corporate', 'moody'], likes: 89 },
  { id: 'velvet-dark', name: 'Velvet Dark', colors: ['#160016', '#25002b', '#3d0040', '#8b1e9e', '#e055c9'], tags: ['dark', 'corporate', 'moody'], likes: 13 },
  { id: 'coral-sunset', name: 'Coral Sunset', colors: ['#ff9a8b', '#ff6a88', '#ff99ac', '#fcb69f', '#ffdde1'], tags: ['pink', 'warm', 'soft'], likes: 18 },
  { id: 'sky-gradient', name: 'Sky Gradient', colors: ['#a1c4fd', '#c2e9fb', '#d4fc79', '#96e6a1', '#84fab0'], tags: ['cool', 'pastel', 'gradient'], likes: 18 },
  { id: 'honey-mustard', name: 'Honey Mustard', colors: ['#e9c46a', '#e6b325', '#d4a017', '#b8860b', '#8b6914'], tags: ['yellow', 'warm', 'monochrome'], likes: 15 },
  { id: 'olive-branch', name: 'Olive Branch', colors: ['#606c38', '#7a8450', '#95a06a', '#b7bd93', '#dde5b6'], tags: ['green', 'earthy', 'muted'], likes: 88 },
  { id: 'blueberry-milk', name: 'Blueberry Milk', colors: ['#dbe4ff', '#bac8ff', '#91a7ff', '#748ffc', '#5c7cfa'], tags: ['pastel', 'blue', 'soft'], likes: 44 },
  { id: 'warm-sand', name: 'Warm Sand', colors: ['#fef6e4', '#f3d2c1', '#f582ae', '#8bd3dd', '#001858'], tags: ['pastel', 'playful', 'contrast'], likes: 14 },
  { id: 'mint-julep', name: 'Mint Julep', colors: ['#e0fbfc', '#c2dfe3', '#9db4c0', '#5c6b73', '#253237'], tags: ['cool', 'muted', 'calm'], likes: 45 },
  { id: 'cranberry-spritz', name: 'Cranberry Spritz', colors: ['#fff0f3', '#ffb3c1', '#ff4d6d', '#c9184a', '#800f2f'], tags: ['red', 'pink', 'vibrant'], likes: 29 },
  { id: 'tuscan-villa', name: 'Tuscan Villa', colors: ['#fec89a', '#ffd7ba', '#fcd5ce', '#f8edeb', '#e8e8e4'], tags: ['pastel', 'warm', 'soft'], likes: 34 },
  { id: 'lagoon', name: 'Lagoon', colors: ['#00b4d8', '#0077b6', '#023e8a', '#03045e', '#caf0f8'], tags: ['blue', 'ocean', 'cool'], likes: 52 },
  { id: 'marigold', name: 'Marigold', colors: ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'], tags: ['vibrant', 'rainbow', 'playful'], likes: 46 },
  { id: 'pistachio', name: 'Pistachio', colors: ['#eff7cf', '#d3e298', '#a3c644', '#6a994e', '#386641'], tags: ['green', 'nature', 'fresh'], likes: 74 },
  { id: 'dusk-mauve', name: 'Dusk Mauve', colors: ['#e5dbe8', '#c9b6cf', '#a58fb0', '#7d6b8a', '#584d6b'], tags: ['purple', 'muted', 'calm'], likes: 41 },
  { id: 'caramel-cream', name: 'Caramel Cream', colors: ['#fff8f0', '#f5e6d3', '#e6c9a8', '#c9a06a', '#8b6635'], tags: ['brown', 'warm', 'soft'], likes: 67 },
  { id: 'electric-sky', name: 'Electric Sky', colors: ['#4cc9f0', '#4895ef', '#4361ee', '#3f37c9', '#3a0ca3'], tags: ['blue', 'gradient', 'vibrant'], likes: 41 },
];

/** Total number of curated palettes - the single source of truth for counts. */
export const PALETTE_COUNT = PALETTES.length;

/** Palettes with the closest overall colour to `palette`, for "explore similar". */
export function similarPalettes(palette: Palette, all: Palette[], limit = 6): Palette[] {
  const meanHue = (p: Palette): number => {
    // Average hue via unit vectors so 350° and 10° read as neighbours.
    let x = 0;
    let y = 0;
    for (const c of p.colors) {
      const { h } = hexToHsl(c);
      x += Math.cos((h * Math.PI) / 180);
      y += Math.sin((h * Math.PI) / 180);
    }
    return Math.atan2(y, x);
  };
  const targetHue = meanHue(palette);
  const score = (p: Palette): number => {
    const dh = Math.abs(Math.atan2(Math.sin(meanHue(p) - targetHue), Math.cos(meanHue(p) - targetHue)));
    // Blend average colour distance with hue closeness for a stable ranking.
    let dist = 0;
    const n = Math.min(p.colors.length, palette.colors.length);
    for (let i = 0; i < n; i++) dist += colorDistance(p.colors[i] ?? '#000', palette.colors[i] ?? '#000');
    return dh * 300 + dist / Math.max(1, n);
  };
  return all
    .filter((p) => p.id !== palette.id)
    .sort((a, b) => score(a) - score(b))
    .slice(0, limit);
}

/** Every tag in use, deduped and sorted - drives the filter chips. */
export const ALL_PALETTE_TAGS: string[] = [...new Set(PALETTES.flatMap((p) => p.tags))].sort();
