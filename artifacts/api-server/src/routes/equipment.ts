import { Router } from "express";
import { db } from "@workspace/db";
import { equipmentListingsTable, equipmentBookingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/listings", async (req, res) => {
  const listings = await db.select().from(equipmentListingsTable).orderBy(equipmentListingsTable.name);
  res.json(listings.map(l => ({ ...l, createdAt: l.createdAt.toISOString() })));
});

router.post("/listings", async (req, res) => {
  const data = req.body;
  const [listing] = await db.insert(equipmentListingsTable).values({
    name: data.name,
    type: data.type,
    description: data.description,
    ratePerDay: data.ratePerDay,
    location: data.location,
    ownerName: data.ownerName,
    ownerPhone: data.ownerPhone,
    available: true,
    availableFrom: data.availableFrom,
    availableTo: data.availableTo,
    condition: data.condition ?? "good",
    brand: data.brand,
    model: data.model,
    yearOfMake: data.yearOfMake,
  }).returning();
  res.status(201).json({ ...listing, createdAt: listing.createdAt.toISOString() });
});

router.get("/bookings", async (_req, res) => {
  const bookings = await db.select().from(equipmentBookingsTable).orderBy(equipmentBookingsTable.fromDate);
  res.json(bookings.map(b => ({ ...b, createdAt: b.createdAt.toISOString() })));
});

router.post("/bookings", async (req, res) => {
  const data = req.body;
  const [equipment] = await db.select().from(equipmentListingsTable).where(eq(equipmentListingsTable.id, data.equipmentId));
  const from = new Date(data.fromDate);
  const to = new Date(data.toDate);
  const totalDays = Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const totalCost = equipment ? equipment.ratePerDay * totalDays : 0;

  const [booking] = await db.insert(equipmentBookingsTable).values({
    equipmentId: data.equipmentId,
    equipmentName: equipment?.name ?? "Equipment",
    fromDate: data.fromDate,
    toDate: data.toDate,
    totalDays,
    totalCost,
    farmerName: data.farmerName,
    farmerPhone: data.farmerPhone,
    status: "pending",
    notes: data.notes,
  }).returning();
  res.status(201).json({ ...booking, createdAt: booking.createdAt.toISOString() });
});

export default router;
