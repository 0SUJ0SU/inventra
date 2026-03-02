// src/lib/demo-data.ts
// Centralized demo data for the Inventra dashboard.
// All numbers are fictional — portfolio showcase only.

// ————————————————————————————————————————————————
// KPI STATS
// ————————————————————————————————————————————————

export const KPI_STATS = [
  {
    label: "Revenue",
    value: 24800,
    prefix: "$",
    suffix: "",
    format: "compact", // 24.8K
    change: "+12.4%",
    positive: true,
  },
  {
    label: "Orders",
    value: 1847,
    prefix: "",
    suffix: "",
    format: "number", // 1,847
    change: "+8.2%",
    positive: true,
  },
  {
    label: "Units Sold",
    value: 3291,
    prefix: "",
    suffix: "",
    format: "number", // 3,291
    change: "+15.7%",
    positive: true,
  },
  {
    label: "Low Stock Alerts",
    value: 12,
    prefix: "",
    suffix: "",
    format: "number",
    change: "-3",
    positive: false,
  },
] as const;

// ————————————————————————————————————————————————
// SALES TREND (30 days)
// ————————————————————————————————————————————————

export const SALES_TREND_30D = [
  { day: "01", revenue: 680, orders: 42 },
  { day: "02", revenue: 720, orders: 45 },
  { day: "03", revenue: 590, orders: 38 },
  { day: "04", revenue: 810, orders: 51 },
  { day: "05", revenue: 740, orders: 47 },
  { day: "06", revenue: 420, orders: 28 },
  { day: "07", revenue: 380, orders: 24 },
  { day: "08", revenue: 890, orders: 56 },
  { day: "09", revenue: 950, orders: 61 },
  { day: "10", revenue: 870, orders: 55 },
  { day: "11", revenue: 1020, orders: 64 },
  { day: "12", revenue: 980, orders: 62 },
  { day: "13", revenue: 510, orders: 33 },
  { day: "14", revenue: 460, orders: 29 },
  { day: "15", revenue: 1100, orders: 69 },
  { day: "16", revenue: 1050, orders: 66 },
  { day: "17", revenue: 970, orders: 61 },
  { day: "18", revenue: 1150, orders: 72 },
  { day: "19", revenue: 1080, orders: 68 },
  { day: "20", revenue: 620, orders: 40 },
  { day: "21", revenue: 550, orders: 35 },
  { day: "22", revenue: 1200, orders: 75 },
  { day: "23", revenue: 1280, orders: 80 },
  { day: "24", revenue: 1150, orders: 72 },
  { day: "25", revenue: 1320, orders: 83 },
  { day: "26", revenue: 1250, orders: 78 },
  { day: "27", revenue: 680, orders: 43 },
  { day: "28", revenue: 610, orders: 39 },
  { day: "29", revenue: 1380, orders: 86 },
  { day: "30", revenue: 1450, orders: 91 },
];

export const SALES_TREND_7D = SALES_TREND_30D.slice(-7);
export const SALES_TREND_90D = [
  ...SALES_TREND_30D.map((d) => ({ ...d, day: `M1-${d.day}` })),
  ...SALES_TREND_30D.map((d) => ({
    day: `M2-${d.day}`,
    revenue: Math.round(d.revenue * 0.85),
    orders: Math.round(d.orders * 0.85),
  })),
  ...SALES_TREND_30D.map((d) => ({
    day: `M3-${d.day}`,
    revenue: Math.round(d.revenue * 0.7),
    orders: Math.round(d.orders * 0.7),
  })),
];

// ————————————————————————————————————————————————
// REVENUE BY CATEGORY
// ————————————————————————————————————————————————

export const REVENUE_BY_CATEGORY = [
  { name: "Smartphones", value: 9200, percentage: 37 },
  { name: "Laptops", value: 6400, percentage: 26 },
  { name: "Accessories", value: 4100, percentage: 17 },
  { name: "Tablets", value: 3200, percentage: 13 },
  { name: "Wearables", value: 1900, percentage: 7 },
];

// ————————————————————————————————————————————————
// TOP SELLING PRODUCTS
// ————————————————————————————————————————————————

export const TOP_PRODUCTS = [
  { name: "iPhone 15 Pro", units: 284, revenue: 4260 },
  { name: "Galaxy S24 Ultra", units: 196, revenue: 2940 },
  { name: "MacBook Air M3", units: 142, revenue: 3550 },
  { name: "AirPods Pro 2", units: 318, revenue: 1590 },
  { name: "iPad Air", units: 127, revenue: 1905 },
];

// ————————————————————————————————————————————————
// STOCK LEVELS
// ————————————————————————————————————————————————

export const STOCK_LEVELS = [
  { category: "Smartphones", inStock: 342, lowStock: 8, outOfStock: 2 },
  { category: "Laptops", inStock: 156, lowStock: 5, outOfStock: 1 },
  { category: "Accessories", inStock: 890, lowStock: 12, outOfStock: 4 },
  { category: "Tablets", inStock: 98, lowStock: 3, outOfStock: 0 },
  { category: "Wearables", inStock: 215, lowStock: 6, outOfStock: 1 },
];

// ————————————————————————————————————————————————
// LOW STOCK ALERTS
// ————————————————————————————————————————————————

export const LOW_STOCK_ALERTS = [
  { sku: "IP15P-256-BK", name: "iPhone 15 Pro 256GB Black", current: 3, minimum: 10, category: "Smartphones" },
  { sku: "GS24U-512-GR", name: "Galaxy S24 Ultra 512GB", current: 2, minimum: 8, category: "Smartphones" },
  { sku: "MBA-M3-256", name: "MacBook Air M3 256GB", current: 4, minimum: 10, category: "Laptops" },
  { sku: "APP2-USB-C", name: "AirPods Pro 2 USB-C", current: 5, minimum: 15, category: "Accessories" },
  { sku: "IPD-AIR-64", name: "iPad Air 64GB WiFi", current: 1, minimum: 5, category: "Tablets" },
  { sku: "GW6-44-BK", name: "Galaxy Watch 6 44mm", current: 3, minimum: 8, category: "Wearables" },
];

// ————————————————————————————————————————————————
// WARRANTY ALERTS
// ————————————————————————————————————————————————

export const WARRANTY_ALERTS = {
  expiringIn30Days: 18,
  openClaims: 7,
  pendingReview: 3,
  items: [
    { serial: "SN-IP15-00847", product: "iPhone 15 Pro", customer: "Tech Haven", expiresIn: 5, status: "expiring" as const },
    { serial: "SN-GS24-01203", product: "Galaxy S24 Ultra", customer: "Circuit Hub", expiresIn: 12, status: "expiring" as const },
    { serial: "SN-MBA3-00291", product: "MacBook Air M3", customer: "Digital Edge", expiresIn: 22, status: "expiring" as const },
    { serial: "SN-IP15-00623", product: "iPhone 15 Pro", customer: "Gadget Zone", expiresIn: 28, status: "expiring" as const },
  ],
};

// ————————————————————————————————————————————————
// RECENT ACTIVITY
// ————————————————————————————————————————————————

export const RECENT_ACTIVITY = [
  { action: "Sale completed #1847", time: "2m ago", type: "sale" as const },
  { action: "Stock in — 24 units (iPhone 15 Pro)", time: "15m ago", type: "stock" as const },
  { action: "Warranty claim #WC-0042 opened", time: "1h ago", type: "warranty" as const },
  { action: "New customer registered — Circuit Hub", time: "2h ago", type: "customer" as const },
  { action: "Purchase order #PO-0189 completed", time: "3h ago", type: "purchase" as const },
  { action: "Low stock alert — AirPods Pro 2", time: "3h ago", type: "alert" as const },
  { action: "Sale completed #1846", time: "4h ago", type: "sale" as const },
  { action: "Warranty claim #WC-0041 resolved", time: "5h ago", type: "warranty" as const },
];

// ————————————————————————————————————————————————
// SALES BY PAYMENT METHOD
// ————————————————————————————————————————————————

export const PAYMENT_METHODS = [
  { method: "Cash", value: 8920, percentage: 36, transactions: 672 },
  { method: "Card", value: 11160, percentage: 45, transactions: 841 },
  { method: "Transfer", value: 4720, percentage: 19, transactions: 334 },
];

// ————————————————————————————————————————————————
// TOP CUSTOMERS
// ————————————————————————————————————————————————

export const TOP_CUSTOMERS = [
  { name: "Tech Haven", transactions: 84, spent: 4280, lastVisit: "2d ago" },
  { name: "Circuit Hub", transactions: 67, spent: 3650, lastVisit: "1d ago" },
  { name: "Digital Edge", transactions: 52, spent: 2890, lastVisit: "5h ago" },
  { name: "Gadget Zone", transactions: 41, spent: 2240, lastVisit: "3d ago" },
  { name: "Nex Mobile", transactions: 38, spent: 1960, lastVisit: "1d ago" },
];

// ————————————————————————————————————————————————
// DASHBOARD PERIOD SYSTEM
// ————————————————————————————————————————————————

export type DashboardPeriod = "today" | "7d" | "30d" | "this-month" | "this-year";

export const PERIOD_CONFIG: Record<
  DashboardPeriod,
  { label: string; shortLabel: string; scale: number }
> = {
  today: { label: "Today", shortLabel: "Today", scale: 0.035 },
  "7d": { label: "Last 7 Days", shortLabel: "7D", scale: 0.24 },
  "30d": { label: "Last 30 Days", shortLabel: "30D", scale: 1 },
  "this-month": { label: "This Month", shortLabel: "MTD", scale: 0.85 },
  "this-year": { label: "This Year", shortLabel: "YTD", scale: 11.5 },
};

// — KPI data per period —

const KPI_CHANGES: Record<
  DashboardPeriod,
  Array<{ change: string; positive: boolean }>
> = {
  today: [
    { change: "+5.2%", positive: true },
    { change: "+3.8%", positive: true },
    { change: "+4.1%", positive: true },
    { change: "-1", positive: false },
  ],
  "7d": [
    { change: "+9.1%", positive: true },
    { change: "+7.3%", positive: true },
    { change: "+10.2%", positive: true },
    { change: "-2", positive: false },
  ],
  "30d": [
    { change: "+12.4%", positive: true },
    { change: "+8.2%", positive: true },
    { change: "+15.7%", positive: true },
    { change: "-3", positive: false },
  ],
  "this-month": [
    { change: "+10.8%", positive: true },
    { change: "+7.5%", positive: true },
    { change: "+13.2%", positive: true },
    { change: "-3", positive: false },
  ],
  "this-year": [
    { change: "+22.6%", positive: true },
    { change: "+18.4%", positive: true },
    { change: "+25.1%", positive: true },
    { change: "-8", positive: false },
  ],
};

const KPI_BASE = [
  { label: "Revenue", base: 24800, prefix: "$", suffix: "", format: "compact" as const },
  { label: "Orders", base: 1847, prefix: "", suffix: "", format: "number" as const },
  { label: "Units Sold", base: 3291, prefix: "", suffix: "", format: "number" as const },
  { label: "Low Stock Alerts", base: 12, prefix: "", suffix: "", format: "number" as const },
];

export function getKpiStats(period: DashboardPeriod) {
  const s = PERIOD_CONFIG[period].scale;
  const changes = KPI_CHANGES[period];
  return KPI_BASE.map((kpi, i) => ({
    label: kpi.label,
    value: kpi.label === "Low Stock Alerts" ? kpi.base : Math.round(kpi.base * s),
    prefix: kpi.prefix,
    suffix: kpi.suffix,
    format: kpi.format,
    change: changes[i].change,
    positive: changes[i].positive,
  }));
}

// — Sales trend data per period —

const SALES_TREND_TODAY = [
  { day: "8AM", revenue: 45, orders: 3 },
  { day: "9AM", revenue: 120, orders: 8 },
  { day: "10AM", revenue: 280, orders: 18 },
  { day: "11AM", revenue: 190, orders: 12 },
  { day: "12PM", revenue: 340, orders: 22 },
  { day: "1PM", revenue: 310, orders: 20 },
  { day: "2PM", revenue: 260, orders: 16 },
  { day: "3PM", revenue: 380, orders: 24 },
  { day: "4PM", revenue: 290, orders: 18 },
  { day: "5PM", revenue: 420, orders: 26 },
  { day: "6PM", revenue: 350, orders: 22 },
  { day: "7PM", revenue: 180, orders: 11 },
];

const SALES_TREND_YEAR = [
  { day: "Jan", revenue: 18200, orders: 1150 },
  { day: "Feb", revenue: 21400, orders: 1340 },
  { day: "Mar", revenue: 19800, orders: 1250 },
  { day: "Apr", revenue: 23600, orders: 1480 },
  { day: "May", revenue: 22100, orders: 1390 },
  { day: "Jun", revenue: 25400, orders: 1590 },
  { day: "Jul", revenue: 24200, orders: 1520 },
  { day: "Aug", revenue: 26800, orders: 1680 },
  { day: "Sep", revenue: 23900, orders: 1500 },
  { day: "Oct", revenue: 27500, orders: 1720 },
  { day: "Nov", revenue: 29100, orders: 1820 },
  { day: "Dec", revenue: 24800, orders: 1550 },
];

export function getSalesTrendData(period: DashboardPeriod) {
  switch (period) {
    case "today":
      return SALES_TREND_TODAY;
    case "7d":
      return SALES_TREND_7D;
    case "30d":
      return SALES_TREND_30D;
    case "this-month":
      return SALES_TREND_30D;
    case "this-year":
      return SALES_TREND_YEAR;
  }
}

export function getSalesTrendInterval(period: DashboardPeriod): number {
  switch (period) {
    case "today":
      return 0;
    case "7d":
      return 0;
    case "30d":
      return 4;
    case "this-month":
      return 4;
    case "this-year":
      return 0;
  }
}

// — Revenue by category per period —

export function getRevenueByCategory(period: DashboardPeriod) {
  const s = PERIOD_CONFIG[period].scale;
  return REVENUE_BY_CATEGORY.map((cat) => ({
    ...cat,
    value: Math.round(cat.value * s),
  }));
}

// — Payment methods per period —

export function getPaymentMethods(period: DashboardPeriod) {
  const s = PERIOD_CONFIG[period].scale;
  return PAYMENT_METHODS.map((m) => ({
    ...m,
    value: Math.round(m.value * s),
    transactions: Math.round(m.transactions * s),
  }));
}

// — Top products per period —

export function getTopProducts(period: DashboardPeriod) {
  const s = PERIOD_CONFIG[period].scale;
  return TOP_PRODUCTS.map((p) => ({
    ...p,
    units: Math.round(p.units * s),
    revenue: Math.round(p.revenue * s),
  }));
}

// — Top customers per period —

export function getTopCustomers(period: DashboardPeriod) {
  const s = PERIOD_CONFIG[period].scale;
  return TOP_CUSTOMERS.map((c) => ({
    ...c,
    transactions: Math.round(c.transactions * s),
    spent: Math.round(c.spent * s),
  }));
}

// ————————————————————————————————————————————————
// PRODUCT CATEGORIES
// ————————————————————————————————————————————————

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount?: number;
}

export const CATEGORIES: Category[] = [
  { id: "cat-smartphones", name: "Smartphones", description: "Mobile phones and accessories" },
  { id: "cat-laptops", name: "Laptops", description: "Notebooks and ultrabooks" },
  { id: "cat-accessories", name: "Accessories", description: "Peripherals, cables, and add-ons" },
  { id: "cat-tablets", name: "Tablets", description: "Tablet devices and e-readers" },
  { id: "cat-wearables", name: "Wearables", description: "Smartwatches and fitness trackers" },
];

// ————————————————————————————————————————————————
// PRODUCTS
// ————————————————————————————————————————————————

export type ProductStatus = "active" | "inactive";

export interface Product {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  category: string;
  description: string;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minStock: number;
  isSerialTracked: boolean;
  warrantyMonths: number;
  isActive: boolean;
  image: string | null;
  createdAt: string;
}

export const PRODUCTS: Product[] = [
  // — SMARTPHONES —
  {
    id: "prod-001",
    sku: "IP15P-256-BK",
    name: "iPhone 15 Pro 256GB Black",
    categoryId: "cat-smartphones",
    category: "Smartphones",
    description: "Apple iPhone 15 Pro with A17 Pro chip, titanium design, 256GB storage.",
    costPrice: 999,
    sellingPrice: 1199,
    stock: 3,
    minStock: 10,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-09-20",
  },
  {
    id: "prod-002",
    sku: "IP15P-512-WH",
    name: "iPhone 15 Pro 512GB White",
    categoryId: "cat-smartphones",
    category: "Smartphones",
    description: "Apple iPhone 15 Pro with A17 Pro chip, titanium design, 512GB storage.",
    costPrice: 1099,
    sellingPrice: 1399,
    stock: 14,
    minStock: 8,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-09-20",
  },
  {
    id: "prod-003",
    sku: "GS24U-512-GR",
    name: "Galaxy S24 Ultra 512GB",
    categoryId: "cat-smartphones",
    category: "Smartphones",
    description: "Samsung Galaxy S24 Ultra with S Pen, 200MP camera, 512GB.",
    costPrice: 1050,
    sellingPrice: 1299,
    stock: 2,
    minStock: 8,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-10-05",
  },
  {
    id: "prod-004",
    sku: "GS24-256-BK",
    name: "Galaxy S24 256GB Black",
    categoryId: "cat-smartphones",
    category: "Smartphones",
    description: "Samsung Galaxy S24 with Galaxy AI, 256GB storage.",
    costPrice: 650,
    sellingPrice: 849,
    stock: 22,
    minStock: 10,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-10-05",
  },
  {
    id: "prod-005",
    sku: "PX8P-256-BK",
    name: "Pixel 8 Pro 256GB",
    categoryId: "cat-smartphones",
    category: "Smartphones",
    description: "Google Pixel 8 Pro with Tensor G3 chip, advanced AI camera.",
    costPrice: 750,
    sellingPrice: 999,
    stock: 11,
    minStock: 6,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-11-12",
  },
  {
    id: "prod-006",
    sku: "OP12-256-GR",
    name: "OnePlus 12 256GB",
    categoryId: "cat-smartphones",
    category: "Smartphones",
    description: "OnePlus 12 with Snapdragon 8 Gen 3, Hasselblad camera.",
    costPrice: 580,
    sellingPrice: 799,
    stock: 18,
    minStock: 8,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-12-01",
  },

  // — LAPTOPS —
  {
    id: "prod-007",
    sku: "MBA-M3-256",
    name: "MacBook Air M3 256GB",
    categoryId: "cat-laptops",
    category: "Laptops",
    description: "Apple MacBook Air 13-inch with M3 chip, 8GB RAM, 256GB SSD.",
    costPrice: 899,
    sellingPrice: 1099,
    stock: 4,
    minStock: 10,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-08-15",
  },
  {
    id: "prod-008",
    sku: "MBA-M3-512",
    name: "MacBook Air M3 512GB",
    categoryId: "cat-laptops",
    category: "Laptops",
    description: "Apple MacBook Air 13-inch with M3 chip, 16GB RAM, 512GB SSD.",
    costPrice: 1100,
    sellingPrice: 1299,
    stock: 9,
    minStock: 6,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-08-15",
  },
  {
    id: "prod-009",
    sku: "MBP-M3P-512",
    name: "MacBook Pro 14\" M3 Pro",
    categoryId: "cat-laptops",
    category: "Laptops",
    description: "Apple MacBook Pro 14-inch with M3 Pro chip, 18GB RAM, 512GB SSD.",
    costPrice: 1599,
    sellingPrice: 1999,
    stock: 6,
    minStock: 4,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-07-20",
  },
  {
    id: "prod-010",
    sku: "TP-X1C-G11",
    name: "ThinkPad X1 Carbon Gen 11",
    categoryId: "cat-laptops",
    category: "Laptops",
    description: "Lenovo ThinkPad X1 Carbon, Intel i7, 16GB RAM, 512GB SSD.",
    costPrice: 1200,
    sellingPrice: 1549,
    stock: 7,
    minStock: 5,
    isSerialTracked: true,
    warrantyMonths: 24,
    isActive: true,
    image: null,
    createdAt: "2024-09-01",
  },
  {
    id: "prod-011",
    sku: "DXP-15-I9",
    name: "Dell XPS 15 i9 32GB",
    categoryId: "cat-laptops",
    category: "Laptops",
    description: "Dell XPS 15 with Intel i9, 32GB RAM, 1TB SSD, OLED display.",
    costPrice: 1750,
    sellingPrice: 2199,
    stock: 0,
    minStock: 3,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-10-10",
  },

  // — ACCESSORIES —
  {
    id: "prod-012",
    sku: "APP2-USB-C",
    name: "AirPods Pro 2 USB-C",
    categoryId: "cat-accessories",
    category: "Accessories",
    description: "Apple AirPods Pro 2nd gen with USB-C MagSafe charging case.",
    costPrice: 180,
    sellingPrice: 249,
    stock: 5,
    minStock: 15,
    isSerialTracked: false,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-09-10",
  },
  {
    id: "prod-013",
    sku: "APP-MAX-SL",
    name: "AirPods Max Silver",
    categoryId: "cat-accessories",
    category: "Accessories",
    description: "Apple AirPods Max over-ear headphones, silver.",
    costPrice: 420,
    sellingPrice: 549,
    stock: 8,
    minStock: 5,
    isSerialTracked: false,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-08-25",
  },
  {
    id: "prod-014",
    sku: "SGS-BDS-BK",
    name: "Galaxy Buds3 Pro Black",
    categoryId: "cat-accessories",
    category: "Accessories",
    description: "Samsung Galaxy Buds3 Pro with intelligent ANC.",
    costPrice: 170,
    sellingPrice: 229,
    stock: 24,
    minStock: 10,
    isSerialTracked: false,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-11-01",
  },
  {
    id: "prod-015",
    sku: "ANK-65W-GN",
    name: "Anker 65W GaN Charger",
    categoryId: "cat-accessories",
    category: "Accessories",
    description: "Anker Nano II 65W USB-C GaN charger, compact design.",
    costPrice: 28,
    sellingPrice: 45,
    stock: 62,
    minStock: 20,
    isSerialTracked: false,
    warrantyMonths: 6,
    isActive: true,
    image: null,
    createdAt: "2024-06-15",
  },
  {
    id: "prod-016",
    sku: "USB-C-2M-BK",
    name: "USB-C Cable 2M Braided",
    categoryId: "cat-accessories",
    category: "Accessories",
    description: "Premium braided USB-C to USB-C cable, 2 meters, 100W PD.",
    costPrice: 8,
    sellingPrice: 19,
    stock: 145,
    minStock: 30,
    isSerialTracked: false,
    warrantyMonths: 3,
    isActive: true,
    image: null,
    createdAt: "2024-05-20",
  },
  {
    id: "prod-017",
    sku: "MG-MS-BK",
    name: "MagSafe Charger",
    categoryId: "cat-accessories",
    category: "Accessories",
    description: "Apple MagSafe wireless charger for iPhone.",
    costPrice: 30,
    sellingPrice: 39,
    stock: 38,
    minStock: 15,
    isSerialTracked: false,
    warrantyMonths: 6,
    isActive: true,
    image: null,
    createdAt: "2024-07-10",
  },
  {
    id: "prod-018",
    sku: "SP-GLASS-15P",
    name: "Screen Protector iPhone 15 Pro",
    categoryId: "cat-accessories",
    category: "Accessories",
    description: "Tempered glass screen protector for iPhone 15 Pro, 9H hardness.",
    costPrice: 3,
    sellingPrice: 15,
    stock: 200,
    minStock: 50,
    isSerialTracked: false,
    warrantyMonths: 0,
    isActive: true,
    image: null,
    createdAt: "2024-09-22",
  },

  // — TABLETS —
  {
    id: "prod-019",
    sku: "IPD-AIR-64",
    name: "iPad Air 64GB WiFi",
    categoryId: "cat-tablets",
    category: "Tablets",
    description: "Apple iPad Air M1 chip, 10.9-inch display, 64GB WiFi.",
    costPrice: 480,
    sellingPrice: 599,
    stock: 1,
    minStock: 5,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-08-01",
  },
  {
    id: "prod-020",
    sku: "IPD-PRO-256",
    name: "iPad Pro 11\" M4 256GB",
    categoryId: "cat-tablets",
    category: "Tablets",
    description: "Apple iPad Pro 11-inch with M4 chip, 256GB, WiFi.",
    costPrice: 850,
    sellingPrice: 1099,
    stock: 5,
    minStock: 4,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-10-15",
  },
  {
    id: "prod-021",
    sku: "SGT-S9U-256",
    name: "Galaxy Tab S9 Ultra 256GB",
    categoryId: "cat-tablets",
    category: "Tablets",
    description: "Samsung Galaxy Tab S9 Ultra, 14.6-inch AMOLED, 256GB.",
    costPrice: 900,
    sellingPrice: 1199,
    stock: 3,
    minStock: 3,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-11-05",
  },

  // — WEARABLES —
  {
    id: "prod-022",
    sku: "GW6-44-BK",
    name: "Galaxy Watch 6 44mm Black",
    categoryId: "cat-wearables",
    category: "Wearables",
    description: "Samsung Galaxy Watch 6, 44mm, BioActive sensor, Wear OS.",
    costPrice: 220,
    sellingPrice: 329,
    stock: 3,
    minStock: 8,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-09-15",
  },
  {
    id: "prod-023",
    sku: "AW-S9-45-MN",
    name: "Apple Watch Series 9 45mm",
    categoryId: "cat-wearables",
    category: "Wearables",
    description: "Apple Watch Series 9, 45mm, GPS, midnight aluminium case.",
    costPrice: 350,
    sellingPrice: 429,
    stock: 12,
    minStock: 6,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: true,
    image: null,
    createdAt: "2024-10-20",
  },
  {
    id: "prod-024",
    sku: "AW-ULT2-49",
    name: "Apple Watch Ultra 2 49mm",
    categoryId: "cat-wearables",
    category: "Wearables",
    description: "Apple Watch Ultra 2, 49mm titanium, GPS + Cellular.",
    costPrice: 650,
    sellingPrice: 799,
    stock: 4,
    minStock: 3,
    isSerialTracked: true,
    warrantyMonths: 12,
    isActive: false,
    image: null,
    createdAt: "2024-07-01",
  },
];

// Hydrate category product counts
CATEGORIES.forEach((cat) => {
  cat.productCount = PRODUCTS.filter((p) => p.categoryId === cat.id).length;
});

// — Helper functions —

export function getProducts() {
  return PRODUCTS;
}

export function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}

export function getCategories() {
  return CATEGORIES;
}

export function getCategoryById(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? null;
}
