import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Pexels sizing params (?auto=…&w=…) vary per image, so the query string stays open.
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/photos/**' },
      {
        protocol: 'https',
        hostname: 'ygzrgfbsswiwugmqxufq.supabase.co',
        pathname: '/storage/v1/object/public/**',
        search: '',
      },
    ],
  },
  partialPrefetching: true,
  reactCompiler: true,
}

export default nextConfig
