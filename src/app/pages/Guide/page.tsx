'use client';

import { useSession } from 'next-auth/react';
import React from "react";

export default function Guide() {
    const { data: session } = useSession();

    const site_link = process.env.SITE_LINK ?? 'https://acid.kvznmx.com';

    const segaLoginLink =
        'https://lng-tgk-aime-gw.am-all.net/common_auth/login?' +
        'site_id=aimessen&' +
        'redirect_url=https%3A%2F%2Fmy-aime.net%2Fen%2Flogin%2Fauth%2Fcauth&' +
        'back_url=https%3A%2F%2Fmy-aime.net%2Fen';

    const segaNotFoundLink =
        `https://lng-tgk-aime-gw.am-all.net/common_auth/?id=${session?.user?.id}`;

    const bookmarklet =
        'javascript:' +
        '(function () {' +
        "var s=document.createElement('script');" +
        `s.src='${site_link}/api/getClal';` +
        'document.body.appendChild(s);' +
        '})();void(0);';

    const Step = ({
                      title,
                      children,
                  }: {
        title: string;
        children: React.ReactNode;
    }) => (
        <div className={'card bg-base-100 shadow-md'}>
            <div className={'card-body gap-3'}>
                <h2 className={'card-title text-xl'}>{title}</h2>
                <div className={'text-base-content/80'}>{children}</div>
            </div>
        </div>
    );

    const Link = ({
                      href,
                      children,
                  }: {
        href: string;
        children: React.ReactNode;
    }) => (
        <a
            href={href}
            target={'_blank'}
            rel={'noreferrer'}
            className={'link link-primary font-medium'}
        >
            {children}
        </a>
    );

    return (
        <div className={'mx-auto max-w-3xl space-y-6 p-6'}>
            <h1 className={'text-3xl font-bold text-center'}>
                CLAL Extraction Guide
            </h1>

            <Step title={'Step 1 — Login to SEGA'}>
                <p>
                    Log in using this <Link href={segaLoginLink}>{'SEGA authentication page'}</Link>.
                </p>
            </Step>

            <Step title={'Step 2 — Open your profile'}>
                <p>
                    Navigate to  <Link href={segaNotFoundLink}>{'this page'}</Link>.
                </p>
            </Step>

            <Step title={'Step 3 — Install the bookmarklet'}>
                <p>
                    Drag the button below into your browser’s bookmark bar.
                </p>

                <div className={'pt-2'}>
                    <a
                        href={bookmarklet}
                        onClick={(e) => e.preventDefault()}
                        className={'btn btn-primary btn-lg'}
                    >
                        {'AcidBot Bookmarklet'}
                    </a>
                </div>
            </Step>

            <Step title={'Step 4 — Run the bookmarklet'}>
                <p>
                    Return to the <Link href={segaNotFoundLink}>{'profile page'}</Link> and click
                    the bookmarklet you just added.
                </p>
            </Step>
        </div>
    );
}
