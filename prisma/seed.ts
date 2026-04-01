import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import path from "node:path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

// ——— Seed Data ———————————————————————————————————

const CATEGORIES = [
  { name: "Smartphones", description: "Mobile phones and accessories" },
  { name: "Laptops", description: "Notebooks and ultrabooks" },
  { name: "Accessories", description: "Peripherals, cables, and add-ons" },
  { name: "Tablets", description: "Tablet devices and e-readers" },
  { name: "Wearables", description: "Smartwatches and fitness trackers" },
] as const

const PRODUCTS = [
  { sku: "IP15P-256-BK", name: "iPhone 15 Pro 256GB Black", category: "Smartphones", description: "Apple iPhone 15 Pro with A17 Pro chip, titanium design, 256GB storage.", costPrice: 999, sellingPrice: 1199, stock: 3, minStock: 10, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-09-20" },
  { sku: "IP15P-512-WH", name: "iPhone 15 Pro 512GB White", category: "Smartphones", description: "Apple iPhone 15 Pro with A17 Pro chip, titanium design, 512GB storage.", costPrice: 1099, sellingPrice: 1399, stock: 14, minStock: 8, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-09-20" },
  { sku: "GS24U-512-GR", name: "Galaxy S24 Ultra 512GB", category: "Smartphones", description: "Samsung Galaxy S24 Ultra with S Pen, 200MP camera, 512GB.", costPrice: 1050, sellingPrice: 1299, stock: 2, minStock: 8, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-10-05" },
  { sku: "GS24-256-BK", name: "Galaxy S24 256GB Black", category: "Smartphones", description: "Samsung Galaxy S24 with Galaxy AI, 256GB storage.", costPrice: 650, sellingPrice: 849, stock: 22, minStock: 10, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-10-05" },
  { sku: "PX8P-256-BK", name: "Pixel 8 Pro 256GB", category: "Smartphones", description: "Google Pixel 8 Pro with Tensor G3 chip, advanced AI camera.", costPrice: 750, sellingPrice: 999, stock: 11, minStock: 6, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-11-12" },
  { sku: "OP12-256-GR", name: "OnePlus 12 256GB", category: "Smartphones", description: "OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad camera.", costPrice: 580, sellingPrice: 799, stock: 18, minStock: 8, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-12-01" },
  { sku: "MBA-M3-256", name: "MacBook Air M3 256GB", category: "Laptops", description: "Apple MacBook Air 13-inch with M3 chip, 8GB RAM, 256GB SSD.", costPrice: 899, sellingPrice: 1099, stock: 4, minStock: 10, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-08-15" },
  { sku: "MBA-M3-512", name: "MacBook Air M3 512GB", category: "Laptops", description: "Apple MacBook Air 13-inch with M3 chip, 16GB RAM, 512GB SSD.", costPrice: 1100, sellingPrice: 1299, stock: 9, minStock: 6, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-08-15" },
  { sku: "MBP-M3P-512", name: "MacBook Pro 14\" M3 Pro", category: "Laptops", description: "Apple MacBook Pro 14-inch with M3 Pro chip, 18GB RAM, 512GB SSD.", costPrice: 1599, sellingPrice: 1999, stock: 6, minStock: 4, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-07-20" },
  { sku: "TP-X1C-G11", name: "ThinkPad X1 Carbon Gen 11", category: "Laptops", description: "Lenovo ThinkPad X1 Carbon, Intel i7, 16GB RAM, 512GB SSD.", costPrice: 1200, sellingPrice: 1549, stock: 7, minStock: 5, isSerialTracked: true, warrantyMonths: 24, createdAt: "2024-09-01" },
  { sku: "DXP-15-I9", name: "Dell XPS 15 i9 32GB", category: "Laptops", description: "Dell XPS 15 with Intel i9, 32GB RAM, 1TB SSD, OLED display.", costPrice: 1750, sellingPrice: 2199, stock: 0, minStock: 3, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-10-10" },
  { sku: "APP2-USB-C", name: "AirPods Pro 2 USB-C", category: "Accessories", description: "Apple AirPods Pro 2nd gen with USB-C MagSafe charging case.", costPrice: 180, sellingPrice: 249, stock: 5, minStock: 15, isSerialTracked: false, warrantyMonths: 12, createdAt: "2024-09-10" },
  { sku: "APP-MAX-SL", name: "AirPods Max Silver", category: "Accessories", description: "Apple AirPods Max over-ear headphones, silver.", costPrice: 420, sellingPrice: 549, stock: 8, minStock: 5, isSerialTracked: false, warrantyMonths: 12, createdAt: "2024-08-25" },
  { sku: "SGS-BDS-BK", name: "Galaxy Buds3 Pro Black", category: "Accessories", description: "Samsung Galaxy Buds3 Pro with intelligent ANC.", costPrice: 170, sellingPrice: 229, stock: 24, minStock: 10, isSerialTracked: false, warrantyMonths: 12, createdAt: "2024-11-01" },
  { sku: "ANK-65W-GN", name: "Anker 65W GaN Charger", category: "Accessories", description: "Anker Nano II 65W USB-C GaN charger, compact design.", costPrice: 28, sellingPrice: 45, stock: 62, minStock: 20, isSerialTracked: false, warrantyMonths: 6, createdAt: "2024-06-15" },
  { sku: "USB-C-2M-BK", name: "USB-C Cable 2M Braided", category: "Accessories", description: "Premium braided USB-C to USB-C cable, 2 meters, 100W PD.", costPrice: 8, sellingPrice: 19, stock: 145, minStock: 30, isSerialTracked: false, warrantyMonths: 3, createdAt: "2024-05-20" },
  { sku: "MG-MS-BK", name: "MagSafe Charger", category: "Accessories", description: "Apple MagSafe wireless charger for iPhone.", costPrice: 30, sellingPrice: 39, stock: 38, minStock: 15, isSerialTracked: false, warrantyMonths: 6, createdAt: "2024-07-10" },
  { sku: "SP-GLASS-15P", name: "Screen Protector iPhone 15 Pro", category: "Accessories", description: "Tempered glass screen protector for iPhone 15 Pro, 9H hardness.", costPrice: 3, sellingPrice: 15, stock: 200, minStock: 50, isSerialTracked: false, warrantyMonths: 0, createdAt: "2024-09-22" },
  { sku: "IPD-AIR-64", name: "iPad Air 64GB WiFi", category: "Tablets", description: "Apple iPad Air M1 chip, 10.9-inch display, 64GB WiFi.", costPrice: 480, sellingPrice: 599, stock: 1, minStock: 5, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-08-01" },
  { sku: "IPD-PRO-256", name: "iPad Pro 11\" M4 256GB", category: "Tablets", description: "Apple iPad Pro 11-inch with M4 chip, 256GB, WiFi.", costPrice: 850, sellingPrice: 1099, stock: 5, minStock: 4, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-10-15" },
  { sku: "SGT-S9U-256", name: "Galaxy Tab S9 Ultra 256GB", category: "Tablets", description: "Samsung Galaxy Tab S9 Ultra, 14.6-inch AMOLED, 256GB.", costPrice: 900, sellingPrice: 1199, stock: 3, minStock: 3, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-11-05" },
  { sku: "GW6-44-BK", name: "Galaxy Watch 6 44mm Black", category: "Wearables", description: "Samsung Galaxy Watch 6, 44mm, BioActive sensor, Wear OS.", costPrice: 220, sellingPrice: 329, stock: 3, minStock: 8, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-09-15" },
  { sku: "AW-S9-45-MN", name: "Apple Watch Series 9 45mm", category: "Wearables", description: "Apple Watch Series 9, 45mm, GPS, midnight aluminium case.", costPrice: 350, sellingPrice: 429, stock: 12, minStock: 6, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-10-20" },
  { sku: "AW-ULT2-49", name: "Apple Watch Ultra 2 49mm", category: "Wearables", description: "Apple Watch Ultra 2, 49mm titanium, GPS + Cellular.", costPrice: 650, sellingPrice: 799, stock: 4, minStock: 3, isSerialTracked: true, warrantyMonths: 12, createdAt: "2024-07-01" },
] as const

// ——— Main ————————————————————————————————————————

async function seed() {
  console.log("Seeding database...\n")

  const hashedPassword = await bcrypt.hash("demo1234", 12)
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@inventra.dev" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@inventra.dev",
      password: hashedPassword,
    },
  })
  console.log("✓ User:", demoUser.email)

  const categoryIds: Record<string, string> = {}
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { name: cat.name },
      update: { description: cat.description },
      create: { name: cat.name, description: cat.description },
    })
    categoryIds[cat.name] = created.id
    console.log("✓ Category:", created.name)
  }

  let productCount = 0
  for (const prod of PRODUCTS) {
    const categoryId = categoryIds[prod.category]
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {},
      create: {
        sku: prod.sku,
        name: prod.name,
        categoryId,
        description: prod.description,
        costPrice: prod.costPrice,
        sellingPrice: prod.sellingPrice,
        stock: prod.stock,
        minStock: prod.minStock,
        isSerialTracked: prod.isSerialTracked,
        warrantyMonths: prod.warrantyMonths,
        createdAt: new Date(prod.createdAt),
      },
    })
    productCount++
  }
  console.log(`✓ Products: ${productCount} seeded`)

  for (const [categoryName, categoryId] of Object.entries(categoryIds)) {
    const count = await prisma.product.count({ where: { categoryId } })
    await prisma.category.update({
      where: { id: categoryId },
      data: { productCount: count },
    })
  }
  console.log("✓ Category product counts updated")

  const defaultSettings = await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      storeName: "Inventra",
      currency: "$",
      taxRate: 0,
      taxEnabled: false,
      lowStockThreshold: 10,
      defaultWarrantyMonths: 12,
      warrantyAlertDays: 30,
      claimNumberPrefix: "WC-",
      featureToggles: {
        expenses: true,
        customers: true,
        payroll: true,
        serialTracking: true,
        warranty: true,
      },
    },
  })
  console.log("✓ Settings:", defaultSettings.storeName)

  console.log("\nSeeding complete!")
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
