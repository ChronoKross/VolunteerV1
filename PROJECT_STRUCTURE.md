# VolunteerV1 Project Documentation

## 1. Project Entry and Layout
- `app/layout.tsx`: Main layout, theme provider, Google OAuth, navigation, and footer.
- `app/globals.css`: Global styles.

## 2. Authentication and User Management
- `app/(auth-pages)/sign-in/page.tsx`, `sign-up/page.tsx`, `forgot-password/page.tsx`, `reset-password/page.tsx`: Auth pages.
- `app/api/auth/callback/route.ts`: Auth callback route.
- `components/header-auth.tsx`: Auth header UI.
- `components/googleSignInButton/googleSignInButton.tsx.tsx`: Google sign-in button.

## 3. Supabase Integration
- `utils/supabase/client.ts`: Supabase client setup.
- `utils/supabase/server.ts`: Server-side Supabase utilities.
- `utils/supabase/check-env-vars.ts`: Checks for required Supabase environment variables.
- `lib/dbHelpers.ts`: All database helper functions, including employee and timeline logic.

## 4. Employee and Timeline Features
- `components/employeeStack/employeeStack.tsx`: Employee stack UI, shows employees and their total volunteered hours.
- `components/employeeTimeline/employeeTimeline.tsx`: Timeline UI, shows volunteer events, hours, and employee info.
- `hooks/useQueue.ts`: Logic for managing the employee queue/stack.
- `hooks/useTimeline.ts`: Logic for fetching and subscribing to timeline entries.

## 5. Types and Data Models
- `types/employee.ts`: Employee type definition.
- `types/supabase.ts`: Supabase-generated types for tables (including timeline and employees).

## 6. API Endpoints
- `app/api/employee/route.ts`: Handles employee actions (e.g., volunteering), calls dbHelpers.

## 7. Utilities and Helpers
- `lib/utils.ts`: General utility functions (e.g., class name merging).
- `components/ui/`: Reusable UI components (Avatar, Card, Button, etc.).

## 8. Theming and Branding
- `components/theme-switcher.tsx`: Theme switcher component.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `postcss.config.js`: PostCSS configuration.

## 9. Documentation and Metadata
- `README.md`: Project overview and setup instructions.
- `package.json`: Project dependencies and scripts.
- `next.config.ts`, `tsconfig.json`: Next.js and TypeScript configuration.

---

## Summary of Data Flow
1. User signs in (Google OAuth or email).
2. Employees and timeline data are fetched from Supabase using hooks (`useQueue`, `useTimeline`).
3. Volunteering actions are sent to `/api/employee/route.ts`, which uses `lib/dbHelpers.ts` to update the database (including timeline and total hours).
4. UI components (`employeeStack`, `employeeTimeline`) display live data, subscribing to changes via Supabase Realtime.
5. Theming and layout are managed globally in `app/layout.tsx` and `ThemeProvider`.

---

## Suggestions & To-Dos for Cleanup and Structure

- **Consolidate Utility Functions:**
  - Move all utility functions (e.g., initials, date formatting) to a single `lib/utils.ts` for reusability.
- **Consistent Naming:**
  - Standardize file and variable naming (e.g., `googleSignInButton.tsx.tsx` → `GoogleSignInButton.tsx`).
- **Type Safety:**
  - Ensure all hooks and helpers use TypeScript types from `types/employee.ts` and `types/supabase.ts`.
- **API Structure:**
  - Consider splitting API endpoints by resource (e.g., `/api/employees`, `/api/timeline`) for clarity.
- **Component Organization:**
  - Group related components (e.g., stack, timeline, UI) into feature folders.
- **Error Handling:**
  - Add user-friendly error messages and loading states throughout the UI.
- **Testing:**
  - Add unit and integration tests for hooks, helpers, and API routes.
- **Documentation:**
  - Expand this doc with setup instructions, environment variables, and deployment notes.
- **Accessibility:**
  - Review UI for accessibility (color contrast, keyboard navigation, ARIA labels).
- **Performance:**
  - Optimize data fetching and consider pagination or virtualization for large lists.
- **Security:**
  - Review Supabase RLS policies and API endpoint protections.

---

_Keep this file updated as your project evolves!_
