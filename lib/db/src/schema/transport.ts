import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transportRequestsTable = pgTable("transport_requests", {
  id: serial("id").primaryKey(),
  farmerName: text("farmer_name").notNull(),
  farmerPhone: text("farmer_phone"),
  pickupLocation: text("pickup_location").notNull(),
  dropLocation: text("drop_location").notNull(),
  cropType: text("crop_type").notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").default("quintal"),
  scheduledDate: text("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time"),
  status: text("status").notNull().default("pending"),
  driverName: text("driver_name"),
  driverPhone: text("driver_phone"),
  estimatedCost: real("estimated_cost"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTransportRequestSchema = createInsertSchema(transportRequestsTable).omit({ id: true, createdAt: true });
export type TransportRequest = typeof transportRequestsTable.$inferSelect;
