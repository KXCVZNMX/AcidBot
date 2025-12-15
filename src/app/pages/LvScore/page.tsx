'use client';

import {useState} from "react";
import {MaimaiLevelMap} from "@/lib/consts";

export default function LvScore() {
    const [ssid, setSsid] = useState('');

    const fetchResultWithSSID = async () => {};

    return (
        <>
            <div className={'flex justify-center'}>
                <div className={'flex flex-col justify-center shadow-lg'}>
                    <p className={'p-3'}>Enter your SSID (temp, use alternate method after implementing users)</p>
                    <input
                        className={'bg-gray-400 rounded-md text-center text-gray-950'}
                        type={'text'}
                        value={ssid}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (/^[a-zA-Z0-9]*$/.test(v)) {
                                setSsid(v);
                            }
                        }}
                    />

                    <form onSubmit={() => fetchResultWithSSID()} className={'text-center p-3'}>
                        <select name={'level'} className={'w-30 text-center'}>
                            {Array.from({ length: 23}, (_, i) =>  (
                                <option key={i} value={i + 1}>
                                    LEVEL {MaimaiLevelMap[i + 1]}
                                </option>
                            ))}
                        </select>
                    </form>
                </div>
            </div>
        </>
    );
}