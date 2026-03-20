import { Router } from "express";
import { db } from "@workspace/db";
import { transportRequestsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/requests", async (_req, res) => {
  const requests = await db.select().from(transportRequestsTable).orderBy(transportRequestsTable.scheduledDate);
  res.json(requests.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/requests", async (req, res) => {
  const data = req.body;
  const [request] = await db.insert(transportRequestsTable).values({
    farmerName: data.farmerName,
    farmerPhone: data.farmerPhone,
    pickupLocation: data.pickupLocation,
    dropLocation: data.dropLocation,
    cropType: data.cropType,
    quantity: data.quantity,
    unit: data.unit ?? "quintal",
    scheduledDate: data.scheduledDate,
    scheduledTime: data.scheduledTime,
    status: "pending",
    notes: data.notes,
  }).returning();
  res.status(201).json({ ...request, createdAt: request.createdAt.toISOString() });
});

router.patch("/requests/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const data = req.body;
  const [request] = await db.update(transportRequestsTable).set({
    status: data.status,
    ...(data.driverName && { driverName: data.driverName }),
    ...(data.driverPhone && { driverPhone: data.driverPhone }),
    ...(data.estimatedCost !== undefined && { estimatedCost: data.estimatedCost }),
  }).where(eq(transportRequestsTable.id, id)).returning();
  if (!request) return res.status(404).json({ error: "Request not found" });
  res.json({ ...request, createdAt: request.createdAt.toISOString() });
});

export default router;
