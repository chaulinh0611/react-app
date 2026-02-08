# 📋 Trello Clone - React App

A modern, feature-rich Trello clone built with React, TypeScript, and Feature-Sliced Design architecture. This application provides a comprehensive project management solution with boards, lists, cards, and real-time collaboration features.

![React](https://img.shields.io/badge/React-19.1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-7.1.6-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.13-cyan)

## ✨ Features

### 🎯 Core Functionality

- **Workspace Management** - Create and organize multiple workspaces
- **Board System** - Create, edit, and delete boards within workspaces
- **List Management** - Add, reorder, and manage lists on boards
- **Card System** - Create cards with rich details, descriptions, and metadata
- **Drag & Drop** - Intuitive drag-and-drop for cards and lists
- **Checklists** - Add and manage checklists within cards
- **User Authentication** - Secure login, registration, and password reset

### 🎨 User Experience

- **Modern UI** - Clean, responsive design with shadcn/ui components
- **Dark Mode Ready** - Theme support with next-themes
- **Real-time Updates** - Instant synchronization across the application
- **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

This project follows **Feature-Sliced Design (FSD)** methodology for scalable and maintainable architecture:

```
src/
├── app/              # Application initialization & providers
├── pages/            # Page components (routes)
├── features/         # Feature-specific logic & UI
│   ├── auth/         # Authentication features
│   ├── board/        # Board management
│   └── dashboard/    # Dashboard features
├── entities/         # Business entities
│   ├── auth/         # Auth entity
│   ├── board/        # Board entity
│   ├── card/         # Card entity
│   ├── checklist/    # Checklist entity
│   ├── list/         # List entity
│   └── workspace/    # Workspace entity
└── shared/           # Shared utilities & components
    ├── ui/           # Reusable UI components
    ├── lib/          # Utilities & helpers
    ├── config/       # Configuration
    └── assets/       # Static assets
```

### 📚 Key Architectural Principles

- **Separation of Concerns** - Each layer has a specific responsibility
- **Unidirectional Dependencies** - Lower layers don't depend on higher layers
- **Encapsulation** - Each slice is self-contained with its own API
- **Scalability** - Easy to add new features without affecting existing code

## 🛠️ Tech Stack

### Core

- **React 19.1.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 7.1.6** - Build tool & dev server

### State Management

- **Zustand 5.0.10** - Lightweight state management
- **React Hook Form 7.70.0** - Form state management
- **Zod 4.3.5** - Schema validation

### UI & Styling

- **TailwindCSS 4.1.13** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful icon library
- **next-themes** - Theme management

### Routing & Navigation

- **React Router DOM 7.9.5** - Client-side routing

### Data Fetching

- **Axios 1.12.2** - HTTP client
- **Query String 9.3.1** - URL query parsing

### Drag & Drop

- **@hello-pangea/dnd 18.0.1** - Drag and drop functionality

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript ESLint** - TypeScript-specific linting

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd react-app
    ```

2. **Install dependencies**

    ```bash
    pnpm install
    # or
    npm install
    ```

3. **Configure environment variables**

    Create a `.env` file in the root directory:

    ```env
    VITE_API_URL=http://localhost:3000/api
    ```

4. **Start the development server**

    ```bash
    pnpm dev
    # or
    npm run dev
    ```

    The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint

# Deploy to GitHub Pages
pnpm deploy
```

## 📁 Project Structure

### Entities Layer

Each entity follows a consistent structure:

```
entities/[entity-name]/
├── api/              # API calls
│   └── [entity].api.ts
├── model/            # State management & types
│   ├── [entity].store.ts
│   ├── [entity].selector.ts
│   └── [entity].type.ts
```

**Available Entities:**

- `auth` - Authentication & user session
- `board` - Board management
- `board-member` - Board membership
- `card` - Card management
- `checklist` - Checklist & items
- `list` - List management
- `users` - User data
- `workspace` - Workspace management

### Features Layer

Features contain business logic and UI components:

```
features/[feature-name]/
├── model/            # Feature-specific logic
├── ui/               # UI components
│   └── components/   # Sub-components
```

**Available Features:**

- `auth` - Login, register, password reset
- `board` - Board layout, lists, cards
- `dashboard` - Workspace & board overview

### Shared Layer

Reusable components and utilities:

```
shared/
├── ui/               # UI component library (shadcn/ui)
├── lib/              # Utilities & helpers
├── config/           # App configuration
├── assets/           # Static assets
└── routes/           # Route definitions
```

## 🔐 Authentication

The app supports multiple authentication methods:

- **Email/Password** - Traditional authentication
- **OAuth** - Google, GitHub (if configured)
- **Password Reset** - Secure password recovery flow

### Auth Flow

1. User registers or logs in
2. JWT token is stored in cookies
3. Axios interceptor adds token to requests
4. Automatic token refresh on expiry
5. Logout clears session data

## 🎨 UI Components

Built with **shadcn/ui** for consistency and accessibility:

- **Button** - Various variants and sizes
- **Card** - Content containers
- **Dialog** - Modal dialogs
- **Dropdown Menu** - Context menus
- **Input** - Form inputs
- **Label** - Form labels
- **Popover** - Floating content
- **Scroll Area** - Custom scrollbars
- **Separator** - Visual dividers
- **Tooltip** - Helpful hints

All components are fully typed and customizable via Tailwind classes.

## 🔄 State Management

### Zustand Stores

Each entity has its own Zustand store following this pattern:

```typescript
// State interface
interface EntityState {
    items: Record<string, Entity>;
    isLoading: boolean;
    error: string | null;
}

// Actions interface
interface EntityAction {
    fetchItems: () => Promise<Entity[]>;
    createItem: (data: CreateEntity) => Promise<Entity>;
    updateItem: (id: string, data: UpdateEntity) => Promise<Entity>;
    deleteItem: (id: string) => Promise<boolean>;
}

// Store creation
export const useEntityStore = create<EntityState & EntityAction>((set) => ({
    // ... implementation
}));
```

### Selectors

Selectors provide derived state and memoization:

```typescript
// Get entity by ID
export const useEntityById = (id: string) => useEntityStore((state) => state.items[id]);

// Get filtered entities
export const useFilteredEntities = (filter: Filter) =>
    useEntityStore((state) => Object.values(state.items).filter(filter));
```

## 🌐 API Integration

### Axios Configuration

- **Base URL** - Configured via `VITE_API_URL`
- **Interceptors** - Automatic token injection & refresh
- **Error Handling** - Centralized error management
- **Query Strings** - Automatic serialization

### API Structure

```typescript
// entities/[entity]/api/[entity].api.ts
export const EntityApi = {
    getAll: () => axios.get('/entities'),
    getById: (id: string) => axios.get(`/entities/${id}`),
    create: (data: CreateEntity) => axios.post('/entities', data),
    update: (id: string, data: UpdateEntity) => axios.put(`/entities/${id}`, data),
    delete: (id: string) => axios.delete(`/entities/${id}`),
};
```

## 🎯 Drag & Drop

Powered by `@hello-pangea/dnd` for smooth drag-and-drop:

- **List Reordering** - Drag lists to reorder
- **Card Movement** - Move cards between lists
- **Optimistic Updates** - Instant UI feedback
- **Error Recovery** - Rollback on API failure

## 📱 Responsive Design

- **Mobile-First** - Optimized for mobile devices
- **Breakpoints** - Tailwind's responsive utilities
- **Touch-Friendly** - Large touch targets
- **Adaptive Layouts** - Flexible grid systems

## 🧪 Code Quality

### Linting & Formatting

```bash
# Run ESLint
pnpm lint

# Format with Prettier (auto-format on save recommended)
```

### TypeScript

- **Strict Mode** - Enabled for maximum type safety
- **Path Aliases** - `@/` maps to `src/`
- **Type Definitions** - Comprehensive type coverage

## 🚢 Deployment

### GitHub Pages

```bash
# Build and deploy
pnpm deploy
```

The app will be deployed to: `https://chaulinh0611.github.io/react-app`

### Environment Variables

For production, ensure these are set:

```env
VITE_API_URL=https://your-api-url.com/api
```

## 🤝 Contributing

1. Follow the FSD architecture
2. Use TypeScript for all new code
3. Follow existing naming conventions
4. Write meaningful commit messages
5. Test your changes thoroughly

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Feature-Sliced Design](https://feature-sliced.design/) - Architecture methodology
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Radix UI](https://www.radix-ui.com/) - Primitive components
- [Tailwind CSS](https://tailwindcss.com/) - Styling framework

---

**Built with ❤️ using React + TypeScript + FSD**
