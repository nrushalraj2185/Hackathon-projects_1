import { Router } from "express";
import { db } from "@workspace/db";
import { marketPricesTable, marketListingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const seedPrices = [
  { cropName: "Wheat", market: "Amritsar Mandi", state: "Punjab", pricePerQuintal: 2275, minPrice: 2200, maxPrice: 2350, modalPrice: 2275, unit: "quintal", priceChange: 25, priceChangePercent: 1.11 },
  { cropName: "Rice (Basmati)", market: "Karnal Mandi", state: "Haryana", pricePerQuintal: 3200, minPrice: 3000, maxPrice: 3500, modalPrice: 3200, unit: "quintal", priceChange: -50, priceChangePercent: -1.54 },
  { cropName: "Cotton", market: "Rajkot APMC", state: "Gujarat", pricePerQuintal: 7200, minPrice: 7000, maxPrice: 7500, modalPrice: 7200, unit: "quintal", priceChange: 150, priceChangePercent: 2.13 },
  { cropName: "Maize", market: "Davangere APMC", state: "Karnataka", pricePerQuintal: 1850, minPrice: 1780, maxPrice: 1920, modalPrice: 1850, unit: "quintal", priceChange: -20, priceChangePercent: -1.07 },
  { cropName: "Soybean", market: "Indore Mandi", state: "Madhya Pradesh", pricePerQuintal: 4450, minPrice: 4300, maxPrice: 4600, modalPrice: 4450, unit: "quintal", priceChange: 75, priceChangePercent: 1.72 },
  { cropName: "Tomato", market: "Kolar APMC", state: "Karnataka", pricePerQuintal: 1200, minPrice: 800, maxPrice: 1500, modalPrice: 1200, unit: "quintal", priceChange: 300, priceChangePercent: 33.33 },
  { cropName: "Onion", market: "Lasalgaon APMC", state: "Maharashtra", pricePerQuintal: 2100, minPrice: 1800, maxPrice: 2400, modalPrice: 2100, unit: "quintal", priceChange: -100, priceChangePercent: -4.55 },
  { cropName: "Sugarcane", market: "Kolhapur APMC", state: "Maharashtra", pricePerQuintal: 315, minPrice: 300, maxPrice: 330, modalPrice: 315, unit: "quintal", priceChange: 5, priceChangePercent: 1.61 },
];

router.get("/prices", async (req, res) => {
  const prices = await db.select().from(marketPricesTable);
  if (prices.length === 0) {
    const inserted = await db.insert(marketPricesTable).values(seedPrices).returning();
    return res.json(inserted.map(p => ({ ...p, updatedAt: p.updatedAt.toISOString() })));
  }
  res.json(prices.map(p => ({ ...p, updatedAt: p.updatedAt.toISOString() })));
});

router.get("/listings", async (req, res) => {
  const { type } = req.query;
  let query = db.select().from(marketListingsTable);
  const listings = await query;
  const filtered = type ? listings.filter(l => l.type === type) : listings;
  res.json(filtered.map(l => ({ ...l, createdAt: l.createdAt.toISOString() })));
});

router.post("/listings", async (req, res) => {
  const data = req.body;
  const [listing] = await db.insert(marketListingsTable).values({
    type: data.type,
    cropName: data.cropName,
    quantity: data.quantity,
    unit: data.unit ?? "quintal",
    pricePerUnit: data.pricePerUnit,
    location: data.location,
    contactName: data.contactName,
    contactPhone: data.contactPhone,
    description: data.description,
    quality: data.quality,
    status: "active",
  }).returning();
  res.status(201).json({ ...listing, createdAt: listing.createdAt.toISOString() });
});

router.delete("/listings/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(marketListingsTable).where(eq(marketListingsTable.id, id));
  res.json({ success: true, message: "Listing deleted" });
});

export default router;
