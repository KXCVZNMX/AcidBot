'use client';

import {useState} from "react";
import {MaimaiLevelMap} from "@/lib/consts";
import {MaimaiFetchData, MaimaiSongScore} from "@/lib/types";

export default function LvScore() {
    const [clal, setClal] = useState('');
    const [level, setLevel] = useState('');
    const [songs, setSongs] = useState<MaimaiSongScore[]>([]);

    const fetchResultWithClal = async () => {
        try {
            const config: MaimaiFetchData = {
                clal: clal,
                redirect: `https://maimaidx-eng.com/maimai-mobile/record/musicLevel/search/?level=${level}`
            }

            const res = await fetch('/api/getSSIDResult', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });

            if (!res.ok) {
                throw new Error(res.statusText);
            }

            const songRes: MaimaiSongScore[] = await res.json();
            setSongs(songRes);
            console.log(songs);
        } catch (error) {
            console.error(error);
        }
    };

    songs.sort((a, b) => parseFloat(b.score.replace('%', '')) - parseFloat(a.score.replace('%', '')))

    return (
        <>
            <div className={'flex flex-col justify-center'}>
                <div className={'flex flex-col justify-center shadow-lg items-center'}>
                    <p className={'p-3'}>Enter your clal (temp, use alternate method after implementing users)</p>
                    <input
                        className={'bg-gray-400 rounded-md text-center text-gray-950'}
                        type={'text'}
                        value={clal}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(v)) {
                                setClal(v);
                            }
                        }}
                    />

                    <form className={'text-center p-3'}>
                        <select
                            name={'level'}
                            className={'w-30 text-center'}
                            onChange={(e) => setLevel(e.target.value)}
                        >
                            {Array.from({ length: 23}, (_, i) =>  (
                                <option key={i} value={i + 1}>
                                    LEVEL {MaimaiLevelMap[i + 1]}
                                </option>
                            ))}
                        </select>
                    </form>

                    <button onClick={fetchResultWithClal} className={'btn btn-primary'}>
                        Submit
                    </button>
                </div>
            </div>
        </>
    );
}