import { Router } from "express";
import { prisma } from "../lib/prisma";

export const sellersRouter = Router();

sellersRouter.get("/:id", async (req, res) => {
  const seller = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!seller) return res.status(404).json({ error: "Seller not found" });

  const [reviewCount, listingsCount] = await Promise.all([
    prisma.report.count({ where: { sellerId: seller.id } }),
    prisma.listing.count({ where: { sellerId: seller.id, status: "ACTIVE" } }),
  ]);

  return res.json({
    seller: {
      id: seller.id,
      username: seller.username,
      displayName: seller.fullName || seller.username || "Seller",
      avatar: seller.avatarUrl,
      bio: seller.bio,
      isVerified: !!seller.emailVerifiedAt,
      isSeller: seller.role === "SELLER" || seller.role === "ADMIN",
      createdAt: seller.createdAt,
      rating: 5,
      reviewCount,
      numSales: listingsCount,
      location: seller.city,
      lastOnline: seller.updatedAt,
      followers: 0,
      following: 0,
      isEmailVerified: !!seller.emailVerifiedAt,
      isPhoneVerified: seller.phoneVerified,
    },
  });
});

sellersRouter.get("/:id/listings", async (req, res) => {
  const listings = await prisma.listing.findMany({
    where: { sellerId: req.params.id, status: "ACTIVE" },
    include: { images: { orderBy: { orderIndex: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return res.json({
    items: listings.map((listing) => ({
      id: listing.id,
      seller_id: listing.sellerId,
      title: listing.title,
      description: listing.description,
      price: Number(listing.price),
      category: listing.category,
      condition: String(listing.condition).toLowerCase(),
      status: String(listing.status).toLowerCase(),
      favorite_count: listing.favoriteCount,
      images: listing.images.map((i) => i.publicUrl),
      created_at: listing.createdAt,
      updated_at: listing.updatedAt,
    })),
  });
});

sellersRouter.get("/:id/reviews", async (_req, res) => {
  // Placeholder for now, returns empty list while keeping API contract stable.
  return res.json({ items: [] });
});
