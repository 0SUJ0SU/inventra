import { z } from "zod"

export const CreateCategorySchema = z.object({
  name: z.string().min(2, "Min 2 characters").max(100).trim(),
  description: z.string().max(200).trim().nullable().optional(),
})

export const UpdateCategorySchema = CreateCategorySchema.partial()

export type CreateCategoryPayload = z.infer<typeof CreateCategorySchema>
export type UpdateCategoryPayload = z.infer<typeof UpdateCategorySchema>
