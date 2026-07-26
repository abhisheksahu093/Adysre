'use client';

import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { cn } from 'adysre';

/**
 * Drag-and-drop plus click-to-browse upload. Accepts multiple files; the parent
 * turns them into queue items. Files stay in the browser.
 */
export function Dropzone({ accept, onFiles, hint }: { accept: string[]; onFiles: (files: File[]) => void; hint: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const accepted = (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => accept.length === 0 || accept.some((a) => f.type === a || a.endsWith('/*')));
    if (list.length > 0) onFiles(list);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    accepted(e.dataTransfer.files);
  };
  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) accepted(e.target.files);
    e.target.value = '';
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDragging(false);
      }}
      onDrop={onDrop}
      className={cn(
        'flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors',
        dragging ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
      )}
    >
      <UploadCloud className="h-6 w-6" aria-hidden />
      <span className="text-sm font-medium">{hint}</span>
      <span className="text-xs text-muted-foreground">Drag &amp; drop or click. Multiple files supported.</span>
      <input ref={inputRef} type="file" multiple accept={accept.join(',')} className="sr-only" onChange={onInput} />
    </button>
  );
}
