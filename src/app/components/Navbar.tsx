'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Logout from '@/app/components/Logout';
import DefaultAvatar from '../../../public/225-default-avatar.svg';
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
                    <Link
                        className={'btn btn-ghost text-lg rounded-2xl'}
                        href={'/'}
                    >
                        AcidBot
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
                            <Image
                                src={session?.user?.image ?? DefaultAvatar}
                                alt={'user profile picture'}
                                width={30}
                                height={30}
                                className={'rounded-full'}
                            />
                            <Logout />
                        </div>
                    </>
                )}
            </div>

            <HamburgerDrawer />
        </>
    );
}
