import { Metadata } from 'next';
import SkillRadar from '@/app/pages/SkillRadar/SkillRadar';

export const metadata: Metadata = {
    title: 'Skill Radar',
    description:
        'Visualize your playstyle with a radar chart across chart types and note patterns from your B50.',
    keywords: [
        'Skill Radar',
        'AcidBot',
        'Acid Bot',
        'Image',
        'Visualise',
        'b50',
        'Best 50',
        'maimai',
    ],
};

export default function Page() {
    return <SkillRadar />;
}
