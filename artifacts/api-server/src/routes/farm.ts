import { Router } from "express";
import { db } from "@workspace/db";
import {
  farmExpensesTable, farmIncomeTable, inventoryTable, livestockTable, cropsTable
} from "@workspace/db/schema";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/expenses", async (_req, res) => {
  const expenses = await db.select().from(farmExpensesTable).orderBy(farmExpensesTable.date);
  res.json(expenses.map(e => ({ ...e, createdAt: e.createdAt.toISOString() })));
});

router.post("/expenses", async (req, res) => {
  const data = req.body;
  const [expense] = await db.insert(farmExpensesTable).values({
    category: data.category,
    description: data.description,
    amount: data.amount,
    date: data.date,
    cropId: data.cropId,
    cropName: data.cropName,
    paymentMethod: data.paymentMethod,
  }).returning();
  res.status(201).json({ ...expense, createdAt: expense.createdAt.toISOString() });
});

router.get("/income", async (_req, res) => {
  const income = await db.select().from(farmIncomeTable).orderBy(farmIncomeTable.date);
  res.json(income.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
});

router.post("/income", async (req, res) => {
  const data = req.body;
  const [income] = await db.insert(farmIncomeTable).values({
    source: data.source,
    description: data.description,
    amount: data.amount,
    date: data.date,
    cropId: data.cropId,
    cropName: data.cropName,
    buyer: data.buyer,
    quantity: data.quantity,
    unit: data.unit,
  }).returning();
  res.status(201).json({ ...income, createdAt: income.createdAt.toISOString() });
});

router.get("/inventory", async (_req, res) => {
  const items = await db.select().from(inventoryTable).orderBy(inventoryTable.name);
  res.json(items.map(i => ({ ...i, createdAt: i.createdAt.toISOString() })));
});

router.post("/inventory", async (req, res) => {
  const data = req.body;
  const [item] = await db.insert(inventoryTable).values({
    name: data.name,
    category: data.category,
    quantity: data.quantity,
    unit: data.unit,
    minQuantity: data.minQuantity,
    location: data.location,
    expiryDate: data.expiryDate,
    purchaseDate: data.purchaseDate,
    cost: data.cost,
    supplier: data.supplier,
    notes: data.notes,
  }).returning();
  res.status(201).json({ ...item, createdAt: item.createdAt.toISOString() });
});

router.get("/livestock", async (_req, res) => {
  const livestock = await db.select().from(livestockTable).orderBy(livestockTable.type);
  res.json(livestock.map(l => ({ ...l, createdAt: l.createdAt.toISOString() })));
});

router.post("/livestock", async (req, res) => {
  const data = req.body;
  const [animal] = await db.insert(livestockTable).values({
    type: data.type,
    breed: data.breed,
    count: data.count,
    tagId: data.tagId,
    age: data.age,
    health: data.health ?? "healthy",
    lastVaccination: data.lastVaccination,
    nextVaccination: data.nextVaccination,
    breedingDate: data.breedingDate,
    notes: data.notes,
  }).returning();
  res.status(201).json({ ...animal, createdAt: animal.createdAt.toISOString() });
});

router.get("/summary", async (_req, res) => {
  const expenses = await db.select().from(farmExpensesTable);
  const income = await db.select().from(farmIncomeTable);
  const crops = await db.select().from(cropsTable);
  const livestock = await db.select().from(livestockTable);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalLivestock = livestock.reduce((sum, l) => sum + l.count, 0);
  const activeCrops = crops.filter(c => c.status !== "harvested").length;

  const monthlyIncome: Record<string, number> = {};
  const monthlyExpenses: Record<string, number> = {};

  income.forEach(i => {
    const month = i.date.substring(0, 7);
    monthlyIncome[month] = (monthlyIncome[month] || 0) + i.amount;
  });
  expenses.forEach(e => {
    const month = e.date.substring(0, 7);
    monthlyExpenses[month] = (monthlyExpenses[month] || 0) + e.amount;
  });

  const months = [...new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpenses)])].sort().slice(-6);

  res.json({
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses,
    totalCrops: crops.length,
    activeCrops,
    totalLivestock,
    pendingAlerts: 3,
    monthlyIncome: months.map(m => ({ month: m, amount: monthlyIncome[m] || 0 })),
    monthlyExpenses: months.map(m => ({ month: m, amount: monthlyExpenses[m] || 0 })),
  });
});

export default router;
