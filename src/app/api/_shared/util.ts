import {RANK_DEFINITIONS} from '@/lib/consts';

export function getRatingByAchievement(achievement: number, lvConstant: number) {
    const rank = RANK_DEFINITIONS.find(
        (r) => achievement >= r.minA && achievement <= (r.maxA ?? Infinity)
    );
    if (typeof rank === 'undefined') {
        console.error(`Achievement out of range: ${achievement}`);
        return -1;
    }

    if (rank.maxA && achievement === rank.maxA) {
        return achievement * (rank.maxFactor ?? -1) * lvConstant;
    } else {
        return (
            (achievement > 100.5 ? 100.5 : achievement) *
            rank.factor *
            lvConstant
        );
    }
}

export function parseDate(input: string): Date {
    if (!/^\d{8}$/.test(input)) {
        throw new Error('Invalid format. Expected YYYYMMDD');
    }

    const year = Number(input.slice(0, 4));
    const month = Number(input.slice(4, 6)) - 1; // JS months are 0-based
    const day = Number(input.slice(6, 8));

    const date = new Date(year, month, day);

    // Validate to catch invalid dates like 20250230
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
    ) {
        throw new Error('Invalid date');
    }

    return date;
}

export function isNewByDate(date: string) {
    return parseDate(date) >= parseDate('20250724'); // Prism Plus Release Date
}