'use client';

import { useEffect, useMemo, useState } from 'react';
import { MaimaiLevelMap } from '@/lib/consts';
import { MaimaiFetchData, MSSB50 } from '@/lib/types';
import { getCookie } from '@/lib/util';
import ErrorModal from '@/app/components/ErrorModal';
import Link from 'next/link';
import B50Card from '@/app/components/B50Card';

export default function LvScore() {
    const [level, setLevel] = useState('1');
    const [songs, setSongs] = useState<MSSB50[]>([]);
    const [clal, setClal] = useState('');
    const [generating, setGenerating] = useState(false);
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
    }, []);

    const fetchResultWithClal = async () => {
        if (!clal) {
            showError('Missing Clal, please fetch a new clal from the guide page');
            return;
        }

        setGenerating(true);
        setSongs([]);

        try {
            const config: MaimaiFetchData = {
                clal,
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
        } catch (error) {
            showError((error as Error).message);
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    const sortedSongs = useMemo(
        () =>
            [...songs].sort(
                (a, b) =>
                    parseFloat(b.score.replace('%', '')) -
                    parseFloat(a.score.replace('%', ''))
            ),
        [songs]
    );

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />
            <div className={'flex flex-col items-center gap-6 p-6 max-w-450 mx-auto'}>
                <div className={'flex flex-col items-center gap-4'}>
                    <form className={'text-center p-3 shadow-lg rounded-box bg-base-100'}>
                        <select
                            name={'level'}
                            className={'select select-bordered w-48 text-center'}
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                        >
                            {Array.from({ length: 23 }, (_, i) => (
                                <option key={i} value={i + 1}>
                                    LEVEL {MaimaiLevelMap[i + 1]}
                                </option>
                            ))}
                        </select>
                    </form>

                    <div className={'flex flex-wrap gap-3 justify-center'}>
                        <button
                            onClick={fetchResultWithClal}
                            className={'btn btn-primary min-w-35'}
                            disabled={generating}
                        >
                            {generating ? (
                                <span className="flex items-center gap-2">
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Generating...
                                </span>
                            ) : (
                                'Generate LvScore'
                            )}
                        </button>

                        <Link
                            href={'/pages/LvScoreImage'}
                            className={`btn btn-accent min-w-35 ${sortedSongs.length === 0 ? 'pointer-events-none btn-disabled' : ''}`}
                            aria-disabled={sortedSongs.length === 0}
                        >
                            Get Image
                        </Link>
                    </div>
                </div>

                {sortedSongs.length > 0 ? (
                    <div className={'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full place-items-center'}>
                        {sortedSongs.map((song, i) => (
                            <div key={`${song.name}-${song.diff}-${i}`} className={'relative'}>
                                <div className="absolute -top-2 -left-2 bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10 shadow-lg">
                                    {i + 1}
                                </div>
                                <B50Card info={song} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={'text-center py-12 text-gray-500'}>
                        <p className={'text-lg'}>
                            No songs available. Generate LvScore to see results.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
