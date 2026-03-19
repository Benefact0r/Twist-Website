import { Router } from "express";
import { UserRole } from "@prisma/client";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../lib/prisma";

export const profilesRouter = Router();

profilesRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({
    profile: {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.fullName,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone,
      phone_verified: user.phoneVerified,
      bio: user.bio,
      location: user.city,
      city: user.city,
      address: user.address,
      postal_code: user.postalCode,
      avatar_url: user.avatarUrl,
      is_seller: user.role === "SELLER" || user.role === "ADMIN",
      email_confirmed_at: user.emailVerifiedAt,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    },
  });
});

profilesRouter.patch("/me", requireAuth, async (req, res) => {
  const updates = req.body || {};
  const current = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!current) return res.status(404).json({ error: "User not found" });

  const shouldEnableSeller = updates.is_seller === true && current.role === UserRole.BUYER;
  const user = await prisma.user.update({
    where: { id: req.auth!.userId },
    data: {
      username: updates.username ?? undefined,
      fullName: updates.full_name ?? undefined,
      firstName: updates.first_name ?? undefined,
      lastName: updates.last_name ?? undefined,
      phone: updates.phone ?? undefined,
      bio: updates.bio ?? undefined,
      role: shouldEnableSeller ? UserRole.SELLER : undefined,
      city: updates.location ?? updates.city ?? undefined,
      address: updates.address ?? undefined,
      postalCode: updates.postal_code ?? undefined,
      avatarUrl: updates.avatar_url ?? undefined,
    },
  });
  return res.json({
    profile: {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.fullName,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone,
      phone_verified: user.phoneVerified,
      bio: user.bio,
      location: user.city,
      city: user.city,
      address: user.address,
      postal_code: user.postalCode,
      avatar_url: user.avatarUrl,
      is_seller: user.role === "SELLER" || user.role === "ADMIN",
      email_confirmed_at: user.emailVerifiedAt,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    },
  });
});

profilesRouter.get("/:id", async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!user) return res.status(404).json({ error: "Profile not found" });

  return res.json({
    profile: {
      id: user.id,
      username: user.username,
      full_name: user.fullName,
      avatar_url: user.avatarUrl,
      bio: user.bio,
      location: user.city,
      city: user.city,
      role: user.role,
      created_at: user.createdAt,
    },
  });
});
