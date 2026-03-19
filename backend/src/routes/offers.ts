import { OfferStatus, Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { notificationHub } from "../ws/hub";

export const offersRouter = Router();

const createOfferSchema = z.object({
  listing_id: z.string().min(1),
  seller_id: z.string().min(1),
  offered_amount: z.number().positive(),
  original_price: z.number().positive(),
  message: z.string().optional(),
});

offersRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createOfferSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const data = parsed.data;
  const offer = await prisma.offer.create({
    data: {
      listingId: data.listing_id,
      buyerId: req.auth!.userId,
      sellerId: data.seller_id,
      offeredAmount: new Prisma.Decimal(data.offered_amount),
      originalPrice: new Prisma.Decimal(data.original_price),
      message: data.message,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.notification.create({
    data: {
      userId: data.seller_id,
      type: "offer_received",
      titleKa: "ახალი შეთავაზება",
      titleEn: "New offer received",
      messageKa: "თქვენ მიიღეთ ახალი შეთავაზება",
      messageEn: "You received a new offer",
      dataJson: { offerId: offer.id, listingId: data.listing_id },
      linkUrl: `/messages`,
    },
  });
  notificationHub.broadcastToUser(data.seller_id, { type: "offer_received", offerId: offer.id });

  return res.status(201).json({ offer: toOffer(offer) });
});

offersRouter.get("/:id", requireAuth, async (req, res) => {
  const offerId = String(req.params.id);
  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) return res.status(404).json({ error: "Offer not found" });
  if (offer.buyerId !== req.auth!.userId && offer.sellerId !== req.auth!.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  return res.json({ offer: toOffer(offer) });
});

offersRouter.get("/listing/:listingId", requireAuth, async (req, res) => {
  const listingId = String(req.params.listingId);
  const offers = await prisma.offer.findMany({
    where: {
      listingId,
      OR: [{ buyerId: req.auth!.userId }, { sellerId: req.auth!.userId }],
    },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ items: offers.map(toOffer) });
});

offersRouter.get("/", requireAuth, async (req, res) => {
  const offers = await prisma.offer.findMany({
    where: { OR: [{ buyerId: req.auth!.userId }, { sellerId: req.auth!.userId }] },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ items: offers.map(toOffer) });
});

offersRouter.patch("/:id/status", requireAuth, async (req, res) => {
  const schema = z.object({
    status: z.enum(["accepted", "declined", "cancelled", "countered", "payment_completed"]),
    counter_offer: z.number().positive().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const offerId = String(req.params.id);
  const existing = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!existing) return res.status(404).json({ error: "Offer not found" });
  if (existing.buyerId !== req.auth!.userId && existing.sellerId !== req.auth!.userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const nextStatus = parsed.data.status.toUpperCase() as OfferStatus;
  const updated = await prisma.offer.update({
    where: { id: offerId },
    data: {
      status: nextStatus,
      counterOffer: parsed.data.counter_offer ? new Prisma.Decimal(parsed.data.counter_offer) : undefined,
    },
  });

  const notifyUser = req.auth!.userId === existing.buyerId ? existing.sellerId : existing.buyerId;
  await prisma.notification.create({
    data: {
      userId: notifyUser,
      type: "offer_updated",
      titleKa: "შეთავაზება განახლდა",
      titleEn: "Offer updated",
      messageKa: "შეთავაზების სტატუსი შეიცვალა",
      messageEn: "Offer status changed",
      dataJson: { offerId: updated.id, status: updated.status },
      linkUrl: "/messages",
    },
  });
  notificationHub.broadcastToUser(notifyUser, { type: "offer_updated", offerId: updated.id });

  return res.json({ offer: toOffer(updated) });
});

function toOffer(offer: any) {
  return {
    id: offer.id,
    listing_id: offer.listingId,
    buyer_id: offer.buyerId,
    seller_id: offer.sellerId,
    offered_amount: Number(offer.offeredAmount),
    original_price: Number(offer.originalPrice),
    status: String(offer.status).toLowerCase(),
    message: offer.message,
    counter_offer: offer.counterOffer ? Number(offer.counterOffer) : null,
    expires_at: offer.expiresAt,
    created_at: offer.createdAt,
    updated_at: offer.updatedAt,
  };
}
