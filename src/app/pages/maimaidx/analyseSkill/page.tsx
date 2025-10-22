'use client';

import { useState } from 'react';
import { isJsonString } from '@/lib/util/util';

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
                <button onClick={getSkillCheck} className={'btn'}>
                    Get Results
                </button>
            </div>
            <p>{tags}</p>
        </>
    );
}
