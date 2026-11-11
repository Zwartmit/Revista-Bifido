const path = require('path')
const { withPayload } = require('@payloadcms/next/withPayload')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Tipografia e ilustraciones de las tarjetas sociales (app/og) se leen con fs: hay que incluirlas en el despliegue
  outputFileTracingIncludes: {
    '/og/[type]': ['./app/og/fonts/**/*', './app/og/art/**/*'],
  },
  // Los navegadores piden /favicon.ico en la raíz; los iconos viven en /favicon
  async rewrites() {
    return {
      beforeFiles: [{ source: '/favicon.ico', destination: '/favicon/favicon.ico' }],
    }
  },
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  experimental: {
    reactCompiler: false,
  },
}

module.exports = withPayload(nextConfig)
