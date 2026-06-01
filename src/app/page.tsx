import { Metadata } from 'next';
import Image from 'next/image';
import HomePageIcon from '../../public/HomeGIF.gif';
import React from 'react';
import { auth } from '@/auth';
import Card from '@/app/components/Card';

export const metadata: Metadata = {
    description:
        'Track maimai DX International Ver. scores, view your Best 50, inspect Skill Radar charts, and read AcidBot guides.',
    keywords: ['maimai', 'Acid Bot', 'AcidBot', 'home', 'best 50', 'score image', 'best50 image', 'image', 'visualise', 'maimai score', 'rating image', 'rating', 'score chart', 'skill radar', 'DX rating']
};

export default async function Home() {
    const session = await auth();

    return (
        <>
            <div className={'flex flex-col items-center'}>
                <Image
                    src={HomePageIcon}
                    alt={'Home page icon'}
                    width={305}
                    height={274}
                    priority={true}
                />
                <h1 className={'text-4xl font-medium'}>AcidBot</h1>

                <div
                    className={'p-3 w-full max-w-175 grid grid-cols-2 gap-3'}
                >
                    <div className={'col-span-2'}>
                        <Card
                            title={`${session ? `Welcome, ${session?.user?.name ?? 'user'}` : 'Please Login First'}`}
                        >
                            <></>
                        </Card>
                    </div>

                    <Card
                        title={'About AcidBot'}
                        href={'/pages/Abouts'}
                        newPage={false}
                    >
                        <p>Information on AcidBot</p>
                    </Card>

                    <Card
                        title={'nearcade'}
                        href={
                            'https://chuqin.me/?utm_source=acidbot&utm_medium=card&utm_campaign=homepage'
                        }
                        newPage={true}
                    >
                        <p>Check out arcades near you</p>
                    </Card>
                </div>
            </div>
        </>
    );
}
