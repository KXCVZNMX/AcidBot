import {truncateByWidth} from '@/lib/util';

{/* eslint-disable @next/next/no-img-element */}

import {NextRequest, NextResponse} from 'next/server';
import {UserClalSchema} from '@/app/api/v2/_shared/schemas';
import {MalformedRequest} from '@/app/api/v2/_shared/types';
import {MSSB50, ParsedProfile} from '@/lib/types';
import {ImageResponse} from 'next/og';
import {readFileSync} from 'fs';
import {join} from 'path';

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

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const {id: u_id} = await params;
    const url = req.nextUrl;
    const u_clal = url.searchParams.get('clal');

    const parsed = UserClalSchema.safeParse({id: u_id, clal: u_clal});

    if (!parsed.success) {
        return NextResponse.json(MalformedRequest, {status: 400});
    }

    const {id, clal} = parsed.data;

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

    const profileRes = await fetch(
        `${SITE_LINK}/api/v2/user/${id}/b50wProfile?clal=${clal}`
    );

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

    return new ImageResponse(
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
                        zIndex: 5
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
                        zIndex: 10,
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
                        zIndex: 20
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
                        zIndex: 20
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
                        zIndex: 20
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
                        zIndex: 20,
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
                        zIndex: 20
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
                        zIndex: 20
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
                        zIndex: 20
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
                        zIndex: 20
                    }}
                />
                <p
                    style={{
                        position: 'absolute',
                        top: 107,
                        left: 604,
                        color: '#101828',
                        fontWeight: 500,
                        zIndex: 20
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
                        zIndex: 20,
                    }}
                >
                    {truncateByWidth(profile.userDetail!, 28)}
                </p>
                <p
                    style={{
                        paddingLeft: 4,
                        top: 68,
                        left: 427,
                        zIndex: 20
                    }}
                >
                    {truncateByWidth(profile.userName!, 12)}
                </p>
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
    )
}