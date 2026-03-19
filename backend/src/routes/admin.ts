import { Router } from "express";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { prisma } from "../lib/prisma";

export const adminRouter = Router();

adminRouter.post("/audit-logs", requireAuth, requireRole(UserRole.ADMIN), async (req, res) => {
  const schema = z.object({
    action_type: z.string().min(1),
    entity_type: z.string().min(1),
    entity_id: z.string().min(1),
    details: z.record(z.string(), z.unknown()).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const log = await prisma.auditLog.create({
    data: {
      adminId: req.auth!.userId,
      actionType: parsed.data.action_type,
      entityType: parsed.data.entity_type,
      entityId: parsed.data.entity_id,
      details: (parsed.data.details ?? {}) as any,
    },
  });
  return res.status(201).json({ log });
});
