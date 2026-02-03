# STATUS.md — Inventra

> This file is updated by Claude Code after every milestone. Read it first to know where we are.

## Current State

**Current Milestone:** M2 — Design System & Core UI Components
**Last Completed:** M1 — Project Setup
**Branch:** main

## Completed Milestones

<!-- Add entries here as milestones are completed. Most recent on top. -->

### M1 — Project Setup ✅
**Date:** 2026-02-03

**Files Created/Modified:**
- `package.json` — Project configuration with all dependencies
- `tsconfig.json` — TypeScript configuration with strict mode
- `tailwind.config.ts` — Full Tailwind configuration with design system colors
- `next.config.mjs` — Next.js configuration
- `postcss.config.mjs` — PostCSS configuration
- `.eslintrc.json` — ESLint configuration with Prettier
- `.prettierrc` — Prettier configuration
- `components.json` — ShadCN UI configuration
- `src/app/globals.css` — CSS variables per VISION.md (colors, surfaces, textures)
- `src/app/layout.tsx` — Root layout with fonts and ThemeProvider
- `src/app/page.tsx` — Placeholder landing page
- `src/styles/fonts.ts` — Font configuration (Fraunces, Space Grotesk, Plus Jakarta Sans, JetBrains Mono)
- `src/components/shared/theme-provider.tsx` — Theme provider wrapper
- `src/components/shared/theme-toggle.tsx` — Light/dark mode toggle
- `src/components/ui/button.tsx` — ShadCN button component
- `src/lib/utils.ts` — cn() utility function
- `src/lib/constants.ts` — App constants (nav items, statuses, etc.)
- `src/lib/animations.ts` — Framer Motion animation variants
- `src/lib/types/index.ts` — TypeScript types per FEATURES.md

**Dependencies Installed:**
- Core: Next.js 14, React 18, TypeScript 5
- Styling: TailwindCSS 3.4, tailwindcss-animate
- UI: ShadCN UI, Lucide React, class-variance-authority, clsx, tailwind-merge
- Animation: Framer Motion, GSAP, @gsap/react
- Forms: React Hook Form, Zod, @hookform/resolvers
- Charts: @tremor/react
- Export: xlsx, jspdf, react-to-print
- Utils: date-fns, next-themes
- Dev: Prettier, eslint-config-prettier, prettier-plugin-tailwindcss

**Folder Structure Created:**
```
src/
├── app/
│   ├── (landing)/
│   ├── (auth)/login/, register/
│   ├── (app)/dashboard/, pos/, products/, serial-inventory/, stock-in/, stock-out/, customers/, suppliers/, employees/, expenses/, warranty-claims/, reports/, settings/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── landing/
│   ├── app/
│   ├── forms/
│   └── shared/
├── lib/
│   ├── store/
│   ├── hooks/
│   ├── utils/
│   ├── validations/
│   ├── data/
│   ├── types/
│   ├── utils.ts
│   ├── constants.ts
│   └── animations.ts
└── styles/
    └── fonts.ts
```

**Notes:**
- Used TailwindCSS 3.4 (stable) instead of v4 (beta) for ShadCN compatibility
- Using Plus Jakarta Sans instead of Satoshi (not available on Google Fonts)
- All CSS variables from VISION.md implemented in globals.css
- Build compiles successfully, theme toggle works
