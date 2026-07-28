import { MaimaiSongScore } from '@/lib/types';
import { COMBO_RULES, DIFF_RULES, DX_RULES, SYNC_RULES } from '@/lib/consts';
import { StaticImageData } from 'next/image';
import RatingNormal from '../../public/rating_plates/rating_base_normal.png';
import RatingBlue from '../../public/rating_plates/rating_base_blue.png';
import RatingGreen from '../../public/rating_plates/rating_base_green.png';
import RatingYellow from '../../public/rating_plates/rating_base_orange.png';
import RatingRed from '../../public/rating_plates/rating_base_red.png';
import RatingPurple from '../../public/rating_plates/rating_base_purple.png';
import RatingBronze from '../../public/rating_plates/rating_base_bronze.png';
import RatingSilver from '../../public/rating_plates/rating_base_silver.png';
import RatingGold1 from '../../public/rating_plates/rating_base_golds.png';
import RatingGold2 from '../../public/rating_plates/rating_base_goldss.png';
import RatingPlatinum1 from '../../public/rating_plates/rating_base_platinums.png';
import RatingPlatinum2 from '../../public/rating_plates/rating_base_platinumss.png';
import RatingRainbow1 from '../../public/rating_plates/rating_base_rainbows.png';
import RatingRainbow2 from '../../public/rating_plates/rating_base_rainbowss.png';
import RatingRainbow3 from '../../public/rating_plates/rating_base_rainbowsss.png';
import RatingRainbow4 from '../../public/rating_plates/rating_base_rainbowssss.png';
import RatingRainbowEx1 from '../../public/rating_plates/rating_base_rainbow_exs.png';
import RatingRainbowEx2 from '../../public/rating_plates/rating_base_rainbow_exss.png';
import RatingRainbowEx3 from '../../public/rating_plates/rating_base_rainbow_exsss.png';
import RatingRainbowEx4 from '../../public/rating_plates/rating_base_rainbow_exssss.png';

export const matchRule = (
    src: string,
    rules: [string, string][]
): string | null => {
    for (const [needle, value] of rules) {
        if (src.includes(needle)) return value;
    }
    return null;
};

export const determineRank = (achievement: string) => {
    const a = parseFloat(achievement.replace('%', ''));
    if (a > 100.5) {
        return 'SSS+';
    } else if (a > 100.0 && a < 100.5) {
        return 'SSS';
    } else if (a > 99.5 && a < 100.0) {
        return 'SS+';
    } else if (a > 99.0 && a < 99.5) {
        return 'SS';
    } else if (a > 98.0 && a < 99.0) {
        return 'S+';
    } else if (a > 97.0 && a < 98.0) {
        return 'S';
    } else if (a > 94.0 && a < 97.0) {
        return 'AAA';
    } else if (a > 90.0 && a < 94.0) {
        return 'AA';
    } else if (a > 80.0 && a < 90.0) {
        return 'A';
    } else if (a > 75.0 && a < 80.0) {
        return 'BBB';
    } else if (a > 70.0 && a < 75.0) {
        return 'BB';
    } else if (a > 60.0 && a < 70.0) {
        return 'B';
    } else if (a > 50.0 && a < 60.0) {
        return 'C';
    } else {
        return 'D';
    }
};

export const extractScore = (
    $: cheerio.Root,
    source: 'getB50' | 'getLevel' = 'getB50'
) => {
    const results: MaimaiSongScore[] = [];

    $('div[class*=\'music_\'][class*=\'_score_back\']').each((_, el) => {
        const root = $(el);
        const wrapper = root.parent();

        const icons = root.find('img[src*=\'music_icon_\']');

        // getLevel pages place DX/STD marker on the card itself, while getB50 is more reliable from wrapper.
        let dxVal =
            source === 'getLevel'
                ? root.find('img.music_kind_icon')
                : wrapper.find(
                      'img[src*=\'music_dx\'], img[src*=\'music_standard\']'
                  );

        // Fallback for mixed/changed layouts.
        if (dxVal.length === 0) {
            dxVal = root.find(
                'img.music_kind_icon, img[src*=\'music_dx\'], img[src*=\'music_standard\']'
            );
        }

        const lvVal = root.find('img[src*=\'diff_\']');

        let dxState: string | null = null;
        let diffState: string | null = null;
        let syncState: string | null = null;
        let comboState: string | null = null;

        icons.each((_, img) => {
            const src = $(img).attr('src') ?? '';

            syncState ||= matchRule(src, SYNC_RULES);
            comboState ||= matchRule(src, COMBO_RULES);
        });

        dxVal.each((_, dxv) => {
            const src = $(dxv).attr('src') ?? '';
            dxState ||= matchRule(src, DX_RULES);
        });

        lvVal.each((_, lv) => {
            const src = $(lv).attr('src') ?? '';
            diffState ||= matchRule(src, DIFF_RULES);
        });

        const name = root.find('.music_name_block').text().trim();

        const scoreBlocks = root.find('.music_score_block');
        const score = scoreBlocks.eq(0).text().trim();
        const dx = scoreBlocks.eq(1).text().trim();

        if (score !== '' && dx !== '' && dxState && diffState) {
            results.push({
                name,
                score,
                dx,
                isDx: dxState,
                diff: diffState,
                sync: syncState,
                combo: comboState,
                rank: determineRank(score),
            });
        }
    });

    return results;
};

export const mapTagToPatternIndex = (tagNumber: number) => {
    if (tagNumber === 3) {
        return 0;
    } else if (tagNumber === 4) {
        return 1;
    } else if (tagNumber === 6) {
        return 2;
    } else if (tagNumber === 7) {
        return 3;
    } else if (tagNumber === 8) {
        return 4;
    } else if (tagNumber === 9) {
        return 5;
    } else if (tagNumber === 10) {
        return 6;
    } else if (tagNumber === 1) {
        return 7;
    } else if (tagNumber === 17) {
        return 8;
    } else if (tagNumber === 18) {
        return 9;
    } else if (tagNumber === 19) {
        return 10;
    } else if (tagNumber === 20) {
        return 11;
    } else if (tagNumber === 23) {
        return 12;
    } else if (tagNumber === 24) {
        return 13;
    }
};

export const mapTagToEvalIndex = (tagNumber: number) => {
    if (tagNumber === 15) {
        return 0;
    } else if (tagNumber === 14) {
        return 1;
    } else if (tagNumber === 21) {
        return 2;
    } else if (tagNumber === 16) {
        return 3;
    } else if (tagNumber === 22) {
        return 4;
    }
};

export function truncateByWidth(
    input: string,
    maxWidth: number,
    ellipsis = '...'
): string {
    let width = 0;
    let result = '';

    const ellipsisWidth = getCharWidth(ellipsis);

    for (const char of input) {
        const charWidth = getCharWidth(char);

        if (width + charWidth + ellipsisWidth > maxWidth) {
            return result + ellipsis;
        }

        width += charWidth;
        result += char;
    }

    return result;
}

function getCharWidth(char: string): number {
    if (char.length > 1) {
        let total = 0;
        for (const c of char) total += getCharWidth(c);
        return total;
    }

    const code = char.codePointAt(0)!;

    if (
        (code >= 0x4e00 && code <= 0x9fff) || // CJK
        (code >= 0x3040 && code <= 0x30ff) || // Hiragana / Katakana
        (code >= 0xac00 && code <= 0xd7af) || // Hangul
        (code >= 0xff01 && code <= 0xff60) || // Fullwidth forms
        (code >= 0x1f300 && code <= 0x1faff) // Emoji (approximation)
    ) {
        return 2;
    } else if (code >= 0x41 && code <= 0x5a) {
        return 1.5;
    }

    return 1;
}

export const chooseNameplate = (arr: StaticImageData[]) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
};

export const determineRatingPlate = (rating: number) => {
    if (rating < 1000) {
        return RatingNormal;
    } else if (rating < 2000 && rating >= 1000) {
        return RatingBlue;
    } else if (rating < 4000 && rating >= 2000) {
        return RatingGreen;
    } else if (rating < 7000 && rating >= 4000) {
        return RatingYellow;
    } else if (rating < 10000 && rating >= 7000) {
        return RatingRed;
    } else if (rating < 12000 && rating >= 10000) {
        return RatingPurple;
    } else if (rating < 13000 && rating >= 12000) {
        return RatingBronze;
    } else if (rating < 14000 && rating >= 13000) {
        return RatingSilver;
    } else if (rating < 14250 && rating >= 14000) {
        return RatingGold1;
    } else if (rating < 14500 && rating >= 14250) {
        return RatingGold2;
    } else if (rating < 14750 && rating >= 14500) {
        return RatingPlatinum1;
    } else if (rating < 15000 && rating >= 14750) {
        return RatingPlatinum2;
    } else if (rating < 15250 && rating >= 15000) {
        return RatingRainbow1;
    } else if (rating < 15500 && rating >= 15250) {
        return RatingRainbow2;
    } else if (rating < 15750 && rating >= 15500) {
        return RatingRainbow3;
    } else if (rating < 16000 && rating >= 15750) {
        return RatingRainbow4;
    } else if (rating < 16250 && rating >= 16000) {
        return RatingRainbowEx1;
    } else if (rating < 16500 && rating >= 16250) {
        return RatingRainbowEx2;
    } else if (rating < 16750 && rating >= 16500) {
        return RatingRainbowEx3;
    } else if (rating >= 16750) {
        return RatingRainbowEx4;
    } else {
        return RatingRainbowEx4;
    }
};
