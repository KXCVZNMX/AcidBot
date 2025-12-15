'use client';

import './globals.css';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang={'en'}>
            <body>
                <SpeedInsights />
                {children}
            </body>
        </html>
    );
}
