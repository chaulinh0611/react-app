/**
 * Board Feature - FSD Layer 4
 *
 * 🎯 PURPOSE: Board display and management UI
 * 📤 EXPORTS: UI components only (BoardList, BoardLayout, ListCard)
 * ❌ NO EXPORTS: useBoard, board types, or mutations
 *
 * 💡 WHY UI-ONLY?
 * - Features compose lower layers; don't re-export logic
 * - Business logic lives in @/entities/board
 * - Import board queries/mutations from @/entities/board
 *
 * 📍 USAGE:
 *   import { BoardList } from '@/features/board';
 *   import { useGetBoardById, useCreateBoard } from '@/entities/board'; // For logic
 */

export * from './ui/BoardList';
export * from './ui/BoardLayout';
export * from './ui/ListCard';
