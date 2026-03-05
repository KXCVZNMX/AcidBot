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
    children: React.ReactNode;
}) {
    const Wrapper = href ? Link : 'div';

    return (
        <Wrapper
            href={href as never}
            target={newPage ? '_blank' : ''}
            rel={'noreferrer'}
            className={
                'card bg-base-200/60 shadow-md hover:bg-base-200 hover:shadow-lg transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary'
            }
        >
            <div className={'card-body gap-3'}>
                <h2 className={'card-title text-xl text-center justify-center'}>
                    {title}
                </h2>
                <div className={'text-base-content/80 text-center'}>
                    {children}
                </div>
            </div>
        </Wrapper>
    );
}
