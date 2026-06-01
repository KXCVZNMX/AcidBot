import { Metadata } from 'next';
import UserProfile from '@/app/pages/UserProfile/UserProfile';

export const metadata: Metadata = {
    title: 'Profile',
    description:
        'Manage your AcidBot profile and view past Best 50 charts and trend.',
    keywords: ['profile', 'trend', 'b50', 'best 50', 'maimai', 'old b50', 'AcidBot', 'Acid Bot']
};

export default function Page() {
    return <UserProfile />;
}
