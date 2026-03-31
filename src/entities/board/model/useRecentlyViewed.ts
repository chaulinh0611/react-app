/**
 * Recently Viewed Boards – persisted in localStorage.
 * Stores up to MAX_RECENT board IDs per user.
 */
import { useCallback } from 'react';

const MAX_RECENT = 8;
const KEY = (userId: string) => `recently_viewed_boards_${userId}`;

export function getRecentBoardIds(userId: string): string[] {
    try {
        const raw = localStorage.getItem(KEY(userId));
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function useRecentBoards(userId: string | undefined) {
    const addRecentBoard = useCallback(
        (boardId: string) => {
            if (!userId) return;
            const ids = getRecentBoardIds(userId).filter((id) => id !== boardId);
            ids.unshift(boardId);
            localStorage.setItem(KEY(userId), JSON.stringify(ids.slice(0, MAX_RECENT)));
        },
        [userId],
    );

    const getRecentIds = useCallback(() => {
        if (!userId) return [];
        return getRecentBoardIds(userId);
    }, [userId]);

    return { addRecentBoard, getRecentIds };
}
