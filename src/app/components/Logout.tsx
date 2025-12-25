import { signOut } from 'next-auth/react';

export default () => (
    <button onClick={() => signOut({ redirectTo: '/' })} className={'btn'}>
        Sign out
    </button>
);
