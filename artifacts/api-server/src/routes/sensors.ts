import { Router } from "express";
import { db } from "@workspace/db";
import { sensorReadingsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

const seedReadings = [
  { fieldId: "field-1", fieldName: "North Field (Wheat)", soilMoisture: 62, soilPh: 6.8, soilTemperature: 24, nitrogen: 180, phosphorus: 45, potassium: 220, airTemperature: 28, airHumidity: 65, lightIntensity: 850 },
  { fieldId: "field-2", fieldName: "South Field (Rice)", soilMoisture: 78, soilPh: 6.2, soilTemperature: 26, nitrogen: 155, phosphorus: 38, potassium: 195, airTemperature: 30, airHumidity: 72, lightIntensity: 920 },
  { fieldId: "field-3", fieldName: "East Field (Cotton)", soilMoisture: 45, soilPh: 7.2, soilTemperature: 27, nitrogen: 120, phosphorus: 55, potassium: 180, airTemperature: 31, airHumidity: 58, lightIntensity: 880 },
];

router.get("/readings", async (req, res) => {
  const { fieldId } = req.query;
  const readings = await db.select().from(sensorReadingsTable).orderBy(desc(sensorReadingsTable.timestamp)).limit(50);

  if (readings.length === 0) {
    const inserted = await db.insert(sensorReadingsTable).values(seedReadings).returning();
    return res.json(inserted.map(r => ({ ...r, timestamp: r.timestamp.toISOString() })));
  }

  const filtered = fieldId ? readings.filter(r => r.fieldId === fieldId) : readings;
  res.json(filtered.map(r => ({ ...r, timestamp: r.timestamp.toISOString() })));
});

router.post("/readings", async (req, res) => {
  const data = req.body;
  const [reading] = await db.insert(sensorReadingsTable).values({
    fieldId: data.fieldId,
    fieldName: data.fieldName,
    soilMoisture: data.soilMoisture,
    soilPh: data.soilPh,
    soilTemperature: data.soilTemperature,
    nitrogen: data.nitrogen,
    phosphorus: data.phosphorus,
    potassium: data.potassium,
    airTemperature: data.airTemperature,
    airHumidity: data.airHumidity,
    lightIntensity: data.lightIntensity,
  }).returning();
  res.status(201).json({ ...reading, timestamp: reading.timestamp.toISOString() });
});

export default router;
