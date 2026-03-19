import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../lib/prisma";

export const notificationsRouter = Router();

notificationsRouter.get("/", requireAuth, async (req, res) => {
  const items = await prisma.notification.findMany({
    where: { userId: req.auth!.userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return res.json({
    items: items.map((n) => ({
      id: n.id,
      user_id: n.userId,
      type: n.type,
      title_ka: n.titleKa,
      title_en: n.titleEn,
      message_ka: n.messageKa,
      message_en: n.messageEn,
      link_url: n.linkUrl,
      data: n.dataJson,
      read: !!n.readAt,
      created_at: n.createdAt,
    })),
  });
});

notificationsRouter.patch("/:id/read", requireAuth, async (req, res) => {
  const notificationId = String(req.params.id);
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notification || notification.userId !== req.auth!.userId) {
    return res.status(404).json({ error: "Notification not found" });
  }
  await prisma.notification.update({
    where: { id: notificationId },
    data: { readAt: new Date() },
  });
  return res.status(204).send();
});

notificationsRouter.patch("/read-all", requireAuth, async (req, res) => {
  await prisma.notification.updateMany({
    where: { userId: req.auth!.userId, readAt: null },
    data: { readAt: new Date() },
  });
  return res.status(204).send();
});
