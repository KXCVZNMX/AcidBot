'use client';

import { useEffect, useState } from 'react';
import {Best50Songs, MSSB50} from '@/lib/types';
import { getCookie } from '@/lib/util';
import ErrorModal from '@/app/components/ErrorModal';
import B50Table from "@/app/components/B50Table";

export default function Best50() {
    const [clal, setClal] = useState('0');
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

    useEffect(() => {
        const clalCookie = getCookie('clal');
        if (!clalCookie) {
            showError(
                'Missing Clal, please go to the guide page to fetch a new clal'
            );
            return;
        }

        setClal(clalCookie);

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

    const fetchB50WithClal = async () => {
        setOldSong([]);
        setNewSong([]);

        try {
            const res = await fetch(`/api/getB50?clal=${clal}`, {
                method: 'GET',
            });

            if (!res.ok) {
                const { error } = await res.json();
                showError(error);
                return;
            }

            const b50: Best50Songs = await res.json();

            setOldSong(b50.b35);
            setNewSong(b50.b15);
        } catch (error) {
            setError((error as Error).message);
            console.error(error);
        }
    };

    const calculateRating = () =>
        [...oldSong, ...newSong].reduce((sum, s) => sum + s.rating, 0);

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />
            <div className={'flex flex-col justify-center shadow-lg'}>
                <div
                    className={
                        'flex flex-col justify-center shadow-lg items-center'
                    }
                >
                    <button
                        onClick={fetchB50WithClal}
                        className={'btn btn-primary'}
                    >
                        Submit
                    </button>
                    <h4 className={'p-3'}>
                        {oldSong.length !== 0 && newSong.length !== 0
                            ? calculateRating()
                            : 0}
                    </h4>
                </div>

                <div className={'overflow-x-auto'}>
                    <B50Table oldSong={oldSong} newSong={newSong} />
                </div>
            </div>
        </>
    );
}
