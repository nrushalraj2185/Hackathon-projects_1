import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const laborJobsTable = pgTable("labor_jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  date: text("date").notNull(),
  duration: text("duration"),
  wage: real("wage").notNull(),
  wageUnit: text("wage_unit").notNull(),
  workersNeeded: integer("workers_needed").notNull(),
  workersApplied: integer("workers_applied").default(0),
  skills: text("skills"),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
  status: text("status").notNull().default("open"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLaborJobSchema = createInsertSchema(laborJobsTable).omit({ id: true, createdAt: true, workersApplied: true });
export type LaborJob = typeof laborJobsTable.$inferSelect;
