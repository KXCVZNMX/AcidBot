import { Metadata } from 'next';
import UserProfile from '@/app/pages/UserProfile/UserProfile';

export const metadata: Metadata = {
    title: 'AcidBot | Profile',
};

export default function Page() {
    return <UserProfile />;
}
