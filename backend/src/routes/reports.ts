import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../lib/prisma";

export const reportsRouter = Router();

const schema = z.object({
  target_type: z.string().default("item"),
  target_id: z.string().min(1),
  seller_id: z.string().optional(),
  reason: z.string().min(2),
  report_category: z.string().min(2),
  optional_details: z.string().optional(),
  priority: z.string().optional(),
});

reportsRouter.post("/", requireAuth, async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const data = parsed.data;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const existingLimit = await prisma.userReportLimit.findUnique({
    where: {
      userId_reportDate: {
        userId: req.auth!.userId,
        reportDate: today,
      },
    },
  });
  if ((existingLimit?.reportCount || 0) >= 10) {
    return res.status(429).json({ error: "Daily report limit reached" });
  }

  const dup = await prisma.report.findFirst({
    where: {
      reporterId: req.auth!.userId,
      targetType: data.target_type,
      targetId: data.target_id,
    },
  });
  if (dup) return res.status(409).json({ error: "Already reported" });

  const report = await prisma.report.create({
    data: {
      reporterId: req.auth!.userId,
      targetType: data.target_type,
      targetId: data.target_id,
      sellerId: data.seller_id,
      reason: data.reason,
      reportCategory: data.report_category,
      optionalDetails: data.optional_details,
      priority: data.priority || "normal",
    },
  });

  if (existingLimit) {
    await prisma.userReportLimit.update({
      where: { userId_reportDate: { userId: req.auth!.userId, reportDate: today } },
      data: { reportCount: { increment: 1 } },
    });
  } else {
    await prisma.userReportLimit.create({
      data: { userId: req.auth!.userId, reportDate: today, reportCount: 1 },
    });
  }

  return res.status(201).json({ report });
});
