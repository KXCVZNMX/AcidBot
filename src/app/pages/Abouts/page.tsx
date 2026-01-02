import type { Metadata } from 'next';
import Image from 'next/image';
import HomePageIcon from '../../../../public/HomeGIF.gif';
import React from 'react';

export const metadata: Metadata = {
    title: 'AcidBot | Abouts',
};

const Card = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div
        className={
            'card bg-base-200/60 shadow-md hover:bg-base-200 hover:shadow-lg transition-all'
        }
    >
        <div className={'card-body gap-3'}>
            <h2 className={'card-title text-xl justify-center'}>{title}</h2>
            <div className={'text-base-content/80 text-center'}>{children}</div>
        </div>
    </div>
);

export default function Page() {
    return (
        <div className={'flex flex-col items-center'}>
            <Image
                src={HomePageIcon}
                alt={'Home page icon'}
                width={150}
                height={134}
            />
            <h1 className={'text-3xl font-medium'}>AcidBot</h1>

            <div className={'p-3 w-full max-w-[800px] grid grid-cols-2 gap-3'}>
                <div className={'col-span-2'}>
                    <div
                        className={
                            'card bg-base-200/60 shadow-md hover:bg-base-200 hover:shadow-lg transition-all'
                        }
                    >
                        <div className={'card-body'}>
                            <div className={'text-base-context/80 text-center'}>
                                <p>
                                    maimai でらっくす International Version
                                    Score Fetcher
                                </p>
                                <p className={'mb-2'}>
                                    Last built at:{' '}
                                    {process.env.NEXT_PUBLIC_BUILD_TIME}
                                </p>
                                <p>Made by KVZ</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
