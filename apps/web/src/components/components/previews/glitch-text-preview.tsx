/**
 * Live preview for `glitch-text`. Mirrors the `typescript` code variant.
 * Two clipped colour clones drift behind the text; reduced motion stills them.
 */
interface GlitchTextProps {
  text: string;
  className?: string;
}

function GlitchText({ text, className = '' }: GlitchTextProps) {
  return (
    <>
      <style>{`
        @keyframes adysre-glitch-1 {
          0%, 100% { clip-path: inset(0 0 85% 0); transform: translate(0, 0); }
          20% { clip-path: inset(20% 0 40% 0); transform: translate(-2px, -1px); }
          40% { clip-path: inset(60% 0 10% 0); transform: translate(2px, 1px); }
          60% { clip-path: inset(10% 0 60% 0); transform: translate(-1px, 1px); }
          80% { clip-path: inset(40% 0 30% 0); transform: translate(1px, -1px); }
        }
        @keyframes adysre-glitch-2 {
          0%, 100% { clip-path: inset(80% 0 5% 0); transform: translate(0, 0); }
          25% { clip-path: inset(10% 0 70% 0); transform: translate(2px, 1px); }
          50% { clip-path: inset(50% 0 30% 0); transform: translate(-2px, -1px); }
          75% { clip-path: inset(30% 0 45% 0); transform: translate(1px, 1px); }
        }
        .adysre-glitch-a { animation: adysre-glitch-1 2.4s infinite linear alternate; }
        .adysre-glitch-b { animation: adysre-glitch-2 2.8s infinite linear alternate; }
        @media (prefers-reduced-motion: reduce) {
          .adysre-glitch-a, .adysre-glitch-b { animation: none !important; opacity: 0 !important; }
        }
      `}</style>
      <span className={`relative inline-block font-bold ${className}`}>
        <span className="relative z-10">{text}</span>
        <span className="adysre-glitch-a absolute left-0 top-0 z-0 text-cyan-400" aria-hidden="true">{text}</span>
        <span className="adysre-glitch-b absolute left-0 top-0 z-0 text-fuchsia-500" aria-hidden="true">{text}</span>
      </span>
    </>
  );
}

export default function GlitchTextPreview() {
  return (
    <div className="px-4 text-center">
      <GlitchText text="SYSTEM ERROR" className="text-3xl text-gray-900 sm:text-4xl dark:text-gray-100" />
    </div>
  );
}
