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

export default function SkillRadar() {
    const [evalRadarValues, setEvalRadarValues] = useState<number[]>([]);
    const [patternRadarValues, setPatternRadarValues] = useState<number[]>([]);
    const [showRadars, setShowRadars] = useState(false);
    const [error, setError] = useState('');

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
                <div className={'flex flex-row justify-center'}>
                    <div style={{ height: 400, width: 400 }}>
                        <PERadar
                            tags={patternRadarValues}
                            tagName={PATTERN_TAG_NAMES}
                            maxV={maxValue(patternRadarValues)}
                            name={'Pattern'}
                        />
                    </div>

                    <div style={{ height: 400, width: 400 }}>
                        <PERadar
                            tags={evalRadarValues}
                            tagName={EVAL_TAG_NAMES}
                            maxV={maxValue(evalRadarValues)}
                            name={'Evaluation'}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
