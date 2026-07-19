/**
 * Live preview for `marquee-announcement-bar`.
 * Mirrors the `typescript` code variant verbatim. Keep this in step with
 * `src/data/components/marquees.ts`.
 */
const ANNOUNCE_KEYFRAMES = `
  @keyframes marquee-announce-scroll {
    to { transform: translateX(-50%); }
  }
`;

const DEFAULT_MESSAGES = ['Version 3.0 is live', 'Free shipping over $50', 'Join 10,000+ teams', 'Now with dark mode'];

interface MarqueeAnnouncementBarProps {
  messages?: string[];
  durationSeconds?: number;
  className?: string;
}

function MarqueeAnnouncementBar({ messages = DEFAULT_MESSAGES, durationSeconds = 26, className = '' }: MarqueeAnnouncementBarProps) {
  const group = (hidden: boolean) => (
    <div className={hidden ? 'flex shrink-0 items-center motion-reduce:hidden' : 'flex shrink-0 items-center motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-1'} aria-hidden={hidden || undefined}>
      {messages.map((message) => (
        <span key={message} className="inline-flex shrink-0 items-center gap-4 pr-4">
          <span className="whitespace-nowrap text-sm font-medium">{message}</span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" aria-hidden="true" />
        </span>
      ))}
    </div>
  );

  return (
    <section className={`w-full overflow-hidden bg-blue-600 py-2 text-white dark:bg-blue-700 ${className}`} aria-label="Announcements">
      <style>{ANNOUNCE_KEYFRAMES}</style>
      <div
        className="flex w-max animate-[marquee-announce-scroll_26s_linear_infinite] motion-reduce:w-full motion-reduce:animate-none"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        {group(false)}
        {group(true)}
      </div>
    </section>
  );
}

export default function MarqueeAnnouncementBarPreview() {
  return <MarqueeAnnouncementBar />;
}
