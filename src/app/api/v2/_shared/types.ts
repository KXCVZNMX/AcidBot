import {MSSB50, SongTags} from '@/lib/types';

export interface ErrorResponse {
    error: string;
    code: ErrorCode;
}

export enum ErrorCode {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_NOT_FOUND_OR_NO_PREV = 'USER_NOT_FOUND_OR_NO_PREV',
    INVALID_CLAL_TOKEN = 'INVALID_CLAL_TOKEN',
    UPSTREAM_MAINTENANCE = 'UPSTREAM_MAINTENANCE',
    MALFORMED_REQUEST = 'MALFORMED_REQUEST',
    DATABASE_ERROR = 'DATABASE_ERROR',
}

export type B50 = MSSB50[]

export interface SplitB50 {
    b15: MSSB50[]
    b35: MSSB50[]
}

export type b50WithTags = SongTags[]