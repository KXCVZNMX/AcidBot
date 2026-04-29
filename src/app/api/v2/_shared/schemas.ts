import { z } from 'zod';
import type { MSSB50, SongTags } from '@/lib/types';

export type B50 = MSSB50[];

export interface SplitB50 {
    b15: MSSB50[];
    b35: MSSB50[];
}

export type b50WithTags = SongTags[];

export const MaimaiSongScoreSchema = z.object({
    name: z.string(),
    score: z.string(),
    diff: z.string(),
    dx: z.string(),
    isDx: z.string(),
    sync: z.string().nullable(),
    combo: z.string().nullable(),
    rank: z.string().nullable(),
}) satisfies z.ZodType<
    Omit<
        MSSB50,
        'levelConst' | 'rating' | 'dateIntlAdded' | 'achievement' | 'jacketURL'
    >
>;

export const MSSB50Schema = MaimaiSongScoreSchema.extend({
    levelConst: z.number(),
    rating: z.number(),
    dateIntlAdded: z.string(),
    achievement: z.number(),
    jacketURL: z.string(),
}) satisfies z.ZodType<MSSB50>;

export const SongTagsSchema = z.object({
    achievement: z.number(),
    levelConst: z.number(),
    tags: z.number().array(),
}) satisfies z.ZodType<SongTags>;

export const B50Schema = MSSB50Schema.array();
export const SplitB50Schema = z.object({
    b15: MSSB50Schema.array(),
    b35: MSSB50Schema.array(),
});
export const B50WithTagsSchema = SongTagsSchema.array();

export const UserClalSchema = z.object({
    id: z.string().min(1),
    clal: z.string().min(1),
});

export function parseUserClal(data: unknown): { id: string; clal: string } {
    return UserClalSchema.parse(data);
}

export function safeParseUserClal(data: unknown) {
    return UserClalSchema.safeParse(data);
}

export function parseB50(data: unknown): B50 {
    return B50Schema.parse(data);
}

export function safeParseB50(data: unknown) {
    return B50Schema.safeParse(data);
}

export function parseSplitB50(data: unknown): SplitB50 {
    return SplitB50Schema.parse(data);
}

export function safeParseSplitB50(data: unknown) {
    return SplitB50Schema.safeParse(data);
}

export function parseB50WithTags(data: unknown): b50WithTags {
    return B50WithTagsSchema.parse(data);
}

export function safeParseB50WithTags(data: unknown) {
    return B50WithTagsSchema.safeParse(data);
}
