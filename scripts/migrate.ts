import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;

const runMigrate = async () => {
  console.log("Running migrations...");
  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);
  
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log("Migrations complete!");
  
  await migrationClient.end();
};

runMigrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
