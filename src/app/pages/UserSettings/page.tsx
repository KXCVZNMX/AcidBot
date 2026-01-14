import UserSettings from '@/app/pages/UserSettings/UserSettings';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AcidBot | Settings',
};

export default function Page() {
    return <UserSettings />;
}
