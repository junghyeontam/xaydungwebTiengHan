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
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
