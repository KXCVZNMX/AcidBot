'use client';

import React, {useEffect, useState} from 'react';
import Image, {StaticImageData} from "next/image";
import { M_PLUS_Rounded_1c } from "next/font/google";
import BGBase from '../../../../public/b50/back_area.png';
import MusicDX from '../../../../public/b50/music_dx.png';
import MusicSTD from '../../../../public/b50/music_standard.png'
import EmptyCircle from '../../../../public/b50/music_icon_back.png';
import FiveStar from '../../../../public/b50/music_icon_dxstar_detail_5.png';
import FourStar from '../../../../public/b50/music_icon_dxstar_detail_4.png';
import ThreeStar from '../../../../public/b50/music_icon_dxstar_detail_3.png';
import TwoStar from '../../../../public/b50/music_icon_dxstar_detail_2.png';
import OneStar from '../../../../public/b50/music_icon_dxstar_detail_1.png';
import SSSP from '../../../../public/b50/SSSp.png';
import SSS from '../../../../public/b50/SSS.png';
import SSP from '../../../../public/b50/SSp.png';
import SS from '../../../../public/b50/SS.png';
import SP from '../../../../public/b50/Sp.png';
import S from '../../../../public/b50/S.png';
import AAA from '../../../../public/b50/AAA.png';
import AA from '../../../../public/b50/AA.png';
import A from '../../../../public/b50/A.png';
import BBB from '../../../../public/b50/BBB.png';
import BB from '../../../../public/b50/BB.png';
import B from '../../../../public/b50/B.png';
import C from '../../../../public/b50/C.png';
import D from '../../../../public/b50/D.png';
import APP from '../../../../public/b50/music_icon_app.png'
import AP from '../../../../public/b50/music_icon_ap.png'
import FCP from '../../../../public/b50/music_icon_fcp.png'
import FC from '../../../../public/b50/music_icon_fc.png'
import FDXP from '../../../../public/b50/music_icon_fdxp.png'
import FDX from '../../../../public/b50/music_icon_fdx.png'
import FSP from '../../../../public/b50/music_icon_fsp.png'
import FS from '../../../../public/b50/music_icon_fs.png'
import SYNC from '../../../../public/b50/music_icon_sync.png'
import Logo from '../../../../public/b50/kv_logo_pc.png';
import NP_bhx from '../../../../public/b50/NP_bhx.webp';
import NP_cf from '../../../../public/b50/NP_cf.webp';
import NP_cf_festival from '../../../../public/b50/NP_cf_festival.webp';
import NP_cf_prism from '../../../../public/b50/NP_cf_prism.webp';
import NP_dlx from '../../../../public/b50/NP_dlx.webp';
import NP_kuro from '../../../../public/b50/NP_kuro.webp';
import NP_lime from '../../../../public/b50/NP_lime.webp';
import NP_lime_bud from '../../../../public/b50/NP_lime_bud.webp';
import NP_milk from '../../../../public/b50/NP_milk.webp';
import NP_milk_cat from '../../../../public/b50/NP_milk_cat.webp';
import NP_milk_prism from '../../../../public/b50/NP_milk_prism.webp';
import NP_milk_splash from '../../../../public/b50/NP_milk_splash.webp';
import NP_rasu from '../../../../public/b50/NP_rasu.webp';
import NP_rasu_bud from '../../../../public/b50/NP_rasu_bud.webp';
import NP_rasu_festival from '../../../../public/b50/NP_rasu_festival.webp';
import NP_riz_prism from '../../../../public/b50/NP_riz_prism.webp';
import NP_salt from '../../../../public/b50/NP_salt.webp';
import NP_salt_festival from '../../../../public/b50/NP_salt_festival.webp';
import NP_salt_prism from '../../../../public/b50/NP_salt_prism.webp';
import NP_sm from '../../../../public/b50/NP_sm.webp';
import NP_sm_splash from '../../../../public/b50/NP_sm_splash.webp';
import NP_yj from '../../../../public/b50/NP_yj.webp';
import NP_yj_bud from '../../../../public/b50/NP_yj_bud.webp';
import NP_yj_splash from '../../../../public/b50/NP_yj_splash.webp';
import Trophy from '../../../../public/b50/trophy_normal.png';
import {Best50Songs, MSSB50, ParsedProfile} from "@/lib/types";
import {getCookie} from "@/lib/util";
import ErrorModal from "@/app/components/ErrorModal";
import RatingNormal from "../../../../public/rating_plates/rating_base_normal.png";
import RatingBlue from "../../../../public/rating_plates/rating_base_blue.png";
import RatingGreen from "../../../../public/rating_plates/rating_base_green.png";
import RatingYellow from "../../../../public/rating_plates/rating_base_orange.png";
import RatingRed from "../../../../public/rating_plates/rating_base_red.png";
import RatingPurple from "../../../../public/rating_plates/rating_base_purple.png";
import RatingBronze from "../../../../public/rating_plates/rating_base_bronze.png";
import RatingSilver from "../../../../public/rating_plates/rating_base_silver.png";
import RatingGold from "../../../../public/rating_plates/rating_base_gold.png";
import RatingPlatinum from "../../../../public/rating_plates/rating_base_platinum.png";
import RatingRainbow from "../../../../public/rating_plates/rating_base_rainbow.png";

const mPlus = M_PLUS_Rounded_1c({
    weight: ["400", "500"],
    display: "swap",
});

function chooseNameplate(arr: StaticImageData[]) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
}

function truncateByWidth(
    input: string,
    maxWidth: number,
    ellipsis = "..."
): string {
    let width = 0;
    let result = "";

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
        (code >= 0x1f300 && code <= 0x1faff)   // Emoji (approximation)
    ) {
        return 2;
    } else if (code >= 0x41 && code <= 0x5a) {
        return 1.5
    }

    return 1;
}


const determineRankImage = (rank: string | null) => {
    if (rank === 'SSS+') {
        return SSSP;
    } else if (rank === 'SSS') {
        return SSS;
    } else if (rank === 'SSP') {
        return SSP;
    } else if (rank === 'SS') {
        return SS;
    } else if (rank === 'SP') {
        return SP;
    } else if (rank === 'S') {
        return S;
    } else if (rank === 'AAA') {
        return AAA;
    } else if (rank === 'AA') {
        return AA;
    } else if (rank === 'A') {
        return A;
    } else if (rank === 'BBB') {
        return BBB;
    } else if (rank === 'BB') {
        return BB;
    } else if (rank === 'B') {
        return B;
    } else if (rank === 'C') {
        return C;
    } else {
        return D;
    }
}

const determineComboImage = (combo: string | null) => {
    if (combo === 'AP+') {
        return APP;
    } else if (combo === 'AP') {
        return AP;
    } else if (combo === 'FC+') {
        return FCP;
    } else if (combo === 'FC') {
        return FC;
    } else {
        return EmptyCircle;
    }
}

const determineSyncImage = (sync: string | null) => {
    if (sync === 'FDX+') {
        return FDXP;
    } else if (sync === 'FDX') {
        return FDX;
    } else if (sync === 'FS+') {
        return FSP;
    } else if (sync === 'FS') {
        return FS;
    } else if (sync === 'SYNC') {
        return SYNC;
    } else {
        return EmptyCircle;
    }
}

const determineStarCount = (dx: string) => {
    const dxScore = dx.split('/');
    const achievedDx = parseInt(dxScore[0].replace(/,/g, ""));
    const maxDx = parseInt(dxScore[1].replace(/,/g, ""));
    const percentage = achievedDx / maxDx;
    if (percentage >= 0.97) {
        return <Image src={FiveStar} alt={'dx stars'} width={52} className={'absolute top-[86px] left-[202px]'} />;
    } else if (percentage >= 0.95) {
        return <Image src={FourStar} alt={'dx stars'} width={55} className={'absolute top-[86px] left-[201px]'} />;
    } else if (percentage >= 0.93) {
        return <Image src={ThreeStar} alt={'dx stars'} width={60} className={'absolute top-[85px] left-[198px]'} />;
    } else if (percentage >= 0.90) {
        return <Image src={TwoStar} alt={'dx stars'} width={65} className={'absolute top-[85px] left-[196px]'} />;
    } else if (percentage >= 0.85) {
        return <Image src={OneStar} alt={'dx stars'} width={65} className={'absolute top-[85px] left-[194px]'} />;
    } else {
        return null;
    }
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
        return '#22bb5b'
    }
}

const determineRatingPlate = (rating: number) => {
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
    } else if (rating < 14500 && rating >= 14000) {
        return RatingGold;
    } else if (rating < 15000 && rating >= 14500) {
        return RatingPlatinum;
    } else if (rating >= 15000) {
        return RatingRainbow;
    } else {
        return RatingRainbow;
    }
};

function Card({info}: {info: MSSB50}) {
    const backgroundColor = determineBackgroundColor(info.diff);
    const textColor = info.diff === 'remaster' ? '#9e45e2' : '#fff';
    return (
        <div className={'card bg-white w-[265px] h-[110px] rounded-xl pt-1'}>
            <div className={`relative mx-auto h-[75px] w-[255px] rounded-t-xl`} style={{ backgroundColor, color: textColor }}>
                <Image
                    src={`https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/${info.jacketURL}`}
                    alt={'jacket'}
                    width={75}
                    height={75}
                    className={'absolute left-3 top-3 border-4 border-b-0 border-[#fff] rounded-lg'}
                />
                <h2 className={'absolute left-24 top-[2px] text-md font-semibold'} style={{ color: textColor }}>
                    {truncateByWidth(info.name, 20)}
                </h2>
                <hr className={'absolute left-[87px] top-[24px] w-[168px] h-[2px] bg-white border-0'}/>
                <h1 className={'absolute left-[91px] top-[22px] text-[26px] font-[400]'} style={{ color: textColor }}>
                    {`${info.achievement.toFixed(4)}%`}
                </h1>
                <p className={'absolute left-[95px] top-[56px] text-xs'} style={{ color: textColor }}>
                    {`${info.levelConst.toFixed(1)} → ${info.rating}`}
                </p>
                <p className={'absolute left-[171px] top-[56px] text-xs'} style={{ color: textColor }}>
                    {info.dx}
                </p>
                <Image src={info.isDx === 'dx' ? MusicDX : MusicSTD} alt={'music_dx_std'} width={50} className={'absolute top-[88px] left-6 '} />
                <Image src={determineRankImage(info.rank)} alt={'rank'} width={50} className={'absolute top-[79px] left-[90px]'} />
                <Image src={determineComboImage(info.combo)} alt={'combo'} width={28} className={'absolute top-[75px] left-[145px]'} />
                <Image src={determineSyncImage(info.sync)} alt={'sync'} width={28} className={'absolute top-[75px] left-[173px]'} />
                {(determineStarCount(info.dx))}
            </div>
        </div>
    );
}


export default function Page() {
    const [oldSong, setOldSong] = useState<MSSB50[]>([]);
    const [newSong, setNewSong] = useState<MSSB50[]>([]);
    const [profile, setProfile] = useState<ParsedProfile>();
    const [nameplate, setNameplate] = useState(NP_salt_prism);
    const [rating, setRating] = useState(0);
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const NP = [
        NP_bhx,
        NP_cf,
        NP_cf_prism,
        NP_cf_festival,
        NP_dlx,
        NP_kuro,
        NP_lime,
        NP_lime_bud,
        NP_milk,
        NP_milk_cat,
        NP_milk_prism,
        NP_milk_splash,
        NP_rasu,
        NP_rasu_bud,
        NP_rasu_festival,
        NP_riz_prism,
        NP_salt,
        NP_salt_festival,
        NP_salt_prism,
        NP_sm,
        NP_sm_splash,
        NP_yj,
        NP_yj_bud,
        NP_yj_splash,
    ]

    const showError = (errorMessage: string) => {
        setError(errorMessage);
        setShowErrorModal(true);

        setTimeout(() => {
            setShowErrorModal(false);
            setError('');
        }, 2000);
    };

    useEffect(() => {
        const clalCookie = getCookie('clal');
        if (!clalCookie) {
            showError(
                'Missing Clal, please go to the guide page to fetch a new clal'
            );
            return;
        }

        (async () => {
            await fetchB50WithClal(clalCookie)
        })()
    }, []);

    useEffect(() => {
        setRating([...oldSong, ...newSong].reduce((sum, s) => sum + s.rating, 0))
    }, [oldSong, newSong]);

    const fetchB50WithClal = async (clalS: string) => {
        setOldSong([]);
        setNewSong([]);

        try {
            const res = await fetch(`/api/getB50?clal=${clalS}`, {
                method: 'GET',
            });

            if (!res.ok) {
                const { error } = await res.json();
                showError(error);
                return;
            }

            const b50: Best50Songs = await res.json();

            setOldSong(b50.b35);
            setNewSong(b50.b15);

            const sRes = await fetch(`/api/fetchUserDetail?clal=${clalS}`, {
                method: 'GET',
            });

            if (!sRes.ok) {
                const { error } = await res.json();
                showError(error);
                return;
            }

            setProfile(await sRes.json());
            setNameplate(chooseNameplate(NP))
        } catch (error) {
            setError((error as Error).message);
            console.error(error);
        }
    };

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />
            <div className={'flex flex-col justify-center items-center p-3 gap-3'}>
                <div className={`relative bg-[#6fbaee] w-[1400px] h-[1600px] shrink-0 ${mPlus.className}`}>
                    <Image src={Logo} alt={'logo'} height={100} className={'absolute top-[60px] left-[20px]'}/>
                    <Image src={nameplate} alt={'nameplate'} width={800} className={'absolute top-[35px] left-[300px] rounded-xl'} />
                    {profile ?
                        <>
                            <Image src={profile.profilePicture!} alt={'pfp'} width={100} height={100} className={'absolute top-[50px] left-[317px] z-20'} />
                            <Image src={Trophy} alt={'trophy'} width={220} height={20} className={'absolute top-[50px] left-[440px] z-20'} />
                            <p className={'absolute top-[49px] left-[465px] text-[14px] text-black font-extrabold z-20'}>
                                {truncateByWidth(profile.userDetail!, 28)}
                            </p>
                            <div className={'absolute top-[80px] left-[425px] w-[140px] h-[30px] text-black bg-gray-100 border-gray-400 border-2 rounded-lg z-20'}>
                                <p className={'pl-1'}>
                                    {truncateByWidth(profile.userName!, 12)}
                                </p>
                            </div>
                            <Image src={determineRatingPlate(rating)} alt={'rating plate'} width={110} height={30} className={'absolute top-[79px] left-[570px] z-20'} />
                            <div className={'absolute top-[83px] left-[617px] text-white tracking-widest z-20'}>
                                {rating}
                            </div>
                            <Image src={profile.dan!} alt={'dan'} width={75} height={50} className={'absolute top-[115px] left-[425px] z-20'} />
                            <Image src={profile.rank!} alt={'dan'} width={60} height={50} className={'absolute top-[113px] left-[505px] z-20'} />
                            <Image src={profile.userCollectionCount!.img!} alt={'dan'} width={25} height={50} className={'absolute top-[115px] left-[590px] z-20'} />
                            <p className={'absolute top-[116px] left-[620px] text-gray-900/90 font-semibold z-20'}>
                                {profile.userCollectionCount!.text!}
                            </p>
                        </>
                        : null
                    }
                    <div className={'absolute w-[375px] h-[110px] left-[310px] top-[45px] bg-white rounded-lg border-gray-500 border-2 z-10'} />
                    <div className={'absolute w-[377px] h-[110px] left-[313px] top-[50px] bg-gray-500 rounded-lg z-0'} />

                    <div className={'absolute top-[185px] grid grid-cols-5 gap-2 p-3'}>
                        {oldSong.map(s => (
                            <Card info={s} key={s.name}/>
                        ))}

                        <hr className={'h-[50px] w-[1400px] bg-none border-none col-span-5'} />

                        {newSong.map(s => (
                            <Card info={s} key={s.name}/>
                        ))}
                    </div>

                    <Image src={BGBase} alt={'bg base'} height={107} width={1400} className={'absolute bottom-10'} />
                    <div className={'absolute bottom-0 bg-[#8aba45] w-full h-[40px]'} />
                </div>
            </div>
        </>
    )
}