'use client';

import Link from 'next/link';
import {useSession} from 'next-auth/react';
import type {ReactNode} from 'react';

export default function ToolAccess({ feature, children }: { feature: string; children: ReactNode }) {
    const { status } = useSession();

    if (status === 'loading') {
        return <div className={'min-h-64'} aria-busy={'true'} />;
    }

    if (status === 'unauthenticated') {
        return (
            <section className={'mx-auto mt-8 max-w-3xl px-4 pb-12'}>
                <div className={'border border-base-300 bg-base-200 p-6 text-center shadow-md'}>
                    <h2 className={'text-2xl font-semibold'}>Sign in to use {feature}</h2>
                    <p className={'mt-3 text-base-content/80'}>
                        Your scores and generated images are private to your AcidBot account.
                    </p>
                    <Link href={'/api/auth/signin'} className={'btn btn-primary mt-5'}>
                        Sign in
                    </Link>
                </div>
            </section>
        );
    }

    return <>{children}</>;
}
