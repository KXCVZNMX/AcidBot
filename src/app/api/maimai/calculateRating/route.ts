import {
    MaimaiResults,
    Output,
    RANK_DEFINITIONS,
    SongInfoList,
} from '@/app/types/maimai';
import { NextRequest, NextResponse } from 'next/server';
// import {readFileSync} from "fs";

function getRatingByAchievement(achievement: number, lvConstant: number) {
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

// TODO: When doing different versions, get version parameter and determine from that
function isNew(version: string) {
    return version === 'PRiSM PLUS';
}

export async function POST(req: NextRequest) {
    const results: MaimaiResults = await req.json();

    const SONG_INFO_URL =
        'https://dp4p6x0xfi5o9.cloudfront.net/maimai/data.json';
    try {
        const res = await fetch(SONG_INFO_URL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error(`Failed to fetch ${SONG_INFO_URL}`);
        let data: SongInfoList = await res.json();

        // console.log(results.results);

        let resultName = new Set(results.results.map((r) => r.name.trim()));
        data.songs.filter((song) => resultName.has(song.title.trim()));

        // console.log(data.songs.find(s => s.title === 'ガラテアの螺旋'));

        let outputList: Output[] = [];
        results.results.map((r) => {
            let song = data.songs.find(
                (s) =>
                    s.title.trim() === r.name.trim() && !s.sheets[0].isSpecial
            );
            if (!song)
                throw new Error(
                    `Could not find song, Likely error with fetching`
                );

            // console.log(song);
            // console.log(r)

            const diff = song.sheets.find(
                (sheet) =>
                    sheet.difficulty === r.difficulty &&
                    sheet.type == (r.isDX ? 'dx' : 'std')
            );
            if (!diff)
                throw new Error(
                    `Could not find difficulty, Likely error with fetching`
                );

            // console.log(diff.internalLevelValue);

            outputList.push({
                difficulty: r.difficulty,
                imageName: song.imageName,
                title: song.title,
                level: diff.level,
                levelValue: diff.internalLevelValue,
                dx_score: r.dx_score,
                achievement: r.score,
                rating: Math.floor(
                    getRatingByAchievement(
                        Number(r.score.replace('%', '')),
                        diff.internalLevelValue
                    )
                ),
                isDX: r.isDX,
                isNew: isNew(song.version),
                sync: r.sync,
                playStat: r.playStat
            });
        });
        // console.log(outputList);

        return NextResponse.json(outputList);
    } catch (err) {
        console.error(err);
        return NextResponse.json(err, { status: 500 });
    }
}

// DEBUG
//
// const pathRes = readFileSync('temp.json', 'utf-8');
// const data: MaimaiResults = JSON.parse(pathRes);
//
// // console.log(data);
//
// (async () => {
//     try {
//         const result = await calculateB50(data);
//         console.log(result);
//
//         let totalRating = 0;
//         result!.forEach(r => totalRating += r.rating);
//         console.log(totalRating);
//     } catch (err) {
//         console.error('calculateB50 failed:', err);
//     }
// })();
