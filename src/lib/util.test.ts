import { describe, it, expect } from 'vitest';
import * as cheerio from 'cheerio';
import {matchRule, determineRank, truncateByWidth, extractScore, sortSongsFn, centerByWidth} from '@/lib/util';
import { SYNC_RULES, COMBO_RULES } from '@/lib/consts';
import {MSSB50} from '@/lib/types';

describe('matchRule', () => {
    it('returns the mapped value for the first matching needle', () => {
        expect(matchRule('a/music_icon_fdx.png', SYNC_RULES)).toBe('FDX');
        expect(matchRule('a/music_icon_fc.png', COMBO_RULES)).toBe('FC');
    });

    it('prefers the earlier rule when one needle is a prefix of another', () => {
        // 'music_icon_fsp' must win over the later 'music_icon_fs' entry
        expect(matchRule('x/music_icon_fsp.png', SYNC_RULES)).toBe('FS+');
    });

    it('returns null when nothing matches', () => {
        expect(matchRule('x/unrelated.png', SYNC_RULES)).toBeNull();
    });
});

describe('determineRank', () => {
    it.each([
        ['101.0000%', 'SSS+'],
        ['100.2500%', 'SSS'],
        ['99.7500%', 'SS+'],
        ['99.2500%', 'SS'],
        ['98.5000%', 'S+'],
        ['97.5000%', 'S'],
        ['95.0000%', 'AAA'],
        ['92.0000%', 'AA'],
        ['85.0000%', 'A'],
        ['77.0000%', 'BBB'],
        ['72.0000%', 'BB'],
        ['65.0000%', 'B'],
        ['55.0000%', 'C'],
        ['30.0000%', 'D'],
    ])('maps %s to rank %s', (achievement, rank) => {
        expect(determineRank(achievement)).toBe(rank);
    });
});

describe('truncateByWidth', () => {
    it('returns the input unchanged when it fits', () => {
        expect(truncateByWidth('ab', 100)).toBe('ab');
    });

    it('truncates ASCII text and appends an ellipsis', () => {
        expect(truncateByWidth('abcdefghij', 5)).toBe('ab...');
    });

    it('counts CJK characters as double width', () => {
        expect(truncateByWidth('一二三四', 6)).toBe('一...');
    });
});

describe('extractScore', () => {
    it('parses a getB50 card (DX/STD marker on the wrapper)', () => {
        const html = `
            <div class="w_450 m_15 p_3 f_0 t_l">
                <img class="music_kind_icon" src="/img/music_standard.png">
                <div class="music_master_score_back w_415 f_0">
                    <img src="/img/diff_master.png">
                    <img src="/img/music_icon_fsp.png">
                    <img src="/img/music_icon_fc.png">
                    <div class="music_name_block t_l f_l f_14 break">Test Song</div>
                    <div class="music_score_block t_r f_l f_14">100.6000%</div>
                    <div class="music_score_block t_r f_l f_12">1234</div>
                </div>
            </div>`;

        const [row, ...rest] = extractScore(cheerio.load(html), 'getB50');
        expect(rest).toHaveLength(0);
        expect(row).toMatchObject({
            name: 'Test Song',
            score: '100.6000%',
            dx: '1234',
            isDx: 'std',
            diff: 'master',
            sync: 'FS+',
            combo: 'FC',
            rank: 'SSS+',
        });
    });

    it('parses a getLevel card (DX/STD marker on the card)', () => {
        const html = `
            <div class="w_450 m_15 p_3 f_0 t_l">
                <div class="music_expert_score_back w_415 f_0">
                    <img class="music_kind_icon" src="/img/music_dx.png">
                    <img src="/img/diff_expert.png">
                    <div class="music_name_block t_l f_l f_14 break">Lv Song</div>
                    <div class="music_score_block t_r f_l f_14">99.6000%</div>
                    <div class="music_score_block t_r f_l f_12">800</div>
                </div>
            </div>`;

        const rows = extractScore(cheerio.load(html), 'getLevel');
        expect(rows).toHaveLength(1);
        expect(rows[0]).toMatchObject({
            name: 'Lv Song',
            isDx: 'dx',
            diff: 'expert',
            rank: 'SS+',
            sync: null,
            combo: null,
        });
    });

    it('skips cards missing a difficulty marker', () => {
        const html = `
            <div class="wrap">
                <img class="music_kind_icon" src="/img/music_standard.png">
                <div class="music_master_score_back">
                    <div class="music_name_block">No Diff</div>
                    <div class="music_score_block">99.0000%</div>
                    <div class="music_score_block">100</div>
                </div>
            </div>`;

        expect(extractScore(cheerio.load(html), 'getB50')).toHaveLength(0);
    });
});

describe('Sort Songs by rating then achievement', () => {
    it('parses scores', () => {
        const a: MSSB50 = {
            name: 'Test Song',
            score: '100.6000%',
            dx: '1234',
            isDx: 'std',
            diff: 'master',
            sync: 'FS+',
            combo: 'FC',
            rank: 'SSS+',
            levelConst: 14.9,
            rating: 335,
            dateIntlAdded: '0',
            achievement: 100.6000,
            jacketURL: '0',
        }

        const b: MSSB50 = {
            name: 'Test Song',
            score: '100.6000%',
            dx: '1234',
            isDx: 'std',
            diff: 'master',
            sync: 'FS+',
            combo: 'FC',
            rank: 'SSS+',
            levelConst: 14.8,
            rating: 333,
            dateIntlAdded: '0',
            achievement: 100.6000,
            jacketURL: '0',
        }

        const c: MSSB50 = {
            name: 'Test Song',
            score: '100.7000%',
            dx: '1234',
            isDx: 'std',
            diff: 'master',
            sync: 'FS+',
            combo: 'FC',
            rank: 'SSS+',
            levelConst: 14.9,
            rating: 335,
            dateIntlAdded: '0',
            achievement: 100.7000,
            jacketURL: '0',
        }

        const b3 = [a, b, c];
        b3.sort((a, b) => sortSongsFn(a, b));
        expect(b3).toStrictEqual([c, a, b]);
    })
})

describe('centerByWidth', () => {
    it('centers a string with equal padding', () => {
        expect(centerByWidth('hello', 9)).toBe('  hello  ');
    });

    it('puts the extra padding character on the right', () => {
        expect(centerByWidth('hello', 10)).toBe('  hello   ');
    });

    it('handles CJK characters with width 2', () => {
        expect(centerByWidth('你好', 10)).toBe('   你好   ');
    });

    it('handles mixed-width characters', () => {
        expect(centerByWidth('A你好', 10)).toBe('  A你好   ');
    });

    it('returns the string unchanged when it exactly fits', () => {
        expect(centerByWidth('hello', 5)).toBe('hello');
    });

    it('truncates when the string is too wide', () => {
        expect(centerByWidth('hello world', 8)).toBe('hello...');
    });

    it('supports custom padding', () => {
        expect(centerByWidth('hello', 9, '-')).toBe('--hello--');
    });
});