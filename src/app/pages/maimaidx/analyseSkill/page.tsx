'use client';

import { useState } from 'react';
import { isJsonString } from '@/lib/util/util';
import EvalRadar from '@/app/components/maimaidx/EvalRadar';
import PatternRadar from '@/app/components/maimaidx/PatternRadar';

export default function Page() {
    const [data, setData] = useState('');
    const [tags, setTags] = useState<number[]>([]);
    const [showModal, setShowModal] = useState(false);

    const getSkillCheck = async () => {
        if (data.length === 0 || !isJsonString(data)) return;
        try {
            const res = await fetch('/api/maimai/skillCheck', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data,
            });

            if (!res.ok)
                throw Error(`Failed to fetch skill check: ${res.status}`);

            setTags(await res.json());

            // console.log(tags);

            setShowModal(true);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className={`modal ${showModal ? 'modal-open' : ''}`}>
                <div
                    className={
                        'modal-box max-w-6xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden'
                    }
                >
                    <h3
                        className={
                            'font-bold text-lg flex justify-between items-center p-4'
                        }
                    >
                        Skill Check
                        <button
                            className={'btn btn-sm btn-circle btn-ghost'}
                            onClick={() => setShowModal(false)}
                        >
                            ✕
                        </button>
                    </h3>

                    <div
                        className={
                            'flex flex-row flex-wrap justify-center w-full p-4'
                        }
                    >
                        <div
                            className={
                                'flex justify-center items-center w-full md:w-1/2 h-[50vh] max-h-[500px] min-h-[300px]'
                            }
                        >
                            <EvalRadar tags={tags} />
                        </div>
                        <div
                            className={
                                'flex justify-center items-center w-full md:w-1/2 h-[50vh] max-h-[500px] min-h-[300px]'
                            }
                        >
                            <PatternRadar tags={tags} />
                        </div>
                    </div>
                </div>
            </div>

            <div className={'flex flex-col justify-center'}>
                <form
                    className={'flex justify-center'}
                    onSubmit={(e) => e.preventDefault()}
                >
                    <textarea
                        className={'bg-gray-950 w-96 h-96 opacity-70'}
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                    />
                </form>
                <button onClick={getSkillCheck} className={'btn'}>
                    Get Results
                </button>
            </div>
        </>
    );
}
