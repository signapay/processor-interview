#!/usr/bin/env bun
/**
 * Script to set up the database and generate Prisma client
 * Run with: bun run scripts/setup-db.ts
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";

// Ensure scripts directory exists
if (!existsSync("./scripts")) {
  mkdirSync("./scripts");
}

console.log("🔄 Setting up database...");

try {
  // Generate Prisma client
  console.log("📦 Generating Prisma client...");
  execSync("bunx prisma generate", { stdio: "inherit" });

  // Create migrations and apply them
  console.log("🗃️ Creating and applying migrations...");
  execSync("bunx prisma migrate dev --name init", { stdio: "inherit" });

  console.log("✅ Database setup complete!");
} catch (error) {
  console.error("❌ Error setting up database:", error);
  process.exit(1);
}
