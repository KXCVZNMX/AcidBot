import { Metadata } from 'next';
import Best50 from '@/app/pages/Best50/Best50';

export const metadata: Metadata = {
    title: 'Best 50',
    description:
        'Fetch your maimai DX Best 50 scores and review the songs that make up your DX Rating.',
    keywords: ['maimai', 'Acid Bot', 'AcidBot', 'b50', 'best 50', 'visualise', 'image', 'maimai score', 'score image', 'rating', 'DX rating']
};

export default function Page() {
    return <Best50 />;
}
