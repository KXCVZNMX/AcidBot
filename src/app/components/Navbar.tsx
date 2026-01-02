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
                        className={'btn btn-ghost text-lg pl-5 pr-5'}
                        href={'/'}
                    >
                        AcidBot
                    </Link>
                </div>

                {status === 'unauthenticated' ? (
                    <>
                        <div className={'flex-1 hidden md:flex'} />
                        <div
                            className={'btn p-5 hidden md:flex'}
                            onClick={() => setShowLoginModal(true)}
                        >
                            Login
                        </div>
                    </>
                ) : (
                    <>
                        <div className={'flex-1 p-3 hidden md:flex'}>
                            <Link
                                className={'btn btn-ghost text-lg'}
                                href={'/pages/Guide'}
                            >
                                Guide
                            </Link>
                            <Link
                                className={'btn btn-ghost text-lg'}
                                href={'/pages/LvScore'}
                            >
                                LvScore
                            </Link>

                            <Link
                                className={'btn btn-ghost text-lg'}
                                href={'/pages/Best50'}
                            >
                                Best50
                            </Link>

                            <Link
                                className={'btn btn-ghost text-lg'}
                                href={'/pages/SkillRadar'}
                            >
                                Skill Radar
                            </Link>
                        </div>

                        <div
                            className={'hidden md:flex p-5 items-center gap-2 '}
                        >
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
