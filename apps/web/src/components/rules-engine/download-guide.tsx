'use client';

import { Download } from 'lucide-react';
import { Button } from 'adysre';
import { guideAsMarkdown, type GuideCopy } from '@/data/rules-guide';

export interface DownloadGuideProps {
  /** Already translated by the server, so this ships no catalogue. */
  copy: GuideCopy;
  label: string;
  filename: string;
}

/**
 * Download the guide as Markdown.
 *
 * Built in the browser from the same data the page rendered, rather than
 * fetched: there is no second copy to go stale, no route to keep in step, and
 * nothing to serve. The file a visitor gets is the page they were reading, in
 * the language they were reading it in.
 *
 * A Client Component for the click, and the only part of the guide that is one.
 */
export function DownloadGuide({ copy, label, filename }: DownloadGuideProps) {
  const download = (): void => {
    const blob = new Blob([guideAsMarkdown(copy)], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();

    // Released immediately: the download has already been handed to the
    // browser, and an object URL that is never revoked keeps the whole file in
    // memory for the life of the page.
    URL.revokeObjectURL(url);
  };

  return (
    <Button size="sm" type="button" variant="outline" onClick={download}>
      <Download aria-hidden className="h-4 w-4" />
      {label}
    </Button>
  );
}
