import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pbs.twimg.com'
            },
            {
                protocol: 'https',
                hostname: 'maimaidx-eng.com'
            },
            {
                protocol: 'https',
                hostname: 'dp4p6x0xfi5o9.cloudfront.net'
            }
        ]
    }
};

export default nextConfig;
