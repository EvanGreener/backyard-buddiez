/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'commons.wikimedia.org',
                port: '',
                pathname: '/wiki/Special:FilePath/**',
            },
        ],
    },
}

export default nextConfig
