import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cropsTable = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  variety: text("variety"),
  fieldName: text("field_name").notNull(),
  areaHectares: real("area_hectares"),
  plantingDate: text("planting_date"),
  expectedHarvestDate: text("expected_harvest_date"),
  status: text("status").notNull().default("planted"),
  healthStatus: text("health_status").notNull().default("good"),
  lastInspected: text("last_inspected"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCropSchema = createInsertSchema(cropsTable).omit({ id: true, createdAt: true });
export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Crop = typeof cropsTable.$inferSelect;
