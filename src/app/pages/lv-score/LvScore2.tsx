'use client';

import ErrorModal from '@/components/ui/ErrorModal';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {MaimaiLevelMap, NP} from '@/lib/consts';
import {Best50Songs, MaimaiFetchData, MSSB50, ParsedProfile} from '@/lib/types';
import Image from 'next/image';
import B50BG from '../../../../public/b50/b50bg.png';
import B50Card from '@/components/b50/B50Card';
import {M_PLUS_Rounded_1c} from 'next/font/google';
import Logo from '../../../../public/b50/kv_logo_pc.png';
import {chooseNameplate, determineRatingPlate, truncateByWidth} from '@/lib/util';
import Trophy from '../../../../public/b50/trophy_normal.png';
import ImageGenerationModal from '@/components/ui/ImageGenerationModal';
import {captureElementToBlob} from '@/lib/captureUtils';
import {getResponseError} from '@/lib/apiResponse';

const PREVIEW_CARD_SCALE = 44;
const PREVIEW_CARD_PERCENTAGE = PREVIEW_CARD_SCALE / 100;
const PREVIEW_CARD_WIDTH = `${(16.5625 * PREVIEW_CARD_SCALE) / 100}rem`;
const PREVIEW_CARD_HEIGHT = `${(6.875 * PREVIEW_CARD_SCALE) / 100}rem`;
const PREVIEW_BASE_WIDTH = 672;
const PREVIEW_BASE_HEIGHT = 768;
const SONGS_PER_PAGE = 55;
const IMAGE_CAPTURE_PIXEL_RATIO = 3;

const mPlus = M_PLUS_Rounded_1c({
    weight: ['400', '500'],
    display: 'swap',
    subsets: ['latin'],
    preload: false,
});

export default function LvScore2() {
    const [error, setError] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [generatingImage, setGeneratingImage] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [generating, setGenerating] = useState<boolean>(false);
    const [level, setLevel] = useState('1');
    const [songs, setSongs] = useState<MSSB50[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [nameplate] = useState(chooseNameplate(NP));
    const [profile, setProfile] = useState<ParsedProfile | null>(null);
    const [rating, setRating] = useState(0);
    const previewRef = useRef<HTMLDivElement>(null);
    const captureRef = useRef<HTMLDivElement>(null);
    const [previewScale, setPreviewScale] = useState(1);

    const updatePreviewScale = useCallback(() => {
        const preview = previewRef.current;

        if (!preview) {
            return;
        }

        const nextScale = Math.min(
            preview.clientWidth / PREVIEW_BASE_WIDTH,
            preview.clientHeight / PREVIEW_BASE_HEIGHT
        );

        setPreviewScale((currentScale) => (Math.abs(currentScale - nextScale) > 0.001 ? nextScale : currentScale));
    }, []);

    useEffect(() => {
        updatePreviewScale();

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', updatePreviewScale);
            return () => window.removeEventListener('resize', updatePreviewScale);
        }

        const observer = new ResizeObserver(updatePreviewScale);
        const preview = previewRef.current;

        if (preview) {
            observer.observe(preview);
        }

        return () => observer.disconnect();
    }, [updatePreviewScale]);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

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
        setCurrentPage(0);

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
                throw new Error(await getResponseError(levelRes));
            }

            const songRes: MSSB50[] = await levelRes.json();
            setSongs(songRes);

            const profileRes = await fetch('/api/v1/profile', {
                method: 'GET',
            });

            if (!profileRes.ok) {
                throw new Error(await getResponseError(profileRes));
            }

            const profileData = await profileRes.json();
            setProfile(profileData);

            const historyRes = await fetch('/api/v1/b50/history', {
                method: 'GET',
            });

            if (!historyRes.ok) {
                setRating(0);
            } else {
                const b50: Best50Songs = await historyRes.json();
                setRating([...b50.b35, ...b50.b15].reduce((sum, s) => sum + s.rating, 0));
            }
        } catch (error) {
            showError((error as Error).message);
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    const sortedSongs = useMemo(
        () => [...songs].sort((a, b) => parseFloat(b.score.replace('%', '')) - parseFloat(a.score.replace('%', ''))),
        [songs]
    );
    const pageCount = Math.max(1, Math.ceil(sortedSongs.length / SONGS_PER_PAGE));
    const pageIndex = Math.min(currentPage, pageCount - 1);
    const paginatedSongs = useMemo(() => {
        const pageStart = pageIndex * SONGS_PER_PAGE;
        return sortedSongs.slice(pageStart, pageStart + SONGS_PER_PAGE);
    }, [pageIndex, sortedSongs]);

    const generateImage = async () => {
        if (sortedSongs.length === 0) {
            showError('No songs available. Generate LvScore before creating an image.');
            return;
        }

        setShowImageModal(true);
        setGeneratingImage(true);
        setImageUrl((currentUrl) => {
            if (currentUrl) {
                URL.revokeObjectURL(currentUrl);
            }
            return null;
        });

        try {
            updatePreviewScale();

            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => resolve());
                    });
                });
            });

            await document.fonts?.ready;
            await new Promise((resolve) => setTimeout(resolve, 100));

            const captureSurface = captureRef.current;

            if (!captureSurface) {
                throw new Error('LvScore capture surface is not ready');
            }

            const blob = await captureElementToBlob(captureSurface, {
                pixelRatio: IMAGE_CAPTURE_PIXEL_RATIO,
                style: {
                    transform: 'none',
                },
            });
            const url = URL.createObjectURL(blob);

            setImageUrl((currentUrl) => {
                if (currentUrl) {
                    URL.revokeObjectURL(currentUrl);
                }
                return url;
            });
        } catch (error) {
            showError((error as Error).message);
            setShowImageModal(false);
        } finally {
            setGeneratingImage(false);
        }
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setImageUrl((currentUrl) => {
            if (currentUrl) {
                URL.revokeObjectURL(currentUrl);
            }
            return null;
        });
    };

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />
            <ImageGenerationModal
                show={showImageModal}
                generating={generatingImage}
                imageUrl={imageUrl}
                onClose={closeImageModal}
                label={'LvScore'}
                downloadFileName={'lvscore.png'}
            />

            <div className={'min-h-[calc(100vh-5rem)] flex items-center justify-center'}>
                <div className={'card bg-base-300 h-[80vh] w-[100vh] shadow-2xl'}>
                    <div className={'card-body h-full flex-row p-0 rounded-xl'}>
                        <div
                            ref={previewRef}
                            className={`relative w-5/7 h-full bg-base-200 rounded-l-xl overflow-hidden ${mPlus.className}`}
                        >
                            <div
                                ref={captureRef}
                                className={'absolute top-0 left-0 p-8 origin-top-left'}
                                style={{
                                    width: `${PREVIEW_BASE_WIDTH}px`,
                                    height: `${PREVIEW_BASE_HEIGHT}px`,
                                    transform: `scale(${previewScale})`,
                                }}
                            >
                                <Image
                                    src={B50BG}
                                    alt={'b50 background'}
                                    fill
                                    sizes={`${PREVIEW_BASE_WIDTH}px`}
                                    className={'object-contain'}
                                />

                                <Image
                                    src={Logo}
                                    alt={'logo'}
                                    height={120 * PREVIEW_CARD_PERCENTAGE}
                                    loading={'eager'}
                                    className={'absolute top-5 left-5'}
                                    unoptimized
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
                                        'absolute w-47.75 h-12.25 left-41 top-4.5 bg-white rounded-sm border-gray-500 border z-10'
                                    }
                                />
                                <div
                                    className={'absolute w-47.25 h-11.75 left-42 top-5.25 bg-gray-500 rounded-sm z-0'}
                                />

                                {profile !== null && (
                                    <>
                                        <Image
                                            src={profile.profilePicture!}
                                            alt={'pfp'}
                                            width={42}
                                            height={42}
                                            unoptimized
                                            loading={'eager'}
                                            className={'absolute top-5.25 left-42 z-20'}
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
                                                'absolute top-3.25 left-54 flex w-27.5 h-6.25 items-center justify-center text-center text-[6.5px] text-black font-medium z-20'
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

                                        <div
                                            className={
                                                'absolute top-9 left-78.5 text-white tracking-[0.15em] text-[7.5px] z-20'
                                            }
                                        >
                                            {rating}
                                        </div>

                                        <Image
                                            src={profile.dan!}
                                            alt={'dan'}
                                            width={72 * 0.4}
                                            height={0}
                                            unoptimized
                                            loading={'eager'}
                                            className={'absolute top-12.75 left-53.5 z-20'}
                                        />
                                        <Image
                                            src={profile.rank!}
                                            alt={'dan'}
                                            width={60 * 0.45}
                                            height={0}
                                            unoptimized
                                            loading={'eager'}
                                            className={'absolute top-12.25 left-61.75 z-20'}
                                        />
                                        <Image
                                            src={profile.userCollectionCount!.img!}
                                            alt={'dan'}
                                            width={25 * 0.45}
                                            height={0}
                                            unoptimized
                                            loading={'eager'}
                                            className={'absolute top-12.5 left-70.5 z-20'}
                                        />
                                        <p
                                            className={
                                                'absolute top-12.5 left-74 text-gray-900/90 font-semibold z-20 text-[8px]'
                                            }
                                        >
                                            {profile.userCollectionCount!.text!}
                                        </p>
                                    </>
                                )}

                                <div className={'relative top-20 z-10 grid grid-cols-5 gap-1.5'}>
                                    {paginatedSongs.map((song, i) => (
                                        <div
                                            key={`${song.name}-${song.diff}-${pageIndex * SONGS_PER_PAGE + i}`}
                                            className={'relative'}
                                            style={{
                                                width: PREVIEW_CARD_WIDTH,
                                                height: PREVIEW_CARD_HEIGHT,
                                            }}
                                        >
                                            <B50Card info={song} sizePercent={PREVIEW_CARD_SCALE} />
                                        </div>
                                    ))}
                                </div>

                                <h3
                                    className={
                                        `absolute bottom-3 left-0 z-10 w-full text-center text-white text-[10px] ${mPlus.className} ` +
                                        `${sortedSongs.length === 0 ? 'hidden' : ''}`
                                    }
                                >
                                    Designed by KVZ. Generated by AcidBot
                                </h3>
                            </div>
                        </div>

                        <div className={'flex-1 min-w-0 h-full bg-base-300 p-6 rounded-r-xl overflow-hidden'}>
                            <div className={'flex h-full min-h-0 flex-col gap-3'}>
                                <button
                                    onClick={fetchResultWithClal}
                                    className={'btn btn-primary min-w-35 shrink-0'}
                                    disabled={generating}
                                >
                                    {generating ? (
                                        <span className={'flex items-center gap-2'}>
                                            <span className={'loading loading-spinner loading-sm'}></span>
                                            Generating...
                                        </span>
                                    ) : (
                                        'Generate LvScore'
                                    )}
                                </button>

                                <button
                                    onClick={generateImage}
                                    className={'btn btn-accent min-w-35 shrink-0'}
                                    disabled={sortedSongs.length === 0 || generatingImage || generating}
                                >
                                    Get Image
                                </button>

                                <div
                                    className={
                                        'min-h-0 flex-1 overflow-hidden text-center p-3 shadow-lg rounded-box bg-base-100 min-w-35'
                                    }
                                >
                                    <div className={'h-full min-h-0 overflow-y-auto flex flex-col gap-1'}>
                                        {Array.from({ length: 23 }, (_, i) => {
                                            const value = i + 1;

                                            return (
                                                <button
                                                    key={value}
                                                    type={'button'}
                                                    onClick={() => setLevel(value.toString())}
                                                    className={`btn btn-sm ${level === value.toString() ? 'btn-primary' : 'btn-ghost'}`}
                                                >
                                                    <span className={'w-full text-center'}>
                                                        LEVEL {MaimaiLevelMap[value]}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className={'flex shrink-0 items-center justify-center gap-2'}>
                                    <button
                                        type={'button'}
                                        className={'btn btn-square btn-sm'}
                                        onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                                        disabled={pageIndex === 0}
                                        aria-label={'Previous page'}
                                        title={'Previous page'}
                                    >
                                        &larr;
                                    </button>
                                    <span className={'min-w-16 text-center text-sm tabular-nums'}>
                                        {pageIndex + 1} / {pageCount}
                                    </span>
                                    <button
                                        type={'button'}
                                        className={'btn btn-square btn-sm'}
                                        onClick={() => setCurrentPage((page) => Math.min(pageCount - 1, page + 1))}
                                        disabled={pageIndex === pageCount - 1}
                                        aria-label={'Next page'}
                                        title={'Next page'}
                                    >
                                        &rarr;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
