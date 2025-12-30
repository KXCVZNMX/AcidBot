'use client';

import React from 'react';
import { Radar } from 'react-chartjs-2';
import {EVAL_TAG_NAMES} from "@/lib/consts";

export default function EvalRadar({ tags, maxV }: { tags: number[], maxV: number }) {
    const data = {
        labels: EVAL_TAG_NAMES,
        datasets: [
            {
                label: 'Evaluation',
                data: tags,
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
                max: maxV,
                beginAtZero: true,
                ticks: {
                    stepSize: maxV / 5,
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

    console.log(data.labels);
    console.log(data.datasets[0].data);

    return <Radar data={data} options={options} />;
}