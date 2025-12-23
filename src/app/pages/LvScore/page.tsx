'use client';

import { useEffect, useState } from 'react';
import { MaimaiLevelMap } from '@/lib/consts';
import { MaimaiFetchData, MaimaiSongScore } from '@/lib/types';
import { useSession } from 'next-auth/react';

export default function LvScore() {
    const { data: session, status } = useSession();

    const [level, setLevel] = useState('');
    const [songs, setSongs] = useState<MaimaiSongScore[]>([]);
    const [clal, setClal] = useState('0');
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            setClal(session!.user!.clal)
        }
    }, [status, session]);

    if (status === 'unauthenticated') {
        return (
            <h3 className={'text-center p-5 text-lg'}>Please log in first.</h3>
        );
    }

    const fetchResultWithClal = async () => {
        try {
            if (status !== 'authenticated') {
                throw new Error('Please log in first');
            }

            if (!session || !session!.user) {
                throw new Error('User session is missing');
            }

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

    songs.sort(
        (a, b) =>
            parseFloat(b.score.replace('%', '')) -
            parseFloat(a.score.replace('%', ''))
    );

    return (
        <>
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
                                <tr className={`hover:bg-base-300 ${song.diff}`} key={i}>
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
