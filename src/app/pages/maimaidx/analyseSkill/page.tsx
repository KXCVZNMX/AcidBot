'use client'

import {useState} from "react";

export default function Page() {
    const [data, setData] = useState('')

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
            </div>
        </>
    )
}