import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authMock, dbMock, unauthorizedMock } = vi.hoisted(() => ({
    authMock: vi.fn(),
    dbMock: vi.fn(),
    unauthorizedMock: vi.fn(),
}));

vi.mock('@/auth', () => ({
    auth: authMock,
}));

vi.mock('@/lib/db', () => ({
    default: {
        db: dbMock,
    },
}));

vi.mock('next/navigation', () => ({
    unauthorized: unauthorizedMock,
}));

import { GET } from './route';

describe('GET /api/v1/b50/history', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('returns empty b50 payload with no-store header when history is missing', async () => {
        authMock.mockResolvedValue({
            user: { id: '507f1f77bcf86cd799439011' },
        });

        const findOneMock = vi.fn().mockResolvedValue(null);
        const collectionMock = vi.fn().mockReturnValue({ findOne: findOneMock });
        dbMock.mockReturnValue({ collection: collectionMock });

        const res = await GET();

        expect(res.status).toBe(200);
        await expect(res.json()).resolves.toEqual({ b15: [], b35: [] });
        expect(res.headers.get('Cache-Control')).toBe('no-store');
    });

    it('returns stored b50 payload with no-store header when history exists', async () => {
        authMock.mockResolvedValue({
            user: { id: '507f1f77bcf86cd799439011' },
        });

        const findOneMock = vi.fn().mockResolvedValue({
            b15: [{ name: 'new' }],
            b35: [{ name: 'old' }],
        });
        const collectionMock = vi.fn().mockReturnValue({ findOne: findOneMock });
        dbMock.mockReturnValue({ collection: collectionMock });

        const res = await GET();

        expect(res.status).toBe(200);
        await expect(res.json()).resolves.toEqual({
            b15: [{ name: 'new' }],
            b35: [{ name: 'old' }],
        });
        expect(res.headers.get('Cache-Control')).toBe('no-store');
    });
});
