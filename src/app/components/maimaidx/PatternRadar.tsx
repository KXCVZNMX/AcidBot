import { countArray, mode } from '@/lib/util/util';
import { PATTERN_TAG } from '@/lib/types/maimai';
import { Radar } from 'react-chartjs-2';
import React from 'react';

export default function PatternRadar({ tags }: { tags: number[] }) {
    const patterTags = tags.filter(
        (t) => ![15, 14, 21, 16, 22, 13, 11].includes(t)
    );
    const patternTagsMostOccurrence = mode(patterTags);

    const countedArr = countArray(patterTags, PATTERN_TAG);

    let labels: string[] = [];
    let results: number[] = [];
    countedArr.entries().forEach(([type, val]) => {
        labels.push(type);
        results.push(val / patternTagsMostOccurrence);
    });

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Pattern',
                data: results,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                pointRadius: 0,
                pointHoverRadius: 0,
                pointBorderWidth: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            r: {
                min: 0,
                max: 1,
                beginAtZero: true,
                ticks: {
                    stepSize: 0.2,
                    display: false,
                },
                grid: {
                    color: 'rgba(160, 160, 160)',
                    circular: true,
                },
                angleLines: {
                    color: 'rgba(160, 160, 160)',
                },
            },
        },
    };

    // console.log(results);
    // console.log(evalTags);

    return <Radar data={data} options={options} />;
}
