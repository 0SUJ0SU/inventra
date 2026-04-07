import { z } from "zod"

export const CreateProductSchema = z.object({
  sku: z.string().min(3, "Min 3 characters").max(50).trim(),
  name: z.string().min(2, "Min 2 characters").max(200).trim(),
  categoryId: z.string().min(1, "Required"),
  description: z.string().max(1000).trim().nullable().optional(),
  costPrice: z.number().nonnegative("Must be 0 or more"),
  sellingPrice: z.number().positive("Must be greater than 0"),
  stock: z.number().int().nonnegative().default(0),
  minStock: z.number().int().nonnegative().default(5),
  unit: z.string().max(20).default("pcs"),
  image: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  isSerialTracked: z.boolean().default(false),
  warrantyMonths: z.number().int().nonnegative().nullable().optional(),
})

export const UpdateProductSchema = CreateProductSchema.partial()

export const ProductQuerySchema = z.object({
  search: z.string().max(200).optional(),
  categoryId: z.string().optional(),
  status: z.enum(["all", "active", "inactive"]).default("all"),
  stock: z.enum(["all", "low", "out"]).default("all"),
  serial: z.enum(["all", "yes", "no"]).default("all"),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(50),
  sortBy: z.string().optional(),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
})

export type CreateProductPayload = z.infer<typeof CreateProductSchema>
export type UpdateProductPayload = z.infer<typeof UpdateProductSchema>
export type ProductQuery = z.infer<typeof ProductQuerySchema>
