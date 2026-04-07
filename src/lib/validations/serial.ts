import { z } from "zod"

export const SerialQuerySchema = z.object({
  search: z.string().max(200).optional(),
  productId: z.string().optional(),
  status: z.enum(["all", "in_stock", "sold", "reserved", "defective", "in_repair", "scrapped"]).default("all"),
  condition: z.enum(["all", "new", "good", "damaged", "defective"]).default("all"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
})

export const UpdateSerialSchema = z.object({
  status: z.enum(["in_stock", "sold", "reserved", "defective", "in_repair", "scrapped"]).optional(),
  condition: z.enum(["new", "good", "damaged", "defective"]).optional(),
  notes: z.string().max(1000).trim().nullable().optional(),
})

export type SerialQuery = z.infer<typeof SerialQuerySchema>
export type UpdateSerialPayload = z.infer<typeof UpdateSerialSchema>
