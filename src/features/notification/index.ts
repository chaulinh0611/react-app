/**
 * Notification Feature - FSD Layer 4
 *
 * 🎯 PURPOSE: Notification display UI (popover, toast, etc.)
 * 📤 EXPORTS: UI components only (NotificationPopover)
 * ❌ NO EXPORTS: useNotifications hook, notification types
 *
 * 💡 WHY UI-ONLY?
 * - Features are presentation layer
 * - Notification logic/queries live in @/entities/notification
 * - Realtime SSE integration in useNotificationSSE hook (entity layer)
 *
 * 📍 SSE INTEGRATION:
 * - Hook location: @/entities/notification/hooks/useNotificationSSE.ts
 * - Mounted in: /src/app/main-layout.tsx
 * - Connects to: /api/notifications/stream (SSE endpoint)
 *
 * 📍 USAGE:
 *   import { NotificationPopover } from '@/features/notification';
 *   import { useNotifications, useNotificationSSE } from '@/entities/notification'; // For logic
 */

export { NotificationPopover } from './ui/NotificationPopover';
