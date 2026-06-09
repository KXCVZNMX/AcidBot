import { Metadata } from 'next';
import ClalGuide from '@/app/pages/Guides/ClalGuide/ClalGuide';

export const metadata: Metadata = {
    title: 'Clal Guide',
    description:
        'Learn how to extract and set your clal token so AcidBot can fetch your maimai DX scores.',
    keywords: ['maimai', 'Acid Bot', 'AcidBot', 'guide', 'clal'],
};

export default function Page() {
    return <ClalGuide />;
}
