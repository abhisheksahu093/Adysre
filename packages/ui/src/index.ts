/**
 * `adysre` - the root entry: styling primitives and the `cn` helper.
 *
 * ─── Why the catalogues are not re-exported here ────────────────────────────
 * Icons, gradients, patterns, textures and palettes each live behind their own
 * subpath. Re-exporting them from the root would mean every `import { Button }
 * from 'adysre'` pulls the whole barrel into the module graph, and only
 * flawless tree-shaking would save the consumer. Subpaths make the cost visible
 * and impossible to get wrong:
 *
 *   import { Button }          from 'adysre';
 *   import { ArrowUpRight }    from 'adysre/icons';
 *   import { GradientSurface } from 'adysre/gradients';
 *   import { PatternSurface }  from 'adysre/patterns';
 *   import { TextureSurface }  from 'adysre/textures';
 *   import { getPalette }      from 'adysre/palettes';
 *   import { AboutStats }      from 'adysre/blocks';
 */

export { cn } from './lib/cn.ts';
export { Button, buttonVariants, type ButtonProps } from './primitives/button.tsx';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './primitives/card.tsx';
export { Input, type InputProps } from './primitives/input.tsx';
export { Label, type LabelProps } from './primitives/label.tsx';
export { Textarea, type TextareaProps } from './primitives/textarea.tsx';
export { Select, type SelectProps } from './primitives/select.tsx';
export { Badge, badgeVariants, type BadgeProps } from './primitives/badge.tsx';
export { Dialog, type DialogProps } from './primitives/dialog.tsx';
export { Tooltip, type TooltipProps, type TooltipSide } from './primitives/tooltip.tsx';
