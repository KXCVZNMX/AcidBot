import './globals.css';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Navbar from '@/app/components/Navbar';
import { SessionProvider } from 'next-auth/react';
import type { Metadata } from 'next';
import PWARegistration from '@/app/components/PWARegistration';

export const metadata: Metadata = {
    applicationName: 'AcidBot',
    manifest: '/manifest.webmanifest',
    appleWebApp: {
        capable: true,
        title: 'AcidBot',
        statusBarStyle: 'black-translucent',
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
