import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { UpdateProductSchema } from "@/lib/validations/product"

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

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id },
    select: PRODUCT_SELECT,
  })

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ product })
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = UpdateProductSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const existing = await prisma.product.findUnique({
    where: { id },
    select: { id: true, categoryId: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (parsed.data.sku) {
    const skuOwner = await prisma.product.findUnique({
      where: { sku: parsed.data.sku },
      select: { id: true },
    })
    if (skuOwner && skuOwner.id !== id) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 409 })
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: parsed.data,
    select: PRODUCT_SELECT,
  })

  if (parsed.data.categoryId && existing.categoryId !== parsed.data.categoryId) {
    await Promise.all([
      prisma.category.update({
        where: { id: existing.categoryId },
        data: {
          productCount: await prisma.product.count({
            where: { categoryId: existing.categoryId },
          }),
        },
      }),
      prisma.category.update({
        where: { id: parsed.data.categoryId },
        data: {
          productCount: await prisma.product.count({
            where: { categoryId: parsed.data.categoryId },
          }),
        },
      }),
    ])
  }

  return NextResponse.json({ product })
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.product.findUnique({
    where: { id },
    select: { id: true, categoryId: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const serialCount = await prisma.serializedItem.count({
    where: { productId: id },
  })
  if (serialCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete product with ${serialCount} serialized items` },
      { status: 400 }
    )
  }

  await prisma.product.delete({ where: { id } })

  await prisma.category.update({
    where: { id: existing.categoryId },
    data: {
      productCount: await prisma.product.count({
        where: { categoryId: existing.categoryId },
      }),
    },
  })

  return NextResponse.json({ success: true })
}
