import type { ComponentType } from 'react';
import type { PanelProps, ProcessContext, ToolResult, ToolStatus } from '../types';
import { IMAGE_ACCEPT } from '../types';
import { CompressorPanel, compressorDefaults, compressorProcess } from './compressor';
import { ConverterPanel, converterDefaults, converterProcess } from './converter';
import { ResizerPanel, resizerDefaults, resizerProcess } from './resizer';
import { qrReaderDefaults, qrReaderProcess } from './qr-reader';
import { barcodeReaderDefaults, barcodeReaderProcess } from './barcode-reader';
import { EnhancerPanel, enhancerDefaults, enhancerProcess } from './enhancer';
import { ocrDefaults, ocrProcess } from './ocr';
import { FaceBlurPanel, faceBlurDefaults, faceBlurProcess } from './face-blur';

/**
 * The tool registry: the single source of truth for the module. Ready tools
 * carry a client-side `process` and a settings panel; upcoming tools declare
 * their identity so the index page can advertise the full roadmap. Adding a
 * tool is one entry plus its `process`/panel.
 */
export interface RegistryTool {
  id: string;
  status: ToolStatus;
  phase: 1 | 2;
  /** Lucide icon name, resolved by the UI. */
  icon: string;
  accept: string[];
  defaultSettings: Record<string, unknown>;
  process?: (ctx: ProcessContext) => Promise<ToolResult>;
  panel?: ComponentType<PanelProps>;
  textOutput?: boolean;
}

export const AI_TOOLS: RegistryTool[] = [
  {
    id: 'compressor',
    status: 'ready',
    phase: 1,
    icon: 'FileArchive',
    accept: IMAGE_ACCEPT,
    defaultSettings: compressorDefaults,
    process: compressorProcess,
    panel: CompressorPanel,
  },
  {
    id: 'converter',
    status: 'ready',
    phase: 1,
    icon: 'Replace',
    accept: IMAGE_ACCEPT,
    defaultSettings: converterDefaults,
    process: converterProcess,
    panel: ConverterPanel,
  },
  {
    id: 'resizer',
    status: 'ready',
    phase: 1,
    icon: 'Scaling',
    accept: IMAGE_ACCEPT,
    defaultSettings: resizerDefaults,
    process: resizerProcess,
    panel: ResizerPanel,
  },
  { id: 'background-remover', status: 'soon', phase: 1, icon: 'Eraser', accept: IMAGE_ACCEPT, defaultSettings: {} },
  {
    id: 'qr-reader',
    status: 'ready',
    phase: 1,
    icon: 'QrCode',
    accept: IMAGE_ACCEPT,
    defaultSettings: qrReaderDefaults,
    process: qrReaderProcess,
    textOutput: true,
  },
  {
    id: 'barcode-reader',
    status: 'ready',
    phase: 1,
    icon: 'Barcode',
    accept: IMAGE_ACCEPT,
    defaultSettings: barcodeReaderDefaults,
    process: barcodeReaderProcess,
    textOutput: true,
  },
  {
    id: 'ocr',
    status: 'ready',
    phase: 1,
    icon: 'ScanText',
    accept: IMAGE_ACCEPT,
    defaultSettings: ocrDefaults,
    process: ocrProcess,
    textOutput: true,
  },
  { id: 'upscaler', status: 'soon', phase: 2, icon: 'Maximize', accept: IMAGE_ACCEPT, defaultSettings: {} },
  {
    id: 'enhancer',
    status: 'ready',
    phase: 2,
    icon: 'Wand2',
    accept: IMAGE_ACCEPT,
    defaultSettings: enhancerDefaults,
    process: enhancerProcess,
    panel: EnhancerPanel,
  },
  {
    id: 'face-blur',
    status: 'ready',
    phase: 2,
    icon: 'Contrast',
    accept: IMAGE_ACCEPT,
    defaultSettings: faceBlurDefaults,
    process: faceBlurProcess,
    panel: FaceBlurPanel,
  },
  { id: 'smart-crop', status: 'soon', phase: 2, icon: 'Crop', accept: IMAGE_ACCEPT, defaultSettings: {} },
];

export const AI_TOOL_BY_ID: Record<string, RegistryTool> = Object.fromEntries(AI_TOOLS.map((t) => [t.id, t]));
