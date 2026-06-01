import Card from '@/app/components/Card';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Guides',
    description:
        'Find step-by-step instructions for logging in, setting your clal token, and using AcidBot features.',
    keywords: ['maimai', 'Acid Bot', 'AcidBot', 'guide']
};

export default function Guides() {
    return (
        <div className={'flex flex-col justify-center items-center'}>
            <h2 className={'text-3xl font-medium m-2'}>Guides</h2>

            <div className={'p-3 w-full max-w-175 grid grid-cols-1 gap-3'}>
                <Card title={'Usage Guide'} href={'/pages/Guides/UsageGuide'}>
                    See how to use AcidBot!
                </Card>

                <Card title={'Clal Guide'} href={'/pages/Guides/ClalGuide'}>
                    See how to extract your clal token, used to fetch for your
                    scores.
                </Card>
            </div>
        </div>
    );
}
