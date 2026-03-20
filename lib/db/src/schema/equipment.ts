import { pgTable, serial, text, real, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const equipmentListingsTable = pgTable("equipment_listings", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  ratePerDay: real("rate_per_day").notNull(),
  location: text("location").notNull(),
  ownerName: text("owner_name").notNull(),
  ownerPhone: text("owner_phone"),
  available: boolean("available").notNull().default(true),
  availableFrom: text("available_from"),
  availableTo: text("available_to"),
  condition: text("condition").default("good"),
  brand: text("brand"),
  model: text("model"),
  yearOfMake: integer("year_of_make"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const equipmentBookingsTable = pgTable("equipment_bookings", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").notNull(),
  equipmentName: text("equipment_name").notNull(),
  fromDate: text("from_date").notNull(),
  toDate: text("to_date").notNull(),
  totalDays: integer("total_days"),
  totalCost: real("total_cost"),
  farmerName: text("farmer_name").notNull(),
  farmerPhone: text("farmer_phone"),
  status: text("status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEquipmentListingSchema = createInsertSchema(equipmentListingsTable).omit({ id: true, createdAt: true });
export const insertEquipmentBookingSchema = createInsertSchema(equipmentBookingsTable).omit({ id: true, createdAt: true });
export type EquipmentListing = typeof equipmentListingsTable.$inferSelect;
export type EquipmentBooking = typeof equipmentBookingsTable.$inferSelect;
