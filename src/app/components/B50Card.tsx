import { MSSB50 } from '@/lib/types';
import Image from 'next/image';
import MusicDX from '../../../public/b50/music_dx.png';
import MusicSTD from '../../../public/b50/music_standard.png';
import React from 'react';
import { truncateByWidth } from '@/lib/util';
import SSSP from '../../../public/b50/SSSp.png';
import SSS from '../../../public/b50/SSS.png';
import SSP from '../../../public/b50/SSp.png';
import SS from '../../../public/b50/SS.png';
import SP from '../../../public/b50/Sp.png';
import S from '../../../public/b50/S.png';
import AAA from '../../../public/b50/AAA.png';
import AA from '../../../public/b50/AA.png';
import A from '../../../public/b50/A.png';
import BBB from '../../../public/b50/BBB.png';
import BB from '../../../public/b50/BB.png';
import B from '../../../public/b50/B.png';
import C from '../../../public/b50/C.png';
import D from '../../../public/b50/D.png';
import APP from '../../../public/b50/music_icon_app.png';
import AP from '../../../public/b50/music_icon_ap.png';
import FCP from '../../../public/b50/music_icon_fcp.png';
import FC from '../../../public/b50/music_icon_fc.png';
import EmptyCircle from '../../../public/b50/music_icon_back.png';
import FDXP from '../../../public/b50/music_icon_fdxp.png';
import FDX from '../../../public/b50/music_icon_fdx.png';
import FSP from '../../../public/b50/music_icon_fsp.png';
import FS from '../../../public/b50/music_icon_fs.png';
import SYNC from '../../../public/b50/music_icon_sync.png';
import FiveStar from '../../../public/b50/music_icon_dxstar_detail_5.png';
import FourStar from '../../../public/b50/music_icon_dxstar_detail_4.png';
import ThreeStar from '../../../public/b50/music_icon_dxstar_detail_3.png';
import TwoStar from '../../../public/b50/music_icon_dxstar_detail_2.png';
import OneStar from '../../../public/b50/music_icon_dxstar_detail_1.png';

const determineRankImage = (rank: string | null) => {
    if (rank === 'SSS+') {
        return SSSP;
    } else if (rank === 'SSS') {
        return SSS;
    } else if (rank === 'SS+') {
        return SSP;
    } else if (rank === 'SS') {
        return SS;
    } else if (rank === 'S+') {
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
};

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
};

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
};

const determineStarCount = (dx: string) => {
    const dxScore = dx.split('/');
    const achievedDx = parseInt(dxScore[0].replace(/,/g, ''));
    const maxDx = parseInt(dxScore[1].replace(/,/g, ''));
    const percentage = achievedDx / maxDx;
    if (percentage >= 0.97) {
        return (
            <Image
                src={FiveStar}
                alt={'dx stars'}
                width={52}
                className={'absolute top-[86px] left-[202px]'}
            />
        );
    } else if (percentage >= 0.95) {
        return (
            <Image
                src={FourStar}
                alt={'dx stars'}
                width={55}
                className={'absolute top-[86px] left-[201px]'}
            />
        );
    } else if (percentage >= 0.93) {
        return (
            <Image
                src={ThreeStar}
                alt={'dx stars'}
                width={60}
                className={'absolute top-[85px] left-[198px]'}
            />
        );
    } else if (percentage >= 0.9) {
        return (
            <Image
                src={TwoStar}
                alt={'dx stars'}
                width={65}
                className={'absolute top-[85px] left-[196px]'}
            />
        );
    } else if (percentage >= 0.85) {
        return (
            <Image
                src={OneStar}
                alt={'dx stars'}
                width={65}
                className={'absolute top-[85px] left-[194px]'}
            />
        );
    } else {
        return null;
    }
};

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

export default function B50Card({ info }: { info: MSSB50 }) {
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
        <div className={'card bg-white w-[265px] h-[110px] rounded-xl pt-1'}>
            <div
                className={'absolute mx-auto h-[75px] w-[255px] rounded-t-xl left-[5px]'}
                style={{ backgroundColor, color: textColor }}
            >
                <Image
                    src={`https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/${info.jacketURL}`}
                    alt={'jacket'}
                    width={75}
                    height={75}
                    className={
                        'absolute left-3 top-3 border-4 border-b-0 border-[#fff] rounded-lg'
                    }
                />
                <h2
                    className={
                        'absolute left-24 top-[2px] text-md font-semibold'
                    }
                    style={{ color: textColor }}
                >
                    {truncateByWidth(info.name, 20)}
                </h2>
                <hr
                    className={
                        'absolute left-[87px] top-[24px] w-[168px] h-[2px] bg-white border-0'
                    }
                />
                <h1
                    className={
                        'absolute left-[91px] top-[22px] text-[26px] font-[500] '
                    }
                    style={{ color: textColor, textShadow }}
                >
                    {`${info.achievement.toFixed(4)}%`}
                </h1>
                <p
                    className={'absolute left-[95px] top-[56px] text-xs'}
                    style={{ color: textColor }}
                >
                    {`${info.levelConst.toFixed(1)} → ${info.rating}`}
                </p>
                <p
                    className={'absolute left-[171px] top-[56px] text-xs'}
                    style={{ color: textColor }}
                >
                    {info.dx}
                </p>
                <Image
                    src={info.isDx === 'dx' ? MusicDX : MusicSTD}
                    alt={'music_dx_std'}
                    width={50}
                    className={'absolute top-[88px] left-6 '}
                />
                <Image
                    src={determineRankImage(info.rank)}
                    alt={'rank'}
                    width={50}
                    className={'absolute top-[79px] left-[90px]'}
                />
                <Image
                    src={determineComboImage(info.combo)}
                    alt={'combo'}
                    width={28}
                    className={'absolute top-[75px] left-[145px]'}
                />
                <Image
                    src={determineSyncImage(info.sync)}
                    alt={'sync'}
                    width={28}
                    className={'absolute top-[75px] left-[173px]'}
                />
                {determineStarCount(info.dx)}
            </div>
        </div>
    );
}
