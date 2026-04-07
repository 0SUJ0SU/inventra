import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { UpdateSerialSchema } from "@/lib/validations/serial"

const SERIAL_DETAIL_SELECT = {
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
  updatedAt: true,
  product: { select: { id: true, name: true, sku: true } },
  customer: { select: { id: true, name: true } },
  purchase: { select: { id: true, invoiceNo: true, supplier: { select: { name: true } } } },
  transaction: { select: { id: true, receiptNo: true } },
} as const

type RouteParams = { params: Promise<{ id: string }> }

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const serialItem = await prisma.serializedItem.findUnique({
    where: { id },
    select: SERIAL_DETAIL_SELECT,
  })

  if (!serialItem) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ serialItem })
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const parsed = UpdateSerialSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    )
  }

  const existing = await prisma.serializedItem.findUnique({
    where: { id },
    select: { id: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const serialItem = await prisma.serializedItem.update({
    where: { id },
    data: parsed.data,
    select: SERIAL_DETAIL_SELECT,
  })

  return NextResponse.json({ serialItem })
}
