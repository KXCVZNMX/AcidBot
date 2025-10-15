'use client';

import { useState } from 'react';
import { Output } from '@/app/types/maimai';
import Image from "next/image";

export default function Page() {
    const [data, setData] = useState('');
    const [result, setResult] = useState<Output[] | null>(null);
    const [showModal, setShowModal] = useState(false);

    const getRating = (output: Output[]) => {
        let rating = 0;
        output.forEach((o) => (rating += o.rating));
        return rating;
    };

    const getResults = async () => {
        try {
            const res = await fetch('/api/maimai/calculateRating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
            });

            if (!res.ok) {
                throw new Error('Failed to get rating data.');
            }

            setResult(await res.json());
            setShowModal(true);
        } catch (error) {
            console.error(error);
        }
    };

    const rcvRes: Output[] = result ?? [];
    const newSongs = rcvRes.filter(r => r.isNew);
    const oldSongs = rcvRes.filter(r => !r.isNew);

    return (
        <>
            <div className={`modal ${showModal ? 'modal-open' : ''}`}>
                <div className={'modal-box'}>
                    <h3 className={'font-bold text-lg flex justify-between items-center'}>
                        Results
                        <button
                            className="btn btn-sm btn-circle btn-ghost"
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>
                    </h3>

                    <div className={'flex justify-center'}>
                        <Image
                            src={'https://pbs.twimg.com/media/GisgIeNaIAEP5BK?format=jpg&name=large'}
                            alt={'acid background @sushitabetai151'}
                            width={1284}
                            height={2048}
                            className={'z-0'}
                        />
                    </div>
                </div>
            </div>

            <div className={'flex flex-col justify-center'}>
                <form
                    className={'flex justify-center'}
                    onSubmit={(e) => e.preventDefault()}
                >
                    <textarea
                        className={'bg-gray-950 w-96 h-96'}
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                    />
                </form>
                <button onClick={getResults} className={'btn'}>
                    Get Results
                </button>

                <p>{getRating(rcvRes)}</p>
            </div>

            <div className={'overflow-x-auto w-full'}>
                <table className={'table w-full'}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Level</th>
                            <th>Constant</th>
                            <th>DX Score</th>
                            <th>Achievement</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rcvRes.sort((a, b) => b.rating - a.rating).map((res) => (
                            <tr key={res.title} className={`${res.isNew ? 'bg-orange-200/60' : ''}`}>
                                <td>{res.title}</td>
                                <td>{res.sync}</td>
                                <td>{res.playStat}</td>
                                <td>{res.level}</td>
                                <td>{res.levelValue}</td>
                                <td>{res.dx_score}</td>
                                <td>{res.achievement}</td>
                                <td>{res.rating}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
