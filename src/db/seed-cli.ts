/**
 * CLI entry point for seeding: `npm run db:seed`.
 *
 * The application itself only seeds through `seedDatabase()` (used by the
 * health route); this file exists so the same routine can be run from a
 * terminal or a container without going through the web server.
 */
import "dotenv/config";
import { seedDatabase } from "./seed";

seedDatabase()
  .then(() => {
    console.log("[seed] finished");
    process.exit(0);
  })
  .catch((error) => {
    console.error("[seed] failed:", error);
    process.exit(1);
  });
