'use client';

import { LoginGithub, LoginGoogle } from '@/app/components/Login';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Logout from '@/app/components/Logout';
import DefaultAvatar from '../../../public/225-default-avatar.svg';
import Image from 'next/image';

export default function Navbar() {
    const { data: session, status } = useSession();

    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        document.cookie = `status=${status}`;
    });

    return (
        <>
            <div className={`modal ${showLoginModal ? 'modal-open' : ''}`}>
                <div className={'modal-box'}>
                    <div className={'relative mb-4'}>
                        <h3 className={'text-lg font-bold text-center'}>
                            Login
                        </h3>

                        <button
                            className={
                                'btn btn-sm absolute right-0 top-1/2 -translate-y-1/2 m-0'
                            }
                            onClick={() => setShowLoginModal(false)}
                        >
                            Close
                        </button>
                    </div>

                    <div className={'flex flex-col w-full gap-3'}>
                        <LoginGoogle />
                        <LoginGithub />
                    </div>
                </div>
            </div>

            <div className={'navbar backdrop-blur-sm shadow-lg'}>
                <div className={'p-3'}>
                    <a className={'btn btn-ghost text-lg pl-5 pr-5'} href={'/'}>
                        AcidBot
                    </a>
                </div>

                {status === 'unauthenticated' ? (
                    <>
                        <div className={'flex-1'} />
                        <div
                            className={'btn p-5'}
                            onClick={() => setShowLoginModal(true)}
                        >
                            Login
                        </div>
                    </>
                ) : (
                    <>
                        <div className={'flex-1 p-3'}>
                            <a
                                className={'btn btn-ghost text-lg'}
                                href={'/pages/Guide'}
                            >
                                Guide
                            </a>
                            <a
                                className={'btn btn-ghost text-lg'}
                                href={'/pages/LvScore'}
                            >
                                LvScore
                            </a>

                            <a
                                className={'btn btn-ghost text-lg'}
                                href={'/pages/Best50'}
                            >
                                Best50
                            </a>

                            <a
                                className={'btn btn-ghost text-lg'}
                                href={'/pages/SkillRadar'}
                            >
                                Skill Radar
                            </a>
                        </div>

                        <div className={'flex p-5 items-center gap-2'}>
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
        </>
    );
}
