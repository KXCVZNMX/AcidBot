'use client';

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler,
    type ChartOptions,
} from 'chart.js';

import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
);

type OldB50 = {
    createdAt: Date;
    rating: number;
};

function formatDateLabel(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
    }).format(date);
}

export default function RatingChart({ oldB50 }: { oldB50: OldB50[] }) {
    const normalized = oldB50
        .map((entry) => ({
            rating: entry.rating,
            createdAt: new Date(entry.createdAt),
        }))
        .filter((entry) => !Number.isNaN(entry.createdAt.getTime()))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    if (normalized.length < 2) {
        return (
            <div className={'flex h-full items-center justify-center rounded-lg bg-base-200/40 text-sm opacity-70'}>
                Need at least two history records to draw a trend line.
            </div>
        );
    }

    const labels = normalized.map((entry) => formatDateLabel(entry.createdAt));
    const ratings = normalized.map((entry) => entry.rating);

    const data = {
        labels,
        datasets: [
            {
                label: 'Rating',
                data: ratings,
                fill: true,
                borderColor: 'rgba(59, 130, 246, 0.95)',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHitRadius: 14,
                tension: 0,
            },
        ],
    };

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 280,
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            y: {
                ticks: {
                    stepSize: 100,
                    color: 'rgba(148, 163, 184, 0.95)',
                },
                grid: {
                    color: 'rgba(148, 163, 184, 0.20)',
                },
            },
            x: {
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 7,
                    color: 'rgba(148, 163, 184, 0.95)',
                },
                grid: {
                    color: 'rgba(148, 163, 184, 0.14)',
                },
            },
        },
    };

    return <Line data={data} options={options} />;
}