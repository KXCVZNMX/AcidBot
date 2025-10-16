import {Output} from '@/app/types/maimai';
import Image from 'next/image';

export default function B50Cell({output}: { output: Output }) {
    if (!output) return;

    // TODO: Find advanced and basic color codes
    const findBgColor = () => {
        if (output.difficulty === 'remaster') {
            return ['bg-[#ab91bb]', 'bg-[#e3caf3]']
        } else if (output.difficulty === 'master') {
            return ['bg-[#4a2a5d]', 'bg-[#61367b]']
        } else if (output.difficulty === 'expert') {
            return ['bg-[#5d2a2a]', 'bg-[#7b3636]']
        } else if (output.difficulty === 'advanced') {
            return ['bg-[#5e552a]', 'bg-[#7b7036]']
        } else if (output.difficulty === 'basic') {
            return ['bg-[#295e3a]', 'bg-[#367b4a]']
        } else {
            return ['', '']
        }
    }

    const determineRank = (achievement: string) => {
        const a = parseFloat(achievement.replace('%', ''));
        if (a > 100.5000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_sssp.png?ver=1.50'
        } else if (a > 100.0000 && a < 100.5000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_sss.png?ver=1.50'
        } else if (a > 99.5000 && a < 100.0000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_ssp.png?ver=1.50'
        } else if (a > 99.0000 && a < 99.5000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_ss.png?ver=1.50'
        } else if (a > 98.0000 && a < 99.0000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_s+.png?ver=1.50'
        } else if (a > 97.0000 && a < 98.0000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_s.png?ver=1.50'
        } else if (a > 94.0000 && a < 97.0000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_aaa.png?ver=1.50'
        } else if (a > 90.0000 && a < 94.0000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_aa.png?ver=1.50'
        } else if (a > 80.0000 && a < 90.0000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_a.png?ver=1.50'
        } else if (a > 75.0000 && a < 80.0000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_bbb.png?ver=1.50'
        } else if (a > 70.0000 && a < 75.0000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_bb.png?ver=1.50'
        } else if (a > 60.0000 && a < 70.0000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_b.png?ver=1.50'
        } else if (a > 50.0000 && a < 60.0000) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_c.png?ver=1.50'
        } else {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_d.png?ver=1.50'
        }
    }

    const [bgColor, bannerColor] = findBgColor()

    return (
        <div className={`rounded-xl ${bgColor} text-white p-4 shadow-lg flex flex-col gap-3 w-full`}>

            <div className={`flex ${bannerColor} justify-between items-center`}>
                <Image
                    src={output.isDX ? 'https://maimaidx-eng.com/maimai-mobile/img/music_dx.png' : 'https://maimaidx-eng.com/maimai-mobile/img/music_standard.png'}
                    alt={'diff type'} width={50} height={25}/>
                <span className={'text-lg font-semibold'}>{output.levelValue}</span>
            </div>

            <h2 className={'text-[16px] font-semibold'}>{output.title}</h2>

            <div className={'flex justify-between items-center'}>

                <div className={'flex items-center gap-3'}>
                    <div className={'flex flex-col leading-tight'}>
                        <div className={'flex items-center gap-1'}>
                            <Image src={determineRank(output.achievement)} alt={'rank'} width={60} height={30}
                                   className={'inline'}/>
                        </div>
                        <span className={'text-lg font-bold'}>{output.achievement}</span>
                    </div>
                </div>

                <div className={'flex flex-col items-end'}>
                    {output.playStat ? (
                        <Image src={`https://maimaidx-eng.com/maimai-mobile/img/music_icon_${output.playStat}.png?ver=1.50`} alt={'play stat'} width={40} height={40} className={'inline'}/>
                    ) : null}
                    {output.sync ? (
                        <Image src={`https://maimaidx-eng.com/maimai-mobile/img/music_icon_${output.sync}.png?ver=1.50`} alt={'sync'} width={40} height={40} className={'inline'}/>
                    ) : null}
                    <span className={'mt-2 text-xl font-bold'}>{output.rating}</span>
                </div>
            </div>
        </div>

    )
}