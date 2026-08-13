import React from 'react';
import Link from 'next/link';

export default function Card({
    title,
    href,
    newPage,
    children,
}: {
    title: string;
    href?: string;
    newPage?: boolean;
    children?: React.ReactNode;
}) {
    const className =
        'card bg-base-200/60 shadow-md hover:bg-base-200 hover:shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary';

    if (href) {
        return (
            <Link
                href={href}
                prefetch={false}
                target={newPage ? '_blank' : undefined}
                rel={newPage ? 'noreferrer' : undefined}
                className={className}
            >
                <div className={'card-body gap-3'}>
                    <h2 className={'card-title text-xl text-center justify-center'}>{title}</h2>
                    <div className={'text-base-content/80 text-center'}>{children}</div>
                </div>
            </Link>
        );
    }

    return (
        <div className={className}>
            <div className={'card-body gap-3'}>
                <h2 className={'card-title text-xl text-center justify-center'}>{title}</h2>
                <div className={'text-base-content/80 text-center'}>{children}</div>
            </div>
        </div>
    );
}
