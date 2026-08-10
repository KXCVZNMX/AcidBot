'use client';

import {
    Chart as ChartJS,
    type ChartOptions,
    Filler,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Tooltip,
} from 'chart.js';

import 'chartjs-adapter-date-fns';
import {Line} from 'react-chartjs-2';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type OldB50 = {
    createdAt: Date;
    rating: number;
};

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

    // Extend the line to today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastEntry = normalized[normalized.length - 1];
    if (lastEntry.createdAt.getTime() < today.getTime()) {
        normalized.push({
            rating: lastEntry.rating,
            createdAt: today,
        });
    }

    const data = {
        datasets: [
            {
                label: 'Rating',
                data: normalized.map((entry) => ({
                    x: entry.createdAt.getTime(),
                    y: entry.rating,
                })),
                fill: true,
                borderColor: 'rgba(59, 130, 246, 0.95)',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHitRadius: 14,
                tension: 0,
                stepped: 'before' as const,
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
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'MMM d',
                    },
                },
                ticks: {
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
