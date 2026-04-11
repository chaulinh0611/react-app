/**
 * Auth Feature - FSD Layer 4
 *
 * 🎯 PURPOSE: User authentication UI components
 * 📤 EXPORTS: UI components only (forms, dialogs)
 * ❌ NO EXPORTS: Hooks, types, or business logic
 *
 * 💡 WHY UI-ONLY?
 * - Features are toggleable; always export the visual part
 * - Business logic lives in @/entities/auth (reusable, composable)
 * - Import queries/mutations from @/entities/auth, not here
 *
 * 📍 USAGE:
 *   import { LoginForm } from '@/features/auth';
 *   import { useAuth } from '@/entities/auth'; // For auth logic
 */

export { LoginForm, RegisterForm, ForgotPasswordForm, ResetPasswordForm } from './ui';
