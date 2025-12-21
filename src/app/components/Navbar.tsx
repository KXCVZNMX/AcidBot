'use client';

import { LoginGithub, LoginGoogle } from '@/app/components/Login';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Logout from '@/app/components/Logout';

export default function Navbar() {
    const { data: session, status } = useSession();

    const [showLoginModal, setShowLoginModal] = useState(false);

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
                <div className={'flex-1 p-3'}>
                    <a className={'btn btn-ghost text-lg pl-5 pr-5'} href={'/'}>
                        AcidBot
                    </a>
                    <a
                        className={'btn btn-ghost text-lg'}
                        href={'/pages/LvScore'}
                    >
                        LvScore
                    </a>
                </div>

                {status === 'unauthenticated' ? (
                    <div
                        className={'flex btn p-5'}
                        onClick={() => setShowLoginModal(true)}
                    >
                        Login
                    </div>
                ) : (
                    <div className={'flex p-5 items-center gap-2'}>
                        <span>{`Welcome, ${session?.user?.name}`}</span>
                        <Logout />
                    </div>
                )}
            </div>
        </>
    );
}
