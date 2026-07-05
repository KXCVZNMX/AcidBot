'use client';

import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import { MaimaiLevelMap } from '@/lib/consts';
import {
    Best50Songs,
    MaimaiFetchData,
    MSSB50,
    ParsedProfile,
} from '@/lib/types';
import { getCookie } from '@/lib/util';
import ErrorModal from '@/app/components/ErrorModal';
import B50Card from '@/app/components/B50Card';
import ImageGenerationModal from '@/app/components/ImageGenerationModal';
import LvScoreImageRenderer from '@/app/components/LvScoreImageRenderer';
import NP_salt_prism from '../../../../public/b50/NP_salt_prism.webp';
import { captureElementToBlob } from '@/lib/captureUtils';

export default function LvScore() {
    const [level, setLevel] = useState('1');
    const [songs, setSongs] = useState<MSSB50[]>([]);
    const [clal, setClal] = useState('');
    const [generating, setGenerating] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [generatingImage, setGeneratingImage] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [profile, setProfile] = useState<ParsedProfile>();
    const [rating, setRating] = useState(0);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setClal(getCookie('clal') || '');
    }, []);

    const captureRef = useRef<HTMLDivElement>(null);

    const [error, setError] = useState(() => !clal ? 'Missing Clal, please go to the guide page to fetch a new clal' : '');

    const showError = useCallback((errorMessage: string) => {
        setError(errorMessage);
        setShowErrorModal(true);

        setTimeout(() => {
            setShowErrorModal(false);
            setError('');
        }, 2000);
    }, []);

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    const fetchResultWithClal = async () => {
        if (!clal) {
            showError(
                'Missing Clal, please fetch a new clal from the guide page'
            );
            return;
        }

        setGenerating(true);
        setSongs([]);

        try {
            const config: MaimaiFetchData = {
                clal,
                redirect: `https://maimaidx-eng.com/maimai-mobile/record/musicLevel/search/?level=${level}`,
            };

            const res = await fetch('/api/v1/sheets/level', {
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

    const fetchCurrentRating = async () => {
        const res = await fetch('/api/v1/b50/history', {
            method: 'GET',
        });

        if (!res.ok) {
            return 0;
        }

        const b50: Best50Songs = await res.json();
        return [...b50.b35, ...b50.b15].reduce((sum, s) => sum + s.rating, 0);
    };

    const generateImage = async () => {
        if (!clal) {
            showError(
                'Missing Clal, please fetch a new clal from the guide page'
            );
            return;
        }

        if (sortedSongs.length === 0) {
            showError(
                'No songs available. Generate LvScore before creating an image.'
            );
            return;
        }

        setShowImageModal(true);
        setGeneratingImage(true);
        setImageUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return null;
        });

        try {
            if (!profile) {
                const profileRes = await fetch(`/api/v1/profile?clal=${clal}`, {
                    method: 'GET',
                });

                if (!profileRes.ok) {
                    const { error } = await profileRes.json();
                    throw new Error(error);
                }

                setProfile(await profileRes.json());
            }

            if (rating === 0) {
                setRating(await fetchCurrentRating());
            }

            await new Promise<void>((resolve) => {
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => resolve());
                    });
                });
            });

            await document.fonts?.ready;
            await new Promise((r) => setTimeout(r, 100));

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

            {showImageModal ? (
                <LvScoreImageRenderer
                    songs={sortedSongs}
                    profile={profile}
                    nameplate={NP_salt_prism}
                    rating={rating}
                    captureRef={captureRef}
                />
            ) : null}

            <div
                className={
                    'flex flex-col items-center gap-6 p-6 max-w-450 mx-auto'
                }
            >
                <div className={'flex flex-col items-center gap-4'}>
                    <form
                        className={
                            'text-center p-3 shadow-lg rounded-box bg-base-100'
                        }
                    >
                        <select
                            name={'level'}
                            className={
                                'select select-bordered w-48 text-center'
                            }
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                        >
                            {Array.from({ length: 23 }, (_, i) => (
                                <option key={i} value={i + 1}>
                                    LEVEL {MaimaiLevelMap[i + 1]}
                                </option>
                            ))}
                        </select>
                    </form>

                    <div className={'flex flex-wrap gap-3 justify-center'}>
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
                            onClick={generateImage}
                            className={'btn btn-accent min-w-35'}
                            disabled={
                                sortedSongs.length === 0 || generatingImage
                            }
                        >
                            Get Image
                        </button>
                    </div>
                </div>

                {sortedSongs.length > 0 ? (
                    <div
                        className={
                            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full place-items-center'
                        }
                    >
                        {sortedSongs.map((song, i) => (
                            <div
                                key={`${song.name}-${song.diff}-${i}`}
                                className={'relative'}
                            >
                                <div
                                    className={
                                        'absolute -top-2 -left-2 bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm z-10 shadow-lg'
                                    }
                                >
                                    {i + 1}
                                </div>
                                <B50Card info={song} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={'text-center py-12 text-gray-500'}>
                        <p className={'text-lg'}>
                            No songs available. Generate LvScore to see results.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
