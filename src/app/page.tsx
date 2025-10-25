'use client';

import { useState } from 'react';
import Image from 'next/image';
import AcidP from '../../public/home/acid.png';
import loginP from '../../public/home/mdxn_login.png'
import landingP from '../../public/home/mdxn_landing.png';
import { Menu } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    const [open, setOpen] = useState(false);

    const sections = [
        {
            name: 'Setup',
            href: '#setup',
            sub: [
                { name: 'Login', href: '#login' },
                { name: 'Setup Bookmarklet', href: '#bookmarklet' },
            ],
        },
        { name: 'How to Use', href: '#how-to-use' },
    ];

    return (
        <>
            <div className={'flex h-screen overflow-hidden'}>
                <div
                    className={`group relative flex flex-col bg-gray-900 text-white transition-all duration-400 ${
                        open ? 'w-64' : 'w-16'
                    }`}
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                >
                    <button
                        className={'p-4 focus:outline-none'}
                    >
                        <Menu />
                    </button>

                    <nav
                        className={`flex-1 overflow-y-auto ${open ? 'px-4' : 'px-0'}`}
                    >
                        <ul className={'space-y-3 mt-4'}>
                            {sections.map(({ name, href, sub }) => (
                                <li key={name}>
                                    <Link
                                        href={href}
                                        className={
                                            'block cursor-pointer rounded-md hover:bg-gray-800 p-2 text-sm'
                                        }
                                    >
                                        {open ? name : name[0]}
                                    </Link>

                                    {sub && open && (
                                        <ul
                                            className={
                                                'ml-4 mt-1 space-y-1 border-l border-gray-700 pl-3'
                                            }
                                        >
                                            {sub.map(({ name, href }) => (
                                                <li key={name}>
                                                    <Link
                                                        href={href}
                                                        className={
                                                            'block text-gray-300 hover:text-white text-sm hover:bg-gray-800 p-1 rounded'
                                                        }
                                                    >
                                                        {name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className={'flex-1 overflow-y-auto scroll-smooth'}>
                    <div
                        className={
                            'min-h-screen flex-1 flex items-center justify-center opacity-70'
                        }
                    >
                        <Image src={AcidP} alt={'acid'} height={900} width={900} />
                    </div>

                    <section id={'login'} className={'p-10 border-b border-gray-800'}>
                        <h1 className={'text-3xl font-bold mb-4'}>
                            Login
                        </h1>
                        <div className={'text-md'}>
                            <p className={'pb-3'}>
                                Log into your <a href={'https://maimaidx-eng.com/'} className={'text-blue-300 underline'}>maimai DX Net</a> normally
                            </p>
                            <div className={'flex flex-row gap-5'}>
                                <Image src={loginP} alt={'maimai dx net login page'} height={450} width={400} />
                                <Image src={landingP} alt={'maimai dx net landing page'} height={450} width={240} />
                            </div>

                        </div>
                    </section>

                    <section id={'bookmarklet'} className={'p-10 border-b border-gray-800'}>
                        <h1 className={'text-3xl font-bold mb-4'}>
                            Setup Bookmarklet
                        </h1>
                    </section>

                    <section id={'how-to-use'} className={'p-10 border-b border-gray-800'}>
                        <h1 className={'text-3xl font-bold mb-4'}>
                            How to Use
                        </h1>
                    </section>
                </div>
            </div>
        </>
    );
}
