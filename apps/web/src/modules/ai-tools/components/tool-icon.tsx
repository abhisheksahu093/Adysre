import {
  Barcode,
  Contrast,
  Crop,
  Eraser,
  FileArchive,
  Maximize,
  QrCode,
  Replace,
  Scaling,
  ScanText,
  Wand2,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  FileArchive,
  Replace,
  Scaling,
  Eraser,
  QrCode,
  Barcode,
  ScanText,
  Maximize,
  Wand2,
  Contrast,
  Crop,
};

/** Resolve a registry icon name to its Lucide component. */
export function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? FileArchive;
  return <Icon className={className} aria-hidden />;
}
