'use client';

import { loginGithub, loginGoogle } from '@/app/components/loginHelper';
import GoogleIcon from '../../../public/google-icon-logo-svgrepo.svg';
import GithubIcon from '../../../public/GitHub_Invertocat_Black.svg';
import Image from 'next/image';

export function LoginGithub() {
    return (
        <button
            type={'button'}
            onClick={loginGithub}
            className={
                'bg-base-300 btn w-full hover:invert transition-[filter] duration-300 border-[#dddddd] border-[1.5]'
            }
        >
            <Image
                src={GithubIcon}
                alt={'google icon'}
                width={25}
                height={25}
                className={'inline'}
            />
            <p className={'pl-1.5'}>Login with Github</p>
        </button>
    );
}

export function LoginGoogle() {
    return (
        <button
            type={'button'}
            onClick={loginGoogle}
            className={
                'bg-base-300 btn w-full hover:invert transition-[filter] duration-300 border-[#dddddd] border-[1.5]'
            }
        >
            <Image
                src={GoogleIcon}
                alt={'google icon'}
                width={25}
                height={25}
                className={'inline'}
            />
            Login with Google
        </button>
    );
}
