import React from 'react';
import Step from '@/components/ui/Step';
import CLink from '@/components/ui/CLink';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import BackButton from '../../../../../public/back-button-svgrepo.svg';

export const metadata: Metadata = {
    title: 'Usage Guide',
    description:
        'Learn how to log in, set your clal token, and use AcidBot to fetch Best 50, Level Score, and Skill Radar data.',
};

export default function UsageGuide() {
    return (
        <div className={'mx-auto max-w-3xl space-y-6 p-6'}>
            <div className={'grid grid-cols-[auto_1fr_auto] items-center'}>
                <Link href={'/pages/guides'} aria-label={'go back'}>
                    <Image src={BackButton} alt={'back button'} width={24} height={24} className={'h-6 w-6'} />
                </Link>
                <h1 className={'text-3xl font-bold text-center'}>AcidBot Usage Guide</h1>
                <div aria-hidden />
            </div>

            <Step title={'Step 1 — Login / Signup'}>
                <p>
                    Click the login button on the top right-hand-side corner (or inside the hamburger drawer on the
                    bottom left-hand-side corner), and login with your preferred provider.
                </p>
            </Step>

            <Step title={'Step 2 — Set your clal token'}>
                <p>
                    Your clal token is required to enable us to fetch your scores. You can learn how to set it in the{' '}
                    <CLink href={'/pages/guides/clal-guide'}>clal guides</CLink> page.
                </p>
            </Step>

            <Step title={'Step 3 — Check out the features'}>
                <Step title={'Best 50'} bg={'300'}>
                    <p>
                        Fetch your Best 50 scores which makes up your DX Rating. See each song&#39;s level constant, and
                        your results on those songs. <CLink href={'/pages/b50'}>{'go to >>'}</CLink>
                    </p>
                </Step>

                <Step title={'Level Scores'} bg={'300'}>
                    <p>
                        Fetch your scores for each level (1, 2, ... , 14+, 15), and see your results for each song
                        belonging to that level category. <CLink href={'/pages/lv-score'}>{'go to >>'}</CLink>
                    </p>
                </Step>

                <Step title={'Skill Radar'} bg={'300'}>
                    <p>
                        See your skill spread represented as a radar map. See it by both patterns (spins, swipes,
                        high-break-counts, etc.), and chart types (mostly slider, heavy tap counts, etc.).{' '}
                        <CLink href={'/pages/skill-radar'}>{'go to >>'}</CLink>
                    </p>
                </Step>
            </Step>
        </div>
    );
}
