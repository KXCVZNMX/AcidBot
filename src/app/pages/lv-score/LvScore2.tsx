'use client';

import ErrorModal from '@/app/components/ErrorModal';
import React, {useCallback, useMemo, useState} from 'react';
import {MaimaiLevelMap} from '@/lib/consts';
import {Best50Songs, MaimaiFetchData, MSSB50, ParsedProfile} from '@/lib/types';
import Image from 'next/image';
import B50BG from '../../../../public/b50/b50bg.png'
import B50Card from '@/app/components/B50Card';
import {M_PLUS_Rounded_1c} from 'next/font/google';
import Logo from '../../../../public/b50/kv_logo_pc.png';
import NP_bhx from '../../../../public/b50/NP_bhx.webp';
import NP_cf from '../../../../public/b50/NP_cf.webp';
import NP_cf_prism from '../../../../public/b50/NP_cf_prism.webp';
import NP_cf_festival from '../../../../public/b50/NP_cf_festival.webp';
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
import {chooseNameplate, determineRatingPlate, truncateByWidth} from '@/lib/util';
import Trophy from '../../../../public/b50/trophy_normal.png';

const PREVIEW_CARD_SCALE = 42;
const PREVIEW_CARD_PERCENTAGE = (PREVIEW_CARD_SCALE / 100);
const PREVIEW_CARD_WIDTH = `${(16.5625 * PREVIEW_CARD_SCALE) / 100}rem`;
const PREVIEW_CARD_HEIGHT = `${(6.875 * PREVIEW_CARD_SCALE) / 100}rem`;

const mPlus = M_PLUS_Rounded_1c({
    weight: ['400', '500'],
    display: 'swap',
    subsets: ['latin'],
    preload: false,
});

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
];

export default function LvScore2() {
    const [error, setError] = useState('')
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [generating, setGenerating] = useState<boolean>(false);
    const [level, setLevel] = useState('1');
    const [songs, setSongs] = useState<MSSB50[]>([]);
    const [nameplate] = useState(chooseNameplate(NP))
    const [profile, setProfile] = useState<ParsedProfile | null>(null);
    const [rating, setRating] = useState(0);

    const showError = useCallback((errorMessage: string) => {
        setError(errorMessage);
        setShowErrorModal(true);

        setTimeout(() => {
            setShowErrorModal(false);
            setError('');
        }, 2000);
    }, []);

    const fetchResultWithClal = async () => {
        setGenerating(true);
        setSongs([]);

        try {
            const config: MaimaiFetchData = {
                redirect: `https://maimaidx-eng.com/maimai-mobile/record/musicLevel/search/?level=${level}`,
            };

            const levelRes = await fetch('/api/v1/sheets/level', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });

            if (!levelRes.ok) {
                const { error } = await levelRes.json();
                showError(error);
                return;
            }

            const songRes: MSSB50[] = await levelRes.json();
            setSongs(songRes);

            const profileRes = await fetch('/api/v1/profile', {
                method: 'GET',
            });

            if (!profileRes.ok) {
                const { error } = await profileRes.json();
                showError(error);
                return;
            }

            const profileData = await profileRes.json();
            setProfile(profileData);

            const historyRes = await fetch('/api/v1/b50/history', {
                method: 'GET',
            });

            if (!historyRes.ok) {
                setRating(0);
            }

            const b50: Best50Songs = await historyRes.json();
            setRating([...b50.b35, ...b50.b15].reduce((sum, s) => sum + s.rating, 0));
        } catch (error) {
            showError((error as Error).message);
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    const sortedSongs = useMemo(
        () =>
            [...songs].sort(
                (a, b) =>
                    parseFloat(b.score.replace('%', '')) -
                    parseFloat(a.score.replace('%', ''))
            ),
        [songs]
    );

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />

            <div className={'min-h-[calc(100vh-5rem)] flex items-center justify-center'}>
                <div className={'card bg-base-300 h-[80vh] w-[100vh] shadow-2xl'}>
                    <div className={'card-body h-full flex-row p-0 rounded-xl'}>
                        <div className={`relative w-5/7 h-full bg-base-200 p-8 rounded-l-xl overflow-hidden ${mPlus.className}`}>
                            <Image
                                src={B50BG}
                                alt={'b50 background'}
                                fill
                                sizes={'(max-width: 768px) 100vw, 72vw'}
                                className={'object-contain'}
                            />

                            <Image
                                src={Logo}
                                alt={'logo'}
                                height={120 * PREVIEW_CARD_PERCENTAGE}
                                loading={'eager'}
                                className={'absolute top-5 left-5'}
                            />

                            <Image
                                src={nameplate}
                                alt={'nameplate'}
                                width={800 * PREVIEW_CARD_PERCENTAGE}
                                loading={'eager'}
                                className={'absolute top-3.75 left-40 rounded-sm'}
                            />

                            <div
                                className={
                                    'absolute w-47.75 h-11.5 left-41 top-4.5 bg-white rounded-sm border-gray-500 border z-10'
                                }
                            />
                            <div
                                className={
                                    'absolute w-47.25 h-11.25 left-42 top-5.25 bg-gray-500 rounded-sm z-0'
                                }
                            />

                            {(profile !== null) && (
                                <>
                                    <Image
                                        src={profile.profilePicture!}
                                        alt={'pfp'}
                                        width={42}
                                        height={42}
                                        unoptimized
                                        loading={'eager'}
                                        className={'absolute top-5 left-41.75 z-20'}
                                    />

                                    <Image
                                        src={Trophy}
                                        alt={'trophy'}
                                        width={110}
                                        height={25}
                                        loading={'eager'}
                                        className={'absolute top-5 left-54 z-20'}
                                    />

                                    <p
                                        className={
                                            'absolute top-5.25 left-57.5 text-[6.5px] text-black font-medium'
                                        }
                                    >
                                        {truncateByWidth(profile.userDetail!, 28)}
                                    </p>

                                    <div
                                        className={
                                            'absolute top-8.5 left-53.25 w-15.75 h-3.5 text-black bg-gray-100 border-gray-400 border rounded-xs z-20'
                                        }
                                    >
                                        <p className={'pl-px text-[7.5px] tracking-[0.15em]'}>
                                            {truncateByWidth(profile.userName!, 12)}
                                        </p>
                                    </div>

                                    <Image
                                        src={determineRatingPlate(rating)}
                                        alt={'rating plate'}
                                        height={0}
                                        width={0}
                                        loading={'eager'}
                                        className={'absolute top-8.5 left-70 z-20'}
                                        style={{
                                            width: '70px',
                                            height: 'auto',
                                        }}
                                        unoptimized
                                    />
                                </>
                            )}

                            <div className={'relative top-20 z-10 grid grid-cols-5 gap-1.5'}>
                                {sortedSongs.slice(0, 55).map((song, i) => (
                                    <div
                                        key={`${song.name}-${song.diff}-${i}`}
                                        className={'relative'}
                                        style={{
                                            width: PREVIEW_CARD_WIDTH,
                                            height: PREVIEW_CARD_HEIGHT,
                                        }}
                                    >
                                        <B50Card
                                            info={song}
                                            sizePercent={PREVIEW_CARD_SCALE}
                                        />
                                    </div>
                                ))}

                                <h3
                                    className={
                                        `relative top-3 w-full text-center text-white col-span-5 text-[10px] ${mPlus.className} ` +
                                        `${sortedSongs.length === 0 ? 'hidden' : ''}`
                                    }
                                >
                                    Designed by KVZ. Generated by AcidBot
                                </h3>
                            </div>
                        </div>

                        <div className={'flex-1 h-full bg-base-300 p-6 rounded-r-xl'}>
                            <div className={'flex flex-col gap-3 justify-center'}>
                                <button
                                    onClick={fetchResultWithClal}
                                    className={'btn btn-primary min-w-35'}
                                    disabled={generating}
                                >
                                    {generating ? (
                                        <span className={'flex items-center gap-2'}>
                                    <span
                                        className={
                                            'loading loading-spinner loading-sm'
                                        }
                                    ></span>
                                    Generating...
                                </span>
                                    ) : (
                                        'Generate LvScore'
                                    )}
                                </button>

                                <button
                                    // onClick={generateImage}
                                    className={'btn btn-accent min-w-35'}
                                    disabled={
                                        sortedSongs.length === 0
                                    }
                                >
                                    Get Image
                                </button>

                                <div className={'text-center p-3 shadow-lg rounded-box bg-base-100 min-w-35'}>
                                    <div className={'max-h-135 overflow-y-auto flex flex-col gap-1'}>
                                        {Array.from({ length: 23 }, (_, i) => {
                                            const value = i + 1;

                                            return (
                                                <button
                                                    key={value}
                                                    type={'button'}
                                                    onClick={() => setLevel(value.toString())}
                                                    className={
                                                        `btn btn-sm ${
                                                            level === value.toString()
                                                                ? 'btn-primary'
                                                                : 'btn-ghost'
                                                        }`
                                                    }
                                                >
                                                    <span className={'w-full text-center'}>
                                                        LEVEL {MaimaiLevelMap[value]}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
