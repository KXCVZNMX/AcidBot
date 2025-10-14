'use client';

import { useState } from 'react';
import { Output } from '@/app/api/maimai/types';

export default function Page() {
    const [data, setData] = useState('');
    const [result, setResult] = useState<Output[] | null>(null);

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
        } catch (error) {
            console.error(error);
        }
    };

    const rcvRes: Output[] = result ?? [];

    return (
        <>
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
