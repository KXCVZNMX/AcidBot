import Image, { StaticImageData } from 'next/image';
import { M_PLUS_Rounded_1c } from 'next/font/google';
import B50Card from './B50Card';
import BGBase from '../../../public/b50/back_area.png';
import Logo from '../../../public/b50/kv_logo_pc.png';
import Trophy from '../../../public/b50/trophy_normal.png';
import { MSSB50, ParsedProfile } from '@/lib/types';
import { determineRatingPlate, truncateByWidth } from '@/lib/util';

const mPlus = M_PLUS_Rounded_1c({
    weight: ['400', '500'],
    display: 'swap',
    subsets: ['latin'],
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
        <div className={'absolute -left-[9999px] top-0'}>
            <div
                className={`relative bg-[#6fbaee] w-[1400px] h-[1600px] shrink-0 ${mPlus.className}`}
                ref={captureRef}
            >
                <Image
                    src={Logo}
                    alt={'logo'}
                    height={100}
                    className={'absolute top-[60px] left-[20px]'}
                />
                <Image
                    src={nameplate}
                    alt={'nameplate'}
                    width={800}
                    className={'absolute top-[35px] left-[300px] rounded-xl'}
                />
                {profile ? (
                    <>
                        <Image
                            src={profile.profilePicture!}
                            alt={'pfp'}
                            width={100}
                            height={100}
                            className={'absolute top-[50px] left-[317px] z-20'}
                        />
                        <Image
                            src={Trophy}
                            alt={'trophy'}
                            width={220}
                            height={20}
                            className={'absolute top-[53px] left-[440px] z-20'}
                        />
                        <p
                            className={
                                'absolute top-[52px] left-[465px] text-[14px] text-black font-extrabold z-20'
                            }
                        >
                            {truncateByWidth(profile.userDetail!, 28)}
                        </p>
                        <div
                            className={
                                'absolute top-[80px] left-[425px] w-[140px] h-[30px] text-black bg-gray-100 border-gray-400 border-2 rounded-lg z-20'
                            }
                        >
                            <p className={'pl-1'}>
                                {truncateByWidth(profile.userName!, 12)}
                            </p>
                        </div>
                        <Image
                            src={determineRatingPlate(rating)}
                            alt={'rating plate'}
                            width={110}
                            height={30}
                            className={'absolute top-[79px] left-[570px] z-20'}
                        />
                        <div
                            className={
                                'absolute top-[83px] left-[617px] text-white tracking-widest z-20'
                            }
                        >
                            {rating}
                        </div>
                        <Image
                            src={profile.dan!}
                            alt={'dan'}
                            width={72}
                            height={30}
                            className={'absolute top-[116px] left-[425px] z-20'}
                        />
                        <Image
                            src={profile.rank!}
                            alt={'rank'}
                            width={60}
                            height={35}
                            className={'absolute top-[114px] left-[505px] z-20'}
                        />
                        <Image
                            src={profile.userCollectionCount!.img!}
                            alt={'collection'}
                            width={25}
                            height={25}
                            className={'absolute top-[118px] left-[590px] z-20'}
                        />
                        <p
                            className={
                                'absolute top-[117px] left-[620px] text-gray-900/90 font-semibold z-20'
                            }
                        >
                            {profile.userCollectionCount!.text!}
                        </p>
                    </>
                ) : null}
                <div
                    className={
                        'absolute w-[375px] h-[110px] left-[310px] top-[45px] bg-white rounded-lg border-gray-500 border-2 z-10'
                    }
                />

                <div
                    className={
                        'absolute top-[245px] grid grid-cols-5 gap-2 p-3 gap-y-[8px]'
                    }
                >
                    {songs.slice(0, 50).map((song, idx) => (
                        <B50Card
                            info={song}
                            key={`${song.name}-${song.diff}-${idx}`}
                        />
                    ))}
                </div>

                <Image
                    src={BGBase}
                    alt={'bg base'}
                    height={107}
                    width={1400}
                    className={'absolute bottom-10'}
                />
                <div
                    className={'absolute bottom-0 bg-[#8aba45] w-full h-[40px]'}
                />
                <h3
                    className={
                        'absolute bottom-3 w-full text-center text-white font-bold text-xl'
                    }
                >
                    Designed by KVZ. Generated by AcidBot
                </h3>
            </div>
        </div>
    );
}
