'use client';

import {useEffect, useState} from 'react';
import { MaimaiLevelMap } from '@/lib/consts';
import { MaimaiFetchData, MaimaiSongScore } from '@/lib/types';
import {useSession} from "next-auth/react";

export default function LvScore() {
    const {data: session, status} = useSession();

    const [level, setLevel] = useState('');
    const [songs, setSongs] = useState<MaimaiSongScore[]>([]);
    const [showClalModal, setShowClalModal] = useState(true);
    const [clal, setClal] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.clal === '0') {
            setShowClalModal(true);
        }
    }, [status, session]);

    if (status === 'unauthenticated') {
        return (
            <h3 className={'text-center p-5 text-lg'}>
                Please log in first.
            </h3>
        )
    }

    const fetchResultWithClal = async () => {
        try {
            if (status !== 'authenticated') {
                throw new Error('Please log in first');
            }

            if (!session || !session!.user) {
                throw new Error('User session is missing');
            }

            if (session!.user!.clal!.length !== 64) {
                throw new Error('The length of clal has to be 64');
            }

            const config: MaimaiFetchData = {
                clal: session!.user!.clal!,
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
                throw new Error(res.statusText);
            }

            const songRes: MaimaiSongScore[] = await res.json();
            setSongs(songRes);
            console.log(songs);
        } catch (error) {
            setError((error as Error).message);
            console.error(error);
        }
    };

    const setUserClal = async () => {
        try {
            if (status !== 'authenticated') {
                throw new Error('Please log in first');
            }

            if (!session || !session!.user) {
                throw new Error('User session is missing');
            }

            if (session!.user!.clal!.length !== 64) {
                throw new Error('The length of clal has to be 64');
            }

            const res = await fetch(`/api/setUserClal?id=${session!.user!.id!}&clal=${clal}`, {
                method: 'POST'
            });

            if (!res.ok) {
                throw new Error('Failed to set clal, try again later');
            }
        } catch (error) {
            setError((error as Error).message);
            console.error(error);
        }
    }

    songs.sort(
        (a, b) =>
            parseFloat(b.score.replace('%', '')) -
            parseFloat(a.score.replace('%', ''))
    );

    return (
        <>
            <div className={`modal ${showClalModal ? 'modal-open' : ''}`}>
                <div className={'modal-box'}>
                    <div className={'relative mb-4'}>
                        <h3 className={'text-lg font-bold text-center'}>
                            Login
                        </h3>

                        <button
                            className={'btn btn-sm absolute right-0 top-1/2 -translate-y-1/2 m-0'}
                            onClick={() => setShowClalModal(false)}
                        >
                            Close
                        </button>
                    </div>

                    <h3>Enter your clal here</h3>
                    <hr/>
                    <input
                        className={
                            'bg-gray-400 rounded-md text-center text-gray-950'
                        }
                        type={'text'}
                        value={clal}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(v)) {
                                setClal(v);
                            }
                        }}
                    />

                    <button
                        onClick={async () => {
                            setShowClalModal(false);
                            await setUserClal()
                        }}
                        className={'btn btn-primary'}
                    >
                        Submit
                    </button>
                </div>
            </div>

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

                    <button
                        onClick={fetchResultWithClal}
                        className={'btn btn-primary'}
                    >
                        Submit
                    </button>
                </div>

                <div className={'overflow-x-auto'}>
                    <table className={'table table-fixed min-w-max'}>
                        <colgroup>
                            <col className={'w-[10%]'} />
                            <col className={'w-[40%]'} />
                            <col className={'w-[10%'} />
                            <col className={'w-[10%'} />
                            <col className={'w-[10%'} />
                            <col className={'w-[10%'} />
                            <col className={'w-[10%'} />
                        </colgroup>

                        <thead>
                            <tr key={'header'}>
                                <th />
                                <th>Song Title</th>
                                <th>Rank</th>
                                <th>Score</th>
                                <th>DX Score</th>
                                <th>Combo</th>
                                <th>Sync</th>
                            </tr>
                        </thead>
                        <tbody>
                            {songs.map((song, i) => (
                                <tr className={'hover:bg-base-300'} key={i}>
                                    <th>{i + 1}</th>
                                    <td>{song.name}</td>
                                    <td>{song.rank}</td>
                                    <td>{song.score}</td>
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
