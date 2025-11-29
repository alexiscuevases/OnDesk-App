/\*\*

-   NEW MODULAR STRUCTURE GUIDE
-   =============================
-
-   MODULES - Feature-based modules
-   ├── auth/ - Authentication & authorization
-   ├── dashboard/ - Dashboard pages & components
-   ├── agents/ - AI Agents management
-   ├── conversations/ - Conversation management
-   ├── integrations/ - External integrations
-   ├── marketplace/ - Marketplace features
-   ├── connections/ - Connection management
-   ├── notifications/ - Notification system
-   ├── team/ - Team management
-   ├── widget/ - Widget functionality
-   └── shared/ - Shared components & UI
-
-   CORE - Shared utilities & infrastructure
-   ├── hooks/ - Custom React hooks (use-auth, use-teams, etc.)
-   ├── services/ - Business logic services
-   ├── utils/ - Utility functions & helpers
-   ├── constants/ - App constants & enums
-   ├── validations/ - Zod schemas for validation
-   ├── types/ - TypeScript types & interfaces
-   └── supabase/ - Supabase client configuration
-
-   UI - Design system components
-   ├── button.tsx
-   ├── card.tsx
-   ├── input.tsx
-   └── ... (all shadcn/ui components)
-
-   APP - Next.js pages & routes
-   └── (same structure as before, but with updated imports)
-
-   MIGRATION IMPORTS
-   =================
-
-   OLD:
-   import { useAuth } from "@/hooks/use-auth";
-   import { signUpSchema } from "@/lib/validations/auth";
-   import { cn } from "@/lib/utils";
-   import { Button } from "@/components/ui/button";
-
-   NEW:
-   import { useAuth } from "@/modules/auth";
-   import { signUpSchema } from "@/core/validations/auth";
-   import { cn } from "@/core/utils/utils";
-   import { Button } from "@/ui/button";
-   \*/

export const MIGRATION_STATUS = {
status: "IN PROGRESS",
completed_modules: [
"core/validations - ALL FILES COPIED",
"core/constants - ALL FILES COPIED",
"core/hooks - ALL FILES COPIED",
"core/services - ALL FILES COPIED",
"core/supabase - ALL FILES COPIED",
"core/utils - Main utility files copied",
"modules/auth - Partial setup",
"modules/dashboard/components - ALL FILES COPIED",
"modules/shared/components - ALL FILES COPIED",
"ui/ - ALL UI COMPONENTS COPIED",
],
pending_tasks: [
"Create index.ts files for all modules",
"Update all imports in src/app/",
"Create hooks for each module domain",
"Update imports in middleware.ts",
"Remove old src/components/ folder",
"Remove old src/hooks/ folder",
"Remove old src/lib/ folder (keep migrations if needed)",
"Test all imports and functionality",
],
};
