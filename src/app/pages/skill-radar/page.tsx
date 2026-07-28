import { Metadata } from 'next';
import SkillRadar from '@/app/pages/skill-radar/SkillRadar';
import ToolAccess from '@/app/components/ToolAccess';
import { auth } from '@/auth';

export const metadata: Metadata = {
    title: 'Skill Radar',
    description:
        'Visualise B50 ratings with specific patterns defined in dxrating.com (community driven).',
    keywords: [
        'Skill Radar',
        'AcidBot',
        'Acid Bot',
        'Image',
        'Visualise',
        'b50',
        'Best 50',
        'maimai',
        'dxrating',
    ],
};

export default async function Page() {
    const session = await auth();

    return (
        <main>
            {!session && (
                <header className={'mx-auto max-w-3xl px-4 pt-10 text-center'}>
                    <h1 className={'text-4xl font-bold'}>
                        maimai DX Skill Radar
                    </h1>
                    <p className={'mt-4 text-lg text-base-content/80'}>
                        Visualise B50 ratings with specific patterns defined in
                        dxrating.com (community driven)
                    </p>
                </header>
            )}
            <ToolAccess feature={'Skill Radar'}>
                <SkillRadar />
            </ToolAccess>
        </main>
    );
}
