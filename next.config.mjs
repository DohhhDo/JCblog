/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./env.mjs'))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      },
      {
        protocol: 'https',
        hostname: 'youke1.picui.cn',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gitee.com',
        port: '',
        pathname: '/**',
      }
    ],
  },

  experimental: {
    taint: true,
  },

  compiler: {
    styledComponents: true,
  },

  // Optimize webpack for better chunk loading
  webpack: (config, { isServer, dev }) => {
    // Improve chunk loading reliability
    if (!isServer) {
      // Enhanced split chunks configuration
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        maxAsyncRequests: 30,
        maxInitialRequests: 15, // Reduced from 30
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Create separate chunks for Sanity Studio (only async)
          sanity: {
            test: /[\\/]node_modules[\\/](@sanity|sanity)[\\/]/,
            name: 'sanity',
            chunks: 'async', // Changed from 'all' to 'async'
            priority: 30,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Separate chunk for Tremor (admin only)
          tremor: {
            test: /[\\/]node_modules[\\/]@tremor[\\/]/,
            name: 'tremor',
            chunks: 'async',
            priority: 28,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Separate chunk for React Query
          reactQuery: {
            test: /[\\/]node_modules[\\/]react-query[\\/]/,
            name: 'react-query',
            chunks: 'async',
            priority: 27,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Separate chunk for framer-motion
          framerMotion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'async',
            priority: 26,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Separate chunk for markdown-related dependencies
          markdown: {
            test: /[\\/]node_modules[\\/](.*markdown.*|.*editor.*|codemirror|prosemirror|slate)[\\/]/,
            name: 'markdown',
            chunks: 'async',
            priority: 25,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Separate React and React-DOM (keep in main bundle for SSR)
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 25,
            reuseExistingChunk: true,
          },
          // UI Libraries
          ui: {
            test: /[\\/]node_modules[\\/](@headlessui|@radix-ui)[\\/]/,
            name: 'ui',
            chunks: 'async',
            priority: 20,
            reuseExistingChunk: true,
            maxSize: 150000, // ~150KB
          },
          // Common vendor libraries (smaller chunks)
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'initial', // Only for initial chunks
            priority: 10,
            reuseExistingChunk: true,
            maxSize: 200000, // Reduced from 244KB to 200KB
          },
        },
      }

      // Improve chunk loading resilience
      config.optimization.chunkIds = 'deterministic'
      config.optimization.moduleIds = 'deterministic'
      
      // Add module concatenation for better tree shaking
      config.optimization.concatenateModules = true
      
      // Enable side effects false for better tree shaking
      config.optimization.sideEffects = false
    }
    return config
  },

  redirects() {
    return [
      {
        "source": "/twitter",
        "destination": "https://x.com/DvorakZhou",
        "permanent": true
      },
      {
        "source": "/x",
        "destination": "https://x.com/DvorakZhou",
        "permanent": true
      },
      {
        "source": "/youtube",
        "destination": "https://youtube.com/",
        "permanent": true
      },
      {
        "source": "/tg",
        "destination": "https://t.me/",
        "permanent": true
      },
      {
        "source": "/linkedin",
        "destination": "https://www.linkedin.com/",
        "permanent": true
      },
      {
        "source": "/github",
        "destination": "https://github.com/",
        "permanent": true
      },
      {
        "source": "/bilibili",
        "destination": "https://space.bilibili.com/8350251",
        "permanent": true
      }
    ]
  },

  rewrites() {
    return [
      {
        source: '/feed',
        destination: '/feed.xml',
      },
      {
        source: '/rss',
        destination: '/feed.xml',
      },
      {
        source: '/rss.xml',
        destination: '/feed.xml',
      },
      {
        source: '/feed-full',
        destination: '/feed-full.xml',
      },
      {
        source: '/rss-full',
        destination: '/feed-full.xml',
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/apple-icon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/site.webmanifest',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
          {
            key: 'Content-Type',
            value: 'application/manifest+json; charset=utf-8',
          },
        ],
      },
    ]
  },
}

export default nextConfig
