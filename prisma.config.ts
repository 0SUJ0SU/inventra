import { defineConfig } from "prisma/config"
import path from "node:path"
import dotenv from "dotenv"

// Prisma CLI does NOT read .env.local by default — must load manually
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
})
