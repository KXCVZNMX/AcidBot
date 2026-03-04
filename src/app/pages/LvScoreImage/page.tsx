import { Metadata } from 'next';
import LvScoreImage from '@/app/pages/LvScoreImage/LvScoreImage';

export const metadata: Metadata = {
    title: 'AcidBot | LvScore Image',
};

export default function page() {
    return <LvScoreImage />;
}
