import { Metadata } from 'next';
import ClalGuide from '@/app/pages/Guides/ClalGuide/ClalGuide';

export const metadata: Metadata = {
    title: 'AcidBot | Guides',
};

export default function Page() {
    return <ClalGuide />;
}
