import {Best50Songs} from '@/app/api/_shared/types';

export interface Best50SongsWithDateRating {
    b50: Best50Songs;
    createdAt: Date;
    rating: number;
}
