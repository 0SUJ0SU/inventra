import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { UpdateCategorySchema } from "@/lib/validations/category"

const CATEGORY_SELECT = {
  id: true,
  name: true,
  description: true,
  productCount: true,
  isActive: true,
  createdAt: true,
} as const

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id },
    select: CATEGORY_SELECT,
  })

  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ category })
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = UpdateCategorySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const existing = await prisma.category.findUnique({
    where: { id },
    select: { id: true, name: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  if (parsed.data.name && parsed.data.name !== existing.name) {
    const duplicate = await prisma.category.findUnique({
      where: { name: parsed.data.name },
      select: { id: true },
    })
    if (duplicate) {
      return NextResponse.json(
        { error: "Category with this name already exists" },
        { status: 409 }
      )
    }
  }

  const category = await prisma.category.update({
    where: { id },
    data: parsed.data,
    select: CATEGORY_SELECT,
  })

  return NextResponse.json({ category })
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const productCount = await prisma.product.count({
    where: { categoryId: id },
  })
  if (productCount > 0) {
    return NextResponse.json(
      { error: `Cannot delete category with ${productCount} products` },
      { status: 400 }
    )
  }

  await prisma.category.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
