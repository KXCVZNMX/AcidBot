'use client';

import { useEffect, useState } from 'react';
import { Best50Songs, MSSB50 } from '@/lib/types';
import { getCookie } from '@/lib/util';
import ErrorModal from '@/app/components/ErrorModal';
import B50Table from '@/app/components/B50Table';
import SuccessModal from '@/app/components/SuccessModal';
import RatingNormal from '../../../../public/rating_plates/rating_base_normal.png';
import RatingBlue from '../../../../public/rating_plates/rating_base_blue.png';
import RatingGreen from '../../../../public/rating_plates/rating_base_green.png';
import RatingYellow from '../../../../public/rating_plates/rating_base_orange.png';
import RatingRed from '../../../../public/rating_plates/rating_base_red.png';
import RatingPurple from '../../../../public/rating_plates/rating_base_purple.png';
import RatingBronze from '../../../../public/rating_plates/rating_base_bronze.png';
import RatingSilver from '../../../../public/rating_plates/rating_base_silver.png';
import RatingGold from '../../../../public/rating_plates/rating_base_gold.png';
import RatingPlatinum from '../../../../public/rating_plates/rating_base_platinum.png';
import RatingRainbow from '../../../../public/rating_plates/rating_base_rainbow.png';
import Image from 'next/image';

export default function Best50() {
    const [clal, setClal] = useState('0');
    const [oldSong, setOldSong] = useState<MSSB50[]>([]);
    const [newSong, setNewSong] = useState<MSSB50[]>([]);
    const [error, setError] = useState('');
    const [rating, setRating] = useState(0);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const showError = (errorMessage: string) => {
        setError(errorMessage);
        setShowErrorModal(true);

        setTimeout(() => {
            setShowErrorModal(false);
            setError('');
        }, 2000);
    };

    const chooseRatingPlate = () => {
        if (rating < 1000) {
            return RatingNormal;
        } else if (rating < 2000 && rating >= 1000) {
            return RatingBlue;
        } else if (rating < 4000 && rating >= 2000) {
            return RatingGreen;
        } else if (rating < 7000 && rating >= 4000) {
            return RatingYellow;
        } else if (rating < 10000 && rating >= 7000) {
            return RatingRed;
        } else if (rating < 12000 && rating >= 10000) {
            return RatingPurple;
        } else if (rating < 13000 && rating >= 12000) {
            return RatingBronze;
        } else if (rating < 14000 && rating >= 13000) {
            return RatingSilver;
        } else if (rating < 14500 && rating >= 14000) {
            return RatingGold;
        } else if (rating < 15000 && rating >= 14500) {
            return RatingPlatinum;
        } else if (rating >= 15000) {
            return RatingRainbow;
        } else {
            return RatingRainbow;
        }
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

        (async () => {
            try {
                const res = await fetch('/api/fetchOldB50', {
                    method: 'GET',
                });

                if (!res.ok) {
                    throw new Error(res.statusText);
                }

                const b50: Best50Songs = await res.json();
                setOldSong(b50.b35);
                setNewSong(b50.b15);
            } catch (error) {
                setError((error as Error).message);
                console.error(error);
            }
        })();
    }, []);

    useEffect(() => {
        setRating(calculateRating());
    }, [oldSong, newSong]);

    const fetchB50WithClal = async () => {
        setOldSong([]);
        setNewSong([]);

        try {
            const res = await fetch(`/api/getB50?clal=${clal}`, {
                method: 'GET',
            });

            if (!res.ok) {
                const { error } = await res.json();
                showError(error);
                return;
            }

            const b50: Best50Songs = await res.json();

            setOldSong(b50.b35);
            setNewSong(b50.b15);
        } catch (error) {
            setError((error as Error).message);
            console.error(error);
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

            const res = await fetch('/api/SaveB50', {
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
            setTimeout(() => {
                setShowSuccess(false);
            }, 2000);
        } catch (error) {
            showError((error as Error).message);
            console.error(error);
        }
    };

    const calculateRating = () =>
        [...oldSong, ...newSong].reduce((sum, s) => sum + s.rating, 0);

    return (
        <>
            <ErrorModal error={error} show={showErrorModal} />
            <SuccessModal message={'Successfully saved!'} show={showSuccess} />

            <div className={'flex flex-col justify-center shadow-lg'}>
                <div
                    className={
                        'flex flex-col justify-center shadow-lg items-center'
                    }
                >
                    <div className={'flex flex-row gap-2'}>
                        <button
                            onClick={fetchB50WithClal}
                            className={'btn btn-primary'}
                        >
                            Submit
                        </button>

                        <button
                            onClick={saveB50}
                            className={'btn btn-secondary'}
                        >
                            Save
                        </button>
                    </div>

                    <div className={'relative w-[300px] h-[50px]'}>
                        <Image
                            src={chooseRatingPlate()}
                            alt={'rating plate'}
                            fill
                            className={'object-contain'}
                        />

                        <div
                            className={
                                'absolute inset-0 flex items-center justify-start pl-[140px] text-2xl tracking-[0.22em]'
                            }
                        >
                            {rating}
                        </div>
                    </div>
                </div>

                <div className={'overflow-x-auto'}>
                    <B50Table oldSong={oldSong} newSong={newSong} />
                </div>
            </div>
        </>
    );
}
