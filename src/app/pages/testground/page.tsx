'use client';

import React from 'react';
import Image from "next/image";
import { M_PLUS_Rounded_1c } from "next/font/google";
import BGBase from '../../../../public/b50/back_area.png';
import ImageIcon from '../../../../public/b50/temp.png';
import MusicDX from '../../../../public/b50/music_dx.png';
import EmptyCircle from '../../../../public/b50/empty_circle.svg';
import FiveStar from '../../../../public/b50/music_icon_dxstar_detail_5.png';
import SSSP from '../../../../public/b50/SSSp.png';

const mPlus = M_PLUS_Rounded_1c({
    weight: ["400", "700"],
    display: "swap",
});

// https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover-m/7f1e94161551e3863a590428813241950678cf838e9aac8be0fa6005d0fc8967.png
function Card() {
    return (
        <div className={'card bg-white w-[265px] h-[110px] rounded-xl pt-1'}>
            <div className={'relative mx-auto bg-[#9e45e2] h-[75px] w-[255px] rounded-t-xl'}>
                <Image
                    src={ImageIcon}
                    alt={'jacket'}
                    width={75}
                    height={75}
                    className={'absolute left-3 top-3 border-4 border-b-0 border-[#fff] rounded-lg'}
                />
                <h2 className={'absolute left-24 top-[0.5px] text-lg font-semibold text-white'}>
                    title
                </h2>
                <hr className={'absolute left-[87px] top-[24px] w-[168px] h-[2px] bg-white border-0'}/>
                <h1 className={'absolute left-[91px] top-[22px] text-[27px] text-white font-semibold'}>
                    100.9999%
                </h1>
                <p className={'absolute left-[95px] top-[56px] text-white text-xs'}>
                    {'14.6 -> 328'}
                </p>
                <p className={'absolute left-[175px] top-[56px] text-white text-xs'}>
                    {'9999 / 9999'}
                </p>
                <Image src={MusicDX} alt={'music_dx'} width={50} className={'absolute top-[88px] left-6'} />
                <Image src={SSSP} alt={'sss+'} width={50} className={'absolute top-[79px] left-[90px]'} />
                <Image src={EmptyCircle} alt={'empty_circle'} width={24} className={'absolute top-[79px] left-[150px]'} />
                <Image src={EmptyCircle} alt={'empty_circle'} width={24} className={'absolute top-[79px] left-[178px]'} />
                <Image src={FiveStar} alt={'five star'} width={45} className={'absolute top-[87px] left-[207px]'} />
            </div>
        </div>
    );
}


export default function Page() {
    return (
        <div className={'flex justify-center items-center'}>
            <div className={`relative bg-[#6fbaee] w-[1400px] h-[1600px] shrink-0 ${mPlus.className}`}>
                <div className={'grid grid-cols-5 gap-3 pl-1.5'}>
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </div>
                
                <Image src={BGBase} alt={'bg base'} height={107} width={1400} className={'absolute bottom-10'} />
                <div className={'absolute bottom-0 bg-[#8aba45] w-full h-[40px]'} />
            </div>
        </div>
    )
}