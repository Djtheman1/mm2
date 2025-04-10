/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["tr.rbxcdn.com"],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignores TypeScript errors during builds
  },
};

export default nextConfig;
