'use client';

import { loginGithub, loginGoogle } from '@/app/components/loginHelper';

export function LoginGithub() {
    return (
        <form action={loginGithub}>
            <button type={'submit'} className={'btn w-full'}>
                Login with Github
            </button>
        </form>
    );
}

// Doesn't work yet
export function LoginGoogle() {
    return (
        <form action={loginGoogle}>
            <button type={'submit'} className={'btn w-full'}>
                Login with Google
            </button>
        </form>
    );
}
