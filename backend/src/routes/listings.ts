import { ListingCondition, ListingStatus, Prisma, UserRole } from "@prisma/client";
import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../lib/prisma";

export const listingsRouter = Router();

const conditionMapFromUi: Record<string, ListingCondition> = {
  new: "NEW",
  like_new: "LIKE_NEW",
  "like-new": "LIKE_NEW",
  good: "GOOD",
  fair: "FAIR",
};

const conditionMapToUi: Record<ListingCondition, string> = {
  NEW: "new",
  LIKE_NEW: "like_new",
  GOOD: "good",
  FAIR: "fair",
};

const createListingSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().min(1),
  condition: z.string().min(1),
  status: z.string().optional(),
  images: z.array(z.string()).optional(),
});

const updateListingStatusSchema = z.object({
  status: z.enum(["draft", "active", "sold", "archived"]),
});

const statusMapFromUi: Record<z.infer<typeof updateListingStatusSchema>["status"], ListingStatus> = {
  draft: "DRAFT",
  active: "ACTIVE",
  sold: "SOLD",
  archived: "ARCHIVED",
};

listingsRouter.get("/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  const category = req.query.category ? String(req.query.category) : undefined;
  const conditions = req.query.conditions
    ? String(req.query.conditions)
        .split(",")
        .map((c) => conditionMapFromUi[c])
        .filter(Boolean)
    : [];
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const sort = String(req.query.sort || "relevance");
  const page = Math.max(0, Number(req.query.page || 0));
  const pageSize = Math.max(1, Math.min(50, Number(req.query.pageSize || 12)));

  const where: Prisma.ListingWhereInput = {
    status: "ACTIVE",
    ...(q
      ? {
          OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }],
        }
      : {}),
    ...(category ? { category } : {}),
    ...(conditions.length ? { condition: { in: conditions as ListingCondition[] } } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined
      ? {
          price: {
            ...(minPrice !== undefined ? { gte: new Prisma.Decimal(minPrice) } : {}),
            ...(maxPrice !== undefined ? { lte: new Prisma.Decimal(maxPrice) } : {}),
          },
        }
      : {}),
  };

  let orderBy: Prisma.ListingOrderByWithRelationInput = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { price: "asc" };
  if (sort === "price-high") orderBy = { price: "desc" };

  const [items, totalCount] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: { images: { orderBy: { orderIndex: "asc" } } },
      orderBy,
      skip: page * pageSize,
      take: pageSize,
    }),
    prisma.listing.count({ where }),
  ]);

  return res.json({
    items: items.map(toListingResponse),
    totalCount,
    totalPages: Math.ceil(totalCount / pageSize),
    page,
    pageSize,
  });
});

listingsRouter.get("/home", async (_req, res) => {
  const [newArrivals, popular] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      include: { images: { orderBy: { orderIndex: "asc" } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      include: { images: { orderBy: { orderIndex: "asc" } } },
      orderBy: [{ favoriteCount: "desc" }, { createdAt: "desc" }],
      take: 10,
    }),
  ]);
  return res.json({
    newArrivals: newArrivals.map(toListingResponse),
    popularListings: popular.map(toListingResponse),
  });
});

listingsRouter.patch("/:id/status", requireAuth, async (req, res) => {
  const listingId = String(req.params.id);
  const parsed = updateListingStatusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (listing.sellerId !== req.auth!.userId) return res.status(403).json({ error: "Forbidden" });

  const updated = await prisma.listing.update({
    where: { id: listingId },
    data: { status: statusMapFromUi[parsed.data.status] },
    include: { images: { orderBy: { orderIndex: "asc" } } },
  });

  return res.json({ listing: toListingResponse(updated) });
});

listingsRouter.delete("/:id", requireAuth, async (req, res) => {
  const listingId = String(req.params.id);
  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (listing.sellerId !== req.auth!.userId) return res.status(403).json({ error: "Forbidden" });

  await prisma.listing.delete({ where: { id: listingId } });
  return res.status(204).send();
});

listingsRouter.get("/:id", async (req, res) => {
  const listingId = String(req.params.id);
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      images: { orderBy: { orderIndex: "asc" } },
      seller: true,
    },
  });
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  return res.json({
    listing: {
      ...toListingResponse(listing),
      seller: {
        id: listing.seller.id,
        displayName: listing.seller.fullName || listing.seller.username || "Seller",
        avatar: listing.seller.avatarUrl,
        isVerified: !!listing.seller.emailVerifiedAt,
      },
    },
  });
});

listingsRouter.post("/", requireAuth, async (req, res) => {
  const parsed = createListingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { title, description, price, category, condition, status, images = [] } = parsed.data;

  const me = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!me) return res.status(401).json({ error: "Unauthorized" });
  if (me.role === UserRole.COURIER) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const listing = await prisma.listing.create({
    data: {
      sellerId: req.auth!.userId,
      title,
      description,
      price: new Prisma.Decimal(price),
      category,
      condition: conditionMapFromUi[condition] || "GOOD",
      status: status?.toLowerCase() === "draft" ? ListingStatus.DRAFT : ListingStatus.ACTIVE,
      images:
        images.length > 0
          ? {
              create: images.map((publicUrl, index) => ({
                objectKey: `legacy-inline-${Date.now()}-${index}`,
                publicUrl,
                orderIndex: index,
              })),
            }
          : undefined,
    },
    include: { images: { orderBy: { orderIndex: "asc" } } },
  });
  return res.status(201).json({ listing: toListingResponse(listing) });
});

listingsRouter.post("/:id/images/commit", requireAuth, async (req, res) => {
  const listingId = String(req.params.id);
  const schema = z.object({
    images: z.array(
      z.object({
        objectKey: z.string().min(1),
        publicUrl: z.string().url(),
        order: z.number().int().nonnegative(),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
      }),
    ),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (listing.sellerId !== req.auth!.userId) return res.status(403).json({ error: "Forbidden" });

  await prisma.listingImage.deleteMany({ where: { listingId: listing.id } });
  await prisma.listingImage.createMany({
    data: parsed.data.images.map((image) => ({
      listingId: listing.id,
      objectKey: image.objectKey,
      publicUrl: image.publicUrl,
      orderIndex: image.order,
      width: image.width,
      height: image.height,
    })),
  });

  const reloaded = await prisma.listing.findUnique({
    where: { id: listing.id },
    include: { images: { orderBy: { orderIndex: "asc" } } },
  });
  return res.json({ listing: reloaded ? toListingResponse(reloaded) : null });
});

listingsRouter.get("/seller/:sellerId/all", async (req, res) => {
  const listings = await prisma.listing.findMany({
    where: { sellerId: req.params.sellerId, status: "ACTIVE" },
    include: { images: { orderBy: { orderIndex: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return res.json({ items: listings.map(toListingResponse) });
});

function toListingResponse(listing: any) {
  return {
    id: listing.id,
    seller_id: listing.sellerId,
    title: listing.title,
    description: listing.description,
    price: Number(listing.price),
    category: listing.category,
    condition: conditionMapToUi[listing.condition] || "good",
    status: String(listing.status).toLowerCase(),
    favorite_count: listing.favoriteCount,
    images: (listing.images || []).map((img: any) => img.publicUrl),
    created_at: listing.createdAt,
    updated_at: listing.updatedAt,
  };
}
