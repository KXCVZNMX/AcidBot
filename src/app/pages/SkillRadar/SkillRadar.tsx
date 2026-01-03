'use client';

import {SongTags} from '@/lib/types';
import {useEffect, useRef, useState} from 'react';
import {
    EVAL_TAG_NAMES,
    PATTERN_TAG_NAMES,
    PATTERN_TAG_NUMBERS,
} from '@/lib/consts';
import {mapTagToEvalIndex, mapTagToPatternIndex} from '@/lib/util';
import PERadar from '@/app/components/PERadar';
import {toBlob} from 'html-to-image';

export default function SkillRadar() {
    const [evalRadarValues, setEvalRadarValues] = useState<number[]>([]);
    const [patternRadarValues, setPatternRadarValues] = useState<number[]>([]);
    const [showRadars, setShowRadars] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');

    const captureRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    const fetchB50WithTags = async (): Promise<SongTags[]> => {
        try {
            const res = await fetch('/api/b50WithTags', {
                method: 'GET',
            });
            return await res.json();
        } catch (err) {
            console.error(err);
            setError((err as Error).message);
            return [];
        }
    };

    const maxValue = (values: number[]) => {
        if (values.length === 0) {
            throw new Error('Cannot compute max of an empty list');
        }
        let max = values[0];
        for (let i = 1; i < values.length; i++) {
            if (values[i] > max) max = values[i];
        }
        return max;
    };

    const calculateWeight = (levelConst: number, meanLevelConst: number) => {
        if (levelConst < meanLevelConst) {
            return 0.75 - (meanLevelConst - levelConst) / 20;
        } else {
            return 0.75 + (levelConst - meanLevelConst) / 20;
        }
    };

    const buttonAction = async () => {
        setError('');
        setImageUrl((prev) => {
            if (prev) {
                URL.revokeObjectURL(prev);
            }
            return null;
        });

        const data = await fetchB50WithTags();
        if (!data || data.length === 0) {
            setEvalRadarValues(Array(5).fill(0));
            setPatternRadarValues(Array(14).fill(0));
            setShowRadars(true);
            return;
        }

        const eRadarVal: number[] = Array(5).fill(0);
        const pRadarVal: number[] = Array(14).fill(0);

        const meanLevelConst =
            data.reduce((sum, s) => sum + s.levelConst, 0) / data.length;

        for (const song of data) {
            const songWeight = calculateWeight(song.levelConst, meanLevelConst);
            for (const tag of song.tags) {
                if (PATTERN_TAG_NUMBERS.includes(tag)) {
                    const idx = mapTagToPatternIndex(tag);
                    if (idx != null) pRadarVal[idx] += songWeight;
                } else {
                    const idx = mapTagToEvalIndex(tag);
                    if (idx != null) eRadarVal[idx] += songWeight;
                }
            }
        }

        setEvalRadarValues(eRadarVal);
        setPatternRadarValues(pRadarVal);
        setShowRadars(true);

        await new Promise<void>((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => resolve());
                });
            });
        });

        await document.fonts?.ready;
        await new Promise((r) => setTimeout(r, 50));

        await generateImageFromRef();

        setShowRadars(false);
    };

    const generateImageFromRef = async () => {
        if (!captureRef.current) return;
        setGenerating(true);

        try {
            const blob = await toBlob(captureRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: '#ffffff',
            });

            if (!blob) {
                setError('Failed to generate image blob.');
                setGenerating(false);
                return;
            }

            const url = URL.createObjectURL(blob);

            setImageUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return url;
            });
        } catch (err) {
            console.error(err);
            setError((err as Error).message ?? 'Error generating image');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <>
            <div className={'flex justify-center p-5'}>
                <button
                    className={'btn btn-primary'}
                    onClick={async () => await buttonAction()}
                    disabled={generating}
                >
                    {generating ? 'Generating…' : 'Get Results'}
                </button>
            </div>

            <div className={'flex items-center flex-col'}>
                {showRadars && (
                    <>
                        <div ref={captureRef} className={'overflow-x-auto'}>
                            <div
                                className={
                                    `flex flex-nowrap gap-4 px-4`
                                }
                            >
                                <div className={'w-[400px] h-[400px] shrink-0'}>
                                    <PERadar
                                        tags={patternRadarValues}
                                        tagName={PATTERN_TAG_NAMES}
                                        maxV={maxValue(patternRadarValues)}
                                        name={'Pattern'}
                                    />
                                </div>

                                <div className={'w-[400px] h-[400px] shrink-0'}>
                                    <PERadar
                                        tags={evalRadarValues}
                                        tagName={EVAL_TAG_NAMES}
                                        maxV={maxValue(evalRadarValues)}
                                        name={'Evaluation'}
                                    />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className={'flex gap-2 items-center mt-4 mb-6'}>
                    {imageUrl && (
                        <>
                            <a
                                className={'btn btn-primary'}
                                href={imageUrl}
                                download={'radar.png'}
                            >
                                Download PNG
                            </a>
                        </>
                    )}
                </div>

                {imageUrl && (
                    <div className={'w-full max-w-[720px] px-4'}>
                        <img
                            src={imageUrl}
                            alt={'Generated radar'}
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                display: 'block',
                            }}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
