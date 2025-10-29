import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Ignore Docusaurus documentation folder during Next.js build
  webpack (config, { isServer }) {
    if (isServer) {
      config.module.rules.push({
        test: /\.tsx?$/,
        include: /documentation/,
        use: 'null-loader'
      })
    }
    return config
  },

  // Rewrite /documentation/* to serve static files from public/documentation/*
  async rewrites () {
    return [
      {
        source: '/documentation',
        destination: '/documentation/index.html'
      },
      {
        source: '/documentation/:path*',
        destination: '/documentation/:path*'
      }
    ]
  }
}

export default nextConfig
