import { Router } from "express";
import { db } from "@workspace/db";
import { laborJobsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/jobs", async (req, res) => {
  const jobs = await db.select().from(laborJobsTable).orderBy(laborJobsTable.date);
  res.json(jobs.map(j => ({
    ...j,
    skills: j.skills ? j.skills.split(",") : [],
    createdAt: j.createdAt.toISOString(),
  })));
});

router.post("/jobs", async (req, res) => {
  const data = req.body;
  const [job] = await db.insert(laborJobsTable).values({
    title: data.title,
    description: data.description,
    location: data.location,
    date: data.date,
    duration: data.duration,
    wage: data.wage,
    wageUnit: data.wageUnit,
    workersNeeded: data.workersNeeded,
    workersApplied: 0,
    skills: Array.isArray(data.skills) ? data.skills.join(",") : data.skills,
    contactName: data.contactName,
    contactPhone: data.contactPhone,
    status: "open",
  }).returning();
  res.status(201).json({
    ...job,
    skills: job.skills ? job.skills.split(",") : [],
    createdAt: job.createdAt.toISOString(),
  });
});

router.delete("/jobs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(laborJobsTable).where(eq(laborJobsTable.id, id));
  res.json({ success: true, message: "Job deleted" });
});

export default router;
