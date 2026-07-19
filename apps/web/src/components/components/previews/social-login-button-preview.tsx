'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Live preview for `social-login-button`.
 *
 * Mirrors the `typescript` code variant verbatim. The button is full width by
 * design, so the preview gives it the sign-in card it was measured against -
 * on its own, "full width" means nothing.
 * Keep this in step with `src/data/components/buttons.ts`.
 */
interface SocialLoginButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  children: ReactNode;
}

function SocialLoginButton({ icon, children, ...props }: SocialLoginButtonProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-gray-900"
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

function GitHubIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.3-1.7-1.3-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="h-[1.125rem] w-[1.125rem] shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 11v3.4h4.8a4.2 4.2 0 0 1-4.8 3.1 5.5 5.5 0 1 1 3.6-9.7l2.4-2.4A9 9 0 1 0 12 21c5.2 0 8.7-3.7 8.7-8.8 0-.6-.1-1.1-.2-1.6H12Z" />
    </svg>
  );
}

export default function SocialLoginButtonPreview() {
  return (
    <div className="w-full max-w-xs space-y-2.5">
      <SocialLoginButton icon={<GitHubIcon />}>Continue with GitHub</SocialLoginButton>
      <SocialLoginButton icon={<GoogleIcon />}>Continue with Google</SocialLoginButton>
    </div>
  );
}
