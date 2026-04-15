'use client';

import Image from 'next/image';
import DefaultUserIcon from '../../../../public/225-default-avatar.svg';
import { Best50Songs, MSSB50 } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getCookie } from '@/lib/util';
import ErrorModal from '@/app/components/ErrorModal';
import RatingChart from '@/app/components/RatingChart';

type OldB50 = {
    createdAt: Date;
    rating: number;
};

export default function UserProfile() {
    const [oldSong, setOldSong] = useState<MSSB50[]>([]);
    const [newSong, setNewSong] = useState<MSSB50[]>([]);
    const [oldB50s, setOldB50s] = useState<OldB50[]>([]);
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

    const { data: session, status } = useSession();

    useEffect(() => {
        if (!getCookie('clal')) {
            showError(
                'Missing Clal, please go to the guide page to fetch a new clal'
            );
            return;
        }

        (async () => {
            if (status === 'loading') return; // Wait for session to load

            if (status === 'unauthenticated') {
                showError('Please sign in to view your profile');
                return;
            }

            try {
                const res = await fetch('/api/v1/fetchOldB50', {
                    method: 'GET',
                });

                if (!res.ok) {
                    throw new Error(res.statusText);
                }

                const b50: Best50Songs = await res.json();
                setOldSong(b50.b35);
                setNewSong(b50.b15);

                const resOldB50 = await fetch(
                    `/api/v1/fetchOldB50Profile?id=${session?.user?.id ?? ''}`,
                    {
                        method: 'POST',
                    }
                );

                const oldB50s: OldB50[] = await resOldB50.json();

                setOldB50s(oldB50s);
            } catch (error) {
                setError((error as Error).message);
                console.error(error);
            }
        })();
    }, [status, session]);

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />

            <div className={'flex items-center justify-center'}>
                <div
                    className={
                        'p-3 w-full max-w-300 grid grid-cols-1 md:grid-cols-2 gap-3'
                    }
                >
                    <div className={'col-span-1 md:col-span-2'}>
                        <div className={'card bg-base-200 -z-10'}>
                            <div className={'card-body'}>
                                <div
                                    className={
                                        'flex flex-col md:flex-row gap-5 items-center md:items-start'
                                    }
                                >
                                    <Image
                                        src={
                                            session?.user?.image ??
                                            DefaultUserIcon
                                        }
                                        alt={'user icon'}
                                        width={130}
                                        height={130}
                                        className={'rounded-full'}
                                    />
                                    <div className={'flex flex-col'}>
                                        <div className={'card-title pl-6'}>
                                            <h2
                                                className={'text-3xl font-bold'}
                                            >
                                                {session?.user?.name}
                                            </h2>
                                        </div>
                                        <div className={'card-body'}>
                                            <h3 className={'text-lg'}>
                                                <p>
                                                    Created on:{' '}
                                                    {
                                                        session?.user?.createdAt
                                                            .toString()
                                                            .split('T')[0]
                                                    }
                                                </p>
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={'col-span-1'}>
                        <div className={'card bg-base-200'}>
                            <div className={'card-body h-135'}>
                                <h3 className={'text-lg font-bold'}>Best 50</h3>
                                <div
                                    className={
                                        'overflow-x-auto overflow-y-auto rounded-xl border border-base-300'
                                    }
                                >
                                    <table
                                        className={'table table-zebra w-full'}
                                    >
                                        <colgroup>
                                            <col className={'w-[5%]'} />
                                        </colgroup>

                                        <thead>
                                            <tr
                                                className={'bg-base-300'}
                                                key={'header'}
                                            >
                                                <th className={'text-center'}>
                                                    #
                                                </th>
                                                <th>Song Title</th>
                                                <th>Level</th>
                                                <th>Rank</th>
                                                <th>Rating</th>
                                                <th>Score</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {oldSong.map((song, i) => (
                                                <tr
                                                    className={
                                                        'hover:bg-base-content/10 transition-colors'
                                                    }
                                                    key={i}
                                                >
                                                    <th>{i + 1}</th>
                                                    <td>{song.name}</td>
                                                    <td>{song.levelConst}</td>
                                                    <td>{song.rank}</td>
                                                    <td>{song.rating}</td>
                                                    <td>{song.score}</td>
                                                </tr>
                                            ))}
                                            {newSong.map((song, i) => (
                                                <tr
                                                    className={
                                                        'hover:bg-base-content/10 transition-colors'
                                                    }
                                                    key={i}
                                                >
                                                    <th>{i + 36}</th>
                                                    <td>{song.name}</td>
                                                    <td>{song.levelConst}</td>
                                                    <td>{song.rank}</td>
                                                    <td>{song.rating}</td>
                                                    <td>{song.score}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={'col-span-1'}>
                        <div className={'card bg-base-200'}>
                            <div className={'card-body h-135'}>
                                <h3 className={'text-lg font-bold'}>
                                    Old Best 50
                                </h3>

                                <div
                                    className={
                                        'overflow-x-auto overflow-y-auto rounded-xl border border-base-300'
                                    }
                                >
                                    <table
                                        className={'table table-zebra w-full'}
                                    >
                                        <thead>
                                            <tr className={'bg-base-300'}>
                                                <th className={'text-center'}>
                                                    #
                                                </th>
                                                <th>History (Rating & Date)</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {oldB50s.length > 0 ? (
                                                oldB50s.map((entry, index) => {
                                                    const dateString =
                                                        entry.createdAt
                                                            .toString()
                                                            .split('T')[0];

                                                    return (
                                                        <tr
                                                            key={index}
                                                            className={
                                                                'hover:bg-base-content/10 transition-colors'
                                                            }
                                                        >
                                                            <th
                                                                className={
                                                                    'text-center'
                                                                }
                                                            >
                                                                {index + 1}
                                                            </th>
                                                            <td
                                                                className={
                                                                    'font-medium text-lg'
                                                                }
                                                            >
                                                                {entry.rating}
                                                                <span
                                                                    className={
                                                                        'text-sm opacity-60 ml-2'
                                                                    }
                                                                >
                                                                    (
                                                                    {dateString}
                                                                    )
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan={2}
                                                        className={
                                                            'text-center py-4 opacity-50 italic'
                                                        }
                                                    >
                                                        No history records
                                                        found.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div
                                    className={
                                        'mt-4 border-t border-base-300 pt-4'
                                    }
                                >
                                    <div
                                        className={
                                            'mb-2 flex items-center justify-between'
                                        }
                                    >
                                        <h4
                                            className={
                                                'text-sm font-semibold tracking-wide opacity-80'
                                            }
                                        >
                                            Rating trend
                                        </h4>
                                        <span className={'text-xs opacity-60'}>
                                            {oldB50s.length} records
                                        </span>
                                    </div>

                                    <div
                                        className={
                                            'h-56 rounded-xl border border-base-300 bg-base-100/40 p-3'
                                        }
                                    >
                                        <RatingChart oldB50={oldB50s} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
