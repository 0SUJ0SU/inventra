# CLAUDE.md — Inventra

## Project Overview

Inventra is a modern inventory and business management system for tech/gadget retail. Read the full project docs before any work:

- **VISION.md** — Design philosophy, colors, typography, brand identity, motion principles
- **WORKFLOW.md** — Tech stack, project structure, milestones, build order
- **FEATURES.md** — Complete feature list, data models, serial/warranty workflows
- **STATUS.md** — Current progress. **Read this first** to know where we are. **Update it after every milestone.**
- **FRONTEND_DESIGN_GUIDE.md** — Frontend aesthetics rules. **Read before any UI work.**

## Tech Stack

- Next.js 14 (App Router) + TypeScript + React 18
- TailwindCSS v4 + ShadCN UI + Lucide React
- Framer Motion + GSAP + ScrollTrigger
- React Hook Form + Zod + date-fns
- Tremor (charts) + xlsx + jsPDF
- localStorage for data persistence (portfolio version)

## Critical Rules

### 1. No AI Slop

Every UI element must be intentional, distinctive, textured, and polished. Never use:
- Generic fonts (Inter, Roboto, Arial, system defaults)
- Cliché color schemes (purple gradients, cold blue primaries)
- Pure white (`#FFFFFF`) or pure black (`#000000`) — always warm-shifted
- Cold blue-tinted dark modes — dark mode has warm rose/brown undertones
- Flat, sterile surfaces with no grain or texture
- Cookie-cutter layouts
- Placeholder-quality design

Use quality typefaces: Fraunces (italic serif display), Space Grotesk (geometric headlines), Satoshi (warm body), Plus Jakarta Sans, JetBrains Mono (data). See VISION.md for the full typography and color system.

### 2. Design System

Follow VISION.md exactly for:
- **Colors**: Dusty rose accent `#C4918A`, warm cream backgrounds (`#F5F1EC` light, `#141113` dark), warm near-black text (`#1C1917`). Never pure white or pure black. See VISION.md for full palette
- **Surface treatments**: Grain/noise overlays (0.03-0.05 opacity), dot-grid patterns, warm glass for floating elements, industrial divider lines
- **Texture**: Every surface must feel physical — grain overlays, warm tones, subtle shadows. No flat solid-color backgrounds
- **Motion**: Dynamic, playful, handcrafted animations. Marquee tickers on dark bars with dusty rose text. Staggered reveals, parallax layers. Page transitions 0.5-0.8s, section reveals 0.6-1.0s, component enters 0.3-0.5s, micro-interactions 0.15-0.25s
- **Dark mode**: Must work in both light and dark. Warm charcoal backgrounds with rose undertone (`#141113`, `#221E20`), warm cream text (`#F5F0EB`)
- **Dark section bands**: Can use dark-mode colors inside light pages for dramatic section contrast

### 3. Follow Milestones in Order

Work milestone by milestone as defined in WORKFLOW.md. Don't skip ahead. Each milestone has a specific scope, build order, and deliverables.

### 4. Read FRONTEND_DESIGN_GUIDE.md Before Any UI Work

Before creating any component, page, or visual element — read FRONTEND_DESIGN_GUIDE.md. This is non-negotiable for every UI task.

### 5. Quality Standards

Every component must be:
- Responsive (mobile, tablet, desktop)
- Light/dark mode compatible (warm tones in both — cream light, warm charcoal dark)
- Keyboard accessible
- Animated with purpose (respect `prefers-reduced-motion`)
- Textured — no flat solid backgrounds
- Clean TypeScript with no errors
- Well-organized with meaningful names

## Code Conventions

### File Organization
```
src/
  app/           → Next.js App Router pages
  components/
    ui/          → ShadCN + custom primitives
    landing/     → Landing page sections
    app/         → App-specific components
    forms/       → Form components
    shared/      → Cross-cutting (loading, empty states, etc.)
  lib/
    store/       → State management hooks
    hooks/       → Custom React hooks
    utils/       → Utility functions
    validations/ → Zod schemas
    data/        → Mock/seed data
    types/       → TypeScript types
    constants.ts
    animations.ts
  styles/
    fonts.ts     → Font configurations
```

### Naming
- Components: PascalCase (`StatCard.tsx`)
- Hooks: camelCase with `use` prefix (`useProducts.ts`)
- Utils: camelCase (`formatCurrency.ts`)
- Types: PascalCase (`Product`, `SerializedItem`)
- Files: kebab-case for non-components (`serial-picker.tsx`), PascalCase or kebab-case for components

### Imports
- Use `@/` path alias for `src/`
- Group: React → external libs → internal components → types → styles

### TypeScript
- Strict mode always
- Explicit return types on exported functions
- No `any` — use proper types from `lib/types/index.ts`

## After Completing a Milestone

Do two things:

### 1. Update STATUS.md
Update the current milestone, last completed, and add the milestone to the completed log with files changed and any notes.

### 2. Provide Handover
```
feat(milestone-name): brief description

- Detail 1
- Detail 2
- Detail 3
```

Chat name: `M[number] - [Brief Description]`

Handover prompt:
```markdown
## Handover: M[X] → M[X+1]

### Completed
- What was finished

### Files Created/Modified
- List of key files

### Current State
- What the app looks like now

### Next Steps
- What M[X+1] should tackle

### Notes
- Any issues or decisions made
```

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Run Prettier
```
