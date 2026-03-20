import { Router } from "express";
import { db } from "@workspace/db";
import { alertsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

const seedAlerts = [
  { type: "weather", severity: "critical", title: "Heavy Rain Alert", message: "Heavy rainfall of 25-30mm expected tomorrow. Clear drainage channels and protect young crops.", isRead: false, actionRequired: true },
  { type: "pest", severity: "warning", title: "Pest Risk: Aphids Detected", message: "Aphid activity reported in nearby farms. Inspect your wheat crops and apply neem-based pesticide if needed.", isRead: false, actionRequired: true },
  { type: "irrigation", severity: "info", title: "Irrigation Due", message: "North field soil moisture at 45%. Recommended to irrigate within next 48 hours.", isRead: false, actionRequired: false },
  { type: "market", severity: "info", title: "Wheat Prices Up 5%", message: "Wheat prices at Amritsar Mandi increased by ₹125/quintal today. Consider selling if you have stored grain.", isRead: true, actionRequired: false },
  { type: "general", severity: "warning", title: "Equipment Service Due", message: "Your tractor (MF 1035) is due for its 200-hour service. Schedule maintenance to avoid breakdown during harvest.", isRead: true, actionRequired: false },
];

router.get("/", async (req, res) => {
  const alerts = await db.select().from(alertsTable).orderBy(alertsTable.createdAt);

  if (alerts.length === 0) {
    const inserted = await db.insert(alertsTable).values(seedAlerts).returning();
    return res.json(inserted.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })));
  }

  const unreadOnly = req.query.unread === "true";
  const filtered = unreadOnly ? alerts.filter(a => !a.isRead) : alerts;
  res.json(filtered.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })));
});

router.post("/:id/read", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.update(alertsTable).set({ isRead: true }).where(eq(alertsTable.id, id));
  res.json({ success: true, message: "Alert marked as read" });
});

export default router;
