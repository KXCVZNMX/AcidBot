'use client';

import {useEffect, useState} from "react";
import {getCookie} from "@/lib/util";

export default function ClalModal(
    {initialState, userId} : {initialState: boolean, userId: string}
) {
    const [showClalModal, setShowClalModal] = useState(initialState);
    const [clal, setClal] = useState('');

    useEffect(() => {
        const clalCookie = getCookie('clal');
        if (clalCookie) {
            setClal(clalCookie);
        }
    }, [])

    const setUserClal = async () => {
        try {
            const res = await fetch(`/api/setUserClal?id=${userId}&clal=${clal}`, {
                method: 'POST',
            });

            if (!res.ok) {
                throw new Error('Failed to set clal, try again later');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
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
    )
}