import './globals.css';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import Navbar from '@/app/components/Navbar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang={'en'} data-theme={'forest'}>
            <body>
                <SpeedInsights />
                <Navbar />
                <Analytics />
                <div className={'pt-20'}>{children}</div>
            </body>
        </html>
    );
}
