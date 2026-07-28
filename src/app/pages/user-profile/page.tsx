import { Metadata } from 'next';
import { unauthorized } from 'next/navigation';
import { auth } from '@/auth';
import UserProfile from '@/app/pages/user-profile/UserProfile';

export const metadata: Metadata = {
    title: 'Profile',
    description:
        'Manage your AcidBot profile and view past Best 50 charts and trend.',
    keywords: [
        'profile',
        'trend',
        'b50',
        'best 50',
        'maimai',
        'old b50',
        'AcidBot',
        'Acid Bot',
    ],
    robots: {
        index: false,
        follow: false,
    },
};

export default async function Page() {
    if (!(await auth())) {
        unauthorized();
    }

    return <UserProfile />;
}
