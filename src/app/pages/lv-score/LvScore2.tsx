'use client';

import ErrorModal from '@/app/components/ErrorModal';
import {useState} from 'react';
import {MaimaiLevelMap} from '@/lib/consts';

export default function LvScore2() {
    const [error, setError] = useState('')
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [generating, setGenerating] = useState<boolean>(false);
    const [level, setLevel] = useState('1');

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />

            <div className={'min-h-[calc(100vh-5rem)] flex items-center justify-center bg-base-200 p-4'}>
                <div className={'card bg-base-300 h-[80vh] w-[100vh] shadow-2xl'}>
                    <div className={'card-body h-full flex-row p-0 rounded-xl'}>
                        <div className={'w-5/7 h-full bg-base-200 p-8 rounded-l-xl'}>
                            Left content
                        </div>

                        <div className={'flex-1 h-full bg-base-300 p-6 rounded-r-xl'}>
                            <div className={'flex flex-col gap-3 justify-center'}>
                                <button
                                    // onClick={fetchResultWithClal}
                                    className={'btn btn-primary min-w-35'}
                                    disabled={generating}
                                >
                                    {generating ? (
                                        <span className={'flex items-center gap-2'}>
                                    <span
                                        className={
                                            'loading loading-spinner loading-sm'
                                        }
                                    ></span>
                                    Generating...
                                </span>
                                    ) : (
                                        'Generate LvScore'
                                    )}
                                </button>

                                <button
                                    // onClick={generateImage}
                                    className={'btn btn-accent min-w-35'}
                                    // disabled={
                                    //     sortedSongs.length === 0 || generatingImage
                                    // }
                                >
                                    Get Image
                                </button>

                                <div className={'text-center p-3 shadow-lg rounded-box bg-base-100 min-w-35'}>
                                    <div className={'max-h-135 overflow-y-auto flex flex-col gap-1'}>
                                        {Array.from({ length: 23 }, (_, i) => {
                                            const value = i + 1;

                                            return (
                                                <button
                                                    key={value}
                                                    type={'button'}
                                                    onClick={() => setLevel(value.toString())}
                                                    className={
                                                        `btn btn-sm ${
                                                            level === value.toString()
                                                                ? 'btn-primary'
                                                                : 'btn-ghost'
                                                        }`
                                                    }
                                                >
                                                    <span className={'w-full text-center'}>
                                                        LEVEL {MaimaiLevelMap[value]}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}