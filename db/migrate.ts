import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "@/lib/db";


async function main() {
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migration complete");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});