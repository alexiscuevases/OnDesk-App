import { z } from "zod"

export const connectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["whatsapp", "website", "sms", "email"]),
  config: z.record(z.any()),
  status: z.enum(["active", "inactive"]).default("active"),
})

export type ConnectionInput = z.infer<typeof connectionSchema>
