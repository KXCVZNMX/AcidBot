'use client';

import { authClient } from '@/lib/auth-client';

export const loginGithub = async () => {
    await authClient.signIn.social({ provider: 'github', callbackURL: '/' });
};

export const loginGoogle = async () => {
    await authClient.signIn.social({ provider: 'google', callbackURL: '/' });
};
