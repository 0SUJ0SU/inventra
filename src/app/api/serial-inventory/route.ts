import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { SerialQuerySchema } from "@/lib/validations/serial"

const SERIAL_SELECT = {
  id: true,
  serialNumber: true,
  productId: true,
  status: true,
  condition: true,
  purchaseDate: true,
  purchaseCost: true,
  soldDate: true,
  soldPrice: true,
  warrantyMonths: true,
  warrantyExpiry: true,
  notes: true,
  createdAt: true,
  product: { select: { id: true, name: true, sku: true } },
  customer: { select: { id: true, name: true } },
} as const

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const query = SerialQuerySchema.safeParse(searchParams)
  if (!query.success) {
    return NextResponse.json(
      { error: "Validation failed", details: query.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { search, productId, status, condition, page, pageSize } = query.data
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { serialNumber: { contains: search, mode: "insensitive" } },
      { product: { name: { contains: search, mode: "insensitive" } } },
      { customer: { name: { contains: search, mode: "insensitive" } } },
    ]
  }

  if (productId) where.productId = productId
  if (status !== "all") where.status = status
  if (condition !== "all") where.condition = condition

  const [serialItems, total] = await Promise.all([
    prisma.serializedItem.findMany({
      where,
      select: SERIAL_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.serializedItem.count({ where }),
  ])

  return NextResponse.json({ serialItems, total, page, pageSize })
}
