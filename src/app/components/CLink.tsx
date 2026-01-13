import React from "react";
import Link from "next/link";

export default function CLink({
                   href,
                   children,
               }: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            target={'_blank'}
            rel={'noreferrer'}
            className={'link link-primary font-medium'}
        >
            {children}
        </Link>
    );
}