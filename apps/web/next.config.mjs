/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@junghyeon/config",
    "@junghyeon/i18n",
    "@junghyeon/features",
    "@junghyeon/ui",
    "@junghyeon/rbac",
    "@junghyeon/db",
    "@junghyeon/auth",
    "@junghyeon/content-renderer",
    "@junghyeon/testing",
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/lo-trinh',
        destination: '/roadmap',
        permanent: true,
      },
      {
        source: '/bai/:slug',
        destination: '/lessons/:slug',
        permanent: true,
      },
      {
        source: '/on-tap',
        destination: '/review',
        permanent: true,
      },
      {
        source: '/phat-am',
        destination: '/pronunciation',
        permanent: true,
      },
      {
        source: '/tu-van',
        destination: '/consultation',
        permanent: true,
      },
      {
        source: '/ho-so',
        destination: '/profile',
        permanent: true,
      },
      {
        source: '/san-pham',
        destination: '/products',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
