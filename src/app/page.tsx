'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Home() {
    const { data: session, status } = useSession();

    const [showClalModal, setShowClalModal] = useState(true);
    const [clal, setClal] = useState('0');
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            setClal(session!.user!.clal);
        }
    }, [status, session]);

    const setUserClal = async () => {
        try {
            if (status !== 'authenticated') {
                throw new Error('Please log in first');
            }

            if (!session || !session!.user) {
                throw new Error('User session is missing');
            }

            const res = await fetch(
                `/api/setUserClal?id=${session!.user!.id!}&clal=${clal}`,
                {
                    method: 'POST',
                }
            );

            if (!res.ok) {
                throw new Error('Failed to set clal, try again later');
            }
        } catch (error) {
            setError((error as Error).message);
            console.error(error);
        }
    };

    return (
        <>
            <h1 className={'flex justify-center'}>Site Under Construction</h1>

            <div className={`modal ${showClalModal ? 'modal-open' : ''}`}>
                <div className={'modal-box'}>
                    <div className={'relative mb-4'}>
                        <h3 className={'text-lg font-bold text-center'}>
                            Set Clal
                        </h3>

                        <button
                            className={
                                'btn btn-sm absolute right-0 top-1/2 -translate-y-1/2 m-0'
                            }
                            onClick={() => setShowClalModal(false)}
                        >
                            Close
                        </button>
                    </div>

                    <h3>Enter your clal here</h3>
                    <hr />
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
                            await setUserClal();
                            setShowClalModal(false);
                        }}
                        className={'btn btn-primary'}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}
