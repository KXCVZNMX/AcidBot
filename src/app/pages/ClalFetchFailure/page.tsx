import { Metadata } from 'next';
import ClalFetchFailure from '@/app/pages/ClalFetchFailure/ClalFetchFailure';

export const metadata: Metadata = {
    title: 'Failed',
};

export default function Page() {
    return <ClalFetchFailure />;
}
