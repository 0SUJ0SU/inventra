import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { CreateProductSchema, ProductQuerySchema } from "@/lib/validations/product"

const PRODUCT_SELECT = {
  id: true,
  sku: true,
  name: true,
  categoryId: true,
  description: true,
  costPrice: true,
  sellingPrice: true,
  stock: true,
  minStock: true,
  unit: true,
  isSerialTracked: true,
  warrantyMonths: true,
  isActive: true,
  image: true,
  createdAt: true,
  category: { select: { name: true } },
} as const

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = Object.fromEntries(request.nextUrl.searchParams)
  const query = ProductQuerySchema.safeParse(searchParams)
  if (!query.success) {
    return NextResponse.json(
      { error: "Validation failed", details: query.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const { search, page, pageSize } = query.data
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ]
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: PRODUCT_SELECT,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where }),
  ])

  return NextResponse.json({ products, total, page, pageSize })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = CreateProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const productFields = parsed.data

  const categoryExists = await prisma.category.findUnique({
    where: { id: productFields.categoryId },
    select: { id: true },
  })
  if (!categoryExists) {
    return NextResponse.json({ error: "Category not found" }, { status: 400 })
  }

  const skuTaken = await prisma.product.findUnique({
    where: { sku: productFields.sku },
    select: { id: true },
  })
  if (skuTaken) {
    return NextResponse.json({ error: "SKU already exists" }, { status: 409 })
  }

  const product = await prisma.product.create({
    data: {
      sku: productFields.sku,
      name: productFields.name,
      categoryId: productFields.categoryId,
      description: productFields.description ?? null,
      costPrice: productFields.costPrice,
      sellingPrice: productFields.sellingPrice,
      stock: productFields.isSerialTracked ? 0 : productFields.stock,
      minStock: productFields.minStock,
      unit: productFields.unit,
      image: productFields.image ?? null,
      isActive: productFields.isActive,
      isSerialTracked: productFields.isSerialTracked,
      warrantyMonths: productFields.warrantyMonths ?? null,
    },
    select: PRODUCT_SELECT,
  })

  await prisma.category.update({
    where: { id: productFields.categoryId },
    data: {
      productCount: await prisma.product.count({
        where: { categoryId: productFields.categoryId },
      }),
    },
  })

  return NextResponse.json({ product }, { status: 201 })
}
