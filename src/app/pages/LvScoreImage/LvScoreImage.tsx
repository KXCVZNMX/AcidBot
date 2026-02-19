'use client';

import {Best50Songs, MaimaiFetchData, MSSB50} from "@/lib/types";
import React, {useEffect, useRef, useState} from "react";
import ErrorModal from "@/app/components/ErrorModal";
import {getCookie} from "@/lib/util";
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

const mPlus = M_PLUS_Rounded_1c({
    weight: ['400', '500'],
    display: 'swap',
});

export default function LvScoreImage() {
    const [level, setLevel] = useState('');
    const [songs, setSongs] = useState<MSSB50[]>([]);
    const [clal, setClal] = useState('');
    const [showModal, setShowModal] = useState(false);
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
                <div
                    className={`relative bg-[#6fbaee] w-[1400px] h-[1600px] shrink-0 ${mPlus.className}`}
                    ref={captureRef}
                >
                    <div
                        className={
                            'absolute top-[185px] grid grid-cols-5 gap-2 p-3'
                        }
                    >
                        {songs.map((s) => (
                            <B50Card info={s} key={s.name} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}