'use client';

import {useState} from 'react';
import {signOut, useSession} from 'next-auth/react';
import DefaultAvatar from '../../../public/225-default-avatar.svg';
import Icon from '@/app/favicon.ico';
import Image from 'next/image';
import HamburgerDrawer from '@/components/layout/HamburgerDrawer';
import LoginModal from '@/components/auth/LoginModal';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

export default function Navbar() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.replace('/');
        router.refresh();
    };

    return (
        <>
            <LoginModal showLoginModal={showLoginModal} setShowLoginModal={setShowLoginModal} />
            <nav className={'navbar backdrop-blur-sm shadow-lg fixed top-0 z-50'}>
                <div className={'p-3'}>
                    <Link href={'/'}>
                        <Image src={Icon} alt={'logo'} width={40} height={40} priority />
                    </Link>
                </div>

                {status === 'unauthenticated' ? (
                    <>
                        <div className={'flex-1 hidden md:flex'}>
                            <Link
                                className={'btn btn-ghost text-lg rounded-2xl'}
                                href={'/pages/guides'}
                                prefetch={false}
                            >
                                Guides
                            </Link>
                            <Link
                                className={'btn btn-ghost text-lg rounded-2xl'}
                                href={'/pages/lv-score'}
                                prefetch={false}
                            >
                                LvScore
                            </Link>

                            <Link className={'btn btn-ghost text-lg rounded-2xl'} href={'/pages/b50'} prefetch={false}>
                                Best50
                            </Link>

                            <Link
                                className={'btn btn-ghost text-lg rounded-2xl'}
                                href={'/pages/skill-radar'}
                                prefetch={false}
                            >
                                Skill Radar
                            </Link>
                        </div>

                        <div className={'btn hidden md:flex rounded-2xl'} onClick={() => setShowLoginModal(true)}>
                            Login
                        </div>
                    </>
                ) : (
                    <>
                        <div className={'flex-1 hidden md:flex'}>
                            <Link
                                className={'btn btn-ghost text-lg rounded-2xl'}
                                href={'/pages/guides'}
                                prefetch={false}
                            >
                                Guides
                            </Link>
                            <Link
                                className={'btn btn-ghost text-lg rounded-2xl'}
                                href={'/pages/lv-score'}
                                prefetch={false}
                            >
                                LvScore
                            </Link>

                            <Link className={'btn btn-ghost text-lg rounded-2xl'} href={'/pages/b50'} prefetch={false}>
                                Best50
                            </Link>

                            <Link
                                className={'btn btn-ghost text-lg rounded-2xl'}
                                href={'/pages/skill-radar'}
                                prefetch={false}
                            >
                                Skill Radar
                            </Link>
                        </div>

                        <div className={'hidden md:flex items-center gap-2'}>
                            <div className={'dropdown dropdown-end'}>
                                <label tabIndex={0} className={'btn btn-ghost btn-circle avatar p-0'}>
                                    <div className={'w-8 h-8 rounded-full overflow-hidden'}>
                                        <Image
                                            src={session?.user?.image ?? DefaultAvatar}
                                            alt={'profile profile picture'}
                                            width={30}
                                            height={30}
                                            className={'rounded-full'}
                                        />
                                    </div>
                                </label>

                                <ul
                                    tabIndex={0}
                                    className={'dropdown-content menu p-2 shadow bg-base-300 rounded-box w-48'}
                                    role={'menu'}
                                    aria-label={'User menu'}
                                >
                                    <li>
                                        <Link href={'/pages/user-profile'} role={'menuitem'} prefetch={false}>
                                            Profile
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            onClick={handleSignOut}
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

                            <h3 className={'text-md font-semibold pr-3'}>{session?.user?.name}</h3>
                        </div>
                    </>
                )}
            </nav>

            <HamburgerDrawer />
        </>
    );
}
