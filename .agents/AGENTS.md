# Spread Project Architecture & Coding Rules

## 1. Icon Usage Standard
- **No Direct Icon Imports in UI Components**: Never import icons directly from `lucide-react`, `react-icons`, or any third-party icon library inside individual UI components.
- **Central `useIcons` Hook**: Always consume icons using the project's central `useIcons()` hook (`client/src/hooks/useIcons.jsx`). Access icons via `const icons = useIcons();` (e.g., `{icons.appreciate}`, `{icons.refresh}`, `{icons.close}`).
- **Adding New Icons**: When introducing new icons, register them in `client/src/hooks/useIcons.jsx` under a clear, semantic key before consuming them in components.

## 2. API Fetching & Data Management Standard
- **No Direct API Calls in UI Components**: Never perform inline `fetch()` or direct `axios` requests inside UI components.
- **Service Layer Abstraction**: Define all API endpoint logic inside custom service modules under `client/src/services/` (e.g., `usePostsApis`, `useProfileApis`, `useAiApi`, `useAuthApi`, `publicApis`, `ChatApi`) leveraging `axiosInstance`.
- **TanStack Query State Management**: Always use **TanStack Query (`@tanstack/react-query`)** (`useQuery`, `useMutation`, `useInfiniteQuery`) inside UI components to execute service layer functions. Let TanStack Query manage caching, loading, error handling, mutations, and query invalidations.

## 3. Component Reuse & DRY Architecture
- **No Code Duplication**: Never duplicate UI structures, state logic, or helper methods across multiple components.
- **Global & Scoped Extraction**: Extract reusable logic into custom hooks (`client/src/hooks/`) or global components (`client/src/components/`). Scope page-specific sub-components cleanly within their parent page directory (e.g., `client/src/pages/<PageName>/components/`).

## 4. Architectural Freedom & Continuous Improvement
- You are encouraged to refine code patterns, enhance performance, and introduce modern technical best practices, provided all changes strictly adhere to the structural rules above.
