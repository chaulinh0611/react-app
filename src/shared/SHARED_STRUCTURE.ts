/**
 * Shared Layer - FSD Layer 1
 * ==========================
 *
 * Cross-cutting concerns, utilities, and reusable infrastructure
 * Used by all other layers (entities, features, pages, etc.)
 *
 * 📁 STRUCTURE:
 */

/**
 * /ui - Reusable UI Component Library
 * ===================================
 *
 * Contains: shadcn/ui component presets
 * Exports: Ready-to-use buttons, inputs, dialogs, etc.
 *
 * Examples:
 *   - Button
 *   - Input
 *   - Dialog
 *   - Card
 *   - etc.
 *
 * Usage:
 *   import { Button } from '@/shared/ui/button';
 *   import { Input } from '@/shared/ui/input';
 */

/**
 * /lib - Utility Functions
 * ========================
 *
 * Purpose: Helper functions used across the app
 * Rule: Non-domain-specific utilities (formatting, validation, etc.)
 *
 * Examples:
 *   - Date formatters (date-fns wrappers)
 *   - String validators
 *   - Common algorithms
 *
 * NOT: Business logic that belongs in entities
 */

/**
 * /models - Shared Type Definitions
 * ==================================
 *
 * Purpose: Common interfaces used across multiple entities/features
 *
 * Current files:
 *   - response.ts: Generic ApiResponse<T> type for all API calls
 *
 * Usage:
 *   import type { ApiResponse } from '@/shared/models/response';
 *
 * Examples:
 *   ApiResponse<Board> - wraps board API responses
 *   ApiResponse<User> - wraps user API responses
 */

/**
 * /config - Infrastructure & Service Configuration
 * ================================================
 *
 * Purpose: Global infrastructure setup and external service configs
 *
 * Current structure:
 *   ├── axiosInterceptor.ts  → JWT token refresh interceptor
 *   ├── endpoint.ts          → API base URL and endpoint config
 *   └── unsplash.ts          → Unsplash API client setup
 *
 * 🤔 ARCHITECTURE DECISION:
 *
 * Why grouped together?
 *   - All app-level configuration in one place
 *   - Centralized to prevent scattered config
 *
 * Could be split as:
 *   - /shared/infrastructure/ (axiosInterceptor, endpoint)
 *   - /shared/config/ (app-specific settings)
 *   - /shared/services/ (unsplash client)
 *
 * Current structure is pragmatic for small apps.
 * Future phase: Consider splitting for clarity as app grows.
 */

/**
 * /routes - Route Definitions
 * ===========================
 *
 * Purpose: Central routing configuration
 * Contains: Route paths, route definitions, navigation structure
 *
 * Usage: Imported by pages and main router
 */

/**
 * /assets - Static Resources
 * ==========================
 *
 * Purpose: Static files (fonts, icons, images)
 * Contains: Non-code assets used throughout the app
 */
