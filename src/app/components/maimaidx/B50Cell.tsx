import { Output } from '@/app/types/maimai';
import Image from 'next/image';

export default function B50Cell({ output }: { output: Output }) {
    if (!output) return;

    // TODO: Find advanced and basic color codes
    const findBgColor = () => {
        if (output.difficulty === 'remaster') {
            return ['bg-[#ab91bb]', 'bg-[#e3caf3]'];
        } else if (output.difficulty === 'master') {
            return ['bg-[#4a2a5d]', 'bg-[#61367b]'];
        } else if (output.difficulty === 'expert') {
            return ['bg-[#5d2a2a]', 'bg-[#7b3636]'];
        } else if (output.difficulty === 'advanced') {
            return ['bg-[#5e552a]', 'bg-[#7b7036]'];
        } else if (output.difficulty === 'basic') {
            return ['bg-[#295e3a]', 'bg-[#367b4a]'];
        } else {
            return ['', ''];
        }
    };

    const determineRank = (achievement: string) => {
        const a = parseFloat(achievement.replace('%', ''));
        if (a > 100.5) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_sssp.png?ver=1.50';
        } else if (a > 100.0 && a < 100.5) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_sss.png?ver=1.50';
        } else if (a > 99.5 && a < 100.0) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_ssp.png?ver=1.50';
        } else if (a > 99.0 && a < 99.5) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_ss.png?ver=1.50';
        } else if (a > 98.0 && a < 99.0) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_s+.png?ver=1.50';
        } else if (a > 97.0 && a < 98.0) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_s.png?ver=1.50';
        } else if (a > 94.0 && a < 97.0) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_aaa.png?ver=1.50';
        } else if (a > 90.0 && a < 94.0) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_aa.png?ver=1.50';
        } else if (a > 80.0 && a < 90.0) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_a.png?ver=1.50';
        } else if (a > 75.0 && a < 80.0) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_bbb.png?ver=1.50';
        } else if (a > 70.0 && a < 75.0) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_bb.png?ver=1.50';
        } else if (a > 60.0 && a < 70.0) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_b.png?ver=1.50';
        } else if (a > 50.0 && a < 60.0) {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_c.png?ver=1.50';
        } else {
            return 'https://maimaidx-eng.com/maimai-mobile/img/music_icon_d.png?ver=1.50';
        }
    };

    const isFullWidth = (char: string) => {
        const code = char.charCodeAt(0);
        return (
            (code >= 0x1100 && code <= 0x115f) || // Hangul Jamo
            (code >= 0x2e80 && code <= 0xa4cf) || // CJK Radicals, Kangxi, Yi
            (code >= 0xac00 && code <= 0xd7a3) || // Hangul syllables
            (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
            (code >= 0xfe10 && code <= 0xfe19) || // Vertical forms
            (code >= 0xfe30 && code <= 0xfe6f) || // CJK compatibility forms
            (code >= 0xff00 && code <= 0xff60) || // Full-width forms
            (code >= 0xffe0 && code <= 0xffe6)
        );
    };

    const checkStringWidth = (str: string) => {
        let width = 0;
        for (const char of str) {
            width += isFullWidth(char) ? 2 : 1;
        }
        return width;
    };

    const [bgColor, bannerColor] = findBgColor();

    return (
        <>
            <div
                className={`text-white relative shadow-lg flex flex-col gap-3 w-full`}
            >
                <Image
                    src={`https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover/${output.imageName}`}
                    alt={'image name'}
                    fill
                    sizes={'(max-width: 50) (max-height: 50) 100vw'}
                    className={
                        'absolute inset-0 object-contain opacity-20 pointer-events-none z-[-10]'
                    }
                />
                <div
                    className={`flex ${bannerColor} justify-between items-center pl-2 opacity-70 w-auto h-auto`}
                >
                    <Image
                        src={
                            output.isDX
                                ? 'https://maimaidx-eng.com/maimai-mobile/img/music_dx.png'
                                : 'https://maimaidx-eng.com/maimai-mobile/img/music_standard.png'
                        }
                        alt={'diff type'}
                        width={50}
                        height={25}
                    />
                    <span className={'text-lg font-semibold pr-2'}>
                        {output.levelValue}
                    </span>
                </div>

                <h2
                    className={
                        'text-[16px] font-semibold w-full pl-0.5 flex justify-center'
                    }
                >
                    {checkStringWidth(output.title) >= 17
                        ? output.title.slice(0, 10) + '...'
                        : output.title}
                </h2>

                <div className={'flex justify-between items-center pl-1 pr-1'}>
                    <div className={'flex items-center gap-3'}>
                        <div className={'flex flex-col leading-tight'}>
                            <div className={'flex items-center gap-1'}>
                                <Image
                                    src={determineRank(output.achievement)}
                                    alt={'rank'}
                                    width={60}
                                    height={30}
                                    className={'inline'}
                                />
                            </div>
                            <span className={'text-lg font-bold'}>
                                {output.achievement + '%'}
                            </span>
                        </div>
                    </div>

                    <div className={'flex flex-col items-end'}>
                        <h2 className={'font-xl font-bold'}>{output.rating}</h2>
                        <div className={'flex flex-row'}>
                            {output.playStat ? (
                                <Image
                                    src={`https://maimaidx-eng.com/maimai-mobile/img/music_icon_${output.playStat}.png?ver=1.50`}
                                    alt={'play stat'}
                                    width={30}
                                    height={30}
                                    className={'inline'}
                                />
                            ) : (
                                <Image
                                    src={`https://maimaidx-eng.com/maimai-mobile/img/music_icon_back.png?ver=1.50`}
                                    alt={'play stat'}
                                    width={30}
                                    height={30}
                                    className={'inline'}
                                />
                            )}
                            {output.sync ? (
                                <Image
                                    src={`https://maimaidx-eng.com/maimai-mobile/img/music_icon_${output.sync}.png?ver=1.50`}
                                    alt={'sync'}
                                    width={30}
                                    height={30}
                                    className={'inline'}
                                />
                            ) : (
                                <Image
                                    src={`https://maimaidx-eng.com/maimai-mobile/img/music_icon_back.png?ver=1.50`}
                                    alt={'play stat'}
                                    width={30}
                                    height={30}
                                    className={'inline'}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
