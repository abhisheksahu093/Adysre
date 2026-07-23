/**
 * Live preview for `animated-checkmark-draw`. Mirrors the `typescript` code variant.
 * The circle and tick draw via stroke-dashoffset; reduced motion shows them drawn.
 */
interface AnimatedCheckmarkDrawProps {
  size?: number;
  label?: string;
  className?: string;
}

export function AnimatedCheckmarkDraw({ size = 96, label = 'Success', className = '' }: AnimatedCheckmarkDrawProps) {
  return (
    <>
      <style>{`
        @keyframes adysre-draw { to { stroke-dashoffset: 0; } }
        .adysre-check-circle { stroke-dasharray: 160; stroke-dashoffset: 160; animation: adysre-draw 600ms ease-out forwards; }
        .adysre-check-mark { stroke-dasharray: 48; stroke-dashoffset: 48; animation: adysre-draw 300ms ease-out 520ms forwards; }
        @media (prefers-reduced-motion: reduce) {
          .adysre-check-circle, .adysre-check-mark { animation: none !important; stroke-dashoffset: 0 !important; }
        }
      `}</style>
      <div className={`flex flex-col items-center gap-3 text-green-500 dark:text-green-400 ${className}`} role="img" aria-label={label}>
        <svg width={size} height={size} viewBox="0 0 52 52" fill="none" aria-hidden="true">
          <circle className="adysre-check-circle" cx="26" cy="26" r="24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <path className="adysre-check-mark" d="M15 27 l7 7 l15 -15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{label}</span>
      </div>
    </>
  );
}

export default function AnimatedCheckmarkDrawPreview() {
  return <AnimatedCheckmarkDraw label="Payment confirmed" />;
}
