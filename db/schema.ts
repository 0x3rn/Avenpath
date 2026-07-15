import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Example basic schema to ensure Drizzle has a target
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});
