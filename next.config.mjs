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
        maxInitialRequests: 30,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Create separate chunks for Sanity Studio
          sanity: {
            test: /[\\/]node_modules[\\/](@sanity|sanity)[\\/]/,
            name: 'sanity',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Separate chunk for markdown-related dependencies
          markdown: {
            test: /[\\/]node_modules[\\/](.*markdown.*|.*editor.*|codemirror|prosemirror|slate)[\\/]/,
            name: 'markdown',
            chunks: 'all',
            priority: 25,
            reuseExistingChunk: true,
            enforce: true,
          },
          // Separate React and React-DOM
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 25,
            reuseExistingChunk: true,
          },
          // Common vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            maxSize: 244000, // ~240KB
          },
        },
      }

      // Improve chunk loading resilience
      config.optimization.chunkIds = 'deterministic'
      config.optimization.moduleIds = 'deterministic'
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
        "destination": "https://youtube.com/@calicastle",
        "permanent": true
      },
      {
        "source": "/tg",
        "destination": "https://t.me/cali_so",
        "permanent": true
      },
      {
        "source": "/linkedin",
        "destination": "https://www.linkedin.com/in/calicastle/",
        "permanent": true
      },
      {
        "source": "/github",
        "destination": "https://github.com/CaliCastle",
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
    ]
  },
}

export default nextConfig
