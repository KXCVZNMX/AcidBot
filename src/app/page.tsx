'use client';

import { useSession } from 'next-auth/react';
import ClalModal from "@/app/components/ClalModal";

export default function Home() {
    const { data: session, status } = useSession();

    return (
        <>
            <h1 className={'flex justify-center'}>Site Under Construction</h1>

            {session ? <ClalModal initialState={true} userId={session!.user!.id!} /> : null}
        </>
    );
}
