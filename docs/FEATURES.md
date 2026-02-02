# FEATURES.md — Inventra

## Overview

Complete feature list for Inventra, organized by page/module. All features must be fully functional with demo data (portfolio) or real data (JDUA COMPUTER).

### Feature Legend
- ✅ Must-have (both versions)
- 🌐 Portfolio only
- 🏢 JDUA COMPUTER only
- ⚙️ Toggleable in Settings

---

## Public Pages (Portfolio Only)

### 1. Landing Page 🌐

**Hero Section**
- ✅ Animated headline with staggered text reveal
- ✅ Subheadline with fade-in
- ✅ CTA buttons (Try Demo, Learn More)
- ✅ Floating dashboard preview (parallax)
- ✅ Morphing gradient blobs background
- ✅ Animated KPI cards floating in 3D space

**Navigation**
- ✅ Sticky navbar with blur backdrop
- ✅ Logo + nav links
- ✅ Theme toggle (light/dark)
- ✅ CTA button
- ✅ Mobile hamburger menu
- ✅ Smooth scroll to sections (CSS native)

**Features Section**
- ✅ Bento grid layout
- ✅ Feature cards with icons
- ✅ Hover animations (scale, glow)
- ✅ Scroll-triggered reveal

**How It Works**
- ✅ Step-by-step process (3-4 steps)
- ✅ Animated connectors
- ✅ Icon illustrations
- ✅ Number indicators

**Dashboard Preview**
- ✅ Interactive mockup
- ✅ Tabbed views (different screens)
- ✅ Device frame (optional)
- ✅ Subtle float animation

**Benefits/Stats**
- ✅ Animated counters
- ✅ Statistics with icons
- ✅ Grid or horizontal layout

**Testimonials**
- ✅ Carousel or grid
- ✅ Avatar, name, role, company
- ✅ Quote with styling
- ✅ Auto-rotate (optional)

**Pricing (Optional)**
- ✅ Pricing cards
- ✅ Feature comparison
- ✅ CTA per tier
- ✅ Popular tier highlight

**About Us**
- ✅ What is Inventra (brief description)
- ✅ Name meaning: Inventra = Inventory + Extra
- ✅ The story/motivation behind building it
- ✅ Who it's for (tech/gadget retail businesses)
- ✅ Our mission/vision statement
- ✅ Visual elements (illustration, photo, or icon-based)
- ✅ Scroll-triggered reveal animation

**Final CTA**
- ✅ Strong headline
- ✅ Subtext
- ✅ Primary action button
- ✅ Background treatment

**Footer**
- ✅ Logo
- ✅ Navigation links
- ✅ Social icons
- ✅ Copyright
- ✅ Made with ♥ credit

---

### 2. Login Page 🌐

- ✅ Email/username input
- ✅ Password input (with show/hide toggle)
- ✅ Remember me checkbox
- ✅ Login button
- ✅ "Forgot password?" link (UI only)
- ✅ "Don't have account? Register" link
- ✅ Demo credentials hint
- ✅ Form validation (Zod)
- ✅ Loading state on submit
- ✅ Error message display
- ✅ Simulated auth (localStorage)
- ✅ Split layout (form + illustration/branding)
- ✅ Theme toggle

---

### 3. Register Page 🌐

- ✅ Full name input
- ✅ Email input
- ✅ Password input (with strength indicator)
- ✅ Confirm password input
- ✅ Terms & conditions checkbox
- ✅ Register button
- ✅ "Already have account? Login" link
- ✅ Form validation (Zod)
- ✅ Loading state on submit
- ✅ Success feedback
- ✅ Simulated registration (localStorage)
- ✅ Split layout (form + illustration/branding)

---

## App Pages (Both Versions)

### 4. Dashboard

**Layout**
- ✅ Sidebar navigation (collapsible)
- ✅ Top header with search, notifications, profile
- ✅ Main content area
- ✅ Responsive (sidebar → bottom nav on mobile)

**KPI Cards (Top Row)**
- ✅ Total Revenue (today/this month)
- ✅ Total Transactions
- ✅ Products Sold
- ✅ Low Stock Alert count
- ✅ Trend indicators (↑↓ percentage)
- ✅ Animated number counting

**Charts (Tremor)**
- ✅ Sales trend (line/area chart) - daily/weekly/monthly toggle
- ✅ Top selling products (bar chart)
- ✅ Revenue by category (donut/pie chart)
- ✅ Stock levels overview (bar chart)

**Recent Activity**
- ✅ Activity feed (latest transactions, stock changes)
- ✅ Timestamp
- ✅ Action type icons
- ✅ "View all" link

**Quick Actions**
- ✅ New Sale (→ POS)
- ✅ Add Product
- ✅ Stock In
- ✅ View Reports

**Low Stock Alerts**
- ✅ List of products below threshold
- ✅ Current stock vs minimum
- ✅ Quick action to reorder

**Warranty Alerts Widget**
- ✅ Items with warranty expiring in next 30 days
- ✅ Open warranty claims count
- ✅ Claims requiring attention (pending status)
- ✅ Link to warranty claims page
- ✅ Link to warranty report

---

### 5. POS / Cashier

**Product Selection (Left Panel)**
- ✅ Search products by name/SKU
- ✅ Category filter tabs
- ✅ Product grid with image, name, price
- ✅ Click to add to cart
- ✅ Quick quantity adjustment
- ✅ Stock availability indicator
- ✅ Serial-tracked badge on applicable products

**Cart (Right Panel)**
- ✅ Cart items list
- ✅ Item: name, qty, unit price, subtotal
- ✅ Quantity +/- buttons
- ✅ Remove item button
- ✅ Subtotal
- ✅ Discount input (% or fixed)
- ✅ Tax calculation (toggleable)
- ✅ Grand total
- ✅ Clear cart button

**Serial Number Selection (for serialized products)**
- ✅ After adding serialized product to cart, show serial picker modal
- ✅ List available serials (status: 'in_stock' only)
- ✅ Search within available serials
- ✅ Select serial(s) to match quantity
- ✅ Show selected serial(s) in cart line item
- ✅ Cannot complete sale without selecting serials for serialized products
- ✅ Validation: quantity must match selected serials count

**Checkout**
- ✅ Payment method selection (Cash, Card, Transfer)
- ✅ Cash: amount received, change calculation
- ✅ Customer selection (optional, for receipts)
- ✅ Notes field
- ✅ Complete sale button
- ✅ Success animation/feedback

**Receipt**
- ✅ Receipt preview modal
- ✅ Print receipt (browser print)
- ✅ Receipt includes: store info, items, totals, payment, date/time, receipt #
- ✅ Serial number(s) printed for each serialized item
- ✅ Warranty expiry date printed for serialized items

**Features**
- ✅ Keyboard shortcuts (for power users)
- ✅ Hold/recall transaction
- ✅ Works offline (localStorage queue)

---

### 6. Products

**Product List**
- ✅ Data table with columns: Image, SKU, Name, Category, Stock, Price, Status, Actions
- ✅ Search by name/SKU
- ✅ Filter by category
- ✅ Filter by status (active/inactive)
- ✅ Filter by stock level (all/low/out)
- ✅ Filter by serial-tracked (yes/no)
- ✅ Sort by any column
- ✅ Pagination
- ✅ Bulk actions (delete, change status)
- ✅ Export to Excel
- ✅ Serial-tracked products show serialized item count instead of simple stock number

**Add/Edit Product (Modal or Page)**
- ✅ Product image upload (with preview)
- ✅ SKU (auto-generate option)
- ✅ Product name
- ✅ Category (select, with add new inline)
- ✅ Description (textarea)
- ✅ Purchase price (cost)
- ✅ Selling price
- ✅ Stock quantity (disabled if serial-tracked, calculated from serialized items)
- ✅ Minimum stock threshold
- ✅ Unit (pcs, kg, box, etc.)
- ✅ Status (active/inactive)
- ✅ Form validation
- ✅ Save & Save+Add Another buttons

**Serial Number Settings (in Product Form)**
- ✅ Toggle: "Track Serial Numbers" (checkbox)
- ✅ If enabled: "Warranty Period (months)" input
- ✅ Warning when enabling on existing product with stock

**Product Detail / View**
- ✅ Full product information display
- ✅ Stock summary (for serial-tracked: X in stock, Y sold, Z in repair)
- ✅ "View Serial Numbers" button (opens Serial Inventory filtered by product)
- ✅ Recent transactions for this product

**Delete Product**
- ✅ Confirmation dialog
- ✅ Soft delete (mark inactive) or hard delete option
- ✅ Warning if product has serialized items

**Categories Management**
- ✅ List categories
- ✅ Add/edit/delete category
- ✅ Category product count

---

### 7. Stock In / Purchases

**Purchase List**
- ✅ Table: Invoice #, Supplier, Date, Total, Status, Actions
- ✅ Search by invoice/supplier
- ✅ Filter by date range
- ✅ Filter by status (pending/completed)
- ✅ Filter by supplier
- ✅ Pagination

**Create Purchase**
- ✅ Supplier selection (with add new inline)
- ✅ Invoice number
- ✅ Purchase date
- ✅ Add products (search, select, qty, unit cost)
- ✅ Product list with subtotals
- ✅ Total calculation
- ✅ Notes
- ✅ Status (pending/received)
- ✅ Save as draft / Complete

**Serial Number Entry (for serialized products)**
- ✅ After entering quantity for serialized product, prompt for serial numbers
- ✅ Serial entry modal/section:
  - Text area for bulk paste (one serial per line)
  - Or add one-by-one with input field
  - Count validation: must match quantity
  - Duplicate detection (within entry + existing database)
- ✅ Each serial creates SerializedItem with status 'in_stock', condition 'new'
- ✅ Cannot complete purchase without entering all serials for serialized products

**Receive Stock**
- ✅ Mark purchase as received
- ✅ Auto-update product stock quantities
- ✅ Partial receive option
- ✅ For serialized products: serials received are activated

**Purchase Detail**
- ✅ Full purchase info
- ✅ Items list
- ✅ List of serial numbers received (for serialized products)
- ✅ Click serial to view its full history
- ✅ Print purchase order

---

### 8. Stock Out / Sales

**Sales List**
- ✅ Table: Receipt #, Customer, Date, Total, Payment Method, Actions
- ✅ Search by receipt/customer
- ✅ Search by serial number
- ✅ Filter by date range
- ✅ Filter by payment method
- ✅ Pagination

**Sale Detail**
- ✅ Full transaction info
- ✅ Items sold
- ✅ Serial numbers for each serialized item
- ✅ Click serial to view history
- ✅ Payment info
- ✅ Reprint receipt
- ✅ Void sale (with reason)

**Returns/Refunds**
- ✅ Process return from sale detail
- ✅ Select items to return
- ✅ For serialized items: select which serial(s) being returned
- ✅ Set condition for returned serialized items: 'new' | 'good' | 'damaged' | 'defective'
- ✅ Refund amount calculation
- ✅ Restock option (updates SerializedItem status back to 'in_stock')
- ✅ Return reason
- ✅ Option to immediately create warranty claim if defective

---

### 9. Customers

**Customer List**
- ✅ Table: Name, Phone, Email, Total Transactions, Total Spent, Actions
- ✅ Search by name/phone/email
- ✅ Pagination

**Add/Edit Customer**
- ✅ Name
- ✅ Phone
- ✅ Email (optional)
- ✅ Address (optional)
- ✅ Notes
- ✅ Active/Inactive status

**Customer Detail**
- ✅ Customer info
- ✅ Transaction history
- ✅ Total spent
- ✅ Receivables (if any credit sales)

**Purchased Items (Serialized)**
- ✅ Tab/section showing serialized items purchased by customer
- ✅ List: Serial Number, Product, Purchase Date, Price, Warranty Status
- ✅ Warranty status indicator (active/expiring soon/expired)
- ✅ Click serial to view full history
- ✅ Quick action: Create warranty claim for any item

---

### 10. Suppliers

**Supplier List**
- ✅ Table: Name, Contact Person, Phone, Email, Total Purchases, Actions
- ✅ Search
- ✅ Pagination

**Add/Edit Supplier**
- ✅ Company name
- ✅ Contact person
- ✅ Phone
- ✅ Email
- ✅ Address
- ✅ Notes
- ✅ Active/Inactive status

**Supplier Detail**
- ✅ Supplier info
- ✅ Purchase history
- ✅ Payables (if any credit purchases)
- ✅ Warranty claims made to this supplier

---

### 11. Employees

**Employee List**
- ✅ Table: Name, Role, Phone, Email, Status, Actions
- ✅ Search
- ✅ Filter by role
- ✅ Pagination

**Add/Edit Employee**
- ✅ Full name
- ✅ Role/Position
- ✅ Phone
- ✅ Email
- ✅ Address
- ✅ Hire date
- ✅ Salary (optional, for payroll)
- ✅ Status (active/inactive)
- ✅ Access level (for future use)

**Employee Detail**
- ✅ Employee info
- ✅ Transaction history (sales made)
- ✅ Payroll history

---

### 12. Expenses ⚙️

> Toggleable feature in Settings. Enabled by default for JDUA COMPUTER.

**Expense Categories**
- ✅ Rent
- ✅ Utilities (electricity, water, internet)
- ✅ Supplies
- ✅ Marketing
- ✅ Maintenance
- ✅ Other (custom)

**Expense List**
- ✅ Table: Date, Category, Description, Amount, Actions
- ✅ Filter by category
- ✅ Filter by date range
- ✅ Total expenses display
- ✅ Pagination

**Add/Edit Expense**
- ✅ Date
- ✅ Category
- ✅ Description
- ✅ Amount
- ✅ Receipt image (optional)
- ✅ Notes

**Recurring Expenses**
- ✅ Set expense as recurring (monthly)
- ✅ Auto-remind or auto-create

---

### 13. Serial Inventory

**Location:** `/app/serial-inventory` (also accessible from Products page)

**List View**
- ✅ Table: Serial Number, Product, Status, Condition, Purchase Date, Sold Date, Customer, Warranty Status, Actions
- ✅ Search by serial number
- ✅ Filter by product
- ✅ Filter by status ('in_stock', 'sold', 'reserved', 'defective', 'in_repair', 'scrapped')
- ✅ Filter by condition ('new', 'good', 'damaged', 'defective')
- ✅ Filter by warranty status (active, expiring soon, expired, n/a)
- ✅ Sort by any column
- ✅ Pagination
- ✅ Export to Excel

**Serial Detail View (modal or page)**
- ✅ Full serial information
- ✅ Product info summary
- ✅ Current status and condition
- ✅ Timeline/history:
  - Purchased from [Supplier] on [Date] for [Cost] (Invoice #X)
  - Received into inventory on [Date]
  - Sold to [Customer] on [Date] for [Price] (Receipt #X)
  - Returned on [Date], condition: [X]
  - Warranty claim #[X] opened on [Date]
  - Status changed to [X] on [Date]
  - etc.
- ✅ Linked warranty claims list
- ✅ Action buttons:
  - Create Warranty Claim
  - Mark as Scrapped (with reason)
  - Update Condition
  - Edit Notes

**Bulk Actions**
- ✅ Select multiple serials
- ✅ Bulk update status
- ✅ Bulk export

---

### 14. Warranty Claims

**Location:** `/app/warranty-claims`

**List View**
- ✅ Table: Claim #, Serial Number, Product, Claim Type, Status, Claim Date, Customer/Supplier, Actions
- ✅ Search by claim number or serial number
- ✅ Filter by status ('pending', 'in_review', 'in_repair', 'repaired', 'replaced', 'rejected', 'closed')
- ✅ Filter by claim type ('customer_to_store', 'store_to_supplier', 'supplier_to_store')
- ✅ Filter by date range
- ✅ Filter by customer
- ✅ Filter by supplier
- ✅ Sort by any column
- ✅ Pagination
- ✅ Export to Excel

**Create Warranty Claim**
- ✅ Search and select serial number
- ✅ Auto-fill: product info, customer info (if sold), warranty status
- ✅ Claim type selection:
  - Customer → Store (customer bringing item to you)
  - Store → Supplier (you claiming from supplier)
  - Supplier → Store (supplier returning repaired/replaced item)
- ✅ Issue description (textarea)
- ✅ Attach files (optional - photos, documents)
- ✅ Link to customer (if customer claim)
- ✅ Link to supplier (if supplier claim)
- ✅ Initial status: 'pending'
- ✅ Form validation

**Claim Detail View**
- ✅ Full claim information
- ✅ Claim number, date, type, status
- ✅ Serial info summary (product, purchase date, sold date, warranty status)
- ✅ Customer/Supplier info
- ✅ Issue description
- ✅ Attachments viewer

**Claim Workflow Actions**
- ✅ Status update buttons based on current status:
  - pending → in_review, rejected
  - in_review → in_repair, replaced, rejected
  - in_repair → repaired, replaced, rejected
  - repaired → closed
  - replaced → closed
  - rejected → closed
- ✅ Each status change logged with timestamp

**Claim Resolution**
- ✅ Set repair cost (if any)
- ✅ Link replacement serial (if replaced)
  - Search and select new serial
  - Original serial marked as 'scrapped'
  - New serial linked to claim
- ✅ Resolution notes (textarea)
- ✅ Close claim

**Claim Notes (Communication Log)**
- ✅ Add notes section
- ✅ Note text input
- ✅ Notes history with:
  - Note content
  - Created by (user/employee)
  - Timestamp
- ✅ Notes displayed in chronological order

**Linked Claims**
- ✅ View related claims (same serial, same customer)
- ✅ One serial can have multiple claims over time

---

### 15. Reports

**Report Types**

| Report | Description |
|--------|-------------|
| **Sales Report** | Daily/weekly/monthly sales, by date, by product, by category |
| **Purchase Report** | Purchases by date range, by supplier |
| **Stock Report** | Current stock levels, low stock, stock value |
| **Profit & Loss** | Revenue - COGS - Expenses = Net Profit |
| **Cash Flow** | Income vs expenses over time |
| **Expense Report** | Expenses by category, by date range |
| **Payroll Report** | Employee salaries by period |
| **Serial Inventory Report** | Serial status breakdown, movements, scrapped items |
| **Warranty Report** | Warranty status, claims, expiring warranties |

**Common Features**
- ✅ Date range picker
- ✅ Filter options
- ✅ Chart visualization (Tremor)
- ✅ Data table below chart
- ✅ Export to Excel (.xlsx)
- ✅ Export to PDF
- ✅ Print report

**Sales Report**
- ✅ Total sales amount
- ✅ Number of transactions
- ✅ Average transaction value
- ✅ Sales by day chart
- ✅ Top products table
- ✅ Sales by category breakdown

**Stock Report**
- ✅ Current stock levels
- ✅ Low stock items
- ✅ Total stock value (qty × cost)
- ✅ Stock movement history

**Profit & Loss**
- ✅ Revenue (total sales)
- ✅ Cost of goods sold
- ✅ Gross profit
- ✅ Expenses by category
- ✅ Net profit
- ✅ Comparison with previous period

**Serial Inventory Report**
- ✅ Stock breakdown by serial status (in_stock, sold, in_repair, scrapped)
- ✅ Stock breakdown by condition
- ✅ Serial movement history (timeline)
- ✅ Scrapped items summary with reasons
- ✅ Average time in inventory before sale

**Warranty Report**
- ✅ Items under active warranty (count and list)
- ✅ Items with warranty expiring soon (30/60/90 days configurable)
- ✅ Expired warranties
- ✅ Warranty claims summary:
  - By status (open, closed)
  - By type (customer→store, store→supplier)
  - By resolution (repaired, replaced, rejected)
- ✅ Claim resolution time average
- ✅ Total repair costs
- ✅ Claims by product (which products have most claims)
- ✅ Claims by supplier (which suppliers have most claims)

---

### 16. Settings

**Store Information**
- ✅ Store name
- ✅ Address
- ✅ Phone
- ✅ Email
- ✅ Logo upload
- ✅ Receipt header/footer text

**Preferences**
- ✅ Currency symbol
- ✅ Tax rate (%)
- ✅ Enable/disable tax
- ✅ Low stock threshold (default)
- ✅ Date format
- ✅ Theme preference (light/dark/system)

**Serial & Warranty Settings**
- ✅ Default warranty period (months) for new products
- ✅ Warranty expiry alert threshold (days before expiry, e.g., 30)
- ✅ Claim number prefix (e.g., "WC-")
- ✅ Claim number format (e.g., "WC-YYYY-NNNN")

**Feature Toggles ⚙️**
- ✅ Enable Expenses module
- ✅ Enable Customer tracking
- ✅ Enable Employee payroll
- ✅ Enable Credit sales (receivables)
- ✅ Enable Credit purchases (payables)
- ✅ Enable Serial Number tracking
- ✅ Enable Warranty management

**Data Management**
- ✅ Export all data (JSON/Excel)
- ✅ Import data
- ✅ Reset demo data (portfolio only) 🌐
- ✅ Backup data (JDUA only) 🏢

**About**
- ✅ App version
- ✅ Credits
- ✅ License info

---

## Global Features

### Navigation & Layout
- ✅ Collapsible sidebar
- ✅ Breadcrumbs
- ✅ Global search (⌘K)
- ✅ Keyboard shortcuts
- ✅ Mobile-responsive

### Sidebar Navigation Structure
```
Dashboard

Products
├── All Products
├── Categories
└── Serial Inventory

Sales
├── POS / Cashier
└── Sales History (Stock Out)

Purchases
├── Purchase Orders (Stock In)
└── Suppliers

Warranty
└── Warranty Claims

Customers

Employees

Expenses ⚙️

Reports

Settings
```

### Theme
- ✅ Light mode
- ✅ Dark mode
- ✅ System preference detection
- ✅ Toggle in header
- ✅ Persisted preference

### Notifications
- ✅ Toast notifications (success, error, warning, info)
- ✅ Notification center (bell icon)
- ✅ Low stock alerts
- ✅ Payment reminders
- ✅ Warranty expiry alerts
- ✅ Open warranty claims alerts

### Data & State
- ✅ Loading skeletons
- ✅ Empty states with illustrations
- ✅ Error states with retry
- ✅ Optimistic updates
- ✅ Data persisted to localStorage (portfolio) / SQLite (JDUA)

### Print
- ✅ Print receipts
- ✅ Print reports
- ✅ Print-optimized stylesheets

### Export
- ✅ Excel export (xlsx)
- ✅ PDF export
- ✅ CSV export (optional)

---

## Data Models Summary

```
User (portfolio only)
├── id, email, password, name, role

Product
├── id, sku, name, categoryId, description
├── costPrice, sellingPrice, stock, minStock
├── unit, image, isActive, createdAt
├── isSerialTracked        → boolean (default: false)
├── warrantyMonths         → default warranty period in months

Category
├── id, name, description

Customer
├── id, name, phone, email, address, isActive

Supplier
├── id, name, contactPerson, phone, email, address, isActive

Employee
├── id, name, role, phone, email, address
├── hireDate, salary, isActive

SerializedItem
├── id
├── productId              → links to Product
├── serialNumber           → unique identifier
├── status                 → 'in_stock' | 'sold' | 'reserved' | 'defective' | 'in_repair' | 'scrapped'
├── condition              → 'new' | 'good' | 'damaged' | 'defective'
├── purchaseId             → which StockIn brought this item
├── purchaseDate           → when received from supplier
├── purchaseCost           → cost for this unit
├── transactionId          → which sale sold this item (nullable)
├── soldDate               → when sold (nullable)
├── soldPrice              → price sold for (nullable)
├── customerId             → who bought it (nullable)
├── warrantyMonths         → warranty period from Product
├── warrantyExpiry         → calculated from soldDate + warrantyMonths
├── notes
├── createdAt, updatedAt

WarrantyClaim
├── id
├── claimNumber            → auto-generated (e.g., "WC-2024-0001")
├── serializedItemId       → which item
├── claimType              → 'customer_to_store' | 'store_to_supplier' | 'supplier_to_store'
├── status                 → 'pending' | 'in_review' | 'in_repair' | 'repaired' | 'replaced' | 'rejected' | 'closed'
├── claimDate              → when claim was made
├── issueDescription       → what's wrong
├── customerId             → customer making claim (nullable)
├── supplierId             → supplier claim is made to (nullable)
├── repairCost             → cost if any (nullable)
├── replacementSerialId    → if replaced, link to new SerializedItem (nullable)
├── resolution             → final resolution notes
├── attachments            → array of file paths/URLs (optional)
├── createdAt, updatedAt

WarrantyClaimNote
├── id
├── warrantyClaimId
├── note
├── createdBy              → who added the note
├── createdAt

StockIn (Purchase)
├── id, invoiceNo, supplierId, date, total
├── status, notes, items[]

StockInItem
├── id, stockInId, productId, quantity, unitCost
├── serialNumbers          → array of serials entered (for serialized products)

Transaction (Sale)
├── id, receiptNo, customerId, employeeId
├── date, subtotal, discount, tax, total
├── paymentMethod, amountPaid, change, items[]

TransactionItem
├── id, transactionId, productId, quantity, unitPrice
├── serializedItemIds      → array of SerializedItem IDs sold

Expense
├── id, date, category, description, amount, notes

Settings
├── storeName, address, phone, email, logo
├── currency, taxRate, taxEnabled, lowStockThreshold
├── defaultWarrantyMonths, warrantyAlertDays, claimNumberPrefix
├── features: { expenses, customers, payroll, serialTracking, warranty }
```

---

## Serial Number Status Flow

```
Purchase received → 'in_stock' (condition: 'new')
         ↓
    Item sold → 'sold'
         ↓
Customer returns → 'in_stock' (condition: 'good' | 'damaged' | 'defective')
         ↓
Warranty claim → 'in_repair'
         ↓
Repaired → 'in_stock' (condition updated)
    OR
Replaced → original becomes 'scrapped', new item linked
    OR
Unrepairable → 'scrapped'
```

---

## Warranty Claim Workflow

```
                    ┌─────────────┐
                    │   pending   │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       ┌─────────────┐           ┌─────────────┐
       │  in_review  │           │  rejected   │
       └──────┬──────┘           └──────┬──────┘
              │                         │
    ┌─────────┴─────────┐               │
    ▼                   ▼               │
┌─────────┐      ┌──────────┐           │
│in_repair│      │ replaced │           │
└────┬────┘      └────┬─────┘           │
     │                │                 │
     ▼                │                 │
┌──────────┐          │                 │
│ repaired │          │                 │
└────┬─────┘          │                 │
     │                │                 │
     └────────┬───────┴─────────────────┘
              ▼
       ┌─────────────┐
       │   closed    │
       └─────────────┘
```

---

## Version Differences Summary

| Feature | Portfolio (inventra) | JDUA COMPUTER |
|---------|---------------------|---------------|
| Landing page | ✅ Yes | ❌ No |
| Login/Register | ✅ Simulated | ❌ Direct app access |
| Language | English | Bahasa Indonesia |
| Database | localStorage | SQLite (local) |
| Auth | Simulated | None needed |
| Logo | Inventra | JDUA COMPUTER |
| Hosting | Vercel | Desktop app (Tauri) |
| Data reset | ✅ Reset demo | ❌ Real data |
| Backup/Export | Export only | Full backup + export |
| Serial tracking | ✅ Demo data | ✅ Real tracking |
| Warranty claims | ✅ Demo data | ✅ Real claims |
