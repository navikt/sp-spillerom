import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    reactCompiler: true,
    serverExternalPackages: ['@navikt/next-logger'],
    experimental: {
        optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
    },
}

export default nextConfig
