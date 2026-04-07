import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { CreateCategorySchema } from "@/lib/validations/category"

const CATEGORY_SELECT = {
  id: true,
  name: true,
  description: true,
  productCount: true,
  isActive: true,
  createdAt: true,
} as const

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const categories = await prisma.category.findMany({
    select: CATEGORY_SELECT,
    orderBy: { name: "asc" },
  })

  return NextResponse.json({ categories })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = CreateCategorySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

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

  const category = await prisma.category.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description ?? null,
    },
    select: CATEGORY_SELECT,
  })

  return NextResponse.json({ category }, { status: 201 })
}
