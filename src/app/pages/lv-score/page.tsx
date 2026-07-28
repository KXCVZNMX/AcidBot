import { Metadata } from 'next';
import LvScore from '@/app/pages/lv-score/LvScore';

export const metadata: Metadata = {
    title: 'Level Score',
    description:
        'View all of your maimai DX scores grouped by level to compare results song by song.',
    keywords: [
        'maimai',
        'Acid Bot',
        'AcidBot',
        'level scores',
        'visualise',
        'image',
    ],
};

export default function Page() {
    return <LvScore />;
}
