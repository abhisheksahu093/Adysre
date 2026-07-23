'use client';

/**
 * Live preview for `map-embed-responsive`.
 *
 * Mirrors the `typescript` code variant verbatim - a styled placeholder, never a
 * live iframe. Keep this in step with `src/data/components/maps.ts`.
 */
interface MapEmbedResponsiveProps {
  title?: string;
  label?: string;
  className?: string;
}

export function MapEmbedResponsive({
  title = 'Map',
  label = 'Map preview',
  className = '',
}: MapEmbedResponsiveProps) {
  // title is reserved for the iframe you drop in; referenced here to keep it in the API.
  void title;
  return (
    <div className={'relative aspect-video w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950 ' + className}>
      {/*
        Drop your provider's iframe here and delete the placeholder below. It is
        left commented out on purpose - nothing loads or phones home until you opt in:

        <iframe
          title={title}
          src="https://maps.example.com/embed?place=..."
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      */}
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full text-gray-300 dark:text-gray-700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="embed-dots" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.4" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#embed-dots)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm dark:bg-gray-900 dark:text-gray-400" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="11" r="2" />
          </svg>
        </span>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</span>
      </div>
    </div>
  );
}

export const minHeight = 300;

export default function MapEmbedResponsivePreview() {
  return <MapEmbedResponsive className="w-full" />;
}
