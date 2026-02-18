import { defineConfig } from "prisma/config";

// This will print to your Docker logs the moment Prisma tries to load the config
console.log("--- PRISMA CONFIG LOADED ---");
console.log("DATABASE_URL PRESENT:", !!process.env.DATABASE_URL);
console.log("URL VALUE:", process.env.DATABASE_URL);
console.log("----------------------------");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
});