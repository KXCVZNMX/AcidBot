'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Best50Songs, MSSB50, ParsedProfile } from '@/lib/types';
import { getCookie, chooseNameplate, determineRatingPlate } from '@/lib/util';
import ErrorModal from '@/app/components/ErrorModal';
import B50CardGrid, { B50_GRID_BASE_WIDTH } from '@/app/components/B50CardGrid';
import SuccessModal from '@/app/components/SuccessModal';
import ImageGenerationModal from '@/app/components/ImageGenerationModal';
import B50ImageRenderer from '@/app/components/B50ImageRenderer';
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
import Image from 'next/image';
import { captureElementToBlob } from '@/lib/captureUtils';

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

export default function Best50() {
    const [clal, setClal] = useState('0');
    const [oldSong, setOldSong] = useState<MSSB50[]>([]);
    const [newSong, setNewSong] = useState<MSSB50[]>([]);
    const [error, setError] = useState('');
    const [generating, setGenerating] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [success, setSuccess] = useState('');
    const [showImageModal, setShowImageModal] = useState(false);
    const [generatingImage, setGeneratingImage] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [profile, setProfile] = useState<ParsedProfile>();
    const [nameplate, setNameplate] = useState(NP_salt_prism);
    const [gridScale, setGridScale] = useState(1);
    const [scaledGridHeight, setScaledGridHeight] = useState(0);
    const [statusText, setStatusText] = useState('');
    const [progress, setProgress] = useState({ current: 0, total: 0, level: 'easy' });

    const rating = [...oldSong, ...newSong].reduce(
        (sum, s) => sum + s.rating,
        0
    );

    const captureRef = useRef<HTMLDivElement>(null);
    const gridShellRef = useRef<HTMLDivElement>(null);
    const gridStageRef = useRef<HTMLDivElement>(null);

    const showError = (errorMessage: string) => {
        setError(errorMessage);
        setShowErrorModal(true);

        setTimeout(() => {
            setShowErrorModal(false);
            setError('');
        }, 2000);
    };

    useEffect(() => {
        (async () => {
            const clalCookie = getCookie('clal');
            if (!clalCookie) {
                showError(
                    'Missing Clal, please go to the guide page to fetch a new clal'
                );
                return;
            }

            setClal(clalCookie);
            try {
                setGenerating(true)

                const res = await fetch('/api/v1/b50/history', {
                    method: 'GET',
                });

                if (!res.ok) {
                    throw new Error(res.statusText);
                }

                const b50: Best50Songs = await res.json();
                setOldSong(b50.b35);
                setNewSong(b50.b15);

                setGenerating(false);
            } catch (error) {
                setError((error as Error).message);
                console.error(error);
            }
        })();
    }, []);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    const generateImage = async () => {
        if (!clal) {
            showError(
                'Missing Clal, please go to the guide page to fetch a new clal'
            );
            return;
        }

        setShowImageModal(true);
        setGeneratingImage(true);
        setImageUrl(null);

        try {
            // Fetch profile if not already loaded
            if (!profile) {
                const res = await fetch(`/api/v1/profile?clal=${clal}`, {
                    method: 'GET',
                });

                if (!res.ok) {
                    const { error } = await res.json();
                    throw new Error(error);
                }

                const profileData = await res.json();
                setProfile(profileData);
                setNameplate(chooseNameplate(NP));
            }

            // Wait for DOM updates and fonts to load
            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => resolve());
                    });
                });
            });

            await document.fonts?.ready;
            await new Promise((r) => setTimeout(r, 100));

            // Generate image
            if (!captureRef.current) {
                throw new Error('Image renderer not ready');
            }

            const blob = await captureElementToBlob(captureRef.current);

            const url = URL.createObjectURL(blob);
            setImageUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
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
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
            setImageUrl(null);
        }
    };

    const determineFetchingLevel = (url: string) => {
        if (url.endsWith('diff=0')) {
            return 'easy';
        } else if (url.endsWith('diff=1')) {
            return 'advanced';
        } else if (url.endsWith('diff=2')) {
            return 'expert';
        } else if (url.endsWith('diff=3')) {
            return 'master';
        } else {
            return 'remaster';
        }
    }

    const fetchB50WithClal = async () => {
        setGenerating(true);
        setOldSong([]);
        setNewSong([]);
        setStatusText('Logging in...');
        setProgress({ current: 0, total: 0, level: 'easy' });

        try {
            const res = await fetch(`/api/v1/b50?clal=${clal}`, {
                method: 'GET',
            });

            if (!res.ok) {
                const { error } = await res.json();
                showError(error);
                return;
            }

            if (!res.body) {
                throw new Error('ReadableStream not supported by browser or response missing body.');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const { value, done } = await reader.read();
                if (done) break; // Stream finished and completely closed

                // Convert Uint8Array chunk to readable text and add it to our buffer
                buffer += decoder.decode(value, { stream: true });

                // Split the accumulated text buffer by our explicit newline delimiter
                const lines = buffer.split('\n');

                // Pop the last element out. If the line was cut off mid-transit by network packets,
                // it goes back into the buffer to be completed by the NEXT network chunk.
                buffer = lines.pop() || '';

                // Iterate through every completed line chunk in this network burst
                for (const line of lines) {
                    if (!line.trim()) continue; // Ignore empty lines or ping marks

                    const packet = JSON.parse(line);

                    // Handle Real-Time Scraping Progress Updates
                    if (packet.type === 'progress') {
                        setStatusText('Downloading genre data...');
                        setProgress({ current: packet.current, total: packet.total, level: determineFetchingLevel(packet.url) });
                    }
                    // Handle General Status Shifts (e.g., Parsing phase)
                    else if (packet.type === 'status') {
                        setStatusText(packet.message);
                    }
                    // Handle Errors streamed mid-execution
                    else if (packet.type === 'error') {
                        throw new Error(packet.message);
                    }
                    // Handle final successful data completion payload
                    else if (packet.type === 'done') {
                        setSuccess('Successfully calculated and saved Best 50 details!');
                        setNewSong(packet.b15);
                        setOldSong(packet.b35);
                        setStatusText('Done');
                        setProgress({ current: 0, total: 0, level: 'easy' });
                    }
                }
            }
        } catch (error) {
            setError((error as Error).message);
            console.error(error);
        } finally {
            setGenerating(false);
        }
    };

    const saveB50 = async () => {
        try {
            if (newSong.length !== 15 || oldSong.length !== 35) {
                throw new Error('Either one of b15 or b35 is incomplete');
            }

            const entry: Best50Songs = {
                b35: oldSong,
                b15: newSong,
            };

            const res = await fetch('/api/v1/b50', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(entry),
            });

            if (!res.ok) {
                const { error } = await res.json();
                showError(error);
                return;
            }

            setShowSuccess(true);
            setSuccess('Successfully saved!');
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
        } catch (error) {
            showError((error as Error).message);
            console.error(error);
        }
    };

    const hasSongs = oldSong.length > 0 || newSong.length > 0;

    const updateScaledGrid = useCallback(() => {
        if (!hasSongs) {
            // Schedule state updates out of the immediate render pipeline frame
            requestAnimationFrame(() => {
                setGridScale(1);
                setScaledGridHeight(0);
            });
            return;
        }

        const shellWidth = gridShellRef.current?.clientWidth;
        const stageHeight = gridStageRef.current?.scrollHeight;

        if (!shellWidth || !stageHeight) {
            return;
        }

        const availableWidth = Math.max(shellWidth - 16, 0);
        const nextScale = Math.min(1, availableWidth / B50_GRID_BASE_WIDTH);

        // Defer real-time DOM measurements so they execute cleanly right after layout completes
        requestAnimationFrame(() => {
            setGridScale((prev) =>
                Math.abs(prev - nextScale) > 0.001 ? nextScale : prev
            );
            setScaledGridHeight((prev) => {
                const nextHeight = stageHeight * nextScale;
                return Math.abs(prev - nextHeight) > 0.5 ? nextHeight : prev;
            });
        });
    }, [hasSongs]);

    useEffect(() => {
        updateScaledGrid();

        if (typeof ResizeObserver === 'undefined') {
            window.addEventListener('resize', updateScaledGrid);
            return () => window.removeEventListener('resize', updateScaledGrid);
        }

        const observer = new ResizeObserver(() => updateScaledGrid());

        if (gridShellRef.current) {
            observer.observe(gridShellRef.current);
        }

        if (gridStageRef.current) {
            observer.observe(gridStageRef.current);
        }

        return () => observer.disconnect();
    }, [updateScaledGrid]);

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />
            <SuccessModal message={success} show={showSuccess} />
            <ImageGenerationModal
                show={showImageModal}
                generating={generatingImage}
                imageUrl={imageUrl}
                onClose={closeImageModal}
            />

            {/* Mount capture renderer on demand to avoid eager font/image downloads. */}
            {showImageModal ? (
                <B50ImageRenderer
                    oldSong={oldSong}
                    newSong={newSong}
                    profile={profile}
                    nameplate={nameplate}
                    rating={rating}
                    captureRef={captureRef}
                />
            ) : null}

            <div className={'min-h-screen bg-base-100 py-8 px-4'}>
                <div className={'flex flex-col items-center gap-8 max-w-4xl mx-auto'}>
                    {/* Rating and Status Side-by-Side Section */}
                    <div className={'flex flex-col md:flex-row gap-6 w-full md:max-w-4xl'}>
                        {/* Rating Plate Section */}
                        <div className={'flex-1 flex justify-center'}>
                            <div className={'w-full max-w-md relative bg-base-200 rounded-2xl p-8 flex flex-col items-center gap-6 shadow-lg'}>
                                {/* Rating Plate Image */}
                                <div className={'relative w-75 h-12.5 drop-shadow-lg'}>
                                    <Image
                                        src={determineRatingPlate(rating)}
                                        alt={'rating plate'}
                                        fill
                                        className={'object-contain'}
                                    />

                                    <div
                                        className={
                                            'absolute inset-0 flex items-center justify-start text-[26px] font-medium ' +
                                            `${rating < 14000 ? 'tracking-[0.17em] pl-34.25' : 'tracking-[0.17em] pl-36.75'}`
                                        }
                                    >
                                        {rating}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className={'flex flex-wrap gap-3 justify-center w-full'}>
                                    <button
                                        onClick={fetchB50WithClal}
                                        className={'btn btn-primary min-w-32 flex-1 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200'}
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
                                            'Generate B50'
                                        )}
                                    </button>

                                    <button
                                        onClick={saveB50}
                                        className={'btn btn-secondary min-w-32 flex-1 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200'}
                                    >
                                        Save B50
                                    </button>

                                    <button
                                        onClick={generateImage}
                                        className={'btn btn-accent min-w-32 flex-1 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200'}
                                        disabled={
                                            oldSong.length === 0 || newSong.length === 0
                                        }
                                    >
                                        Get Image
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Status Section */}
                        <div className={'flex-1 flex justify-center'}>
                            <div className={'w-full max-w-md bg-base-200 rounded-2xl p-8 shadow-lg flex flex-col justify-center'}>
                                {statusText && (
                                    <div className={'mb-4'}>
                                        <span className={'text-xs font-bold text-primary uppercase tracking-wider block mb-2'}>Status</span>
                                        <span className={'text-sm font-medium text-base-content'}>{statusText}</span>
                                    </div>
                                )}

                                {/* Interactive Progress Tracking Interface */}
                                {progress.total > 0 && (
                                    <div>
                                        <div className={'flex justify-between text-xs text-base-content/70 mb-3'}>
                                            <span className={'font-semibold'}>Fetching {progress.level} charts</span>
                                            <span className={'font-bold text-primary'}>{progress.current} / {progress.total}</span>
                                        </div>
                                        <div className={'w-full bg-base-300 h-2.5 rounded-full overflow-hidden shadow-inner'}>
                                            <div
                                                className={'bg-primary h-full transition-all duration-300 ease-out shadow-lg'}
                                                style={{ width: `${(progress.current / progress.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Empty state when no status or progress */}
                                {!statusText && progress.total === 0 && (
                                    <div className={'text-center text-base-content/50 text-sm'}>
                                        <p>Ready to generate your best 50!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cards Grid Section */}
                    <div className={'w-full'}>
                        {hasSongs ? (
                            <div className={'bg-base-200 rounded-2xl p-8 shadow-lg'}>
                                <div
                                    ref={gridShellRef}
                                    className={'relative w-full overflow-hidden rounded-lg'}
                                    style={{
                                        height:
                                            scaledGridHeight > 0
                                                ? `${scaledGridHeight}px`
                                                : undefined,
                                    }}
                                >
                                    <div
                                        ref={gridStageRef}
                                        className={'absolute left-1/2 top-0 origin-top'}
                                        style={{
                                            width: `${B50_GRID_BASE_WIDTH}px`,
                                            transform: `translateX(-50%) scale(${gridScale})`,
                                        }}
                                    >
                                        <B50CardGrid oldSong={oldSong} newSong={newSong} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className={'bg-base-200 rounded-2xl p-12 shadow-lg'}>
                                <B50CardGrid oldSong={oldSong} newSong={newSong} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
