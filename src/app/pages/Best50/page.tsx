'use client';

import { useEffect, useState } from 'react';
import { MSSB50 } from '@/lib/types';
import {getCookie} from "@/lib/util";

interface Best50Songs {
    b35: MSSB50[];
    b15: MSSB50[];
}

export default function Best50() {
    const [clal, setClal] = useState('0');
    const [oldSong, setOldSong] = useState<MSSB50[]>([]);
    const [newSong, setNewSong] = useState<MSSB50[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const clalCookie = getCookie('clal');
        if (clalCookie) {
            setClal(clalCookie);
        }
    }, []);

    const fetchB50WithClal = async () => {
        try {
            const res = await fetch(`/api/getB50?clal=${clal}`, {
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
    };

    return (
        <>
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
                </div>
                <div className={'overflow-x-auto'}>
                    <table className={'table table-fixed min-w-max'}>
                        <colgroup>
                            <col className="w-[5%]" />
                            <col className="w-[20%]" />
                            <col className="w-[10%]" />
                            <col className="w-[10%]" />
                            <col className="w-[10%]" />
                            <col className="w-[10%]" />
                            <col className="w-[5%]" />
                            <col className="w-[10%]" />
                            <col className="w-[10%]" />
                            <col className="w-[10%]" />
                        </colgroup>

                        <thead>
                            <tr key={'header'}>
                                <th />
                                <th>Song Title</th>
                                <th>Level</th>
                                <th>Rank</th>
                                <th>Rating</th>
                                <th>Score</th>
                                <th>Type</th>
                                <th>DX Score</th>
                                <th>Combo</th>
                                <th>Sync</th>
                            </tr>
                        </thead>

                        <tbody>
                            {oldSong.map((song, i) => (
                                <tr
                                    className={`hover:bg-base-300 bg-${song.diff}`}
                                    key={i}
                                >
                                    <th>{i + 1}</th>
                                    <td>{song.name}</td>
                                    <td>{song.levelConst}</td>
                                    <td>{song.rank}</td>
                                    <td>{song.rating}</td>
                                    <td>{song.score}</td>
                                    <td>{song.isDx}</td>
                                    <td>{song.dx}</td>
                                    <td>{song.combo}</td>
                                    <td>{song.sync}</td>
                                </tr>
                            ))}
                            {newSong.map((song, i) => (
                                <tr
                                    className={`hover:bg-base-300 bg-${song.diff}`}
                                    key={i}
                                >
                                    <th>{i + 36}</th>
                                    <td>{song.name}</td>
                                    <td>{song.levelConst}</td>
                                    <td>{song.rank}</td>
                                    <td>{song.rating}</td>
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
