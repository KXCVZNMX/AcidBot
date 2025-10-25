'use client';

import { useState } from 'react';
import Image from 'next/image';
import AcidP from '../../public/acid.png';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
    const [open, setOpen] = useState(true);

    const sections = [
        { name: 'Introduction', href: '#introduction' },
        {
            name: 'Setup',
            href: '#setup',
            sub: [
                { name: 'Install', href: '#install' },
                { name: 'Configuration', href: '#config' },
            ],
        },
        { name: 'How to Use', href: '#how-to-use' },
        { name: 'Examples', href: '#examples' },
        { name: 'FAQ', href: '#faq' },
        { name: 'Credits', href: '#credits' },
    ];

    return (
        <>
            <div className={'flex h-screen overflow-hidden'}>
                <div
                    className={`flex flex-col bg-gray-900 text-white transition-all duration-300 ${
                        open ? 'w-64' : 'w-16'
                    }`}
                >
                    <button
                        onClick={() => setOpen(!open)}
                        className={'p-4 hover:bg-gray-800 focus:outline-none'}
                    >
                        {open ? <X /> : <Menu />}
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

                <div
                    className={
                        'flex-1 flex items-center justify-center opacity-70'
                    }
                >
                    <Image src={AcidP} alt={'acid'} height={900} width={900} />
                </div>
            </div>
        </>
    );
}
