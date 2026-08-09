import type { Metadata } from 'next';
import Image from 'next/image';
import HomePageIcon from '../../../../public/HomeGIF.gif';
import React from 'react';
import Link from 'next/link';
import Card from '@/app/components/Card';

export const metadata: Metadata = {
    title: 'About',
    description: 'Learn what AcidBot does, who built it, and where to find the source code and usage guides.',
    keywords: ['maimai', 'Acid Bot', 'AcidBot', 'abouts'],
};

export default function Page() {
    return (
        <div className={'flex flex-col items-center'}>
            <Image src={HomePageIcon} alt={'Home page icon'} width={150} height={134} />
            <h1 className={'text-3xl font-medium'}>AcidBot</h1>

            <div className={'p-3 w-full max-w-200 grid grid-cols-2 gap-3'}>
                <div className={'col-span-2'}>
                    <div className={'card bg-base-200/60 shadow-md hover:bg-base-200 hover:shadow-lg transition-all'}>
                        <div className={'card-body'}>
                            <div className={'text-base-context/80 text-center'}>
                                <p>maimai でらっくす International Version Score Fetcher</p>
                                <p>Special Thanks to ゆめ for authorising the use of the icon</p>
                                <p className={'mb-2'}>Last built at: {process.env.NEXT_PUBLIC_BUILD_TIME}</p>
                                <p>
                                    {' '}
                                    Made by{' '}
                                    <Link
                                        href={'https://github.com/KXCVZNMX'}
                                        target={'_blank'}
                                        rel={'noreferrer'}
                                        className={'link link-primary font-medium'}
                                    >
                                        KVZ
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <Card title={'Guides'} newPage={false} href={'/pages/guides'}>
                    <p>How to use AcidBot (WIP...)</p>
                </Card>

                {/*This would be the community card when I create one. either on QQ or Discord*/}
                <Card title={''}>
                    <></>
                </Card>

                <div className={'col-span-2'}>
                    <Card title={'KXCVZNMX/AcidBot'} newPage={true} href={'https://github.com/KXCVZNMX/AcidBot'}>
                        <p>Check out the source code!</p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
