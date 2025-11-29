// Core validations - Shared across modules (NONE - all moved to modules)
// Re-export from their new locations for backwards compatibility:
export * from "@/modules/auth/validations/auth";
export * from "@/modules/auth/validations/profile";
export * from "@/modules/marketplace/validations/marketplace_author";

// Module-specific validations - Import from their respective modules:
// export * from "@/modules/agents/validations/agent";
// export * from "@/modules/connections/validations/connection";
// export * from "@/modules/conversations/validations/conversation";
// export * from "@/modules/conversations/validations/message";
// export * from "@/modules/integrations/validations/endpoint";
// export * from "@/modules/integrations/validations/integration";
// export * from "@/modules/marketplace/validations/marketplace";
// export * from "@/modules/notifications/validations/notification";
// export * from "@/modules/team/validations/team";
// export * from "@/modules/team/validations/team_member";
// export * from "@/modules/widget/validations/widget";
