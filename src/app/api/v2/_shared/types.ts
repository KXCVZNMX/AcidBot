import { MSSB50, SongTags } from '@/app/api/_shared/types';

export enum ErrorCode {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_NOT_FOUND_OR_NO_PREV = 'USER_NOT_FOUND_OR_NO_PREV',
    INVALID_CLAL_TOKEN = 'INVALID_CLAL_TOKEN',
    UPSTREAM_MAINTENANCE = 'UPSTREAM_MAINTENANCE',
    MALFORMED_REQUEST = 'MALFORMED_REQUEST',
    DATABASE_ERROR = 'DATABASE_ERROR',
    FETCH_ERROR = 'FETCH_ERROR',
}

export interface ErrorResponse {
    error: string;
    code: ErrorCode;
}

export const UserNotFound: ErrorResponse = {
    error: 'User Not Found',
    code: ErrorCode.USER_NOT_FOUND,
};

export const UserNotFoundOrNoPrev: ErrorResponse = {
    error: 'User Not Found or No Previous Records',
    code: ErrorCode.USER_NOT_FOUND_OR_NO_PREV,
};

export const InvalidClalToken: ErrorResponse = {
    error: 'Invalid clal Token',
    code: ErrorCode.INVALID_CLAL_TOKEN,
};

export const UpstreamMaintenance: ErrorResponse = {
    error: 'Upstream Maintenance',
    code: ErrorCode.UPSTREAM_MAINTENANCE,
};

export const MalformedRequest: ErrorResponse = {
    error: 'Malformed Request',
    code: ErrorCode.MALFORMED_REQUEST,
};

export const DatabaseError: ErrorResponse = {
    error: 'Database Error',
    code: ErrorCode.DATABASE_ERROR,
};

export const FetchError: ErrorResponse = {
    error: 'Data fetched was incomplete or invalid, consider retying in a moment or fetching a new clal token',
    code: ErrorCode.FETCH_ERROR,
};

export type B50 = MSSB50[];

export interface SplitB50 {
    b15: MSSB50[];
    b35: MSSB50[];
}

export type b50WithTags = SongTags[];
