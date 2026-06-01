import './globals.css';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Navbar from '@/app/components/Navbar';
import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next';
import PWARegistration from '@/app/components/PWARegistration';

const siteUrl = new URL(
    (process.env.SITE_LINK ?? 'https://acid.kvznmx.com').replace(/\/$/, ''),
);

export const metadata: Metadata = {
    metadataBase: siteUrl,
    title: {
        default: 'AcidBot',
        template: '%s | AcidBot',
    },
    description:
        'AcidBot is a maimai DX International Ver. score tracker with Best 50, Level Score, Skill Radar, and profile tools.',
    keywords: [
        'AcidBot',
        'maimai DX',
        'maimai DX International Ver.',
        'maimai score tracker',
        'Best 50',
        'Skill Radar',
        'Level Score',
        'DX Rating',
    ],
    authors: [{ name: 'KVZ' }, { name: 'KVZNMX' }],
    creator: 'KVZ',
    publisher: 'KVZ',
    applicationName: 'AcidBot',
    manifest: '/manifest.webmanifest',
    appleWebApp: {
        capable: true,
        title: 'AcidBot',
        statusBarStyle: 'black-translucent',
    },
    openGraph: {
        type: 'website',
        url: siteUrl,
        siteName: 'AcidBot',
        title: 'AcidBot',
        description:
            'AcidBot is a maimai DX International Ver. score tracker with Best 50, Level Score, Skill Radar, and profile tools.',
        images: [
            {
                url: '/web-app-manifest-512x512.png',
                width: 512,
                height: 512,
                alt: 'AcidBot',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AcidBot',
        description:
            'AcidBot is a maimai DX International Ver. score tracker with Best 50, Level Score, Skill Radar, and profile tools.',
        images: ['/web-app-manifest-512x512.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang={'en'} data-theme={'forest'}>
            <body>
                <SpeedInsights />
                <SessionProvider
                    refetchOnWindowFocus={false}
                    refetchInterval={0}
                >
                    <PWARegistration />
                    <Navbar />
                    <Analytics />
                    <div className={'pt-20'}>{children}</div>
                </SessionProvider>
            </body>
        </html>
    );
}
