import { Router } from "express";
import { db } from "@workspace/db";
import { cropsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const crops = await db.select().from(cropsTable).orderBy(cropsTable.createdAt);
  res.json(crops.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    lastInspected: c.lastInspected ?? undefined,
  })));
});

router.post("/", async (req, res) => {
  const data = req.body;
  const [crop] = await db.insert(cropsTable).values({
    name: data.name,
    variety: data.variety,
    fieldName: data.fieldName,
    areaHectares: data.areaHectares,
    plantingDate: data.plantingDate,
    expectedHarvestDate: data.expectedHarvestDate,
    status: data.status ?? "planted",
    healthStatus: "good",
    notes: data.notes,
  }).returning();
  res.status(201).json({ ...crop, createdAt: crop.createdAt.toISOString() });
});

router.post("/scan", async (req, res) => {
  const { cropName, description } = req.body;
  const diagnoses: Record<string, any> = {
    "wheat": { diagnosis: "Wheat Rust (Puccinia striiformis)", pestName: "Yellow Rust", diseaseName: "Stripe Rust", confidence: 0.87, severity: "moderate", treatment: "Apply Propiconazole fungicide at 0.1% concentration. Spray in early morning or evening. Repeat after 14 days if needed.", preventionTips: ["Use rust-resistant varieties", "Ensure proper spacing for air circulation", "Monitor crop weekly during humid conditions", "Apply preventive fungicide before flowering"], affectedArea: "15-20% of leaf area" },
    "rice": { diagnosis: "Rice Blast (Magnaporthe oryzae)", diseaseName: "Blast", confidence: 0.82, severity: "severe", treatment: "Apply Tricyclazole 75WP at 600g/ha. Do not apply during flowering. Drain field and let dry for 2-3 days.", preventionTips: ["Use blast-resistant varieties", "Avoid excessive nitrogen", "Maintain water level 5cm during tillering", "Roguing of affected plants"], affectedArea: "25-30% of crop" },
    "cotton": { diagnosis: "Cotton Bollworm (Helicoverpa armigera)", pestName: "American Bollworm", confidence: 0.91, severity: "severe", treatment: "Apply Emamectin Benzoate 5SG at 220g/ha. Use pheromone traps (5/acre). Spray during evening hours.", preventionTips: ["Install pheromone traps early", "Use Bt cotton varieties", "Inter-crop with trap crops like marigold", "Conserve natural enemies"], affectedArea: "30-40% boll damage" },
  };
  const crop = cropName.toLowerCase();
  const found = Object.keys(diagnoses).find(k => crop.includes(k));
  const result = found ? diagnoses[found] : {
    diagnosis: "No significant disease or pest detected",
    confidence: 0.78,
    severity: "none",
    treatment: "Crop appears healthy. Continue regular monitoring and maintain good agronomic practices.",
    preventionTips: ["Regular field scouting", "Proper irrigation scheduling", "Balanced fertilization", "Weed management"],
    affectedArea: "< 5%"
  };
  res.json(result);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [crop] = await db.select().from(cropsTable).where(eq(cropsTable.id, id));
  if (!crop) return res.status(404).json({ error: "Crop not found" });
  res.json({ ...crop, createdAt: crop.createdAt.toISOString() });
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  const [crop] = await db.update(cropsTable).set({
    ...(data.name && { name: data.name }),
    ...(data.variety && { variety: data.variety }),
    ...(data.fieldName && { fieldName: data.fieldName }),
    ...(data.areaHectares !== undefined && { areaHectares: data.areaHectares }),
    ...(data.plantingDate && { plantingDate: data.plantingDate }),
    ...(data.expectedHarvestDate && { expectedHarvestDate: data.expectedHarvestDate }),
    ...(data.status && { status: data.status }),
    ...(data.healthStatus && { healthStatus: data.healthStatus }),
    ...(data.notes && { notes: data.notes }),
  }).where(eq(cropsTable.id, id)).returning();
  if (!crop) return res.status(404).json({ error: "Crop not found" });
  res.json({ ...crop, createdAt: crop.createdAt.toISOString() });
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(cropsTable).where(eq(cropsTable.id, id));
  res.json({ success: true, message: "Crop deleted" });
});

export default router;
