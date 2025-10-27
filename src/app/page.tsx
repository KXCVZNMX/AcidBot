'use client';

import Image from 'next/image';
import loginP from '../../public/home/mdxn_login.png';
import landingP from '../../public/home/mdxn_landing.png';

export default function Home() {
    return (
        <>
            <div
                className={'flex-1 overflow-y-auto scroll-smooth z-10 relative'}
            >
                <section
                    id={'setup'}
                    className={'p-10 border-b border-gray-800'}
                >
                    <h1 className={'text-3xl font-bold mb-4'}>Setup</h1>
                    <section
                        id={'login'}
                        className={'p-10 pt-2 border-b border-gray-800'}
                    >
                        <h1 className={'text-3xl font-bold mb-4'}>Login</h1>
                        <div className={'text-md'}>
                            <p className={'pb-3'}>
                                Log into your{' '}
                                <a
                                    href={'https://maimaidx-eng.com/'}
                                    className={'text-blue-300 underline'}
                                >
                                    maimai DX Net
                                </a>{' '}
                                normally
                            </p>
                            <div
                                className={
                                    'flex flex-col sm:flex-row gap-5 object-contain'
                                }
                            >
                                <Image
                                    src={loginP}
                                    alt={'maimai dx net login page'}
                                    height={891 / 2}
                                    width={792 / 2}
                                />
                                <Image
                                    src={landingP}
                                    alt={'maimai dx net landing page'}
                                    height={450}
                                    width={240}
                                />
                            </div>
                        </div>
                    </section>
                    <section
                        id={'bookmarklet'}
                        className={'p-10 border-b border-gray-800'}
                    >
                        <h1 className={'text-2xl font-bold mb-4'}>
                            Setup Bookmarklet
                        </h1>
                    </section>
                </section>
                <section
                    id={'how-to-use'}
                    className={'p-10 border-b border-gray-800'}
                >
                    <h1 className={'text-2xl font-bold mb-4'}>How to Use</h1>
                </section>
            </div>
        </>
    );
}
