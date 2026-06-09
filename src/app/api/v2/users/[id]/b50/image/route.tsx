{/* eslint-disable @next/next/no-img-element */}
import {NextRequest, NextResponse} from 'next/server';
import {MalformedRequest} from '@/app/api/v2/_shared/types';
import {MSSB50, ParsedProfile} from '@/lib/types'
import {truncateByWidth} from '@/lib/util';
import {ImageResponse} from 'next/og';
import {readFileSync} from 'fs';
import {join} from 'path';
import React from 'react';
import {z} from 'zod';

const UserClalSchema = z.object({
    id: z.string().min(1),
    clal: z
        .string()
        .length(64)
        .regex(/^[A-Za-z0-9]+$/),
});

export const alt = 'B50'
export const runtime = 'nodejs';
export const contentType = 'image/png'
export const size = {
    width: 1400,
    height: 1600,
}

// Cache fonts at module level to avoid reloading on every request
let cachedFonts: {mPlusMed: ArrayBuffer; mPlusReg: ArrayBuffer} | null = null;

function getFonts() {
    if (cachedFonts) {
        return cachedFonts;
    }

    // Read font files from the public directory
    const publicDir = join(process.cwd(), 'public', 'assets');
    const mPlusMedBuffer = readFileSync(join(publicDir, 'MPLUSRounded1c-Medium.ttf'));
    const mPlusRegBuffer = readFileSync(join(publicDir, 'MPLUSRounded1c-Regular.ttf'));

    cachedFonts = {
        mPlusMed: mPlusMedBuffer.buffer.slice(mPlusMedBuffer.byteOffset, mPlusMedBuffer.byteOffset + mPlusMedBuffer.byteLength),
        mPlusReg: mPlusRegBuffer.buffer.slice(mPlusRegBuffer.byteOffset, mPlusRegBuffer.byteOffset + mPlusRegBuffer.byteLength),
    };
    return cachedFonts;
}

const chooseNP = (nps: string[]) => {
    const randomIndex = Math.floor(Math.random() * nps.length);
    return nps[randomIndex];
}

const determineBackgroundColor = (diff: string) => {
    if (diff === 'remaster') {
        return '#DFC7F8';
    } else if (diff === 'master') {
        return '#9e45e2';
    } else if (diff === 'expert') {
        return '#f64861';
    } else if (diff === 'advanced') {
        return '#fb9c2d';
    } else if (diff === 'basic') {
        return '#22bb5b';
    } else {
        return '#22bb5b';
    }
};

const determineRankImage = (rank: string | null) => {
    if (rank === 'SSS+') {
        return '/b50/SSSp.png';
    } else if (rank === 'SSS') {
        return '/b50/SSS.png';
    } else if (rank === 'SS+') {
        return '/b50/SSp.png';
    } else if (rank === 'SS') {
        return '/b50/SS.png';
    } else if (rank === 'S+') {
        return '/b50/Sp.png';
    } else if (rank === 'S') {
        return '/b50/S.png';
    } else if (rank === 'AAA') {
        return '/b50/AAA.png';
    } else if (rank === 'AA') {
        return '/b50/AA.png';
    } else if (rank === 'A') {
        return '/b50/A.png';
    } else if (rank === 'BBB') {
        return '/b50/BBB.png';
    } else if (rank === 'BB') {
        return '/b50/BB.png';
    } else if (rank === 'B') {
        return '/b50/B.png';
    } else if (rank === 'C') {
        return '/b50/C.png';
    } else {
        return '/b50/D.png';
    }
};

const determineComboImage = (combo: string | null) => {
    if (combo === 'AP+') {
        return '/b50/music_icon_app.png';
    } else if (combo === 'AP') {
        return '/b50/music_icon_ap.png';
    } else if (combo === 'FC+') {
        return '/b50/music_icon_fcp.png';
    } else if (combo === 'FC') {
        return '/b50/music_icon_fc.png';
    } else {
        return '/b50/music_icon_back.png';
    }
};

const determineSyncImage = (sync: string | null) => {
    if (sync === 'FDX+') {
        return '/b50/music_icon_fdxp.png';
    } else if (sync === 'FDX') {
        return '/b50/music_icon_fdx.png';
    } else if (sync === 'FS+') {
        return '/b50/music_icon_fsp.png';
    } else if (sync === 'FS') {
        return '/b50/music_icon_fs.png';
    } else if (sync === 'SYNC') {
        return '/b50/music_icon_sync.png';
    } else {
        return '/b50/music_icon_back.png';
    }
};

const determineStarCount = (dx: string) => {
    const dxScore = dx.split('/');
    const achievedDx = parseInt(dxScore[0].replace(/,/g, ''));
    const maxDx = parseInt(dxScore[1].replace(/,/g, ''));
    const percentage = achievedDx / maxDx;
    const SITE_LINK = process.env.SITE_LINK ?? 'http://localhost:3000';
    if (percentage >= 0.97) {
        return (
            <img
                src={`${SITE_LINK}/b50/music_icon_dxstar_detail_5.png`}
        alt={'dx stars'}
        width={52}
        style={{
            position: 'absolute',
                top: 86,
                left: 202
        }}
        />
    );
    } else if (percentage >= 0.95) {
        return (
            <img
                src={`${SITE_LINK}/b50/music_icon_dxstar_detail_4.png`}
        alt={'dx stars'}
        width={55}
        style={{
            position: 'absolute',
                top: 86,
                left: 201
        }}
        />
    );
    } else if (percentage >= 0.93) {
        return (
            <img
                src={`${SITE_LINK}/b50/music_icon_dxstar_detail_3.png`}
        alt={'dx stars'}
        width={60}
        style={{
            position: 'absolute',
                top: 85,
                left: 198
        }}
        />
    );
    } else if (percentage >= 0.9) {
        return (
            <img
                src={`${SITE_LINK}/b50/music_icon_dxstar_detail_2.png`}
        alt={'dx stars'}
        width={65}
        style={{
            position: 'absolute',
                top: 85,
                left: 196
        }}
        />
    );
    } else if (percentage >= 0.85) {
        return (
            <img
                src={`${SITE_LINK}/b50/music_icon_dxstar_detail_1.png`}
        alt={'dx stars'}
        width={65}
        style={{
            position: 'absolute',
                top: 85,
                left: 194
        }}
        />
    );
    } else {
        return null;
    }
};

function B50Card({ info }: { info: MSSB50 }) {
    const SITE_LINK = process.env.SITE_LINK ?? 'http://localhost:3000';
    const backgroundColor = determineBackgroundColor(info.diff);
    const textColor = info.diff === 'remaster' ? '#9e45e2' : '#fff';
    const textShadow =
        info.diff === 'remaster'
            ? `
      1px 1px 1px rgba(130,130,130,0.6),
      1px 2px 2px rgba(130,130,130,0.5)
    `
            : `
      1px 1px 1px rgba(0,0,0,0.6),
      1px 2px 2px rgba(0,0,0,0.5)
    `;

    return (
        <div
            style={{
        backgroundColor: 'white',
            width: 265,
            height: 110,
            borderRadius: 12,
            paddingTop: 4,
            display: 'flex',
            flex: '0 0 265px',
            flexShrink: 0,
    }}
>
    <div
        style={{
        position: 'absolute',
            marginInline: 'auto',
            height: 75,
            width: 255,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            left: 5,
            display: 'flex',
            backgroundColor,
            color: textColor,
    }}
>
    <img
        src={`${SITE_LINK}/maimaiJackets/${info.jacketURL}`}
    alt={'jacket'}
    width={75}
    height={75}
    style={{
        position: 'absolute',
            left: 12,
            top: 12,
            borderWidth: 4,
            borderBottomWidth: 0,
            borderColor: 'white',
            borderRadius: 8
    }}
    />
    <h2
    style={{
        position: 'absolute',
            left: 96,
            top: -18,
            fontFamily: 'mPlusMed',
            fontSize: 16,
            color: textColor
    }}
>
    {truncateByWidth(info.name, 20)}
    </h2>
    <hr
    style={{
        position: 'absolute',
            left: 87,
            top: 15,
            width: 168,
            height: 2,
            backgroundColor: 'white',
            border: 'none',
    }}
    />
    <h1
    style={{
        position: 'absolute',
            left: 92,
            top: 2,
            fontSize: 26,
            fontWeight: 500,
            color: textColor,
            textShadow,
    }}
>
    {`${info.achievement.toFixed(4)}%`}
    </h1>
    <p
    style={{
        position: 'absolute',
            left: 96,
            top: 38,
            fontSize: 12,
            color: textColor,
    }}
>
    {`${info.levelConst.toFixed(1)} → ${info.rating}`}
    </p>
    <p
    style={{
        position: 'absolute',
            left: 171,
            top: 38,
            fontSize: 12,
            color: textColor,
    }}
>
    {info.dx}
    </p>
    <img
    src={info.isDx === 'dx' ? `${SITE_LINK}/b50/music_dx.png` : `${SITE_LINK}/b50/music_standard.png`}
    alt={'music_dx_std'}
    width={50}
    style={{
        position: 'absolute',
            top: 88,
            left: 24
    }}
    />
    <img
    src={SITE_LINK + determineRankImage(info.rank)}
    alt={'rank'}
    width={50}
    style={{
        position: 'absolute',
            top: 79,
            left: 90
    }}
    />
    <img
    src={SITE_LINK + determineComboImage(info.combo)}
    alt={'combo'}
    width={28}
    style={{
        position: 'absolute',
            top: 75,
            left: 145
    }}
    />
    <img
    src={SITE_LINK + determineSyncImage(info.sync)}
    alt={'sync'}
    width={28}
    style={{
        position: 'absolute',
            top: 75,
            left: 173
    }}
    />
    {determineStarCount(info.dx)}
    </div>
    </div>
)
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const funcStartTime = Date.now();
    console.log(`[b50Image] START: ${new Date().toISOString()}`);

    const {id: u_id} = await params;
    const url = req.nextUrl;
    const u_clal = url.searchParams.get('clal');
    const u_old = url.searchParams.get('old');

    const parsed = UserClalSchema.extend({
        old: z.enum(['true', 'false']).transform((value) => value === 'true').optional(),
    }).safeParse({id: u_id, clal: u_clal, old: u_old ?? undefined});

    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, {status: 400});
    }

    const {id, clal, old} = parsed.data;
    console.log(`[b50Image] INPUT PARSED: ${Date.now() - funcStartTime}ms`);

    const SITE_LINK = process.env.SITE_LINK ?? 'http://localhost:3000';

    const NP = [
        `${SITE_LINK}/b50/NP_bhx.png`,
        `${SITE_LINK}/b50/NP_cf.png`,
        `${SITE_LINK}/b50/NP_cf_prism.png`,
        `${SITE_LINK}/b50/NP_cf_festival.png`,
        `${SITE_LINK}/b50/NP_dlx.png`,
        `${SITE_LINK}/b50/NP_kuro.png`,
        `${SITE_LINK}/b50/NP_lime.png`,
        `${SITE_LINK}/b50/NP_lime_bud.png`,
        `${SITE_LINK}/b50/NP_milk.png`,
        `${SITE_LINK}/b50/NP_milk_cat.png`,
        `${SITE_LINK}/b50/NP_milk_prism.png`,
        `${SITE_LINK}/b50/NP_milk_splash.png`,
        `${SITE_LINK}/b50/NP_rasu.png`,
        `${SITE_LINK}/b50/NP_rasu_bud.png`,
        `${SITE_LINK}/b50/NP_rasu_festival.png`,
        `${SITE_LINK}/b50/NP_riz_prism.png`,
        `${SITE_LINK}/b50/NP_salt.png`,
        `${SITE_LINK}/b50/NP_salt_festival.png`,
        `${SITE_LINK}/b50/NP_salt_prism.png`,
        `${SITE_LINK}/b50/NP_sm.png`,
        `${SITE_LINK}/b50/NP_sm_splash.png`,
        `${SITE_LINK}/b50/NP_yj.png`,
        `${SITE_LINK}/b50/NP_yj_bud.png`,
        `${SITE_LINK}/b50/NP_yj_splash.png`,
    ];

    const determineRP = (rating: number) => {
        if (rating < 1000) {
            return `${SITE_LINK}/rating_plates/rating_base_normal.png`;
        } else if (rating < 2000 && rating >= 1000) {
            return `${SITE_LINK}/rating_plates/rating_base_blue.png`;
        } else if (rating < 4000 && rating >= 2000) {
            return `${SITE_LINK}/rating_plates/rating_base_green.png`;
        } else if (rating < 7000 && rating >= 4000) {
            return `${SITE_LINK}/rating_plates/rating_base_yellow.png`;
        } else if (rating < 10000 && rating >= 7000) {
            return `${SITE_LINK}/rating_plates/rating_base_red.png`;
        } else if (rating < 12000 && rating >= 10000) {
            return `${SITE_LINK}/rating_plates/rating_base_purple.png`;
        } else if (rating < 13000 && rating >= 12000) {
            return `${SITE_LINK}/rating_plates/rating_base_bronze.png`;
        } else if (rating < 14000 && rating >= 13000) {
            return `${SITE_LINK}/rating_plates/rating_base_silver.png`;
        } else if (rating < 14250 && rating >= 14000) {
            return `${SITE_LINK}/rating_plates/rating_base_golds.png`;
        } else if (rating < 14500 && rating >= 14250) {
            return `${SITE_LINK}/rating_plates/rating_base_goldss.png`;
        } else if (rating < 14750 && rating >= 14500) {
            return `${SITE_LINK}/rating_plates/rating_base_platinums.png`;
        } else if (rating < 15000 && rating >= 14750) {
            return `${SITE_LINK}/rating_plates/rating_base_platinumss.png`;
        } else if (rating < 15250 && rating >= 15000) {
            return `${SITE_LINK}/rating_plates/rating_base_rainbows.png`;
        } else if (rating < 15500 && rating >= 15250) {
            return `${SITE_LINK}/rating_plates/rating_base_rainbowss.png`;
        } else if (rating < 15750 && rating >= 15500) {
            return `${SITE_LINK}/rating_plates/rating_base_rainbowsss.png`;
        } else if (rating < 16000 && rating >= 15750) {
            return `${SITE_LINK}/rating_plates/rating_base_rainbowssss.png`;
        } else if (rating < 16250 && rating >= 16000) {
            return `${SITE_LINK}/rating_plates/rating_base_rainbow_exs.png`;
        } else if (rating < 16500 && rating >= 16250) {
            return `${SITE_LINK}/rating_plates/rating_base_rainbow_exss.png`;
        } else if (rating < 16750 && rating >= 16500) {
            return `${SITE_LINK}/rating_plates/rating_base_rainbow_exsss.png`;
        } else if (rating >= 16750) {
            return `${SITE_LINK}/rating_plates/rating_base_rainbow_exssss.png`;
        } else {
            return `${SITE_LINK}/rating_plates/rating_base_rainbow_exssss.png`;
        }
    }

    const nameplate = chooseNP(NP);

    const {mPlusMed, mPlusReg} = getFonts();

    const upstreamFetchStart = Date.now();
    console.log(`[b50Image] UPSTREAM FETCH START: ${upstreamFetchStart - funcStartTime}ms into execution`);

    const profileRes = await fetch(
        `${SITE_LINK}/api/v2/users/${id}/b50?clal=${clal}&profile=true${old ? '&old=true' : ''}`
    );

    const upstreamFetchEnd = Date.now();
    console.log(`[b50Image] UPSTREAM FETCH COMPLETE: ${upstreamFetchEnd - upstreamFetchStart}ms (total: ${upstreamFetchEnd - funcStartTime}ms)`);

    if (!profileRes.ok) {
        return new NextResponse('Upstream fetch failed', { status: 502 });
    }

    const {
        b35,
        b15,
        profile,
    }: {
        b35: MSSB50[];
        b15: MSSB50[];
        profile: ParsedProfile;
    } = await profileRes.json();

    const rating = [...b35, ...b15].reduce(
        (sum, s) => sum + s.rating,
        0
    );

    const imageRenderStart = Date.now();
    console.log(`[b50Image] IMAGE RENDER START: ${imageRenderStart - funcStartTime}ms into execution`);

    const imageResponse = new ImageResponse(
        (
            <div
                style={{
        display: 'flex',
            position: 'relative',
            width: 1400,
            height: 1600,
            flexShrink: 0,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${SITE_LINK}/b50/b50bg.png)`,
            fontFamily: 'MPlusMed',
    }}
>
    <img
        src={`${SITE_LINK}/b50/kv_logo_pc.png`}
    alt={'logo'}
    height={120}
    style={{
        position: 'absolute',
            top: 60,
            left: 20
    }}
    />
    <img
    src={nameplate}
    alt={'nameplate'}
    width={800}
    style={{
        position: 'absolute',
            top: 35,
            left: 300,
            borderRadius: 12
    }}
    />
    <div
    style={{
        position: 'absolute',
            width: 433,
            height: 110,
            left: 313,
            top: 50,
            backgroundColor: '#6a7282',
            borderRadius: 8,
    }}
    />
    <div
    style={{
        position: 'absolute',
            width: '26.9375rem',
            height: '6.875rem',
            left: '19.375rem',
            top: '2.8125rem',
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            borderColor: '#6a7282',
            borderWidth: '2px',
            borderStyle: 'solid',
    }}
    />
    <img
    src={profile.profilePicture!}
    alt={'pfp'}
    width={100}
    height={100}
    style={{
        position: 'absolute',
            top: 50,
            left: 317,
    }}
    />
    <img
    src={`${SITE_LINK}/b50/trophy_normal.png`}
    alt={'trophy'}
    width={220}
    height={20}
    style={{
        position: 'absolute',
            top: 53,
            left: 440,
    }}
    />
    <div
    style={{
        display: 'flex',
            position: 'absolute',
            top: 80,
            left: 425,
            width: 140,
            height: 30,
            color: '#000000',
            backgroundColor: '#f3f4f6',
            borderColor: '#99a1af',
            borderWidth: 2,
            borderRadius: 8,
    }}
    />
    <img
    src={determineRP(rating)}
    alt={'rating plate'}
    height={32}
    width={163}
    style={{
        position: 'absolute',
            top: 79,
            left: 570,
    }}
    />
    <div
    style={{
        display: 'flex',
            position: 'absolute',
            top: 85,
            left: 648,
            color: '#ffffff',
            letterSpacing: 3,
    }}
>
    {rating}
    </div>
    <img
    src={profile.dan!}
    alt={'dan'}
    style={{
        width: 72,
            height: 30,
            position: 'absolute',
            top: 116,
            left: 425,
    }}
    />
    <img
    src={profile.rank!}
    alt={'rank'}
    style={{
        width: 60,
            height: 35,
            position: 'absolute',
            top: 114,
            left: 505,
    }}
    />
    <img
    src={profile.userCollectionCount!.img!}
    alt={'collection img'}
    style={{
        width: 25,
            height: 25,
            position: 'absolute',
            top: 120,
            left: 574,
    }}
    />
    <p
    style={{
        position: 'absolute',
            top: 107,
            left: 604,
            color: '#101828',
            fontWeight: 500,
    }}
>
    {profile.userCollectionCount!.text!}
    </p>
    <p
    style={{
        position: 'absolute',
            top: 36,
            left: 465,
            fontSize: 14,
    }}
>
    {truncateByWidth(profile.userDetail!, 28)}
    </p>
    <p
    style={{
        paddingLeft: 4,
            top: 68,
            left: 427,
    }}
>
    {truncateByWidth(profile.userName!, 12)}
    </p>

    <div
    style={{
        position: 'absolute',
            top: 230,
            left: 0,
            width: 1400,
            display: 'flex',
            flexDirection: 'column',
            padding: 12,
            gap: 70,
    }}
>
    <div
        style={{
        display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            width: '100%',
            alignContent: 'flex-start',
    }}
>
    {b35.map((s, idx) => (
        <B50Card info={s} key={`old-${idx}`} />
    ))}
    </div>

    <div
    style={{
        display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            width: '100%',
            alignContent: 'flex-start',
    }}
>
    {b15.map((s, idx) => (
        <B50Card info={s} key={`new-${idx}`} />
    ))}
    </div>
    </div>
    <h3
    style={{
        position: 'absolute',
            bottom: 12,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'MPlusMed',
            fontSize: 20,
    }}
>
    Designed by KVZ. Generated by AcidBot
    </h3>
    </div>
),
    {
    ...size,
        fonts: [
        {
            name: 'MPlusMed',
            data: mPlusMed,
            style: 'normal',
            weight: 500,
        },
        {
            name: 'MPlusReg',
            data: mPlusReg,
            style: 'normal',
            weight: 400,
        },
    ],
    }
);

    const imageRenderEnd = Date.now();
    console.log(`[b50Image] IMAGE RENDER COMPLETE: ${imageRenderEnd - imageRenderStart}ms (total: ${imageRenderEnd - funcStartTime}ms)`);

    return imageResponse;
}