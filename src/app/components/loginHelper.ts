'use server';

import { signIn } from '@/auth';

export const loginGithub = async () => {
    await signIn('github');
};

export const loginGoogle = async () => {
    await signIn('google');
};
