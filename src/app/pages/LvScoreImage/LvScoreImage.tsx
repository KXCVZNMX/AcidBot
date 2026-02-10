'use client';

import {MaimaiFetchData, MSSB50} from "@/lib/types";
import {useEffect, useState} from "react";
import ErrorModal from "@/app/components/ErrorModal";
import {getCookie} from "@/lib/util";
import {MaimaiLevelMap} from "@/lib/consts";

export default function LvScoreImage() {
    const [level, setLevel] = useState('');
    const [songs, setSongs] = useState<MSSB50[]>([]);
    const [clal, setClal] = useState('');
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

        if (clalCookie) {
            setClal(clalCookie);
        }
    }, []);

    const fetchResultWithClal = async () => {
        try {
            const config: MaimaiFetchData = {
                clal: clal,
                redirect: `https://maimaidx-eng.com/maimai-mobile/record/musicLevel/search/?level=${level}`,
            };

            const res = await fetch('/api/getLevel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });

            if (!res.ok) {
                const { error } = await res.json();
                showError(error);
                return;
            }

            const songRes: MSSB50[] = await res.json();
            setSongs(songRes);
            console.log(songs);
        } catch (error) {
            showError((error as Error).message);
            console.error(error);
        }
    };

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />
            <div className={'flex justify-center'}>
                <form className={'text-center p-3 shadow-lg'}>
                    <select
                        name={'level'}
                        className={'w-30 text-center'}
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        {Array.from({ length: 23 }, (_, i) => (
                            <option key={i} value={i + 1}>
                                LEVEL {MaimaiLevelMap[i + 1]}
                            </option>
                        ))}
                    </select>
                </form>

                <button
                    onClick={fetchResultWithClal}
                    className={'btn btn-primary'}
                >
                    Submit
                </button>
            </div>
        </>
    )
}