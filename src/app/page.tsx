'use client';

import { useState } from 'react';
import Image from 'next/image';
import AcidP from '../../public/acid.png'
import { Menu, X } from 'lucide-react';


export default function Home() {
    const [open, setOpen] = useState(true);

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

                    <nav className={`flex-1 overflow-y-auto ${open ? 'px-4' : 'px-0'}`}>
                        <ul className={'space-y-3 mt-4'}>
                            {[
                                'Login',
                                'Setup',
                                'How to Use',
                                'Examples',
                                'FAQ',
                                'Credits',
                            ].map((item) => (
                                <li
                                    key={item}
                                    className={'cursor-pointer rounded-md hover:bg-gray-800 p-2 text-sm'}
                                >
                                    {open ? item : item[0]}
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>

                <div className={'flex-1 flex items-center justify-center opacity-70'}>
                    <Image src={AcidP} alt={'acid'} height={900} width={900} />
                </div>
            </div>
        </>
    )
}
