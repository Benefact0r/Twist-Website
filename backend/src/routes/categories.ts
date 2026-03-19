import { Router } from "express";
import { prisma } from "../lib/prisma";

export const categoriesRouter = Router();

categoriesRouter.get("/counts", async (_req, res) => {
  const grouped = await prisma.listing.groupBy({
    by: ["category"],
    where: { status: "ACTIVE" },
    _count: { category: true },
  });
  return res.json({
    items: grouped.map((row) => ({ slug: row.category, count: row._count.category })),
  });
});
