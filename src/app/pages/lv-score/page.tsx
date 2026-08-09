import { Metadata } from 'next';
import LvScore from '@/app/pages/lv-score/LvScore';
import ToolAccess from '@/app/components/ToolAccess';
import { auth } from '@/auth';
import LvScore2 from '@/app/pages/lv-score/LvScore2';

export const metadata: Metadata = {
    title: 'Level Score',
    description: 'View all of your maimai DX scores grouped by level to compare results song by song.',
    keywords: ['maimai', 'Acid Bot', 'AcidBot', 'level scores', 'visualise', 'image'],
};

export default async function Page() {
    const session = await auth();

    return (
        <main>
            {!session && (
                <header className={'mx-auto max-w-3xl px-4 pt-10 text-center'}>
                    <h1 className={'text-4xl font-bold'}>maimai DX Level Scores</h1>
                    <p className={'mt-4 text-lg text-base-content/80'}>
                        Generate a list or image of scores for one specific level
                    </p>
                </header>
            )}
            <ToolAccess feature={'Level Scores'}>
                <LvScore2 />
            </ToolAccess>
        </main>
    );
}
