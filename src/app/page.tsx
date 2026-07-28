import { Metadata } from 'next';
import Image from 'next/image';
import HomePageIcon from '../../public/HomeGIF.gif';
import React from 'react';
import Card from '@/app/components/Card';
import {auth} from '@/auth';

export const metadata: Metadata = {
    title: 'maimai B50 Tracker',
    description:
        'Track maimai DX International Ver. scores, view your Best 50, inspect Skill Radar charts, and read AcidBot guides.',
    keywords: [
        'maimai',
        'Acid Bot',
        'AcidBot',
        'home',
        'best 50',
        'score image',
        'best50 image',
        'image',
        'visualise',
        'maimai score',
        'rating image',
        'rating',
        'score chart',
        'skill radar',
        'DX rating',
    ],
};

export default async function Home() {
    const session = await auth();
    return (
        <main className={'flex flex-col items-center pb-12'}>
            <header
                className={'flex flex-col items-center text-center px-4 mt-4'}
            >
                <Image
                    src={HomePageIcon}
                    alt={'Home page icon'}
                    width={305}
                    height={274}
                    priority={true}
                />
                <h1 className={'text-4xl font-bold mt-6'}>AcidBot</h1>
                <p className={'text-lg mt-4 max-w-xl text-base-content/80'}>
                    An easy-to-use <strong>maimai DX International Ver.</strong>{' '}
                    score tracker. Fetch your scores, generate shareable rating
                    images, and analyze your playstyle.
                </p>
            </header>

            <section
                className={'p-3 w-full max-w-175 grid grid-cols-2 gap-3 mt-8'}
            >
                {session ?
                    <div className={'col-span-2'}>
                        <Card title={'I wanna play maimai'} href={'/pages/user-profile'}><></></Card>
                    </div>
                    :
                    <div className={'col-span-2'}>
                        <Card
                            title={'Sign in to get started'}
                            href={'/api/auth/signin'}
                        >
                            <></>
                        </Card>
                    </div>
                }

                <Card
                    title={'About AcidBot'}
                    href={'/pages/about'}
                    newPage={false}
                >
                    <p>Information on AcidBot</p>
                </Card>

                <Card
                    title={'nearcade'}
                    href={
                        'https://nearcade.cn/?utm_source=acidbot&utm_medium=card&utm_campaign=homepage'
                    }
                    newPage={true}
                >
                    <p>Check out arcades near you</p>
                </Card>
            </section>

            <section
                className={
                    'w-full max-w-5xl mt-12 px-4 flex flex-col items-center'
                }
            >
                <h2 className={'text-3xl font-semibold mb-8 text-center'}>
                    Generate Images from your maimaidx-net
                </h2>

                <div className={'grid grid-cols-1 md:grid-cols-3 gap-6 w-full'}>
                    <Card title={'Best 50 Generator'} href={'/pages/b50'}>
                        <p className={'text-sm text-base-content/80'}>
                            Fetch your Best 50 scores to calculate your DX
                            Rating. Instantly generate rating images to share
                            with your friends.
                        </p>
                    </Card>

                    <Card title={'Skill Radar'} href={'/pages/skill-radar'}>
                        <p className={'text-sm text-base-content/80'}>
                            Discover your playstyle. Analyzes your ability
                            across different patterns like spins, swipes, and
                            more.
                        </p>
                    </Card>

                    <Card title={'Level Scores'} href={'/pages/lv-score'}>
                        <p className={'text-sm text-base-content/80'}>
                            Break down your performance by difficulty level.
                            Easily track all your SSS+ grades for levels 1
                            through 15.
                        </p>
                    </Card>
                </div>
            </section>
        </main>
    );
}
