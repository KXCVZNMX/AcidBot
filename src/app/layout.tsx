'use client';

import './globals.css';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/next"
import Navbar from '@/app/components/Navbar';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang={'en'}>
            <body>
                <SpeedInsights />
                <SessionProvider
                    refetchOnWindowFocus={false}
                    refetchInterval={0}
                >
                    <Navbar />
                    <Analytics />
                    {children}
                </SessionProvider>
            </body>
        </html>
    );
}
