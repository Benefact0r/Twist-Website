import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../lib/prisma";

export const favoritesRouter = Router();

favoritesRouter.get("/", requireAuth, async (req, res) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId: req.auth!.userId },
    include: {
      listing: {
        include: { images: { orderBy: { orderIndex: "asc" } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return res.json({
    items: favorites.map((fav) => ({
      id: fav.id,
      listing_id: fav.listingId,
      listing: {
        id: fav.listing.id,
        title: fav.listing.title,
        price: Number(fav.listing.price),
        category: fav.listing.category,
        condition: String(fav.listing.condition).toLowerCase(),
        images: fav.listing.images.map((i) => i.publicUrl),
        status: String(fav.listing.status).toLowerCase(),
      },
      created_at: fav.createdAt,
    })),
  });
});

favoritesRouter.post("/:listingId", requireAuth, async (req, res) => {
  const listingId = String(req.params.listingId);
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return res.status(404).json({ error: "Listing not found" });

  await prisma.favorite.upsert({
    where: {
      userId_listingId: {
        userId: req.auth!.userId,
        listingId,
      },
    },
    create: {
      userId: req.auth!.userId,
      listingId,
    },
    update: {},
  });

  await prisma.listing.update({
    where: { id: listingId },
    data: { favoriteCount: { increment: 1 } },
  });

  return res.status(201).json({ ok: true });
});

favoritesRouter.delete("/:listingId", requireAuth, async (req, res) => {
  const listingId = String(req.params.listingId);
  const deleted = await prisma.favorite.deleteMany({
    where: { userId: req.auth!.userId, listingId },
  });
  if (deleted.count > 0) {
    await prisma.listing.update({
      where: { id: listingId },
      data: { favoriteCount: { decrement: 1 } },
    });
  }
  return res.status(204).send();
});
