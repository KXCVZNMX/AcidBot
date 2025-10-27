'use client';

import './globals.css';
import React from 'react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import NavBar from '@/app/components/Navbar';
import Image from "next/image";
import AcidP from "../../public/home/acid.png";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang={'en'}>
            <body>
                <SpeedInsights />
                <NavBar />
                <div className={'fixed inset-0 -z-50 pointer-events-none top-20 object-contain'}>
                    <Image
                        src={AcidP}
                        alt={'acid background'}
                        width={3000}
                        className={'object-cover opacity-30'}
                        priority
                    />
                </div>
                {children}
            </body>
        </html>
    );
}
