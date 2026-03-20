import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sensorReadingsTable = pgTable("sensor_readings", {
  id: serial("id").primaryKey(),
  fieldId: text("field_id").notNull(),
  fieldName: text("field_name"),
  soilMoisture: real("soil_moisture"),
  soilPh: real("soil_ph"),
  soilTemperature: real("soil_temperature"),
  nitrogen: real("nitrogen"),
  phosphorus: real("phosphorus"),
  potassium: real("potassium"),
  airTemperature: real("air_temperature"),
  airHumidity: real("air_humidity"),
  lightIntensity: real("light_intensity"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertSensorReadingSchema = createInsertSchema(sensorReadingsTable).omit({ id: true, timestamp: true });
export type SensorReading = typeof sensorReadingsTable.$inferSelect;
