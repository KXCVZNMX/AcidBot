'use client';

import React, {useEffect, useRef, useState} from 'react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(false); // false = dark, true = light

    const toggleTheme = () => {
        const newTheme = !theme;
        setTheme(newTheme);
        document.documentElement.setAttribute(
            'data-theme',
            newTheme ? 'light' : 'dark'
        );
    };

    return (
        <button className="btn btn-ghost" onClick={toggleTheme}>
            change this to svg
        </button>
    );
};

export default function NavBar() {
    const [openId, setOpenId] = useState<string | null>(null);
    const navRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onPointerDown = (e: PointerEvent) => {
            if (!navRef.current) return;
            if (!navRef.current.contains(e.target as Node)) {
                setOpenId(null);
            }
        };

        document.addEventListener('pointerdown', onPointerDown);
        return () => document.removeEventListener('pointerdown', onPointerDown);
    }, []);

    const toggle = (id: string) => setOpenId(prev => (prev === id ? null : id));

    return (
        <div ref={navRef} className={'navbar bg-base-50 shadow-lg'}>
            <div className={'flex-1'}>
                <a className={'btn btn-ghost text-xl'} href={'/'}>
                    b50Bot
                </a>

                <ul className={'menu menu-horizontal px-1'}>
                    <li>
                        <details
                            className={'flex dropdown dropdown-center items-center rounded-lg px-3 py-2'}
                            open={openId === 'games'}
                        >
                            <summary
                                className={'cursor-pointer'}
                                onClick={(e) => { e.preventDefault(); toggle('games'); }}
                            >
                                Games
                            </summary>

                            <ul className={'dropdown-content menu menu-vertical bg-base-100 rounded-t-none p-2 w-40'}>
                                <li>
                                    <a className={'btn btn-ghost border-gray-500'} href={'/pages/maimaidx/rating'}>
                                        maimai DX
                                    </a>
                                </li>
                            </ul>
                        </details>
                    </li>

                    <li>
                        <details
                            className={'flex dropdown dropdown-center items-center rounded-lg px-3 py-2'}
                            open={openId === 'skill'}
                        >
                            <summary
                                className={'cursor-pointer'}
                                onClick={(e) => { e.preventDefault(); toggle('skill'); }}
                            >
                                Skill Check
                            </summary>

                            <ul className={'dropdown-content menu menu-vertical bg-base-100 rounded-t-none p-2 w-40'}>
                                <li>
                                    <a className={'btn btn-ghost border-gray-500'} href={'/pages/maimaidx/analyseSkill'}>
                                        maimai DX
                                    </a>
                                </li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>

            <div className={'flex-none'}>
                <ThemeToggle />
            </div>
        </div>
    );
}
