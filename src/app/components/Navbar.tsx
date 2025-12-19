'use client';

import SignIn from "@/app/components/SignIn";

export default function Navbar() {
    return (
        <div className={'navbar backdrop-blur-sm shadow-lg'}>
            <div className={'flex-1 p-3'}>
                <a className={'btn btn-ghost text-lg pl-5 pr-5'} href={'/'}>
                    AcidBot
                </a>
                <a className={'btn btn-ghost text-lg'} href={'/pages/LvScore'}>
                    LvScore
                </a>
            </div>
            <div className={'flex-0 p-3'}>
                <SignIn />
            </div>
        </div>
    );
}
