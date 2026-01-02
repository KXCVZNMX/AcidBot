import { Metadata } from 'next';
import Guide from '@/app/pages/Guide/Guide';

export const metadata: Metadata = {
    title: 'AcidBot | Guide',
};

export default function Page() {
    return <Guide />;
}
