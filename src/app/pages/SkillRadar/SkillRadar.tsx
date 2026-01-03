'use client';

import { SongTags } from '@/lib/types';
import { useState } from 'react';
import {
    EVAL_TAG_NAMES,
    PATTERN_TAG_NAMES,
    PATTERN_TAG_NUMBERS,
} from '@/lib/consts';
import { mapTagToEvalIndex, mapTagToPatternIndex } from '@/lib/util';
import PERadar from '@/app/components/PERadar';
import { useRef } from 'react';
import {toBlob, toPng} from 'html-to-image';

export default function SkillRadar() {
    const [evalRadarValues, setEvalRadarValues] = useState<number[]>([]);
    const [patternRadarValues, setPatternRadarValues] = useState<number[]>([]);
    const [showRadars, setShowRadars] = useState(false);
    const [error, setError] = useState('');

    const captureRef = useRef<HTMLDivElement>(null);

    const takeScreenshot = async () => {
        if (!captureRef.current) return;

        const dataUrl = await toBlob(captureRef.current, {
            cacheBust: true,
            pixelRatio: 2,
            backgroundColor: '#ffffff',
        });
        if (!dataUrl) return;

        // const link = document.createElement('a');
        // link.download = 'radar.png';
        // link.href = dataUrl;
        // link.click();

        const url = URL.createObjectURL(dataUrl);
        window.open(url, '_blank');
    };

    const fetchB50WithTags = async () => {
        try {
            const res = await fetch('/api/b50WithTags', {
                method: 'GET',
            });

            const data: SongTags[] = await res.json();
            return data;
        } catch (error) {
            console.error(error);
            setError((error as Error).message);
            return [];
        }
    };

    const maxValue = (values: number[]) => {
        if (values.length === 0) {
            throw new Error('Cannot compute max of an empty list');
        }

        let max = values[0];
        for (let i = 1; i < values.length; i++) {
            if (values[i] > max) {
                max = values[i];
            }
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
            data.reduce((sum, s) => sum + s.levelConst, 0) / 50;

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
    };

    return (
        <>
            <div className={'flex justify-center p-5'}>
                <button
                    className={'btn btn-primary'}
                    onClick={async () => await buttonAction()}
                >
                    Get Results
                </button>
            </div>
            {showRadars && (
                <div className={'flex items-center flex-col'}>
                    <div ref={captureRef} className="overflow-x-auto">
                        <div className="flex justify-center gap-4 px-4 min-w-max">
                            <div className="w-[400px] h-[400px] shrink-0">
                                <PERadar
                                    tags={patternRadarValues}
                                    tagName={PATTERN_TAG_NAMES}
                                    maxV={maxValue(patternRadarValues)}
                                    name="Pattern"
                                />
                            </div>

                            <div className="w-[400px] h-[400px] shrink-0">
                                <PERadar
                                    tags={evalRadarValues}
                                    tagName={EVAL_TAG_NAMES}
                                    maxV={maxValue(evalRadarValues)}
                                    name="Evaluation"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        className={'btn btn-primary mb-4'}
                        onClick={takeScreenshot}
                    >
                        Save Image
                    </button>
                </div>
            )}
        </>
    );
}
