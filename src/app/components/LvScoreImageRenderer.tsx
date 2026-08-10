import Image, {StaticImageData} from 'next/image';
import {M_PLUS_Rounded_1c} from 'next/font/google';
import B50Card from './B50Card';
import BGBase from '../../../public/b50/back_area.png';
import Logo from '../../../public/b50/kv_logo_pc.png';
import Trophy from '../../../public/b50/trophy_normal.png';
import {MSSB50, ParsedProfile} from '@/lib/types';
import {determineRatingPlate, truncateByWidth} from '@/lib/util';

const mPlus = M_PLUS_Rounded_1c({
    weight: ['400', '500'],
    display: 'swap',
    subsets: ['latin'],
    preload: false,
});

export default function LvScoreImageRenderer({
    songs,
    profile,
    nameplate,
    rating,
    captureRef,
}: {
    songs: MSSB50[];
    profile?: ParsedProfile;
    nameplate: StaticImageData;
    rating: number;
    captureRef: React.RefObject<HTMLDivElement | null>;
}) {
    return (
        <div className={'absolute -left-2499.75 top-0'}>
            <div className={`relative bg-[#6fbaee] w-350 h-400 shrink-0 ${mPlus.className}`} ref={captureRef}>
                <Image src={Logo} alt={'logo'} height={100} loading={'eager'} className={'absolute top-15 left-5'} />
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
                            width={110}
                            height={30}
                            loading={'eager'}
                            className={'absolute top-19.75 left-142.5 z-20'}
                        />
                        <div className={'absolute top-20.75 left-154.25 text-white tracking-widest z-20'}>{rating}</div>
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
                            alt={'rank'}
                            width={60}
                            height={35}
                            unoptimized
                            loading={'eager'}
                            className={'absolute top-28.5 left-126.25 z-20'}
                        />
                        <Image
                            src={profile.userCollectionCount!.img!}
                            alt={'collection'}
                            width={25}
                            height={25}
                            unoptimized
                            loading={'eager'}
                            className={'absolute top-29.5 left-147.5 z-20'}
                        />
                        <p className={'absolute top-29.25 left-155 text-gray-900/90 font-semibold z-20'}>
                            {profile.userCollectionCount!.text!}
                        </p>
                    </>
                ) : null}
                <div
                    className={
                        'absolute w-93.75 h-27.5 left-77.5 top-11.25 bg-white rounded-lg border-gray-500 border-2 z-10'
                    }
                />

                <div className={'absolute top-61.25 grid grid-cols-5 gap-2 p-3 gap-y-2'}>
                    {songs.slice(0, 50).map((song, idx) => (
                        <B50Card info={song} key={`${song.name}-${song.diff}-${idx}`} eager />
                    ))}
                </div>

                <Image
                    src={BGBase}
                    alt={'bg base'}
                    height={107}
                    width={1400}
                    loading={'eager'}
                    className={'absolute bottom-10'}
                />
                <div className={'absolute bottom-0 bg-[#8aba45] w-full h-10'} />
                <h3 className={'absolute bottom-3 w-full text-center text-white font-bold text-xl'}>
                    Designed by KVZ. Generated by AcidBot
                </h3>
            </div>
        </div>
    );
}
