'use client';

import { useEffect, useState } from 'react';
import { MaimaiLevelMap } from '@/lib/consts';
import { MaimaiFetchData, MaimaiSongScore } from '@/lib/types';
import { getCookie } from '@/lib/util';
import ErrorModal from '@/app/components/ErrorModal';
import Link from 'next/link';

export default function LvScore() {
    const [level, setLevel] = useState('');
    const [songs, setSongs] = useState<MaimaiSongScore[]>([]);
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

            const songRes: MaimaiSongScore[] = await res.json();
            setSongs(songRes);
        } catch (error) {
            showError((error as Error).message);
            console.error(error);
        }
    };

    songs.sort(
        (a, b) =>
            parseFloat(b.score.replace('%', '')) -
            parseFloat(a.score.replace('%', ''))
    );

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />
            <div className={'flex flex-col justify-center shadow-lg'}>
                <div
                    className={
                        'flex flex-col justify-center shadow-lg items-center'
                    }
                >
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

                    <div className={'flex flex-row justify-center'}>
                        <button
                            onClick={fetchResultWithClal}
                            className={'btn btn-primary'}
                        >
                            Submit
                        </button>

                        <Link
                            href={'/pages/LvScoreImage'}
                            className={'btn btn-secondary'}
                        >
                            Get Image
                        </Link>
                    </div>
                </div>

                <div className={'overflow-x-auto'}>
                    <table className={'table min-w-[900px]'}>
                        <colgroup>
                            <col className={'w-[10%]'} />
                            <col className={'w-[30%]'} />
                            <col className={'w-[10%]'} />
                            <col className={'w-[10%]'} />
                            <col className={'w-[10%]'} />
                            <col className={'w-[10%]'} />
                            <col className={'w-[10%]'} />
                            <col className={'w-[10%]'} />
                        </colgroup>

                        <thead>
                            <tr key={'header'}>
                                <th />
                                <th>Song Title</th>
                                <th>Rank</th>
                                <th>Score</th>
                                <th>Type</th>
                                <th>DX Score</th>
                                <th>Combo</th>
                                <th>Sync</th>
                            </tr>
                        </thead>
                        <tbody>
                            {songs.map((song, i) => (
                                <tr
                                    className={`hover:bg-base-300 bg-${song.diff}`}
                                    key={i}
                                >
                                    <th>{i + 1}</th>
                                    <td>{song.name}</td>
                                    <td>{song.rank}</td>
                                    <td>{song.score}</td>
                                    <td>{song.isDx}</td>
                                    <td>{song.dx}</td>
                                    <td>{song.combo}</td>
                                    <td>{song.sync}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
