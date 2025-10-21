import { z } from "zod"

export const inviteTeamMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member", "viewer"]),
})

export type InviteTeamMemberInput = z.infer<typeof inviteTeamMemberSchema>
