import React from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

import {countArray, mode} from "@/lib/util/util";
import {EVAL_TAG} from "@/lib/types/maimai";

export default function EvalRadar({tags}: {tags: number[]}) {
    const evalTags = tags.filter(t => [15, 14, 21, 16, 22,].includes(t));
    const evalTagsMostOccurrence = mode(evalTags);

    const countedArr = countArray(evalTags, EVAL_TAG);

    let labels: string[] = [];
    let results: number[] = [];
    countedArr.entries().forEach(([type, val]) => {
        labels.push(type);
        results.push(val / evalTagsMostOccurrence);
    })

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Evaluation',
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
                },
                angleLines: {
                    color: 'rgba(160, 160, 160)',
                },
            },
        },
    };

    // console.log(results);
    // console.log(evalTags);
    
    return <Radar data={data} options={options}/>
}