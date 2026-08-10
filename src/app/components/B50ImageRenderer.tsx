import Image, {StaticImageData} from 'next/image';
import {M_PLUS_Rounded_1c} from 'next/font/google';
import B50Card from './B50Card';
import B50BG from '../../../public/b50/b50bg.png';
import Logo from '../../../public/b50/kv_logo_pc.png';
import Trophy from '../../../public/b50/trophy_normal.png';
import {MSSB50, ParsedProfile} from '@/lib/types';
import {determineRatingPlate, truncateByWidth} from '@/lib/util';
import React from 'react';

const mPlus = M_PLUS_Rounded_1c({
    weight: ['400', '500'],
    display: 'swap',
    subsets: ['latin'],
    preload: false,
});

export default function B50ImageRenderer({
    oldSong,
    newSong,
    profile,
    nameplate,
    rating,
    captureRef,
}: {
    oldSong: MSSB50[];
    newSong: MSSB50[];
    profile?: ParsedProfile;
    nameplate: StaticImageData;
    rating: number;
    captureRef: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <div className={'absolute -left-2499.75 top-0'}>
            <div
                className={`relative w-350 h-400 shrink-0 bg-cover bg-center bg-no-repeat ${mPlus.className}`}
                style={{ backgroundImage: `url(${B50BG.src})` }}
                ref={captureRef}
            >
                <Image src={Logo} alt={'logo'} height={120} loading={'eager'} className={'absolute top-15 left-5'} />
                <Image
                    src={nameplate}
                    alt={'nameplate'}
                    width={800}
                    loading={'eager'}
                    className={'absolute top-8.75 left-75 rounded-xl'}
                />
                {profile ? (
                    <>
                        <Image
                            src={profile.profilePicture!}
                            alt={'pfp'}
                            width={100}
                            height={100}
                            unoptimized
                            loading={'eager'}
                            className={'absolute top-12.5 left-79.25 z-20'}
                        />
                        <Image
                            src={Trophy}
                            alt={'trophy'}
                            width={220}
                            height={20}
                            loading={'eager'}
                            className={'absolute top-13.25 left-110 z-20'}
                        />
                        <p className={'absolute top-13 left-116.25 text-[14px] text-black font-extrabold z-20'}>
                            {truncateByWidth(profile.userDetail!, 28)}
                        </p>
                        <div
                            className={
                                'absolute top-20 left-106.25 w-35 h-7.5 text-black bg-gray-100 border-gray-400 border-2 rounded-lg z-20'
                            }
                        >
                            <p className={'pl-1'}>{truncateByWidth(profile.userName!, 12)}</p>
                        </div>
                        <Image
                            src={determineRatingPlate(rating)}
                            alt={'rating plate'}
                            height={32}
                            width={163}
                            loading={'eager'}
                            className={'absolute top-19.75 left-142.5 z-20'}
                        />
                        <div className={'absolute top-20.75 left-162 text-white tracking-[0.1875em] z-20'}>
                            {rating}
                        </div>
                        <Image
                            src={profile.dan!}
                            alt={'dan'}
                            width={72}
                            height={30}
                            unoptimized
                            loading={'eager'}
                            className={'absolute top-29 left-106.25 z-20'}
                        />
                        <Image
                            src={profile.rank!}
                            alt={'dan'}
                            width={60}
                            height={35}
                            unoptimized
                            loading={'eager'}
                            className={'absolute top-28.5 left-126.25 z-20'}
                        />
                        <Image
                            src={profile.userCollectionCount!.img!}
                            alt={'dan'}
                            width={25}
                            height={25}
                            unoptimized
                            loading={'eager'}
                            className={'absolute top-29.5 left-143.5 z-20'}
                        />
                        <p className={'absolute top-29.25 left-151 text-gray-900/90 font-semibold z-20'}>
                            {profile.userCollectionCount!.text!}
                        </p>
                    </>
                ) : null}
                <div
                    className={
                        'absolute w-107.75 h-27.5 left-77.5 top-11.25 bg-white rounded-lg border-gray-500 border-2 z-10'
                    }
                />
                <div className={'absolute w-108.25 h-27.5 left-78.25 top-12.5 bg-gray-500 rounded-lg z-0'} />

                <div className={'absolute top-57.5 grid grid-cols-5 gap-2 p-3'}>
                    {oldSong.map((s, idx) => (
                        <B50Card info={s} key={`old-${idx}`} eager />
                    ))}

                    <hr className={'h-17.5 w-350 bg-none border-none col-span-5'} />

                    {newSong.map((s, idx) => (
                        <B50Card info={s} key={`new-${idx}`} eager />
                    ))}
                </div>

                {/*<Image*/}
                {/*    src={BGBase}*/}
                {/*    alt={'bg base'}*/}
                {/*    height={107}*/}
                {/*    width={1400}*/}
                {/*    className={'absolute bottom-10'}*/}
                {/*/>*/}
                {/*<div*/}
                {/*    className={'absolute bottom-0 bg-[#8aba45] w-full h-10'}*/}
                {/*/>*/}
                <h3 className={'absolute bottom-3 w-full text-center text-white font-bold text-xl'}>
                    Designed by KVZ. Generated by AcidBot
                </h3>
            </div>
        </div>
    );
}
