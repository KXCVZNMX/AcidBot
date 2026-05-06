'use client';

import { useEffect } from 'react';

export default function PWARegistration() {
    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !('serviceWorker' in navigator) ||
            process.env.NODE_ENV !== 'production'
        ) {
            return;
        }

        void navigator.serviceWorker
            .register('/sw.js')
            .catch((error) => {
                console.error(
                    'Service worker registration failed. Check browser support and ensure /sw.js is available:',
                    error
                );
            });
    }, []);

    return null;
}
