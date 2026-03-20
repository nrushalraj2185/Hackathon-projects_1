import { pgTable, serial, text, real, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const farmExpensesTable = pgTable("farm_expenses", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
  cropId: integer("crop_id"),
  cropName: text("crop_name"),
  paymentMethod: text("payment_method"),
  receipt: text("receipt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const farmIncomeTable = pgTable("farm_income", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(),
  description: text("description"),
  amount: real("amount").notNull(),
  date: text("date").notNull(),
  cropId: integer("crop_id"),
  cropName: text("crop_name"),
  buyer: text("buyer"),
  quantity: real("quantity"),
  unit: text("unit"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const inventoryTable = pgTable("inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(),
  minQuantity: real("min_quantity"),
  location: text("location"),
  expiryDate: text("expiry_date"),
  purchaseDate: text("purchase_date"),
  cost: real("cost"),
  supplier: text("supplier"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const livestockTable = pgTable("livestock", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  breed: text("breed"),
  count: integer("count").notNull(),
  tagId: text("tag_id"),
  age: integer("age"),
  health: text("health").notNull().default("healthy"),
  lastVaccination: text("last_vaccination"),
  nextVaccination: text("next_vaccination"),
  breedingDate: text("breeding_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertFarmExpenseSchema = createInsertSchema(farmExpensesTable).omit({ id: true, createdAt: true });
export const insertFarmIncomeSchema = createInsertSchema(farmIncomeTable).omit({ id: true, createdAt: true });
export const insertInventorySchema = createInsertSchema(inventoryTable).omit({ id: true, createdAt: true });
export const insertLivestockSchema = createInsertSchema(livestockTable).omit({ id: true, createdAt: true });

export type FarmExpense = typeof farmExpensesTable.$inferSelect;
export type FarmIncome = typeof farmIncomeTable.$inferSelect;
export type InventoryItem = typeof inventoryTable.$inferSelect;
export type Livestock = typeof livestockTable.$inferSelect;
