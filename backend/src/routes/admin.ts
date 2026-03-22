import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { requireRole } from "../middleware/rbac";
import { prisma } from "../lib/prisma";

export const adminRouter = Router();

const adminRoleGuard = [requireAuth, requireRole(UserRole.ADMIN)] as const;

const mapUser = (user: any) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  full_name: user.fullName,
  first_name: user.firstName,
  last_name: user.lastName,
  phone: user.phone,
  city: user.city,
  role: user.role,
  is_suspended: user.isSuspended,
  suspension_reason: user.suspensionReason,
  suspension_duration: user.suspensionDuration,
  suspension_expires: user.suspensionExpires,
  created_at: user.createdAt,
  updated_at: user.updatedAt,
});

const logAdminAction = async (
  adminId: string,
  actionType: string,
  entityType: string,
  entityId: string,
  details?: Record<string, unknown>,
) => {
  await prisma.auditLog.create({
    data: {
      adminId,
      actionType,
      entityType,
      entityId,
      details: (details || {}) as any,
    },
  });
};

const ensureAdminCountForRoleChange = async (targetRole: UserRole, nextRole: UserRole | undefined) => {
  if (targetRole !== UserRole.ADMIN || !nextRole || nextRole === UserRole.ADMIN) return;
  const adminCount = await prisma.user.count({ where: { role: UserRole.ADMIN } });
  return adminCount > 1;
};

const ensureAdminCountForDelete = async (targetRole: UserRole) => {
  if (targetRole !== UserRole.ADMIN) return true;
  const adminCount = await prisma.user.count({ where: { role: UserRole.ADMIN } });
  return adminCount > 1;
};

adminRouter.post("/users", ...adminRoleGuard, async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.nativeEnum(UserRole).default(UserRole.BUYER),
    username: z.string().min(2).max(30).optional(),
    full_name: z.string().min(1).max(120).optional(),
    first_name: z.string().min(1).max(60).optional(),
    last_name: z.string().min(1).max(60).optional(),
    phone: z.string().optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    is_suspended: z.boolean().optional(),
    suspension_reason: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const hint =
      parsed.error.issues?.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; ") ||
      "Invalid request body";
    return res.status(400).json({ error: hint, details: parsed.error.flatten() });
  }

  const email = parsed.data.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: parsed.data.role,
        username: parsed.data.username,
        fullName: parsed.data.full_name,
        firstName: parsed.data.first_name,
        lastName: parsed.data.last_name,
        phone: parsed.data.phone,
        city: parsed.data.city,
        address: parsed.data.address,
        isSuspended: parsed.data.is_suspended === true,
        suspensionReason: parsed.data.is_suspended ? parsed.data.suspension_reason || "admin_action" : null,
        suspensionDuration: parsed.data.is_suspended ? "manual" : null,
        suspensionExpires: null,
      },
    });

    await logAdminAction(req.auth!.userId, "admin_user_create", "user", user.id, {
      created_role: user.role,
      created_email: user.email,
      created_is_suspended: user.isSuspended,
    });

    (req as { log?: { info: (o: unknown, msg?: string) => void } }).log?.info(
      { userId: user.id, email: user.email, role: user.role },
      "admin user created",
    );

    return res.status(201).json({ user: mapUser(user) });
  } catch (err) {
    (req as { log?: { error: (o: unknown, msg?: string) => void } }).log?.error({ err }, "admin user create failed");
    const code = (err as { code?: string })?.code;
    if (code === "P2002") {
      return res.status(409).json({ error: "A unique field already exists (e.g. email or username)" });
    }
    return res.status(500).json({ error: "Failed to create user" });
  }
});

adminRouter.get("/users", ...adminRoleGuard, async (req, res) => {
  const q = String(req.query.q || "").trim();
  const role = req.query.role ? String(req.query.role).toUpperCase() : undefined;
  const isSuspendedQuery = req.query.is_suspended;
  const page = Math.max(0, Number(req.query.page || 0));
  const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize || 20)));

  const where: any = {};
  if (q) {
    where.OR = [
      { email: { contains: q, mode: "insensitive" } },
      { username: { contains: q, mode: "insensitive" } },
      { fullName: { contains: q, mode: "insensitive" } },
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { phone: { contains: q, mode: "insensitive" } },
    ];
  }
  if (role && Object.values(UserRole).includes(role as UserRole)) {
    where.role = role;
  }
  if (isSuspendedQuery === "true") {
    where.isSuspended = true;
  } else if (isSuspendedQuery === "false") {
    where.isSuspended = false;
  }

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where }),
  ]);

  return res.json({
    items: users.map(mapUser),
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    page,
    pageSize,
  });
});

adminRouter.patch("/users/:id", ...adminRoleGuard, async (req, res) => {
  const schema = z.object({
    role: z.nativeEnum(UserRole).optional(),
    is_suspended: z.boolean().optional(),
    suspension_reason: z.string().optional(),
    suspension_duration: z.string().optional(),
    suspension_expires: z.string().datetime().nullable().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const targetUserId = String(req.params.id);
  const target = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!target) return res.status(404).json({ error: "User not found" });
  if (target.id === req.auth!.userId && parsed.data.role && parsed.data.role !== UserRole.ADMIN) {
    return res.status(400).json({ error: "Cannot remove your own admin role" });
  }
  if (parsed.data.role && parsed.data.role !== target.role) {
    const ok = await ensureAdminCountForRoleChange(target.role, parsed.data.role);
    if (ok === false) {
      return res.status(400).json({ error: "Cannot remove the last admin role" });
    }
  }

  const shouldSuspend = parsed.data.is_suspended === true;
  const shouldUnsuspend = parsed.data.is_suspended === false;

  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: {
      role: parsed.data.role,
      isSuspended: parsed.data.is_suspended,
      suspensionReason: shouldSuspend ? parsed.data.suspension_reason || target.suspensionReason : shouldUnsuspend ? null : undefined,
      suspensionDuration: shouldSuspend ? parsed.data.suspension_duration || target.suspensionDuration : shouldUnsuspend ? null : undefined,
      suspensionExpires:
        shouldSuspend && parsed.data.suspension_expires !== undefined
          ? parsed.data.suspension_expires
            ? new Date(parsed.data.suspension_expires)
            : null
          : shouldUnsuspend
            ? null
            : undefined,
    },
  });

  await logAdminAction(req.auth!.userId, "admin_user_update", "user", target.id, {
    previous: {
      role: target.role,
      is_suspended: target.isSuspended,
      suspension_reason: target.suspensionReason,
      suspension_duration: target.suspensionDuration,
      suspension_expires: target.suspensionExpires,
    },
    next: {
      role: updated.role,
      is_suspended: updated.isSuspended,
      suspension_reason: updated.suspensionReason,
      suspension_duration: updated.suspensionDuration,
      suspension_expires: updated.suspensionExpires,
    },
  });

  return res.json({ user: mapUser(updated) });
});

adminRouter.delete("/users/:id", ...adminRoleGuard, async (req, res) => {
  const targetUserId = String(req.params.id);
  if (targetUserId === req.auth!.userId) {
    return res.status(400).json({ error: "Cannot delete your own account" });
  }

  const target = await prisma.user.findUnique({ where: { id: targetUserId } });
  if (!target) return res.status(404).json({ error: "User not found" });
  const canDelete = await ensureAdminCountForDelete(target.role);
  if (!canDelete) {
    return res.status(400).json({ error: "Cannot delete the last admin account" });
  }

  try {
    await prisma.user.delete({ where: { id: targetUserId } });
    await logAdminAction(req.auth!.userId, "admin_user_delete", "user", target.id, {
      deleted_role: target.role,
      deleted_email: target.email,
    });
    return res.status(204).send();
  } catch {
    return res.status(409).json({ error: "User cannot be deleted due to related records" });
  }
});

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

// --- LISTINGS ADMIN ROUTES ---
adminRouter.get("/listings", ...adminRoleGuard, async (req, res) => {
  const q = String(req.query.q || "").trim();
  const status = req.query.status ? String(req.query.status).toUpperCase() : undefined;
  const page = Math.max(0, Number(req.query.page || 0));
  const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize || 20)));

  const where: any = {};
  if (q) {
    where.title = { contains: q, mode: "insensitive" };
  }
  if (status) {
    where.status = status as import("@prisma/client").ListingStatus;
  }

  const [listings, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { seller: { select: { id: true, email: true, username: true } } },
      orderBy: { createdAt: "desc" },
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.listing.count({ where }),
  ]);

  return res.json({
    items: listings,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    page,
    pageSize,
  });
});

adminRouter.patch("/listings/:id", ...adminRoleGuard, async (req, res) => {
  const schema = z.object({
    status: z.enum(["DRAFT", "ACTIVE", "SOLD", "ARCHIVED"]).optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const listing = await prisma.listing.findUnique({ where: { id: req.params.id as string } });
  if (!listing) return res.status(404).json({ error: "Listing not found" });

  const updated = await prisma.listing.update({
    where: { id: listing.id },
    data: { status: parsed.data.status as any },
  });

  await logAdminAction(req.auth!.userId, "admin_listing_update", "listing", listing.id, {
    previous_status: listing.status,
    next_status: updated.status,
  });

  return res.json({ listing: updated });
});

adminRouter.delete("/listings/:id", ...adminRoleGuard, async (req, res) => {
  const listing = await prisma.listing.findUnique({ where: { id: req.params.id as string } });
  if (!listing) return res.status(404).json({ error: "Listing not found" });

  await prisma.listing.delete({ where: { id: listing.id } });

  await logAdminAction(req.auth!.userId, "admin_listing_delete", "listing", listing.id, {
    deleted_title: listing.title,
  });

  return res.status(204).send();
});

// --- REPORTS ADMIN ROUTES ---
adminRouter.get("/reports", ...adminRoleGuard, async (req, res) => {
  const status = req.query.status ? String(req.query.status).toUpperCase() : undefined;
  const page = Math.max(0, Number(req.query.page || 0));
  const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize || 20)));

  const where: any = {};
  if (status) {
    where.status = status as import("@prisma/client").ReportStatus;
  }

  const [reports, totalCount] = await Promise.all([
    prisma.report.findMany({
      where,
      include: { reporter: { select: { id: true, email: true, username: true } } },
      orderBy: { createdAt: "desc" },
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.report.count({ where }),
  ]);

  return res.json({
    items: reports,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    page,
    pageSize,
  });
});

adminRouter.patch("/reports/:id", ...adminRoleGuard, async (req, res) => {
  const schema = z.object({
    status: z.enum(["OPEN", "IN_REVIEW", "RESOLVED", "REJECTED"]),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const report = await prisma.report.findUnique({ where: { id: req.params.id as string } });
  if (!report) return res.status(404).json({ error: "Report not found" });

  const updated = await prisma.report.update({
    where: { id: report.id },
    data: { status: parsed.data.status as any },
  });

  await logAdminAction(req.auth!.userId, "admin_report_update", "report", report.id, {
    previous_status: report.status,
    next_status: updated.status,
  });

  return res.json({ report: updated });
});

// --- ORDERS ADMIN ROUTES ---
adminRouter.get("/orders", ...adminRoleGuard, async (req, res) => {
  const status = req.query.status ? String(req.query.status).toUpperCase() : undefined;
  const page = Math.max(0, Number(req.query.page || 0));
  const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize || 20)));

  const where: any = {};
  if (status) {
    where.status = status;
  }

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where }),
  ]);

  return res.json({
    items: orders,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    page,
    pageSize,
  });
});

// --- AUDIT LOGS ADMIN ROUTES ---
adminRouter.get("/audit-logs", ...adminRoleGuard, async (req, res) => {
  const page = Math.max(0, Number(req.query.page || 0));
  const pageSize = Math.max(1, Math.min(100, Number(req.query.pageSize || 20)));

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      include: { admin: { select: { id: true, email: true, username: true } } },
      orderBy: { createdAt: "desc" },
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.auditLog.count(),
  ]);

  return res.json({
    items: logs,
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    page,
    pageSize,
  });
});

