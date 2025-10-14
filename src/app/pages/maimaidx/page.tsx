'use client'

import {useState} from "react";
import {Output} from "@/app/api/maimai/types";

export default function Page() {
    const [data, setData] = useState('');
    const [result, setResult] = useState<Output[] | null>(null);

    const getRating = (output: Output[]) => {
        let rating = 0;
        output.forEach(o => rating += o.rating);
        return rating;
    }

    const getResults = async () => {
        try {
            console.log(data)

            const res = await fetch('/api/maimai/calculateRating', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: data
            });

            if (!res.ok) {
                throw new Error("Failed to get rating data.");
            }

            setResult(await res.json());
        } catch (error) {
            console.error(error);
        }
    }

    console.log(result);
    console.log(getRating(result ?? []))

    return (
        <>
            <div className={'flex flex-col justify-center'}>
                <form className={'flex justify-center'} onSubmit={e => e.preventDefault()}>
                    <textarea className={'bg-gray-950 w-96 h-96'} value={data} onChange={e => setData(e.target.value)}/>
                </form>
                <button onClick={getResults} className={'btn'}>Get Results</button>
            </div>
        </>
    )
}