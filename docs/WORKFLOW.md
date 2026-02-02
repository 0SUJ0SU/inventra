# WORKFLOW.md — Inventra

## Tech Stack

### Core Framework
| Tool | Purpose | Version |
|------|---------|---------|
| **Next.js** | React framework (App Router) | 14.x |
| **TypeScript** | Type safety | 5.x |
| **React** | UI library | 18.x |

### Styling & UI
| Tool | Purpose |
|------|---------|
| **TailwindCSS** | Utility-first CSS (v4) |
| **ShadCN UI** | Accessible component primitives |
| **Lucide React** | Icon library |
| **clsx / tailwind-merge** | Conditional class management |

### Animation
| Tool | Purpose |
|------|---------|
| **Framer Motion** | React animations, page transitions, gestures |
| **GSAP + ScrollTrigger** | Complex scroll animations, timelines, parallax |

### Data & Forms
| Tool | Purpose |
|------|---------|
| **React Hook Form** | Form state management |
| **Zod** | Schema validation |
| **date-fns** | Date manipulation |
| **Tremor** | Charts and dashboards |

### Data Persistence
| Version | Tool |
|---------|------|
| **Portfolio** | localStorage + demo data |
| **JDUA COMPUTER** | SQLite via Prisma + Tauri |

### Export & Print
| Tool | Purpose |
|------|---------|
| **xlsx** | Excel file generation |
| **jsPDF** | PDF generation |
| **@react-to-print** | Print functionality |

### Desktop (JDUA COMPUTER only)
| Tool | Purpose |
|------|---------|
| **Tauri** | Desktop app framework |
| **Vite** | Build tool for Tauri |
| **Prisma** | Database ORM |
| **SQLite** | Local database |

---

## Project Structure

### Portfolio Version (inventra)

```
inventra/
├── public/
│   ├── fonts/                  # Self-hosted fonts
│   ├── images/                 # Static images
│   └── favicon.ico
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (landing)/          # Landing page group
│   │   │   ├── page.tsx        # Landing page
│   │   │   └── layout.tsx
│   │   ├── (auth)/             # Auth pages group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (app)/              # Main app group
│   │   │   ├── dashboard/
│   │   │   ├── pos/
│   │   │   ├── products/
│   │   │   ├── serial-inventory/
│   │   │   ├── stock-in/
│   │   │   ├── stock-out/
│   │   │   ├── customers/
│   │   │   ├── suppliers/
│   │   │   ├── employees/
│   │   │   ├── expenses/
│   │   │   ├── warranty-claims/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   └── layout.tsx      # App shell (sidebar, header)
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                 # ShadCN + custom primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── data-table.tsx
│   │   │   └── ...
│   │   ├── landing/            # Landing page components
│   │   │   ├── navbar.tsx
│   │   │   ├── hero.tsx
│   │   │   ├── features-bento.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   ├── dashboard-preview.tsx
│   │   │   ├── stats.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── about.tsx
│   │   │   ├── pricing.tsx
│   │   │   ├── cta.tsx
│   │   │   └── footer.tsx
│   │   ├── app/                # App-specific components
│   │   │   ├── sidebar.tsx
│   │   │   ├── header.tsx
│   │   │   ├── stat-card.tsx
│   │   │   ├── chart-card.tsx
│   │   │   ├── serial-picker.tsx
│   │   │   ├── serial-entry.tsx
│   │   │   ├── warranty-status-badge.tsx
│   │   │   ├── claim-workflow.tsx
│   │   │   └── ...
│   │   ├── forms/              # Form components
│   │   │   ├── product-form.tsx
│   │   │   ├── customer-form.tsx
│   │   │   ├── warranty-claim-form.tsx
│   │   │   └── ...
│   │   └── shared/             # Shared across all
│   │       ├── theme-toggle.tsx
│   │       ├── loading.tsx
│   │       ├── empty-state.tsx
│   │       └── error-boundary.tsx
│   ├── lib/
│   │   ├── store/              # State management
│   │   │   ├── products.ts
│   │   │   ├── transactions.ts
│   │   │   ├── serialized-items.ts
│   │   │   ├── warranty-claims.ts
│   │   │   └── ...
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── use-products.ts
│   │   │   ├── use-local-storage.ts
│   │   │   ├── use-serialized-items.ts
│   │   │   ├── use-warranty-claims.ts
│   │   │   └── ...
│   │   ├── utils/              # Utility functions
│   │   │   ├── format.ts
│   │   │   ├── export.ts
│   │   │   ├── warranty.ts
│   │   │   └── ...
│   │   ├── validations/        # Zod schemas
│   │   │   ├── product.ts
│   │   │   ├── serialized-item.ts
│   │   │   ├── warranty-claim.ts
│   │   │   └── ...
│   │   ├── data/               # Mock/seed data
│   │   │   ├── products.ts
│   │   │   ├── customers.ts
│   │   │   ├── serialized-items.ts
│   │   │   ├── warranty-claims.ts
│   │   │   └── ...
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts
│   │   ├── constants.ts        # App constants
│   │   └── animations.ts       # Animation presets
│   └── styles/
│       └── fonts.ts            # Font configurations
├── .env.local
├── .eslintrc.json
├── .prettierrc
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## How We Work

### Component-First Workflow

> **Core principle:** Complex pages are built one component at a time. Each component goes through a full implement → integrate → review → iterate cycle before we move on. Each component is immediately integrated into the real page so feedback is always in context.

This approach gives us:
- **Focused feedback** — you review one thing at a time, not a wall of code
- **Higher quality** — each component gets full attention and refinement
- **Cleaner iteration** — changes are scoped and won't break other parts
- **Better context** — Claude stays focused on one component's scope
- **Real-page feedback** — you always see the component live on the actual page, not in isolation

### The Build Cycle

For each component within a milestone:

```
┌─────────────────────────────────────────────┐
│  1. IMPLEMENT                               │
│     Claude provides code for the component  │
│     You create the file and paste it in     │
├─────────────────────────────────────────────┤
│  2. INTEGRATE                               │
│     Add the component to the real page      │
│     So you see it in the actual context     │
├─────────────────────────────────────────────┤
│  3. REVIEW                                  │
│     You check it in the browser             │
│     Test both light/dark mode               │
│     Test responsive (mobile/tablet/desktop) │
├─────────────────────────────────────────────┤
│  4. FEEDBACK                                │
│     Tell Claude what to change              │
│     "Looks good" or specific adjustments    │
├─────────────────────────────────────────────┤
│  5. ITERATE (if needed)                     │
│     Claude provides updated code            │
│     Repeat until you're satisfied           │
├─────────────────────────────────────────────┤
│  6. LOCK ✅ → NEXT MILESTONE                │
│     Component is done                       │
│     Commit, new chat, handover              │
│     Move to next component                  │
└─────────────────────────────────────────────┘
```

### Before Every UI Task

```
1. Read /mnt/skills/public/frontend-design/SKILL.md
2. Think about design direction
3. Implement with intention
4. No AI slop allowed
```

### After Every Milestone

Provide three things:

**1. Commit Message**
```
feat(milestone-name): brief description

- Detail 1
- Detail 2
- Detail 3
```

**2. Chat Name**
```
M[number] - [Brief Description]
```
Example: `M4 - Landing Hero`

**3. Handover Prompt**
```markdown
## Handover: M[X] → M[X+1]

### Completed
- What was finished

### Files Created/Modified
- List of key files

### Current State
- What the landing page / app looks like now
- Which components are live on the page

### Next Steps
- What M[X+1] should tackle
- Which component to build next

### Notes
- Any issues or decisions made
```

---

## Milestones

> **Milestone = one chat session = one component (for complex pages).**
>
> For the landing page, each component is its own milestone. The component gets built, integrated into the real page, reviewed, and iterated — all within that milestone. Once locked, we commit, start a new chat, and move to the next component.
>
> For simpler app pages, a milestone may cover a full page or a logical group of features.
>
> After each milestone: commit, new chat, handover.

### Complexity Guide
| Label | Meaning | Typical Iterations |
|-------|---------|-------------------|
| 🟢 Light | Simple component, mostly layout/styling | 1–2 rounds |
| 🟡 Medium | Moderate logic, animations, or interactivity | 2–3 rounds |
| 🔴 Heavy | Complex logic, many sub-parts, lots of interactivity | 3–5 rounds |

---

### Phase 1: Foundation

#### M1 — Project Setup
**Goal:** Initialize project with all dependencies and base configuration.

**Tasks:**
- [ ] Create Next.js 14 project with TypeScript
- [ ] Install and configure TailwindCSS v4
- [ ] Install ShadCN UI, configure components.json
- [ ] Install animation libraries (Framer Motion, GSAP)
- [ ] Install form libraries (React Hook Form, Zod)
- [ ] Install utility libraries (date-fns, clsx, tailwind-merge)
- [ ] Install chart library (Tremor)
- [ ] Install export libraries (xlsx, jsPDF)
- [ ] Set up folder structure
- [ ] Configure ESLint + Prettier
- [ ] Set up fonts (choose and configure)
- [ ] Create CSS variables (colors, spacing)
- [ ] Set up theme provider (light/dark mode)
- [ ] Create base layout

**Deliverables:**
- Working Next.js project
- All dependencies installed
- Theme toggle functional
- Base styles applied

> ℹ️ No build order needed — this is config/setup, not components.

---

#### M2 — Design System & Core UI Components
**Goal:** Build foundational UI components with proper styling.

**Build Order:**
| # | Component | File(s) | Complexity | Description |
|---|-----------|---------|------------|-------------|
| 1 | ShadCN base setup | `ui/*.tsx` | 🟢 Light | Install & style: Button, Input, Card, Dialog, Select, Dropdown, Tabs, Badge, Tooltip, Sheet |
| 2 | StatCard | `app/stat-card.tsx` | 🟡 Medium | KPI display with icon, value, trend indicator, animated counting |
| 3 | ChartCard | `app/chart-card.tsx` | 🟢 Light | Wrapper for Tremor charts with title, subtitle, date filter |
| 4 | DataTable | `ui/data-table.tsx` | 🔴 Heavy | Sortable columns, search, filters, pagination, row selection, bulk actions |
| 5 | StatusBadge | `app/status-badge.tsx` | 🟢 Light | Reusable colored badge for serial status, warranty status, etc. |
| 6 | Timeline | `app/timeline.tsx` | 🟡 Medium | Vertical timeline for serial/warranty history events |
| 7 | EmptyState | `shared/empty-state.tsx` | 🟢 Light | Illustration + message + action button for empty pages |
| 8 | LoadingSkeleton | `shared/loading.tsx` | 🟢 Light | Skeleton loaders matching various page layouts |
| 9 | PageHeader | `shared/page-header.tsx` | 🟢 Light | Page title, breadcrumb slot, action buttons |
| 10 | SearchInput | `ui/search-input.tsx` | 🟢 Light | Debounced search with icon and clear button |
| 11 | FilterDropdown | `ui/filter-dropdown.tsx` | 🟡 Medium | Multi-select dropdown for table filtering |
| 12 | Animation presets | `lib/animations.ts` | 🟡 Medium | Framer Motion variants: fadeIn, slideUp, stagger, scale, etc. |

**Deliverables:**
- Complete UI component library
- All components reviewed individually
- Animation presets ready

---

### Phase 2: Landing Page

> **Each landing page component = one milestone = one chat session.**
>
> The flow for every milestone in this phase:
> 1. Build the component file
> 2. Integrate it into `page.tsx` (the real landing page)
> 3. Review on the live page in the browser
> 4. Iterate until satisfied
> 5. Commit → new chat → next component
>
> By the end of Phase 2, the entire landing page is assembled and polished, one piece at a time.

#### M3 — Landing: Layout + Navbar
**Goal:** Set up the landing page infrastructure and build the navigation.

**Component:** `navbar.tsx` + `layout.tsx`
**Complexity:** 🟡 Medium
**Integrates into:** `app/(landing)/layout.tsx` and `app/(landing)/page.tsx`

**Tasks:**
- [ ] Create landing layout (`layout.tsx`): GSAP ScrollTrigger setup, smooth scroll config, base wrapper
- [ ] Build Navbar component:
  - [ ] Sticky with blur backdrop
  - [ ] Logo + nav links (anchor links to sections)
  - [ ] Theme toggle (light/dark)
  - [ ] CTA button
  - [ ] Mobile hamburger menu (responsive drawer)
  - [ ] Smooth scroll to sections (CSS native)
- [ ] Create initial `page.tsx` with Navbar mounted
- [ ] Review navbar on the live page

**Deliverables:**
- Landing layout with scroll infrastructure
- Polished navbar (desktop + mobile)
- Navbar visible on real page for review

---

#### M4 — Landing: Hero Section
**Goal:** Build the hero — the first thing visitors see.

**Component:** `hero.tsx`
**Complexity:** 🔴 Heavy
**Integrates into:** `page.tsx` below Navbar

**Tasks:**
- [ ] Animated headline with staggered text reveal (GSAP)
- [ ] Subheadline with fade-in
- [ ] CTA buttons (Try Demo, Learn More)
- [ ] Floating dashboard preview (parallax)
- [ ] Morphing gradient blobs background
- [ ] Animated KPI cards floating in 3D space
- [ ] Mobile responsive layout
- [ ] Add Hero to `page.tsx`, review on real page

**Deliverables:**
- Stunning hero section live on the page
- All animations working
- Responsive on all breakpoints

---

#### M5 — Landing: Features Bento
**Goal:** Build the features showcase section.

**Component:** `features-bento.tsx`
**Complexity:** 🟡 Medium
**Integrates into:** `page.tsx` below Hero

**Tasks:**
- [ ] Bento grid layout
- [ ] Feature cards with icons
- [ ] Hover animations (scale, glow)
- [ ] Scroll-triggered reveal animation
- [ ] Mobile responsive (stack on small screens)
- [ ] Add to `page.tsx`, review on real page with Hero above

**Deliverables:**
- Features section live on page
- Scroll animations flowing from Hero → Features

---

#### M6 — Landing: How It Works
**Goal:** Build the step-by-step process section.

**Component:** `how-it-works.tsx`
**Complexity:** 🟡 Medium
**Integrates into:** `page.tsx` below Features

**Tasks:**
- [ ] Step-by-step process (3–4 steps)
- [ ] Animated connectors between steps
- [ ] Icon illustrations per step
- [ ] Number indicators
- [ ] Scroll-triggered reveal
- [ ] Mobile responsive
- [ ] Add to `page.tsx`, review in context

**Deliverables:**
- How It Works section live on page
- Connectors and animations polished

---

#### M7 — Landing: Dashboard Preview
**Goal:** Build an interactive mockup showing the actual app.

**Component:** `dashboard-preview.tsx`
**Complexity:** 🔴 Heavy
**Integrates into:** `page.tsx` below How It Works

**Tasks:**
- [ ] Interactive mockup of the app dashboard
- [ ] Tabbed views showing different screens
- [ ] Device frame (optional)
- [ ] Subtle float animation
- [ ] Scroll-triggered entrance
- [ ] Mobile responsive
- [ ] Add to `page.tsx`, review in context

**Deliverables:**
- Dashboard preview section live on page
- Tab switching working
- Float animation smooth

---

#### M8 — Landing: Benefits / Stats
**Goal:** Build the statistics and social proof numbers section.

**Component:** `stats.tsx`
**Complexity:** 🟡 Medium
**Integrates into:** `page.tsx` below Dashboard Preview

**Tasks:**
- [ ] Animated counters (scroll-triggered, count up when visible)
- [ ] Statistics with icons
- [ ] Grid or horizontal layout
- [ ] Scroll-triggered reveal
- [ ] Mobile responsive
- [ ] Add to `page.tsx`, review in context

**Deliverables:**
- Stats section live on page
- Counters animate on scroll

---

#### M9 — Landing: Testimonials
**Goal:** Build the customer testimonials section.

**Component:** `testimonials.tsx`
**Complexity:** 🟡 Medium
**Integrates into:** `page.tsx` below Stats

**Tasks:**
- [ ] Carousel or grid layout
- [ ] Avatar, name, role, company per testimonial
- [ ] Quote with styling
- [ ] Auto-rotate (optional)
- [ ] Navigation controls (arrows, dots)
- [ ] Mobile responsive
- [ ] Add to `page.tsx`, review in context

**Deliverables:**
- Testimonials section live on page
- Carousel/grid polished

---

#### M10 — Landing: About Us
**Goal:** Build the about section telling Inventra's story.

**Component:** `about.tsx`
**Complexity:** 🟢 Light
**Integrates into:** `page.tsx` below Testimonials

**Tasks:**
- [ ] What is Inventra (brief description)
- [ ] Name meaning: Inventra = Inventory + Extra
- [ ] The story/motivation behind building it
- [ ] Who it's for (tech/gadget retail businesses)
- [ ] Our mission/vision statement
- [ ] Visual elements (illustration, photo, or icon-based)
- [ ] Scroll-triggered reveal animation
- [ ] Mobile responsive
- [ ] Add to `page.tsx`, review in context

**Deliverables:**
- About section live on page
- Story reads well, visuals polished

---

#### M11 — Landing: Pricing
**Goal:** Build the pricing tiers section.

**Component:** `pricing.tsx`
**Complexity:** 🟡 Medium
**Integrates into:** `page.tsx` below About

**Tasks:**
- [ ] Pricing cards (2–3 tiers)
- [ ] Feature comparison per tier
- [ ] CTA button per tier
- [ ] Popular tier highlight (badge, border, or scale)
- [ ] Scroll-triggered reveal
- [ ] Mobile responsive
- [ ] Add to `page.tsx`, review in context

> ℹ️ This is an optional section — we decide during review whether to keep or skip it.

**Deliverables:**
- Pricing section live on page (or decision to skip)

---

#### M12 — Landing: Final CTA + Footer + Full Page Review
**Goal:** Build the closing CTA and footer, then do a full-page review pass.

**Components:** `cta.tsx` + `footer.tsx`
**Complexity:** 🟢 Light
**Integrates into:** `page.tsx` as final sections

**Tasks:**
- [ ] Final CTA section:
  - [ ] Strong headline
  - [ ] Subtext
  - [ ] Primary action button
  - [ ] Background treatment (gradient, pattern, or illustration)
- [ ] Footer:
  - [ ] Logo
  - [ ] Navigation links
  - [ ] Social icons
  - [ ] Copyright
  - [ ] "Made with ♥" credit
- [ ] Add both to `page.tsx`
- [ ] **Full page review pass:**
  - [ ] Scroll through entire page top to bottom
  - [ ] Check animation flow between all sections
  - [ ] Verify consistent spacing and rhythm
  - [ ] Test full page in light mode
  - [ ] Test full page in dark mode
  - [ ] Test full page on mobile
  - [ ] Fix any issues found

**Deliverables:**
- Complete landing page with all sections
- CTA and footer polished
- Full page reviewed end-to-end
- Landing page done ✅

---

### Phase 3: Authentication

#### M13 — Auth Pages
**Goal:** Build login and register pages with simulated auth.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Auth layout | `app/(auth)/layout.tsx` | 🟡 Medium | Split layout design (form side + illustration/branding side), responsive collapse on mobile |
| 2 | Login page | `app/(auth)/login/page.tsx` | 🟡 Medium | Email/password form, show/hide toggle, remember me, demo credentials hint, Zod validation, loading state, error display |
| 3 | Register page | `app/(auth)/register/page.tsx` | 🟡 Medium | Full name/email/password/confirm form, password strength indicator, terms checkbox, Zod validation, success feedback |
| 4 | Auth logic | `lib/hooks/use-auth.ts` | 🟡 Medium | Simulated auth (localStorage), protected route wrapper, redirect flows, login/register/logout functions |

**Deliverables:**
- Login & register pages
- Auth simulation working
- Route protection functional

---

### Phase 4: App Shell

#### M14 — App Layout: Sidebar, Header & Navigation
**Goal:** Build the main application shell that wraps all app pages.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | App layout wrapper | `app/(app)/layout.tsx` | 🟢 Light | Overall layout structure, sidebar + main content area, page transition wrapper |
| 2 | Sidebar | `app/sidebar.tsx` | 🔴 Heavy | Logo, nav items with Lucide icons, nested navigation (Products → sub-items), active state highlighting, collapse/expand toggle, mobile drawer (Sheet), full nav structure from FEATURES.md |
| 3 | Header | `app/header.tsx` | 🟡 Medium | Global search trigger (⌘K), notifications bell with badge, theme toggle, user dropdown (profile, settings, logout) |
| 4 | Breadcrumbs | `shared/breadcrumbs.tsx` | 🟢 Light | Auto-generated from route, clickable path segments |
| 5 | Mobile navigation | `app/mobile-nav.tsx` | 🟡 Medium | Bottom tab bar (alternative to sidebar on mobile), key nav items, active state |
| 6 | Page transitions | Integration | 🟢 Light | Framer Motion page enter/exit animations, integrate with layout |

**Deliverables:**
- Complete app shell
- Sidebar with all nav items
- Responsive (sidebar ↔ mobile nav)
- Smooth page transitions

---

### Phase 5: Core Data & Types

#### M15 — Data Layer Setup
**Goal:** Set up all TypeScript types, Zod schemas, mock data, and state management.

**Build Order:**
| # | Step | File(s) | Complexity | Description |
|---|------|---------|------------|-------------|
| 1 | TypeScript types | `lib/types/index.ts` | 🟡 Medium | All data models from FEATURES.md: Product, Category, Customer, Supplier, Employee, SerializedItem, WarrantyClaim, WarrantyClaimNote, StockIn, StockInItem, Transaction, TransactionItem, Expense, Settings |
| 2 | Zod schemas | `lib/validations/*.ts` | 🟡 Medium | Validation schemas for each model |
| 3 | localStorage hooks | `lib/hooks/use-local-storage.ts` | 🟡 Medium | Generic typed hook for localStorage CRUD, auto-serialize/deserialize, seed data on first load |
| 4 | Seed/mock data | `lib/data/*.ts` | 🟡 Medium | Realistic demo data: products (mix of serial-tracked and non-tracked), customers, suppliers, employees, serialized items (various statuses), warranty claims, transactions, expenses |
| 5 | Store hooks | `lib/store/*.ts` | 🟡 Medium | Entity-specific hooks: useProducts, useCustomers, useSuppliers, useEmployees, useSerializedItems, useWarrantyClaims, useTransactions, useExpenses, useSettings |
| 6 | Utility functions | `lib/utils/*.ts` | 🟢 Light | format.ts (currency, dates), export.ts (Excel/PDF helpers), warranty.ts (expiry calculations, status checks) |

**Deliverables:**
- All types defined and consistent with FEATURES.md
- All Zod schemas matching types
- Realistic mock data loaded
- Store hooks working with localStorage

> ℹ️ No UI components in this milestone — it's pure data/logic. Feedback is on types, data quality, and hook APIs.

---

### Phase 6: Core App Pages

#### M16 — Dashboard
**Goal:** Build the main dashboard with charts, stats, and widgets.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Dashboard layout | `app/(app)/dashboard/page.tsx` | 🟢 Light | Page structure, grid layout for widgets, responsive columns |
| 2 | KPI stat cards | Integration of `stat-card.tsx` | 🟡 Medium | 4 cards: Total Revenue, Total Transactions, Products Sold, Low Stock Alerts. Trend indicators (↑↓ %), animated number counting, pull data from stores |
| 3 | Sales trend chart | Dashboard section | 🟡 Medium | Area/line chart (Tremor), daily/weekly/monthly toggle, responsive |
| 4 | Top products + Revenue by category | Dashboard section | 🟡 Medium | Bar chart for top products, donut/pie for category revenue |
| 5 | Recent activity feed | Dashboard section | 🟡 Medium | Activity list (latest transactions, stock changes), timestamps, action type icons, "View all" link |
| 6 | Quick actions | Dashboard section | 🟢 Light | Button grid: New Sale → POS, Add Product, Stock In, View Reports |
| 7 | Low stock alerts widget | Dashboard section | 🟡 Medium | Products below threshold, current vs minimum stock, quick reorder action |
| 8 | Warranty alerts widget | Dashboard section | 🟡 Medium | Expiring warranties (next 30 days), open claims count, claims needing attention, links to warranty pages |

**Deliverables:**
- Fully functional dashboard
- All charts working with mock data
- All widgets interactive
- Responsive on all breakpoints

---

#### M17 — Products Management
**Goal:** Full CRUD for products and categories.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Products list page | `app/(app)/products/page.tsx` | 🔴 Heavy | DataTable with all features. Search, filters (category, status, stock level, serial-tracked), sort, pagination, bulk actions, export to Excel |
| 2 | Add/Edit product form | `forms/product-form.tsx` + modal/page | 🔴 Heavy | All fields including serial tracking toggle, warranty period, image upload. Zod validation. Save & Save+Add Another |
| 3 | Product detail view | `app/(app)/products/[id]/page.tsx` | 🟡 Medium | Full info, stock summary for serial-tracked, "View Serial Numbers" link, recent transactions |
| 4 | Categories management | `app/(app)/products/categories/page.tsx` | 🟡 Medium | List, add/edit/delete, product count per category |
| 5 | Delete product | Integration | 🟢 Light | Confirmation dialog, soft/hard delete, warning for serialized items |

**Deliverables:**
- Complete products CRUD
- Serial tracking toggle functional
- Categories management
- Export working

---

#### M18 — Serial Inventory
**Goal:** Build serial number tracking and management page.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Serial inventory list | `app/(app)/serial-inventory/page.tsx` | 🔴 Heavy | DataTable with all columns. Filters: product, status, condition, warranty status. Search, sort, pagination, export |
| 2 | Warranty status badges | `app/warranty-status-badge.tsx` | 🟢 Light | Color-coded: active (green), expiring soon (amber), expired (red), n/a (gray) |
| 3 | Serial detail view | Modal or page | 🔴 Heavy | Full info, timeline/history, linked warranty claims, action buttons (Create Claim, Mark Scrapped, Update Condition, Edit Notes) |
| 4 | Bulk actions | Integration | 🟡 Medium | Multi-select, bulk update status, bulk export |

**Deliverables:**
- Serial inventory page complete
- Serial detail with full history timeline
- All filters working

---

#### M19 — POS Part 1: Layout, Product Grid & Cart
**Goal:** Build the POS interface foundation.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | POS layout | `app/(app)/pos/page.tsx` | 🟡 Medium | Split layout: products (left) + cart (right). Responsive stacking |
| 2 | Product grid | POS sub-component | 🔴 Heavy | Search, category tabs, product cards (image, name, price, stock), serial badge, click to add |
| 3 | Cart panel | POS sub-component | 🔴 Heavy | Items list, qty +/-, remove, subtotal, discount, tax toggle, grand total, clear cart |
| 4 | Cart state management | `lib/hooks/use-cart.ts` | 🟡 Medium | Add/remove/update, discount/tax logic, cart persistence, total calc |

**Deliverables:**
- POS layout responsive
- Product browsing and filtering
- Cart fully functional

---

#### M20 — POS Part 2: Serial Picker, Checkout & Receipt
**Goal:** Complete POS with serial selection, payment, and receipt.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Serial picker modal | `app/serial-picker.tsx` | 🔴 Heavy | List available serials, search, select to match qty, validation |
| 2 | Checkout flow | POS sub-component | 🟡 Medium | Payment method, cash calculation, customer selection, notes, complete sale |
| 3 | Sale completion logic | Integration | 🔴 Heavy | Create transaction, update stock, update SerializedItem, calculate warranty expiry |
| 4 | Receipt preview & print | POS sub-component | 🟡 Medium | Receipt modal with serials + warranty info, browser print |
| 5 | Hold/recall & shortcuts | Integration | 🟡 Medium | Hold/recall transactions, keyboard shortcuts |

**Deliverables:**
- Serial picker working
- Full checkout flow
- Transactions saved
- Receipt with serials

---

#### M21 — Stock In (Purchases) & Suppliers
**Goal:** Purchase management, stock receiving with serial entry, and supplier CRUD.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Supplier list & CRUD | `app/(app)/suppliers/` + form | 🟡 Medium | DataTable, search, pagination, add/edit form, supplier detail with purchase history |
| 2 | Purchase list page | `app/(app)/stock-in/page.tsx` | 🟡 Medium | DataTable, search, filters (date, status, supplier), pagination |
| 3 | Create purchase form | `app/(app)/stock-in/new/page.tsx` | 🔴 Heavy | Supplier selection, add products, qty + cost, totals, save draft/complete |
| 4 | Serial number entry | `app/serial-entry.tsx` | 🔴 Heavy | Bulk paste or one-by-one, count validation, duplicate detection, create SerializedItem records |
| 5 | Purchase detail view | `app/(app)/stock-in/[id]/page.tsx` | 🟡 Medium | Full info, serial numbers received, click serial → history, print purchase order |
| 6 | Receive stock logic | Integration | 🟡 Medium | Mark received, update stock, partial receive, activate serials |

**Deliverables:**
- Supplier CRUD complete
- Purchase management with serial entry
- Stock receiving working

---

#### M22 — Stock Out (Sales), Returns & Customers
**Goal:** Sales history, return processing, and customer management.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Customer list & CRUD | `app/(app)/customers/` + form | 🟡 Medium | DataTable, search, pagination, add/edit form |
| 2 | Customer detail | `app/(app)/customers/[id]/page.tsx` | 🟡 Medium | Info, transaction history, total spent, purchased serialized items tab with warranty status |
| 3 | Sales list page | `app/(app)/stock-out/page.tsx` | 🟡 Medium | DataTable, search by receipt/customer/serial, filters, pagination |
| 4 | Sale detail view | `app/(app)/stock-out/[id]/page.tsx` | 🟡 Medium | Full info, serial numbers, reprint receipt, void sale |
| 5 | Returns/refunds | Modal or sub-page | 🔴 Heavy | Select items/serials to return, set condition, refund calc, restock, option to create warranty claim |

**Deliverables:**
- Customer CRUD with serial purchase history
- Sales history with serial tracking
- Return/refund processing

---

### Phase 7: Warranty System

#### M23 — Warranty Claims
**Goal:** Full warranty claim management with workflow, notes, and resolution.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Warranty claims list | `app/(app)/warranty-claims/page.tsx` | 🟡 Medium | DataTable, search, filters (status, type, date, customer, supplier), pagination, export |
| 2 | Create warranty claim form | `forms/warranty-claim-form.tsx` | 🔴 Heavy | Search serial, auto-fill info, claim type, issue description, attachments, validation |
| 3 | Claim detail view | `app/(app)/warranty-claims/[id]/page.tsx` | 🔴 Heavy | Full info, serial summary, customer/supplier info, attachments viewer |
| 4 | Claim workflow actions | `app/claim-workflow.tsx` | 🔴 Heavy | Status update buttons, state machine transitions, SerializedItem status updates |
| 5 | Claim notes | Sub-component | 🟡 Medium | Add note input, notes history with author + timestamp |
| 6 | Claim resolution | Sub-component | 🟡 Medium | Repair cost, replacement serial linking, resolution notes, close claim |

**Deliverables:**
- Warranty claims CRUD
- Full status workflow
- Notes/communication log
- Resolution with replacement linking

---

### Phase 8: Business Features

#### M24 — Employees & Expenses
**Goal:** Employee management and expense tracking module.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Employee list & CRUD | `app/(app)/employees/` + form | 🟡 Medium | DataTable, search, filter by role, add/edit form, employee detail |
| 2 | Employee detail | `app/(app)/employees/[id]/page.tsx` | 🟢 Light | Employee info, transaction history, payroll history |
| 3 | Expense categories | Setup within expenses | 🟢 Light | Predefined + custom categories |
| 4 | Expense list page | `app/(app)/expenses/page.tsx` | 🟡 Medium | DataTable, filter by category/date, total expenses, pagination |
| 5 | Expense CRUD | Form (modal or page) | 🟡 Medium | Date, category, description, amount, receipt image, notes, recurring toggle |
| 6 | Feature toggle wiring | Settings integration | 🟢 Light | Expenses module respects settings toggle |

**Deliverables:**
- Employee management complete
- Expense tracking with categories
- Feature toggle working

---

#### M25 — Reports Part 1: Sales, Purchase, Stock & Profit
**Goal:** Build the core business reports.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Reports layout | `app/(app)/reports/` | 🟡 Medium | Tab navigation, shared date range picker, export buttons, print button |
| 2 | Sales report | Reports section | 🔴 Heavy | Total sales, transaction count, avg value, sales by day chart, top products, category breakdown |
| 3 | Purchase report | Reports section | 🟡 Medium | Purchases by date/supplier, chart + table |
| 4 | Stock report | Reports section | 🟡 Medium | Current levels, low stock, total value, movement history |
| 5 | Profit & Loss report | Reports section | 🔴 Heavy | Revenue, COGS, gross profit, expenses, net profit, period comparison |

**Deliverables:**
- Reports infrastructure
- 4 core reports functional
- Export to Excel + PDF working

---

#### M26 — Reports Part 2: Remaining Reports
**Goal:** Build specialized and operational reports.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Cash flow report | Reports section | 🟡 Medium | Income vs expenses over time, monthly breakdown |
| 2 | Expense report | Reports section | 🟡 Medium | Expenses by category/date, breakdown chart |
| 3 | Payroll report | Reports section | 🟢 Light | Employee salaries by period |
| 4 | Serial inventory report | Reports section | 🔴 Heavy | Status/condition breakdown, movement history, scrapped summary, avg time in inventory |
| 5 | Warranty report | Reports section | 🔴 Heavy | Active/expiring/expired warranties, claims summary by status/type/resolution, avg resolution time, repair costs, claims by product/supplier |

**Deliverables:**
- All remaining reports functional
- Serial & warranty analytics
- All reports exportable

---

#### M27 — Settings
**Goal:** App configuration, preferences, and data management.

**Build Order:**
| # | Component | File | Complexity | Description |
|---|-----------|------|------------|-------------|
| 1 | Settings layout | `app/(app)/settings/page.tsx` | 🟢 Light | Tab-based or sectioned layout |
| 2 | Store information | Settings section | 🟡 Medium | Store name, address, phone, email, logo upload, receipt header/footer |
| 3 | Preferences | Settings section | 🟡 Medium | Currency, tax rate + toggle, low stock threshold, date format, theme |
| 4 | Serial & warranty settings | Settings section | 🟡 Medium | Default warranty period, alert threshold, claim number prefix/format |
| 5 | Feature toggles | Settings section | 🟡 Medium | Toggle switches for all optional modules, show/hide sidebar items |
| 6 | Data management | Settings section | 🟡 Medium | Export all data, import, reset demo data, backup |
| 7 | About | Settings section | 🟢 Light | App version, credits, license info |

**Deliverables:**
- Complete settings page
- Feature toggles working across app
- Data export/import working

---

### Phase 9: Polish & Deploy

#### M28 — Final Polish & Testing
**Goal:** Bug fixes, performance, accessibility, final touches.

**Build Order:**
| # | Step | Complexity | Description |
|---|------|------------|-------------|
| 1 | Cross-browser testing | 🟡 Medium | Chrome, Firefox, Safari, Edge |
| 2 | Mobile testing | 🟡 Medium | All pages on mobile breakpoints, touch interactions |
| 3 | Loading states audit | 🟢 Light | Verify every page has loading skeletons |
| 4 | Empty states audit | 🟢 Light | Verify every list/table has proper empty state |
| 5 | Error states audit | 🟢 Light | Error boundaries, retry actions |
| 6 | Light/dark mode audit | 🟡 Medium | Every page correct in both modes |
| 7 | Performance optimization | 🟡 Medium | Lazy loading, code splitting, GPU animations |
| 8 | Accessibility audit | 🟡 Medium | Keyboard nav, ARIA labels, focus indicators, `prefers-reduced-motion` |
| 9 | Animation polish | 🟢 Light | 60fps everywhere, timing/easing tweaks |
| 10 | README documentation | 🟢 Light | Overview, setup, tech stack, screenshots |

**Deliverables:**
- Production-ready portfolio
- All audits passed
- README complete

---

#### M29 — Portfolio Deployment
**Goal:** Deploy to Vercel.

**Tasks:**
- [ ] Set up Vercel project
- [ ] Configure environment
- [ ] Deploy
- [ ] Test production build
- [ ] Custom domain (optional)
- [ ] Final smoke test on live site

**Deliverables:**
- Live portfolio site on Vercel

---

#### M30 — JDUA COMPUTER (Desktop App)
**Goal:** Create the Tauri desktop version for real business use.

**Build Order:**
| # | Step | Complexity | Description |
|---|------|------------|-------------|
| 1 | Project setup | 🟡 Medium | New repo, Vite + React + Tauri init |
| 2 | Component migration | 🟡 Medium | Copy components, remove landing/auth pages |
| 3 | Branding swap | 🟢 Light | JDUA COMPUTER logo, update colors if needed |
| 4 | Language translation | 🔴 Heavy | Translate all UI strings to Bahasa Indonesia |
| 5 | Database setup | 🔴 Heavy | Prisma + SQLite, replace localStorage with DB queries |
| 6 | Data features | 🟡 Medium | Backup/restore, data export |
| 7 | Build & package | 🟡 Medium | Build .exe, create installer, test on Windows |

**Deliverables:**
- Working desktop app
- Bahasa Indonesia UI
- SQLite database
- Installer for distribution

---

## Quality Checklist

Before completing any milestone:

- [ ] Code compiles without errors
- [ ] No TypeScript errors
- [ ] Responsive on mobile, tablet, desktop
- [ ] Light mode works
- [ ] Dark mode works
- [ ] Loading states present (where applicable)
- [ ] Empty states present (where applicable)
- [ ] Error handling in place
- [ ] Animations smooth (60fps)
- [ ] Keyboard accessible
- [ ] Clean code, no commented junk
- [ ] Each component individually reviewed ✅

---

## Milestone Summary

| # | Milestone | Phase | Complexity |
|---|-----------|-------|------------|
| **M1** | Project Setup | Foundation | 🟢 |
| **M2** | Design System & Core UI | Foundation | 🟡 |
| **M3** | Landing: Layout + Navbar | Landing Page | 🟡 |
| **M4** | Landing: Hero Section | Landing Page | 🔴 |
| **M5** | Landing: Features Bento | Landing Page | 🟡 |
| **M6** | Landing: How It Works | Landing Page | 🟡 |
| **M7** | Landing: Dashboard Preview | Landing Page | 🔴 |
| **M8** | Landing: Benefits / Stats | Landing Page | 🟡 |
| **M9** | Landing: Testimonials | Landing Page | 🟡 |
| **M10** | Landing: About Us | Landing Page | 🟢 |
| **M11** | Landing: Pricing | Landing Page | 🟡 |
| **M12** | Landing: CTA + Footer + Full Page Review | Landing Page | 🟢 |
| **M13** | Auth Pages | Authentication | 🟡 |
| **M14** | App Layout: Sidebar, Header & Nav | App Shell | 🟡 |
| **M15** | Data Layer Setup | Data Layer | 🟡 |
| **M16** | Dashboard | Core Pages | 🟡 |
| **M17** | Products Management | Core Pages | 🔴 |
| **M18** | Serial Inventory | Core Pages | 🔴 |
| **M19** | POS Part 1: Layout, Grid & Cart | Core Pages | 🔴 |
| **M20** | POS Part 2: Serial, Checkout & Receipt | Core Pages | 🔴 |
| **M21** | Stock In & Suppliers | Core Pages | 🔴 |
| **M22** | Stock Out, Returns & Customers | Core Pages | 🔴 |
| **M23** | Warranty Claims | Warranty | 🔴 |
| **M24** | Employees & Expenses | Business | 🟡 |
| **M25** | Reports Part 1: Core Reports | Business | 🔴 |
| **M26** | Reports Part 2: Remaining Reports | Business | 🔴 |
| **M27** | Settings | Business | 🟡 |
| **M28** | Final Polish & Testing | Polish | 🟡 |
| **M29** | Portfolio Deployment | Deploy | 🟢 |
| **M30** | JDUA COMPUTER Desktop App | Deploy | 🔴 |
| | **Total: 30 milestones** | | |

---

## Commands Reference

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Production build
npm run start        # Start production server

# Lint
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues

# Format
npm run format       # Run Prettier
```

---

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [ShadCN UI](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)
- [GSAP](https://greensock.com/docs)
- [Tremor](https://tremor.so)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)
- [Tauri](https://tauri.app)
