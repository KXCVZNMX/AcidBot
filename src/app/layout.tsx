'use client';

import './globals.css';
import React from 'react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import NavBar from '@/app/components/Navbar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang={'en'}>
            <body>
                <SpeedInsights/>
                <NavBar />
                {children}
            </body>
        </html>
    );
}
