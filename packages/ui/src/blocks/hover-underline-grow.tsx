/**
 * Live preview for `hover-underline-grow`. Mirrors the `typescript` code variant.
 * The underline scales in from the left on hover and keyboard focus.
 */
import type { ReactNode } from 'react';

interface HoverUnderlineGrowProps {
  children: ReactNode;
  href?: string;
  className?: string;
}

export function HoverUnderlineGrow({ children, href = '#', className = '' }: HoverUnderlineGrowProps) {
  return (
    <>
      <style>{`
        .adysre-underline::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          height: 2px;
          width: 100%;
          background: currentColor;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .adysre-underline:hover::after,
        .adysre-underline:focus-visible::after { transform: scaleX(1); }
        @media (prefers-reduced-motion: reduce) { .adysre-underline::after { transition: none; } }
      `}</style>
      <a
        href={href}
        className={`adysre-underline relative inline-block font-semibold text-gray-900 focus-visible:outline-none dark:text-gray-100 ${className}`}
      >
        {children}
      </a>
    </>
  );
}

export default function HoverUnderlineGrowPreview() {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-6 px-4 text-lg">
      <HoverUnderlineGrow href="#">Product</HoverUnderlineGrow>
      <HoverUnderlineGrow href="#">Pricing</HoverUnderlineGrow>
      <HoverUnderlineGrow href="#">Docs</HoverUnderlineGrow>
    </nav>
  );
}
