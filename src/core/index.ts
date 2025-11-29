/**
 * CORE MODULE - Shared utilities, hooks, and types
 * Re-exports all commonly used core utilities
 */

// Hooks
export * from "./hooks/index";

// Services
export * from "./services/index";

// Utils
export { cn, getNotificationIcon, formatDate, formatDate_DistanceToNow } from "./utils/utils";
export { stripe, type StripeEvent, type StripeSubscription, type StripeCheckoutSession } from "./utils/stripe";
export { generateWidgetToken } from "./utils/jose";

// Validations
export * from "./validations/index";

// Constants
export * from "./constants/index";

// Supabase
export { createClient as createSupabaseClient } from "./supabase/client";
export { createClient as createSupabaseServerClient } from "./supabase/server";

