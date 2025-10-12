import {MaimaiResults, RANK_DEFINITIONS} from "@/lib/maimai/types";

function getRatingByAchievement(achievement: number, lvConstant: number) {
    const rank = RANK_DEFINITIONS.find((r) => achievement >= r.minA && achievement <= (r.maxA ?? Infinity));
    if (typeof rank === 'undefined') {
        console.error(`Achievement out of range: ${achievement}`);
        return -1;
    }

    if (achievement === rank.minA) {
        return achievement * (rank.maxFactor ?? -1) * lvConstant;
    } else {
        return achievement * rank.factor * lvConstant;
    }
}

export function calculateB50(results: MaimaiResults) {

}