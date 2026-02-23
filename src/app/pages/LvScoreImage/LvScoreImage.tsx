'use client';

import {Best50Songs, MaimaiFetchData, MSSB50, ParsedProfile} from "@/lib/types";
import React, {useEffect, useRef, useState} from "react";
import ErrorModal from "@/app/components/ErrorModal";
import {chooseNameplate, determineRatingPlate, getCookie, truncateByWidth} from "@/lib/util";
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
import {toBlob} from "html-to-image";
import {M_PLUS_Rounded_1c} from "next/font/google";
import B50Card from "@/app/components/B50Card";
import {MaimaiLevelMap} from "@/lib/consts";
import Image from "next/image";
import Logo from "../../../../public/b50/kv_logo_pc.png";

const mPlus = M_PLUS_Rounded_1c({
    weight: ['400', '500'],
    display: 'swap',
});

export default function LvScoreImage() {
    const [level, setLevel] = useState('');
    const [songs, setSongs] = useState<MSSB50[]>([]);
    const [clal, setClal] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [profile, setProfile] = useState<ParsedProfile>();
    const [nameplate, setNameplate] = useState(NP_salt_prism);
    const [rating, setRating] = useState(0);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);

    const captureRef = useRef<HTMLDivElement | null>(null);

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

        setClal(clalCookie);

        if (clalCookie) {
            setClal(clalCookie);
        }

        (async () => {
            const res = await fetch(`/api/fetchOldB50`, {
                method: 'GET',
            });

            if (!res.ok) {
                const { error } = await res.json();
                showError(error);
                return;
            }

            const b50: Best50Songs = await res.json();
            setRating(
                [...b50.b35, ...b50.b15].reduce((sum, s) => sum + s.rating, 0)
            );
        })()
    }, []);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    const buttonAction = async () => {
        setError('');
        setImageUrl((prev) => {
            if (prev) {
                URL.revokeObjectURL(prev);
            }
            return null;
        });

        await new Promise<void>((resolve) => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => resolve());
                });
            });
        });

        await document.fonts?.ready;
        await new Promise((r) => setTimeout(r, 50));

        await generateImageFromRef();
    };

    const generateImageFromRef = async () => {
        if (!captureRef.current) return;
        setGenerating(true);

        try {
            const blob = await toBlob(captureRef.current, {
                cacheBust: true,
                pixelRatio: 2,
            });

            if (!blob) {
                setError('Failed to generate image blob.');
                setGenerating(false);
                return;
            }

            const url = URL.createObjectURL(blob);

            setImageUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return url;
            });
        } catch (err) {
            console.error(err);
            setError((err as Error).message ?? 'Error generating image');
        } finally {
            setGenerating(false);
        }
    };

    const fetchResultWithClal = async (clalS: string) => {
        setSongs([]);

        try {
            const config: MaimaiFetchData = {
                clal: clalS,
                redirect: `https://maimaidx-eng.com/maimai-mobile/record/musicLevel/search/?level=${level}`,
            };

            const res = await fetch('/api/getLevel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });

            if (!res.ok) {
                const { error } = await res.json();
                showError(error);
                return;
            }

            const songRes: MSSB50[] = await res.json();
            setSongs(songRes);
            console.log(songs);
            setShowModal(true)

            const sRes = await fetch(`/api/fetchUserDetail?clal=${clalS}`, {
                method: 'GET',
            });

            if (!sRes.ok) {
                const { error } = await res.json();
                showError(error);
                return;
            }

            setProfile(await sRes.json());
            setNameplate(chooseNameplate(NP));
        } catch (error) {
            showError((error as Error).message);
            console.error(error);
        }
    };

    songs.sort(
        (a, b) =>
            parseFloat(b.score.replace('%', '')) -
            parseFloat(a.score.replace('%', ''))
    );

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />

            <div
                className={
                    'flex flex-col justify-center shadow-lg items-center'
                }
            >
                <form className={'text-center p-3 shadow-lg'}>
                    <select
                        name={'level'}
                        className={'w-30 text-center'}
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        {Array.from({ length: 23 }, (_, i) => (
                            <option key={i} value={i + 1}>
                                LEVEL {MaimaiLevelMap[i + 1]}
                            </option>
                        ))}
                    </select>
                </form>

                <button
                    onClick={async () => fetchResultWithClal(clal)}
                    className={'btn btn-primary'}
                >
                    Submit
                </button>

                <button onClick={async () => await buttonAction()} disabled={generating || !profile} className={'btn btn-secondary'}>
                    {generating || !profile ? 'Generating…' : 'Get Image'}
                </button>
            </div>

            <div
                className={
                    'flex flex-col justify-center items-center p-3 gap-3'
                }
            >
                <div className={'flex gap-2 items-center mt-4 mb-6'}>
                    {imageUrl && (
                        <>
                            <a
                                className={'btn btn-primary'}
                                href={imageUrl}
                                download={'b50.png'}
                            >
                                Download PNG
                            </a>
                        </>
                    )}
                </div>
                {imageUrl && (
                    <div className={'w-full max-w-[720px] px-4'}>
                        <img
                            src={imageUrl}
                            alt={'Generated '}
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                display: 'block',
                            }}
                        />
                    </div>
                )}
                <div className={'relative h-[1000px]'} />
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
                        className={
                            'absolute top-[35px] left-[300px] rounded-xl'
                        }
                    />
                    {profile ? (
                        <>
                            <Image
                                src={profile.profilePicture!}
                                alt={'pfp'}
                                width={100}
                                height={100}
                                className={
                                    'absolute top-[50px] left-[317px] z-20'
                                }
                            />
                            <Image
                                src={Trophy}
                                alt={'trophy'}
                                width={220}
                                height={20}
                                className={
                                    'absolute top-[53px] left-[440px] z-20'
                                }
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
                                className={
                                    'absolute top-[79px] left-[570px] z-20'
                                }
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
                                width={75}
                                height={50}
                                className={
                                    'absolute top-[116px] left-[425px] z-20'
                                }
                            />
                            <Image
                                src={profile.rank!}
                                alt={'dan'}
                                width={60}
                                height={50}
                                className={
                                    'absolute top-[114px] left-[505px] z-20'
                                }
                            />
                            <Image
                                src={profile.userCollectionCount!.img!}
                                alt={'dan'}
                                width={25}
                                height={50}
                                className={
                                    'absolute top-[116px] left-[590px] z-20'
                                }
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
                        {songs.slice(0, 50).map((s) => (
                            <B50Card info={s} key={s.name} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}