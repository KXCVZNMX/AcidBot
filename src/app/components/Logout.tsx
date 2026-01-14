import { signOut } from 'next-auth/react';
import LogoutIcon from '../../../public/logout-svg-svgrepo.svg';
import Image from "next/image";

export default () => (
    <button
        onClick={() =>
            signOut({ redirectTo: '/' })
        }
        aria-label={'Logout'}
        title={'Logout'}
        className={
            'p-2 rounded hover:bg-base-200 transition-colors'
        }
    >
        <Image
            src={LogoutIcon}
            alt={'logout icon'}
            width={20}
            height={20}
        />
    </button>
);
