import createNextIntlPlugin from 'next-intl/plugin';

/** Points the plugin at our request config (default location is ./i18n/request.ts). */
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compile workspace packages that ship raw TS/TSX.
  transpilePackages: ['@adysre/ui', '@adysre/theme', '@adysre/sdk', '@adysre/types', '@adysre/validators'],
  typedRoutes: true,
  // Barrel-optimise the icon library so a route only bundles the icons it uses
  // instead of pulling the whole package graph (lucide-react is imported across
  // dozens of files).
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default withNextIntl(nextConfig);
