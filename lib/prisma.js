import { PrismaClient } from "@prisma/client";

// Avoids exhausting the DB connection limit in Next.js dev mode,
// where modules can be re-evaluated on every hot reload.
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
