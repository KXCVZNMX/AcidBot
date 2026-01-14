'use client';

import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import DefaultAvatar from '../../../public/225-default-avatar.svg';
import Icon from '../favicon.ico';
import Image from 'next/image';
import HamburgerDrawer from '@/app/components/HamburgerDrawer';
import LoginModal from '@/app/components/LoginModal';
import Link from 'next/link';

export default function Navbar() {
    const { data: session, status } = useSession();

    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        document.cookie = `status=${status}`;
    });

    return (
        <>
            <LoginModal
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
            />
            <div className={'navbar backdrop-blur-sm shadow-lg'}>
                <div className={'p-3'}>
                    <Link href={'/'}>
                        <Image
                            src={Icon}
                            alt={'logo'}
                            width={40}
                            height={40}
                            priority
                        />
                    </Link>
                </div>

                {status === 'unauthenticated' ? (
                    <>
                        <div className={'flex-1 hidden md:flex'}>
                            <Link
                                className={'btn btn-ghost text-lg rounded-2xl'}
                                href={'/pages/Guides'}
                            >
                                Guides
                            </Link>
                        </div>

                        <div
                            className={'btn hidden md:flex rounded-2xl'}
                            onClick={() => setShowLoginModal(true)}
                        >
                            Login
                        </div>
                    </>
                ) : (
                    <>
                        <div className={'flex-1 hidden md:flex'}>
                            <Link
                                className={'btn btn-ghost text-lg rounded-2xl'}
                                href={'/pages/Guides'}
                            >
                                Guides
                            </Link>
                            <Link
                                className={'btn btn-ghost text-lg rounded-2xl'}
                                href={'/pages/LvScore'}
                            >
                                LvScore
                            </Link>

                            <Link
                                className={'btn btn-ghost text-lg rounded-2xl'}
                                href={'/pages/Best50'}
                            >
                                Best50
                            </Link>

                            <Link
                                className={'btn btn-ghost text-lg rounded-2xl'}
                                href={'/pages/SkillRadar'}
                            >
                                Skill Radar
                            </Link>
                        </div>

                        <div className={'hidden md:flex items-center gap-2'}>
                            <div className={'dropdown dropdown-end'}>
                                <label
                                    tabIndex={0}
                                    className={
                                        'btn btn-ghost btn-circle avatar p-0'
                                    }
                                >
                                    <div
                                        className={
                                            'w-8 h-8 rounded-full overflow-hidden'
                                        }
                                    >
                                        <Image
                                            src={
                                                session?.user?.image ??
                                                DefaultAvatar
                                            }
                                            alt={'user profile picture'}
                                            width={30}
                                            height={30}
                                            className={'rounded-full'}
                                        />
                                    </div>
                                </label>

                                <ul
                                    tabIndex={0}
                                    className={
                                        'dropdown-content menu p-2 shadow bg-base-300 rounded-box w-48'
                                    }
                                    role={'menu'}
                                    aria-label={'User menu'}
                                >
                                    <li>
                                        <Link
                                            href={'/pages/UserProfile'}
                                            role={'menuitem'}
                                        >
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={'/pages/UserSettings'}
                                            role={'menuitem'}
                                        >
                                            Settings
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() =>
                                                signOut({ redirectTo: '/' })
                                            }
                                            aria-label={'Logout'}
                                            title={'Logout'}
                                            role={'menuitem'}
                                            className={'text-red-500'}
                                        >
                                            Sign out
                                        </button>
                                    </li>
                                </ul>
                            </div>

                            <h3 className={'text-md font-semibold'}>
                                {session?.user?.name}
                            </h3>
                        </div>
                    </>
                )}
            </div>

            <HamburgerDrawer />
        </>
    );
}
