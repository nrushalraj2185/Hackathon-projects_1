import { pgTable, serial, text, real, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const marketPricesTable = pgTable("market_prices", {
  id: serial("id").primaryKey(),
  cropName: text("crop_name").notNull(),
  market: text("market").notNull(),
  state: text("state"),
  pricePerQuintal: real("price_per_quintal").notNull(),
  minPrice: real("min_price"),
  maxPrice: real("max_price"),
  modalPrice: real("modal_price"),
  unit: text("unit").default("quintal"),
  priceChange: real("price_change"),
  priceChangePercent: real("price_change_percent"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const marketListingsTable = pgTable("market_listings", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  cropName: text("crop_name").notNull(),
  quantity: real("quantity").notNull(),
  unit: text("unit").default("quintal"),
  pricePerUnit: real("price_per_unit").notNull(),
  location: text("location").notNull(),
  contactName: text("contact_name"),
  contactPhone: text("contact_phone"),
  description: text("description"),
  quality: text("quality"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMarketListingSchema = createInsertSchema(marketListingsTable).omit({ id: true, createdAt: true });
export type InsertMarketListing = z.infer<typeof insertMarketListingSchema>;
export type MarketListing = typeof marketListingsTable.$inferSelect;
export type MarketPrice = typeof marketPricesTable.$inferSelect;
