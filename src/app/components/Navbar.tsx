'use client';

import React, { useState } from 'react';

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
    return (
        <div className={'navbar bg-base-50 shadow-lg'}>
            <div className={'flex-1'}>
                <a className={'btn btn-ghost text-xl'} href={'/'}>
                    b50Bot
                </a>

                <ul className={'menu menu-horizontal px-1'}>
                    <li>
                        <details
                            className={
                                'flex dropdown dropdown-center items-center rounded-lg px-3 py-2'
                            }
                        >
                            <summary>Games</summary>
                            <ul
                                className={
                                    'dropdown-content menu menu-vertical bg-base-100 rounded-t-none p-2 w-40'
                                }
                            >
                                <li key={'maimaidx DX'}>
                                    <a
                                        className={
                                            'btn btn-ghost border-gray-500'
                                        }
                                        href={'/pages/maimaidx'}
                                    >
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
