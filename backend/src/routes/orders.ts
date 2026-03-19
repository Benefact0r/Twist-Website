import { Prisma } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../lib/prisma";

export const ordersRouter = Router();

const createOrderSchema = z.object({
  seller_id: z.string(),
  item_id: z.string(),
  item_title: z.string(),
  item_image: z.string().nullable().optional(),
  item_price: z.number(),
  delivery_cost: z.number(),
  buyer_protection_fee: z.number(),
  total_amount: z.number(),
  status: z.string(),
  shipping_full_name: z.string(),
  shipping_phone: z.string(),
  shipping_street: z.string(),
  shipping_city: z.string(),
  shipping_region: z.string().optional(),
  shipping_postal_code: z.string().optional(),
  payment_card_last4: z.string().optional(),
  paid_at: z.string().optional(),
});

ordersRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const data = parsed.data;
  const order = await prisma.order.create({
    data: {
      buyerId: req.auth!.userId,
      sellerId: data.seller_id,
      listingId: data.item_id,
      itemTitle: data.item_title,
      itemImage: data.item_image || null,
      itemPrice: new Prisma.Decimal(data.item_price),
      deliveryCost: new Prisma.Decimal(data.delivery_cost),
      buyerProtectionFee: new Prisma.Decimal(data.buyer_protection_fee),
      totalAmount: new Prisma.Decimal(data.total_amount),
      status: data.status,
      shippingFullName: data.shipping_full_name,
      shippingPhone: data.shipping_phone,
      shippingStreet: data.shipping_street,
      shippingCity: data.shipping_city,
      shippingRegion: data.shipping_region,
      shippingPostalCode: data.shipping_postal_code,
      paymentCardLast4: data.payment_card_last4,
      paidAt: data.paid_at ? new Date(data.paid_at) : new Date(),
    },
  });
  return res.status(201).json({ order });
});
