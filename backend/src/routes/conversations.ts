import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../lib/prisma";
import { notificationHub } from "../ws/hub";

export const conversationsRouter = Router();

conversationsRouter.get("/", requireAuth, async (req, res) => {
  const userId = req.auth!.userId;
  const conversations = await prisma.conversation.findMany({
    where: { OR: [{ participant1Id: userId }, { participant2Id: userId }] },
    orderBy: { lastMessageAt: "desc" },
  });

  const items = await Promise.all(
    conversations.map(async (conv) => {
      const otherId = conv.participant1Id === userId ? conv.participant2Id : conv.participant1Id;
      const [other, lastMessage, unreadCount] = await Promise.all([
        prisma.user.findUnique({ where: { id: otherId } }),
        prisma.message.findFirst({ where: { conversationId: conv.id }, orderBy: { createdAt: "desc" } }),
        prisma.message.count({ where: { conversationId: conv.id, senderId: { not: userId }, read: false } }),
      ]);
      return {
        id: conv.id,
        participant1_id: conv.participant1Id,
        participant2_id: conv.participant2Id,
        listing_id: conv.listingId,
        last_message_at: conv.lastMessageAt,
        created_at: conv.createdAt,
        otherParticipant: other
          ? {
              id: other.id,
              username: other.username,
              avatar_url: other.avatarUrl,
              full_name: other.fullName,
            }
          : undefined,
        lastMessage: lastMessage ? toMessage(lastMessage) : undefined,
        unreadCount,
      };
    }),
  );
  return res.json({ items });
});

conversationsRouter.post("/", requireAuth, async (req, res) => {
  const schema = z.object({
    other_user_id: z.string().min(1),
    listing_id: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const userId = req.auth!.userId;
  const otherUserId = parsed.data.other_user_id;
  const listingId = parsed.data.listing_id || null;

  const existing = await prisma.conversation.findFirst({
    where: {
      listingId,
      OR: [
        { participant1Id: userId, participant2Id: otherUserId },
        { participant1Id: otherUserId, participant2Id: userId },
      ],
    },
  });
  if (existing) return res.json({ conversation_id: existing.id });

  const created = await prisma.conversation.create({
    data: {
      participant1Id: userId,
      participant2Id: otherUserId,
      listingId,
    },
  });
  return res.status(201).json({ conversation_id: created.id });
});

conversationsRouter.get("/:id/messages", requireAuth, async (req, res) => {
  const conversationId = String(req.params.id);
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) return res.status(404).json({ error: "Conversation not found" });
  if (![conversation.participant1Id, conversation.participant2Id].includes(req.auth!.userId)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "asc" },
  });
  return res.json({ items: messages.map(toMessage) });
});

conversationsRouter.post("/:id/messages", requireAuth, async (req, res) => {
  const schema = z.object({
    content: z.string().min(1),
    message_type: z.string().default("text"),
    offer_id: z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const conversationId = String(req.params.id);
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) return res.status(404).json({ error: "Conversation not found" });
  if (![conversation.participant1Id, conversation.participant2Id].includes(req.auth!.userId)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: req.auth!.userId,
      content: parsed.data.content,
      messageType: parsed.data.message_type,
      offerId: parsed.data.offer_id,
    },
  });
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: new Date() },
  });

  const recipient = conversation.participant1Id === req.auth!.userId ? conversation.participant2Id : conversation.participant1Id;
  notificationHub.broadcastToUser(recipient, {
    type: "message",
    conversationId: conversation.id,
    message: toMessage(message),
  });

  return res.status(201).json({ message: toMessage(message) });
});

conversationsRouter.post("/:id/read", requireAuth, async (req, res) => {
  const conversationId = String(req.params.id);
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) return res.status(404).json({ error: "Conversation not found" });
  if (![conversation.participant1Id, conversation.participant2Id].includes(req.auth!.userId)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  await prisma.message.updateMany({
    where: { conversationId: conversation.id, senderId: { not: req.auth!.userId }, read: false },
    data: { read: true },
  });
  return res.status(204).send();
});

function toMessage(message: any) {
  return {
    id: message.id,
    conversation_id: message.conversationId,
    sender_id: message.senderId,
    content: message.content,
    message_type: message.messageType,
    offer_id: message.offerId,
    read: message.read,
    created_at: message.createdAt,
  };
}
