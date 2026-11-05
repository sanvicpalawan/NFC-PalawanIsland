import "dotenv/config";
import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit configuration.
 *
 * The connection string comes from DATABASE_URL so the same command works
 * locally, in CI and inside a container. The localhost value is a development
 * convenience only and must never be used for a real deployment.
 */
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  // Only this schema belongs to this application. Without the filter, a shared
  // Postgres instance raises a table-name conflict prompt between schemas.
  schemaFilter: ["nfc_palawan"],
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://postgres:postgres@127.0.0.1:5432/app_db",
  },
});
