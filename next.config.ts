import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  cacheLife: {
    // Game data changes at most once a day. Cached data refreshes every
    // 6 hours as a fallback; the updater also triggers on-demand revalidation
    // right after each successful run.
    gameData: {
      stale: 5 * 60,
      revalidate: 6 * 60 * 60,
      expire: 7 * 24 * 60 * 60,
    },
  },
  // Hero, item and emblem images load straight from their source URLs.
  // This keeps Vercel's image optimization quota at zero.
  images: { unoptimized: true },
  poweredByHeader: false,
  // next dev would otherwise write an AGENTS.md for AI assistants into the repo.
  agentRules: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // The welcome page is English only; Indonesian visitors start in the app.
  async redirects() {
    return [{ source: "/id", destination: "/id/app", permanent: false }];
  },
  // Pages live under app/[lang] (docs/i18n.md). English keeps the unprefixed
  // URLs: /tier-list is served by /en/tier-list. afterFiles runs after
  // static files and routes (sitemap, icons, public/), and before dynamic
  // routes, so /data/v1/... and /api/... are excluded explicitly.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: "/", destination: "/en" },
        {
          source: "/:path((?!(?:en|id|api|data|_next)(?:/|$)).+)",
          destination: "/en/:path",
        },
      ],
      fallback: [],
    };
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
