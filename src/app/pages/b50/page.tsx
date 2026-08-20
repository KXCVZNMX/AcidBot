import { Metadata } from 'next';
import Best50 from '@/app/pages/b50/Best50';
import ToolAccess from '@/components/ui/ToolAccess';
import { auth } from '@/auth';

export const metadata: Metadata = {
    title: 'Best 50',
    description: 'Fetch your maimai DX Best 50 scores and review the songs that make up your DX Rating.',
    keywords: [
        'maimai',
        'Acid Bot',
        'AcidBot',
        'b50',
        'best 50',
        'visualise',
        'image',
        'maimai score',
        'score image',
        'rating',
        'DX rating',
    ],
};

export default async function Page() {
    const session = await auth();

    return (
        <main>
            {!session && (
                <header className={'mx-auto max-w-3xl px-4 pt-10 text-center'}>
                    <h1 className={'text-4xl font-bold'}>maimai DX Best 50 Generator</h1>
                    <p className={'mt-4 text-lg text-base-content/80'}>
                        Fetch your Best old and new song scores, and generate a B50 image based off it
                    </p>
                </header>
            )}
            <ToolAccess feature={'the Best 50 tracker'}>
                <Best50 />
            </ToolAccess>
        </main>
    );
}
