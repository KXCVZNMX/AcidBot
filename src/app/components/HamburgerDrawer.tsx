'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import DefaultAvatar from '../../../public/225-default-avatar.svg';
import LogoutIcon from '../../../public/logout-svg-svgrepo.svg';
import { signOut, useSession } from 'next-auth/react';
import LoginModal from '@/app/components/LoginModal';

function HamburgerIcon({ open }: { open: boolean }) {
    return (
        <button
            className={'btn btn-square bg-base-200 shadow-2xl'}
            aria-label={open ? 'Close menu' : 'Open menu'}
        >
            <svg className={'w-6 h-6'} viewBox={'0 0 24 24'} fill={'none'}>
                {open ? (
                    <path
                        d={'M6 6L18 18M6 18L18 6'}
                        stroke={'currentColor'}
                        strokeWidth={'1.5'}
                        strokeLinecap={'round'}
                    />
                ) : (
                    <path
                        d={'M3 6h18M3 12h18M3 18h18'}
                        stroke={'currentColor'}
                        strokeWidth={'1.5'}
                        strokeLinecap={'round'}
                    />
                )}
            </svg>
        </button>
    );
}

export default function HamburgerDrawer() {
    const [open, setOpen] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const { data: session } = useSession();

    return (
        <>
            <LoginModal
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
            />

            <div className={''}>
                <div
                    className={'fixed left-4 bottom-6 z-50 md:hidden'}
                    role={'button'}
                    aria-label={open ? 'Close menu' : 'Open menu'}
                    onClick={() => setOpen((v) => !v)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                            setOpen((v) => !v);
                    }}
                    tabIndex={0}
                >
                    <HamburgerIcon open={open} />
                </div>
            </div>

            <div
                className={
                    open
                        ? 'fixed inset-0 z-40 transition-opacity opacity-100 pointer-events-auto bg-base-200/60 backdrop-blur-sm'
                        : 'fixed inset-0 z-40 transition-opacity opacity-0 pointer-events-none'
                }
                aria-hidden={!open}
                onClick={() => setOpen(false)}
            />

            <aside
                className={
                    open
                        ? 'fixed top-0 left-0 z-50 h-full w-72 max-w-[80%] bg-base-100 shadow-xl transform transition-transform translate-x-0 md:hidden'
                        : 'fixed top-0 left-0 z-50 h-full w-72 max-w-[80%] bg-base-100 shadow-xl transform transition-transform -translate-x-full md:hidden'
                }
                role={'dialog'}
                aria-modal={'true'}
            >
                <div className={''}>
                    <div className={'p-4'}>
                        <div
                            className={'flex items-center justify-between mb-4'}
                        >
                            <h3 className={'text-lg font-semibold'}>Menu</h3>

                            <button
                                className={''}
                                onClick={() => setOpen(false)}
                                aria-label={'Close menu'}
                            >
                                <svg
                                    className={'w-6 h-6'}
                                    viewBox={'0 0 24 24'}
                                    fill={'none'}
                                    aria-hidden
                                >
                                    <path
                                        d={'M6 6L18 18M6 18L18 6'}
                                        stroke={'currentColor'}
                                        strokeWidth={'1.5'}
                                        strokeLinecap={'round'}
                                        strokeLinejoin={'round'}
                                    />
                                </svg>
                            </button>
                        </div>

                        <nav>
                            <ul className={'flex flex-col gap-2'}>
                                <li>
                                    <Link
                                        href={'/'}
                                        className={
                                            'block px-3 py-2 rounded hover:bg-base-200'
                                        }
                                        onClick={() => setOpen(false)}
                                    >
                                        Home
                                    </Link>
                                </li>
                                {session ? (
                                    <>
                                        <li>
                                            <Link
                                                href={'/pages/Guides'}
                                                className={
                                                    'block px-3 py-2 rounded hover:bg-base-200'
                                                }
                                                onClick={() => setOpen(false)}
                                            >
                                                Guide
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/pages/LvScore'}
                                                className={
                                                    'block px-3 py-2 rounded hover:bg-base-200'
                                                }
                                                onClick={() => setOpen(false)}
                                            >
                                                LvScore
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/pages/Best50'}
                                                className={
                                                    'block px-3 py-2 rounded hover:bg-base-200'
                                                }
                                                onClick={() => setOpen(false)}
                                            >
                                                Best50
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href={'/pages/SkillRadar'}
                                                className={
                                                    'block px-3 py-2 rounded hover:bg-base-200'
                                                }
                                                onClick={() => setOpen(false)}
                                            >
                                                Skill Radar
                                            </Link>
                                        </li>
                                    </>
                                ) : null}
                            </ul>

                            <div
                                className={'border-t border-base-200 mt-4 pt-4'}
                            >
                                {session ? (
                                    <div
                                        className={
                                            'flex items-center gap-3 px-3'
                                        }
                                    >
                                        <div
                                            className={
                                                'flex items-center gap-3'
                                            }
                                        >
                                            <Link href={'/pages/UserProfile'} onClick={() => setOpen(false)}>
                                                <Image
                                                    src={
                                                        session.user?.image ??
                                                        DefaultAvatar
                                                    }
                                                    alt={'avatar'}
                                                    width={40}
                                                    height={40}
                                                    className={'rounded-full'}
                                                />
                                            </Link>
                                            <div>
                                                <div
                                                    className={
                                                        'text-sm font-medium'
                                                    }
                                                >
                                                    {session.user?.name ||
                                                        'User'}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    signOut({ redirectTo: '/' })
                                                }
                                                aria-label={'Logout'}
                                                title={'Logout'}
                                                className={
                                                    'p-2 rounded hover:bg-base-200 transition-colors'
                                                }
                                            >
                                                <Image
                                                    src={LogoutIcon}
                                                    alt={'logout icon'}
                                                    width={20}
                                                    height={20}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={'px-3'}>
                                        <div
                                            className={
                                                'inline-block px-3 py-2 btn btn-primary w-full text-center'
                                            }
                                            onClick={() =>
                                                setShowLoginModal(true)
                                            }
                                        >
                                            Login
                                        </div>
                                    </div>
                                )}
                            </div>
                        </nav>
                    </div>
                </div>
            </aside>
        </>
    );
}
