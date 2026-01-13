import React from 'react';
import Step from '@/app/components/Step';
import CLink from '@/app/components/CLink';
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'AcidBot | Clal Guide',
};


export default function UsageGuide() {
    return (
        <div className={'mx-auto max-w-3xl space-y-6 p-6'}>
            <h1 className={'text-3xl font-bold text-center'}>
                AcidBot Usage Guide
            </h1>

            <Step title={'Step 1 — Login / Signup'}>
                <p>
                    Click the login button on the top right-hand-side corner (or
                    inside the hamburger drawer on the bottom left-hand-side
                    corner), and login with your preferred provider.
                </p>
            </Step>

            <Step title={'Step 2 — Set your clal token'}>
                <p>
                    Your clal token is required to enable us to fetch your
                    scores. You can learn how to set it in the{' '}
                    <CLink href={'/pages/Guides/ClalGuide'}>clal guides</CLink>{' '}
                    page.
                </p>
            </Step>

            <Step title={'Step 3 — Check out the features'}>
                <Step title={'Best 50'} bg={'300'}>
                    <p>
                        Fetch your Best 50 scores which makes up your DX Rating.
                        See each song's level constant, and your results on
                        those songs.{' '}
                        <CLink href={'/pages/Best50'}>{'go to >>'}</CLink>
                    </p>
                </Step>

                <Step title={'Level Scores'} bg={'300'}>
                    <p>
                        Fetch your scores for each level (1, 2, ... , 14+, 15),
                        and see your results for each song belonging to that
                        level category.{' '}
                        <CLink href={'/pages/LvScore'}>{'go to >>'}</CLink>
                    </p>
                </Step>

                <Step title={'Skill Radar'} bg={'300'}>
                    <p>
                        See your skill spread represented as a radar map. See it
                        by both patterns (spins, swipes, high-break-counts,
                        etc.), and chart types (mostly slider, heavy tap counts,
                        etc.).{' '}
                        <CLink href={'/pages/SkillRadar'}>{'go to >>'}</CLink>
                    </p>
                </Step>
            </Step>
        </div>
    );
}
