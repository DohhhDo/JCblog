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
  webpack: (config, { isServer }) => {
    // Improve chunk loading reliability
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          // Create separate chunks for Sanity Studio
          sanity: {
            test: /[\\/]node_modules[\\/](@sanity|sanity)[\\/]/,
            name: 'sanity',
            chunks: 'all',
            priority: 30,
            reuseExistingChunk: true,
          },
        },
      }
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
