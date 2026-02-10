import { MaimaiSongScore } from '@/lib/types';
import { COMBO_RULES, DIFF_RULES, DX_RULES, SYNC_RULES } from '@/lib/consts';

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

export const extractScore = ($: cheerio.Root) => {
    const results: MaimaiSongScore[] = [];

    $("div[class*='music_'][class*='_score_back']").each((_, el) => {
        const root = $(el);

        const icons = root.find("img[src*='music_icon_']");

        const dxVal = root.find(
            "img[src*='music_dx'], img[src*='music_standard']"
        );
        const lvVal = root.find("img[src*='diff_']");

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

        if (score !== '' && dx !== '') {
            results.push({
                name,
                score,
                dx,
                isDx: dxState!,
                diff: diffState!,
                sync: syncState,
                combo: comboState,
                rank: determineRank(score),
            });
            console.log(`${name} -> ${dxState}`)
        }
    });

    return results;
};

export const getCookie = (name: string): string | undefined => {
    return document.cookie
        .split('; ')
        .find((c) => c.startsWith(name + '='))
        ?.split('=')[1];
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