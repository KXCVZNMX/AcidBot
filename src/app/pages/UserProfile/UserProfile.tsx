'use client';

import Image from "next/image";
import DefaultUserIcon from '../../../../public/225-default-avatar.svg'
import {Best50Songs, MSSB50} from "@/lib/types";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {getCookie} from "@/lib/util";
import ErrorModal from "@/app/components/ErrorModal";
import B50Table from "@/app/components/B50Table";

export default function UserProfile() {
    const [oldSong, setOldSong] = useState<MSSB50[]>([]);
    const [newSong, setNewSong] = useState<MSSB50[]>([]);
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const showError = (errorMessage: string) => {
        setError(errorMessage);
        setShowErrorModal(true);

        setTimeout(() => {
            setShowErrorModal(false);
            setError('');
        }, 2000);
    };

    const { data: session } = useSession();

    useEffect(() => {
        if (!getCookie('clal')) {
            showError(
                'Missing Clal, please go to the guide page to fetch a new clal'
            );
            return;
        }

        (async () => {
            try {
                const res = await fetch('/api/fetchOldB50', {
                    method: 'GET',
                });

                if (!res.ok) {
                    throw new Error(res.statusText);
                }

                const b50: Best50Songs = await res.json();
                setOldSong(b50.b35);
                setNewSong(b50.b15);
            } catch (error) {
                setError((error as Error).message);
                console.error(error);
            }
        })();
    }, []);

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />

            <div className={'flex items-center justify-center'}>
                <div className={'p-3 w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-2 gap-3'}>
                    <div className={'col-span-1 md:col-span-2'}>
                        <div className={'card bg-base-200 z-[-10]'}>
                            <div className={'card-body'}>
                                <div className={'flex flex-col md:flex-row gap-5 items-center md:items-start'}>
                                    <Image
                                        src={session?.user?.image ?? DefaultUserIcon}
                                        alt={'user icon'}
                                        width={130}
                                        height={130}
                                        className={'rounded-full'}
                                    />
                                    <div className={'flex flex-col'}>
                                        <div className={'card-title pl-6'}>
                                            <h2 className={'text-3xl font-bold'}>
                                                {session?.user?.name}
                                            </h2>
                                        </div>
                                        <div className={'card-body'}>
                                            <h3 className={'text-lg'}>
                                                <p>Created on: {session?.user?.createdAt.toString().split('T')[0]}</p>
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={'col-span-1'}>
                        <div className={'card bg-base-200'}>
                            <div className={'card-body max-h-[540px]'}>
                                <div className={'overflow-x-auto overflow-y-auto'}>
                                    <B50Table oldSong={oldSong} newSong={newSong} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
