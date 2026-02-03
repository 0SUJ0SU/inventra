"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Plus,
  Search,
  Info,
  Warehouse,
  Wrench,
  CheckCircle,
  FileText,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Trash,
  User,
  Settings,
  Users,
  LogOut,
  ArrowRight,
  ArrowLeft,
  Mail,
} from "lucide-react";

// Animation presets
import {
  staggerContainer,
  staggerItem,
  hoverLift,
  tapLift,
  hoverScale,
  tapScale,
  fadeInUp,
} from "@/lib/animations";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FilterDropdown } from "@/components/ui/filter-dropdown";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTable, type ColumnDef } from "@/components/ui/data-table";
import { Separator } from "@/components/ui/separator";

// App Components
import { StatCard } from "@/components/app/stat-card";
import { ChartCard } from "@/components/app/chart-card";
import { StatusBadge } from "@/components/app/status-badge";
import { Timeline, TimelineItem } from "@/components/app/timeline";

// Shared Components
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonStatCard,
  SkeletonTableRow,
  SkeletonTable,
  PageLoader,
} from "@/components/shared/loading";
import { ThemeToggle } from "@/components/shared/theme-toggle";

// =============================================================================
// Section Component
// =============================================================================

interface SectionProps {
  title: string;
  children: React.ReactNode;
  isAlt?: boolean;
}

function Section({ title, children, isAlt }: SectionProps) {
  return (
    <motion.section
      variants={staggerItem}
      className={`py-16 px-6 ${
        isAlt
          ? "bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)]"
          : "bg-[var(--background)] dark:bg-[var(--background-dark)]"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="w-12 h-1 bg-[var(--accent-500)] rounded mb-4" />
        <h2 className="font-display text-2xl font-bold text-[var(--text)] dark:text-[var(--text-dark)] mb-8">
          {title}
        </h2>
        {children}
      </div>
    </motion.section>
  );
}

// =============================================================================
// Mock Data
// =============================================================================

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: "in_stock" | "sold" | "reserved" | "defective";
}

const mockProducts: Product[] = [
  { id: "1", name: "iPhone 15 Pro", sku: "APL-IP15P-256", category: "Electronics", price: 999, stock: 45, status: "in_stock" },
  { id: "2", name: "MacBook Air M3", sku: "APL-MBA-M3", category: "Electronics", price: 1299, stock: 23, status: "in_stock" },
  { id: "3", name: "Samsung Galaxy S24", sku: "SAM-GS24-128", category: "Electronics", price: 799, stock: 0, status: "sold" },
  { id: "4", name: "Sony WH-1000XM5", sku: "SNY-WH5-BLK", category: "Audio", price: 349, stock: 67, status: "in_stock" },
  { id: "5", name: "iPad Pro 12.9", sku: "APL-IPADP-12", category: "Electronics", price: 1099, stock: 12, status: "reserved" },
  { id: "6", name: "AirPods Pro 2", sku: "APL-APP2-WHT", category: "Audio", price: 249, stock: 89, status: "in_stock" },
  { id: "7", name: "Dell XPS 15", sku: "DEL-XPS15-32", category: "Electronics", price: 1599, stock: 8, status: "in_stock" },
  { id: "8", name: "Logitech MX Master", sku: "LOG-MXM-3S", category: "Accessories", price: 99, stock: 0, status: "defective" },
  { id: "9", name: "Apple Watch Ultra", sku: "APL-AWU-49", category: "Electronics", price: 799, stock: 34, status: "in_stock" },
  { id: "10", name: "Kindle Paperwhite", sku: "AMZ-KPW-11", category: "Electronics", price: 139, stock: 56, status: "in_stock" },
];

const productColumns: ColumnDef<Product, unknown>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "sku",
    header: "SKU",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: "Price",
    enableSorting: true,
    cell: ({ row }) => {
      const price = row.getValue("price") as number;
      return `$${price.toLocaleString()}`;
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return <StatusBadge variant="serial" status={status} />;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const filterOptions = [
  { value: "electronics", label: "Electronics", count: 24 },
  { value: "clothing", label: "Clothing", count: 18 },
  { value: "books", label: "Books", count: 42 },
  { value: "audio", label: "Audio", count: 15 },
  { value: "accessories", label: "Accessories", count: 31 },
  { value: "other", label: "Other", count: 8 },
];

// =============================================================================
// Page Component
// =============================================================================

export default function ShowcasePage() {
  const [mounted, setMounted] = useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedFilters1, setSelectedFilters1] = React.useState<string[]>([]);
  const [selectedFilters2, setSelectedFilters2] = React.useState<string[]>(["electronics", "audio"]);
  const [selectedFilters3, setSelectedFilters3] = React.useState<string[]>([]);
  const [searchValue, setSearchValue] = React.useState("iPhone");
  const [checkboxState1, setCheckboxState1] = React.useState(true);
  const [checkboxState2, setCheckboxState2] = React.useState(false);
  const [radioValue, setRadioValue] = React.useState("comfortable");
  const [showAnimatedBox, setShowAnimatedBox] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[var(--background-dark)]">
      {/* Floating Theme Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Page Header */}
      <div className="py-8 px-6 bg-[var(--background)] dark:bg-[var(--background-dark)]">
        <div className="max-w-7xl mx-auto">
          <PageHeader
            title="Design System Showcase"
            description="All UI components built for Inventra — M2 Design System"
            breadcrumbs={[
              { label: "Home", href: "/" },
              { label: "Showcase" },
            ]}
          />
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {/* 1. Buttons */}
        <Section title="1. Buttons" isAlt={false}>
          <div className="space-y-8">
            {/* All variants */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">All variants (default size)</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* All sizes */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">All sizes (default variant)</p>
              <div className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Plus className="h-4 w-4" /></Button>
              </div>
            </div>

            {/* Disabled states */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">Disabled states</p>
              <div className="flex flex-wrap gap-4">
                <Button variant="default" disabled>Default</Button>
                <Button variant="secondary" disabled>Secondary</Button>
                <Button variant="outline" disabled>Outline</Button>
                <Button variant="ghost" disabled>Ghost</Button>
                <Button variant="destructive" disabled>Destructive</Button>
              </div>
            </div>

            {/* With icons */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">With icons</p>
              <div className="flex flex-wrap gap-4">
                <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
                <Button variant="outline">Continue <ArrowRight className="ml-2 h-4 w-4" /></Button>
                <Button variant="secondary"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                <Button variant="ghost"><Mail className="mr-2 h-4 w-4" /> Contact</Button>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 2. Inputs & Labels */}
        <Section title="2. Inputs & Labels" isAlt={true}>
          <div className="space-y-8">
            {/* Label + Input pairs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="default">Default Input</Label>
                <Input id="default" placeholder="Enter text..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="with-value">With Value</Label>
                <Input id="with-value" defaultValue="Hello World" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disabled">Disabled</Label>
                <Input id="disabled" placeholder="Disabled input" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="error" className="text-red-500">With Error</Label>
                <Input id="error" placeholder="Invalid input" className="border-red-500 focus-visible:ring-red-500/20" />
              </div>
            </div>

            {/* SearchInput */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">SearchInput Component</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SearchInput
                  placeholder="Search..."
                  onChange={() => {}}
                  showShortcutHint
                />
                <SearchInput
                  placeholder="Search..."
                  value={searchValue}
                  onChange={setSearchValue}
                />
                <SearchInput
                  placeholder="Searching..."
                  onChange={() => {}}
                  loading
                />
                <div className="flex gap-2">
                  <SearchInput placeholder="SM" size="sm" onChange={() => {}} className="flex-1" />
                  <SearchInput placeholder="LG" size="lg" onChange={() => {}} className="flex-1" />
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 3. Select */}
        <Section title="3. Select" isAlt={false}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
            <div className="space-y-2">
              <Label>Basic Select</Label>
              <Select defaultValue="electronics">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>With Placeholder</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Disabled</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Disabled" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 4. Dropdown Menu */}
        <Section title="4. Dropdown Menu" isAlt={true}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Open Menu <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Users className="mr-2 h-4 w-4" />
                Team
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={checkboxState1}
                onCheckedChange={setCheckboxState1}
                onSelect={(e) => e.preventDefault()}
              >
                Show notifications
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={checkboxState2}
                onCheckedChange={setCheckboxState2}
                onSelect={(e) => e.preventDefault()}
              >
                Show activity status
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={radioValue} onValueChange={setRadioValue}>
                <DropdownMenuRadioItem value="compact">Compact</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="comfortable">Comfortable</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="spacious">Spacious</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Section>

        <Separator />

        {/* 5. Filter Dropdown */}
        <Section title="5. Filter Dropdown" isAlt={false}>
          <div className="flex flex-wrap gap-4">
            <FilterDropdown
              label="Category"
              options={filterOptions}
              selected={selectedFilters1}
              onChange={setSelectedFilters1}
            />
            <FilterDropdown
              label="Category"
              options={filterOptions}
              selected={selectedFilters2}
              onChange={setSelectedFilters2}
            />
            <FilterDropdown
              label="Category"
              options={filterOptions}
              selected={selectedFilters3}
              onChange={setSelectedFilters3}
              searchable
            />
          </div>
        </Section>

        <Separator />

        {/* 6. Badges */}
        <Section title="6. Badges" isAlt={true}>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </Section>

        <Separator />

        {/* 7. Status Badges */}
        <Section title="7. Status Badges" isAlt={false}>
          <div className="space-y-8">
            {/* Serial Status */}
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-3">Serial Status</p>
              <div className="flex flex-wrap gap-3">
                <StatusBadge variant="serial" status="in_stock" />
                <StatusBadge variant="serial" status="sold" />
                <StatusBadge variant="serial" status="reserved" />
                <StatusBadge variant="serial" status="defective" />
                <StatusBadge variant="serial" status="in_repair" />
                <StatusBadge variant="serial" status="scrapped" />
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <StatusBadge variant="serial" status="in_stock" showDot />
                <StatusBadge variant="serial" status="sold" showDot />
                <StatusBadge variant="serial" status="defective" showDot />
              </div>
            </div>

            {/* Warranty Status */}
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-3">Warranty Status</p>
              <div className="flex flex-wrap gap-3">
                <StatusBadge variant="warranty" status="active" />
                <StatusBadge variant="warranty" status="expiring_soon" />
                <StatusBadge variant="warranty" status="expired" />
                <StatusBadge variant="warranty" status="n/a" />
              </div>
            </div>

            {/* Order Status */}
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-3">Order Status</p>
              <div className="flex flex-wrap gap-3">
                <StatusBadge variant="order" status="pending" />
                <StatusBadge variant="order" status="completed" />
                <StatusBadge variant="order" status="cancelled" />
                <StatusBadge variant="order" status="partial" />
              </div>
            </div>

            {/* Claim Status */}
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-3">Claim Status</p>
              <div className="flex flex-wrap gap-3">
                <StatusBadge variant="claim" status="pending" />
                <StatusBadge variant="claim" status="in_review" />
                <StatusBadge variant="claim" status="in_repair" />
                <StatusBadge variant="claim" status="repaired" />
                <StatusBadge variant="claim" status="replaced" />
                <StatusBadge variant="claim" status="rejected" />
                <StatusBadge variant="claim" status="closed" />
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 8. Cards */}
        <Section title="8. Cards" isAlt={true}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Full Card */}
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here with more details.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--text)] dark:text-[var(--text-dark)]">
                  This is the card content area. You can put any content here including text, images, forms, and more.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </CardFooter>
            </Card>

            {/* Content Only Card */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-[var(--text)] dark:text-[var(--text-dark)]">
                  This card only has content — no header or footer. It&apos;s useful for simple information displays or small widgets.
                </p>
              </CardContent>
            </Card>

            {/* Interactive Card */}
            <motion.div whileHover={hoverLift} whileTap={tapLift}>
              <Card className="cursor-pointer">
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>Hover me to see the lift effect</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--text)] dark:text-[var(--text-dark)]">
                    This card uses the hoverLift animation preset for a subtle interactive feel.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </Section>

        <Separator />

        {/* 9. Stat Cards */}
        <Section title="9. Stat Cards" isAlt={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Revenue"
              value="$45,231.89"
              icon={DollarSign}
              trend={{ value: 20.1, isPositive: true }}
            />
            <StatCard
              title="Total Orders"
              value="2,350"
              icon={ShoppingCart}
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              title="Products Sold"
              value="12,234"
              icon={Package}
              trend={{ value: 3.2, isPositive: false }}
            />
            <StatCard
              title="Low Stock Items"
              value="23"
              icon={AlertTriangle}
            />
          </div>
          <div className="mt-6 max-w-sm">
            <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-3">Loading state:</p>
            <StatCard
              title="Loading..."
              value="—"
              icon={DollarSign}
              loading
            />
          </div>
        </Section>

        <Separator />

        {/* 10. Chart Card */}
        <Section title="10. Chart Card" isAlt={true}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Sales Overview"
              subtitle="Monthly sales performance"
              dateFilter
            >
              <div className="h-64 rounded-lg bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)] flex items-center justify-center text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">
                Chart goes here
              </div>
            </ChartCard>
            <ChartCard
              title="Revenue Breakdown"
              subtitle="By category"
              loading
            >
              <div className="h-64" />
            </ChartCard>
          </div>
        </Section>

        <Separator />

        {/* 11. Tabs */}
        <Section title="11. Tabs" isAlt={false}>
          <Tabs defaultValue="overview" className="max-w-2xl">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-[var(--text)] dark:text-[var(--text-dark)]">
                    This is the overview tab content. You can display any information here that gives users a quick summary of the current state.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="mt-4">
              <StatCard
                title="Conversion Rate"
                value="24.5%"
                icon={ShoppingCart}
                trend={{ value: 5.2, isPositive: true }}
              />
            </TabsContent>
            <TabsContent value="reports" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Sales Report</TableCell>
                    <TableCell>Jan 2024</TableCell>
                    <TableCell><StatusBadge variant="order" status="completed" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Inventory Report</TableCell>
                    <TableCell>Jan 2024</TableCell>
                    <TableCell><StatusBadge variant="order" status="completed" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Warranty Report</TableCell>
                    <TableCell>Jan 2024</TableCell>
                    <TableCell><StatusBadge variant="order" status="pending" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </Section>

        <Separator />

        {/* 12. Tooltips */}
        <Section title="12. Tooltips" isAlt={true}>
          <TooltipProvider>
            <div className="flex flex-wrap gap-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button>Hover me (top)</Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>This is a primary action</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>More information here</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm underline decoration-dotted cursor-help text-[var(--text)] dark:text-[var(--text-dark)]">
                    Hover this text
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Tooltip on text element</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary">Left tooltip</Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Positioned on the left</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </Section>

        <Separator />

        {/* 13. Dialog */}
        <Section title="13. Dialog" isAlt={false}>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue="john@example.com" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => setDialogOpen(false)}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Section>

        <Separator />

        {/* 14. Sheets */}
        <Section title="14. Sheets" isAlt={true}>
          <div className="flex flex-wrap gap-4">
            {(["right", "left", "top", "bottom"] as const).map((side) => (
              <Sheet key={side}>
                <SheetTrigger asChild>
                  <Button variant="outline">Open {side} sheet</Button>
                </SheetTrigger>
                <SheetContent side={side}>
                  <SheetHeader>
                    <SheetTitle>Sheet from {side}</SheetTitle>
                    <SheetDescription>
                      This sheet slides in from the {side} side of the screen.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4">
                    <p className="text-sm text-[var(--text)] dark:text-[var(--text-dark)]">
                      Sheet content goes here. You can add forms, lists, or any other content.
                    </p>
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button>Close</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            ))}
          </div>
        </Section>

        <Separator />

        {/* 15. Table */}
        <Section title="15. Table (Basic)" isAlt={false}>
          <div className="rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] overflow-hidden">
            <Table>
              <TableCaption>A list of sample products</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>001</TableCell>
                  <TableCell>iPhone 15 Pro</TableCell>
                  <TableCell>Electronics</TableCell>
                  <TableCell>$999</TableCell>
                  <TableCell><StatusBadge variant="serial" status="in_stock" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>002</TableCell>
                  <TableCell>MacBook Air M3</TableCell>
                  <TableCell>Electronics</TableCell>
                  <TableCell>$1,299</TableCell>
                  <TableCell><StatusBadge variant="serial" status="in_stock" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>003</TableCell>
                  <TableCell>AirPods Pro 2</TableCell>
                  <TableCell>Audio</TableCell>
                  <TableCell>$249</TableCell>
                  <TableCell><StatusBadge variant="serial" status="sold" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>004</TableCell>
                  <TableCell>iPad Pro 12.9</TableCell>
                  <TableCell>Electronics</TableCell>
                  <TableCell>$1,099</TableCell>
                  <TableCell><StatusBadge variant="serial" status="reserved" /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>005</TableCell>
                  <TableCell>Apple Watch Ultra</TableCell>
                  <TableCell>Electronics</TableCell>
                  <TableCell>$799</TableCell>
                  <TableCell><StatusBadge variant="serial" status="defective" /></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Section>

        <Separator />

        {/* 16. Data Table */}
        <Section title="16. Data Table (Interactive)" isAlt={true}>
          <DataTable
            columns={productColumns}
            data={mockProducts}
            searchKey="name"
            searchPlaceholder="Search products..."
            pagination
            pageSize={5}
            selectable
          />
        </Section>

        <Separator />

        {/* 17. Timeline */}
        <Section title="17. Timeline" isAlt={false}>
          <div className="max-w-2xl">
            <Timeline>
              <TimelineItem
                title="Product received from supplier"
                description="Invoice #INV-2024-001"
                formattedTimestamp="Jan 15, 2024 at 9:00 AM"
                icon={Package}
                variant="info"
              />
              <TimelineItem
                title="Added to inventory"
                description="Serial: SN-12345-ABC"
                formattedTimestamp="Jan 15, 2024 at 10:30 AM"
                icon={Warehouse}
                variant="default"
              />
              <TimelineItem
                title="Sold to customer"
                description="Receipt #REC-2024-0542"
                formattedTimestamp="Jan 20, 2024 at 2:22 PM"
                icon={ShoppingCart}
                variant="success"
              />
              <TimelineItem
                title="Warranty claim opened"
                description="Claim #WC-2024-0023"
                formattedTimestamp="Feb 10, 2024 at 11:00 AM"
                icon={AlertTriangle}
                variant="warning"
              />
              <TimelineItem
                title="Sent for repair"
                description="Repair center: TechFix Inc"
                formattedTimestamp="Feb 12, 2024 at 9:15 AM"
                icon={Wrench}
                variant="default"
              />
              <TimelineItem
                title="Repair completed"
                description="Returned to customer"
                formattedTimestamp="Feb 20, 2024 at 4:45 PM"
                icon={CheckCircle}
                variant="success"
                isLast
              />
            </Timeline>
          </div>
        </Section>

        <Separator />

        {/* 18. Empty State */}
        <Section title="18. Empty State" isAlt={true}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={Package}
                  title="No products found"
                  description="Try adjusting your search or filters"
                  action={{ label: "Add Product", onClick: () => {} }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={Search}
                  title="No results"
                  description="No items match your search criteria"
                  action={{ label: "Clear Search", onClick: () => {} }}
                  secondaryAction={{ label: "View All", onClick: () => {} }}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <EmptyState
                  icon={FileText}
                  title="No reports yet"
                  description="Reports will appear here once you have sales data"
                />
              </CardContent>
            </Card>
          </div>
        </Section>

        <Separator />

        {/* 19. Separators */}
        <Section title="19. Separators" isAlt={false}>
          <div className="space-y-8">
            {/* Horizontal */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">Left Content</span>
              <Separator className="flex-1" />
              <span className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">Right Content</span>
            </div>

            {/* Vertical */}
            <div className="flex items-center h-12 gap-4">
              <div className="px-4 py-2 rounded bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)]">
                <span className="text-sm text-[var(--text)] dark:text-[var(--text-dark)]">Section A</span>
              </div>
              <Separator orientation="vertical" />
              <div className="px-4 py-2 rounded bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)]">
                <span className="text-sm text-[var(--text)] dark:text-[var(--text-dark)]">Section B</span>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 20. Loading & Skeletons */}
        <Section title="20. Loading & Skeletons" isAlt={true}>
          <div className="space-y-8">
            {/* Basic Skeletons */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">Basic Skeleton variants</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">Rectangular</p>
                  <Skeleton className="w-full h-8" />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">Text (3 lines)</p>
                  <SkeletonText lines={3} />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">Circular</p>
                  <Skeleton variant="circular" className="w-12 h-12" />
                </div>
              </div>
            </div>

            {/* Avatars */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">Skeleton Avatars</p>
              <div className="flex items-center gap-4">
                <SkeletonAvatar size="sm" />
                <SkeletonAvatar size="md" />
                <SkeletonAvatar size="lg" />
              </div>
            </div>

            {/* Cards */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">Skeleton Cards</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <SkeletonCard />
                <SkeletonStatCard />
                <SkeletonStatCard />
              </div>
            </div>

            {/* Table */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">Skeleton Table</p>
              <SkeletonTable rows={3} columns={5} />
            </div>

            {/* Page Loader */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">Page Loader (Bouncing Dots)</p>
              <div className="relative h-48 rounded-lg border border-[var(--border)] dark:border-[var(--border-dark)] overflow-hidden bg-[var(--surface)] dark:bg-[var(--surface-dark)]">
                <PageLoader />
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 21. Animation Demos */}
        <Section title="21. Animation Demos" isAlt={false}>
          <div className="space-y-8">
            {/* Hover Lift */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">hoverLift effect</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={hoverLift}
                    whileTap={tapLift}
                    className="p-6 rounded-lg bg-[var(--surface)] dark:bg-[var(--surface-dark)] border border-[var(--border)] dark:border-[var(--border-dark)] cursor-pointer text-center"
                  >
                    <span className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)]">Card {i}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Hover Scale */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">hoverScale effect</p>
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={hoverScale}
                    whileTap={tapScale}
                    className="w-16 h-16 rounded-lg bg-[var(--accent-500)] flex items-center justify-center cursor-pointer"
                  >
                    <span className="text-sm font-bold text-white">{i}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fade In Up Animation */}
            <div className="space-y-4">
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)]">fadeInUp animation</p>
              <Button variant="outline" onClick={() => setShowAnimatedBox(!showAnimatedBox)}>
                {showAnimatedBox ? "Hide Box" : "Show Box"}
              </Button>
              <div className="h-24 flex items-center">
                <AnimatePresence mode="wait">
                  {showAnimatedBox && (
                    <motion.div
                      key="animated-box"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
                      }}
                      exit={{ 
                        opacity: 0, 
                        y: -10,
                        transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                      }}
                      className="px-6 py-3 rounded-lg bg-[var(--accent-500)] text-white font-medium"
                    >
                      Animated Box
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Staggered Children */}
            <div>
              <p className="text-sm text-[var(--text-muted)] dark:text-[var(--text-muted-dark)] mb-4">Staggered children (refresh page to see)</p>
              <motion.div
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <motion.div
                    key={i}
                    variants={staggerItem}
                    className="p-4 rounded-lg bg-[var(--background-alt)] dark:bg-[var(--background-alt-dark)] border border-[var(--border)] dark:border-[var(--border-dark)] text-center"
                  >
                    <span className="text-sm text-[var(--text)] dark:text-[var(--text-dark)]">Item {i}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </Section>

        {/* Footer spacing */}
        <div className="h-24" />
      </motion.div>
    </div>
  );
}
