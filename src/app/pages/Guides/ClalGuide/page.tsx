import { Metadata } from 'next';
import ClalGuide from '@/app/pages/Guides/ClalGuide/ClalGuide';

export const metadata: Metadata = {
    title: 'AcidBot | Clal Guide',
};

export default function Page() {
    return <ClalGuide />;
}
