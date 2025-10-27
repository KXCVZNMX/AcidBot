'use client';

import Image from 'next/image';
import loginP from '../../public/home/mdxn_login.png';
import landingP from '../../public/home/mdxn_landing.png';
import bookmarkP from '../../public/home/bookmark_page.png';
import bookmarkP1P from '../../public/home/bookmark_phone1.jpg';
import bookmarkP2P from '../../public/home/bookmark_phone2.jpg';
import bookmarkPCP1P from '../../public/home/bookmark_edit_pc1.png';
import bookmarkPCP2P from '../../public/home/bookmark_edit_pc2.png';

export default function Home() {
    const writeBookmarklet = async () => {
        const res = await fetch('/api/maimai/getBookmarklet', {
            method: 'GET',
        });
        const bookmarklet: { bookmarklet: string } = await res.json();
        try {
            await navigator.clipboard.writeText(bookmarklet.bookmarklet);
        } catch (e) {
            console.error(e);
        }
    };

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
                        <button
                            onClick={writeBookmarklet}
                            className={'btn hover:bg-gray-800'}
                        >
                            Copy to clipboard
                        </button>
                        <p className={'pt-2'}>
                            Bookmark this page, and go to edit the URL on your
                            page, to the copied function.
                        </p>

                        <p className={'font-bold text-lg pt-2'}>PC:</p>

                        <div
                            className={'flex flex-col gap-5 object-contain p-2'}
                        >
                            <Image
                                src={bookmarkP}
                                alt={'how to bookmark'}
                                width={3018 / 4}
                                height={1814 / 4}
                                className={'shadow-2xl'}
                            />
                        </div>

                        <div
                            className={
                                'flex flex-col sm:flex-row gap-5 object-contain p-2'
                            }
                        >
                            <Image
                                src={bookmarkPCP1P}
                                alt={'bookmark on pc 1'}
                                width={2200 / 4}
                                height={1980 / 4}
                            />
                            <Image
                                src={bookmarkPCP2P}
                                alt={'bookmark on pc 2'}
                                width={1179 / 4}
                                height={1980 / 4}
                            />
                        </div>

                        <p className={'font-bold text-lg'}>Mobile:</p>

                        <div
                            className={
                                'flex flex-col sm:flex-row gap-5 object-contain p-2'
                            }
                        >
                            <Image
                                src={bookmarkP1P}
                                alt={'bookmark on phone 1'}
                                width={1500 / 4}
                                height={1980 / 4}
                            />
                            <Image
                                src={bookmarkP2P}
                                alt={'bookmark on phone 2'}
                                width={1179 / 4}
                                height={1980 / 4}
                            />
                        </div>
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
