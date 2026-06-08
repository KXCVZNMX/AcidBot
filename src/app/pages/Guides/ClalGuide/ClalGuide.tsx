'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import Link from 'next/link';
import Step from '@/app/components/Step';
import CLink from '@/app/components/CLink';
import BackButton from '../../../../../public/back-button-svgrepo.svg';
import Image from 'next/image';

export default function ClalGuide() {
    const { data: session } = useSession();

    const site_link = process.env.SITE_LINK ?? 'https://acid.kvznmx.com';

    const segaLoginLink =
        'https://lng-tgk-aime-gw.am-all.net/common_auth/login?' +
        'site_id=aimessen&' +
        'redirect_url=https%3A%2F%2Fmy-aime.net%2Fen%2Flogin%2Fauth%2Fcauth&' +
        'back_url=https%3A%2F%2Fmy-aime.net%2Fen';

    const segaNotFoundLink = `https://lng-tgk-aime-gw.am-all.net/common_auth/?id=${session?.user?.id}`;

    const bookmarklet =
        'javascript:' +
        '(function () {' +
        'var s=document.createElement(\'script\');' +
        `s.src='${site_link}/api/v1/profile/clal';` +
        'document.body.appendChild(s);' +
        '})();void(0);';

    return (
        <div className={'mx-auto max-w-3xl space-y-6 p-6'}>
            <div className={'grid grid-cols-[auto_1fr_auto] items-center'}>
                <Link href={'/pages/Guides'} aria-label={'go back'}>
                    <Image
                        src={BackButton}
                        alt={'back button'}
                        width={24}
                        height={24}
                        className={'h-6 w-6'}
                    />
                </Link>
                <h1 className={'text-3xl font-bold text-center'}>
                    CLAL Extraction Guide
                </h1>
                <div aria-hidden />
            </div>

            <Step title={'Step 1 — Login to SEGA'}>
                <p>
                    Log in using this{' '}
                    <CLink href={segaLoginLink}>
                        {'SEGA authentication page'}
                    </CLink>
                    .
                </p>
            </Step>

            <Step title={'Step 2 — Open your profile'}>
                <p>
                    Navigate to{' '}
                    <CLink href={segaNotFoundLink}>{'this page'}</CLink>.
                </p>
            </Step>

            <Step title={'Step 3 — Install the bookmarklet'}>
                <p>
                    Click this button to copy the bookmarklet and paste it into
                    a bookmark&#39;s URL field.
                </p>

                <div className={'pt-2'}>
                    <Link
                        href={bookmarklet}
                        onClick={async (e) => {
                            e.preventDefault();
                            await navigator.clipboard.writeText(bookmarklet);
                        }}
                        className={'btn btn-primary btn-lg'}
                    >
                        {'AcidBot Bookmarklet'}
                    </Link>
                </div>
            </Step>

            <Step title={'Step 4 — Run the bookmarklet'}>
                <p>
                    Return to the{' '}
                    <CLink href={segaNotFoundLink}>{'profile page'}</CLink> and
                    click the bookmarklet you just added.
                </p>
            </Step>
        </div>
    );
}
