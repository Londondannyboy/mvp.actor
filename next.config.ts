import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Fix ESM module issues with CopilotKit dependencies
  transpilePackages: ['shiki', 'streamdown'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.mux.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value: '<https://image.mux.com>; rel=preconnect; crossorigin, <https://stream.mux.com>; rel=preconnect; crossorigin',
          },
        ],
      },
    ];
  },
  // Route restructuring (preserve SEO with redirects)
  async redirects() {
    return [
      // Career guides redirect
      {
        source: '/esports-career-guide/:path*',
        destination: '/career-guide/:path*',
        permanent: true,
      },
      // Salary guides redirect
      {
        source: '/esports-salary-guide/:path*',
        destination: '/salary-guide/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
