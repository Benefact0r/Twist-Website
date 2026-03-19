import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";

export const supportRouter = Router();

type SupportTicket = {
  id: string;
  ticket_number: string;
  user_id: string;
  user_email: string;
  user_phone?: string;
  subject: string;
  description: string;
  category: string;
  subcategory?: string;
  priority: string;
  status: string;
  listing_id?: string;
  order_id?: string;
  conversation_id?: string;
  page_url?: string;
  assigned_to?: string;
  first_response_at?: string;
  resolved_at?: string;
  satisfaction?: number;
  feedback?: string;
  created_at: string;
  updated_at: string;
};

type SupportMessage = {
  id: string;
  ticket_id: string;
  sender_id: string;
  sender_type: "user" | "agent" | "system" | "bot";
  content: string;
  is_internal_note: boolean;
  read_by_user: boolean;
  read_by_agent: boolean;
  attachments?: unknown;
  quick_replies?: unknown;
  created_at: string;
};

type FAQ = {
  id: string;
  question_ka: string;
  question_en: string;
  answer_ka: string;
  answer_en: string;
  category: string;
  subcategory?: string;
  tags: string[];
  view_count: number;
  helpful_yes: number;
  helpful_no: number;
  last_viewed?: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const createTicketSchema = z.object({
  subject: z.string().min(2),
  description: z.string().min(2),
  category: z.string().default("other"),
  page_url: z.string().optional(),
  user_phone: z.string().optional(),
  initial_message: z.string().optional(),
});

const sendMessageSchema = z.object({
  content: z.string().min(1),
});

const rateTicketSchema = z.object({
  satisfaction: z.number().int().min(1).max(5),
  feedback: z.string().optional(),
});

const faqFeedbackSchema = z.object({
  is_helpful: z.boolean(),
});

const tickets: SupportTicket[] = [];
const messages: SupportMessage[] = [];
const faqs: FAQ[] = [
  {
    id: "faq-buying-1",
    question_ka: "როგორ ვიყიდო ნივთი?",
    question_en: "How do I buy an item?",
    answer_ka: "აირჩიეთ ნივთი, დააჭირეთ Buy Now-ს და შეავსეთ მიწოდების ინფორმაცია.",
    answer_en: "Pick an item, click Buy Now, and complete delivery details.",
    category: "buying",
    tags: ["buy", "checkout", "order"],
    view_count: 0,
    helpful_yes: 0,
    helpful_no: 0,
    priority: 100,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "faq-selling-1",
    question_ka: "როგორ დავდო განცხადება?",
    question_en: "How do I create a listing?",
    answer_ka: "გადადით Sell გვერდზე, ატვირთეთ ფოტოები და შეავსეთ ინფორმაცია.",
    answer_en: "Open the Sell page, upload images, and fill in item details.",
    category: "selling",
    tags: ["sell", "listing", "upload"],
    view_count: 0,
    helpful_yes: 0,
    helpful_no: 0,
    priority: 90,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "faq-payment-1",
    question_ka: "როგორ მუშაობს ბეტა გადახდა?",
    question_en: "How does beta payment work?",
    answer_ka: "Twist გუნდი ახდენს კოორდინაციას უსაფრთხო მიწოდებასა და გადახდაზე.",
    answer_en: "The Twist team coordinates secure delivery and payment during beta.",
    category: "payment",
    tags: ["payment", "beta", "delivery"],
    view_count: 0,
    helpful_yes: 0,
    helpful_no: 0,
    priority: 80,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nextTicketNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `TW-${year}-${random}`;
}

supportRouter.get("/faqs", async (req, res) => {
  const category = req.query.category ? String(req.query.category) : undefined;
  const query = req.query.q ? String(req.query.q).toLowerCase() : "";
  const popular = String(req.query.popular || "") === "1";

  let filtered = faqs.filter((faq) => faq.is_active);
  if (category && category !== "all") {
    filtered = filtered.filter((faq) => faq.category === category);
  }
  if (query.length >= 2) {
    filtered = filtered.filter((faq) =>
      [faq.question_ka, faq.question_en, faq.answer_ka, faq.answer_en]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }

  filtered = [...filtered].sort((a, b) => {
    if (popular) return b.view_count - a.view_count;
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.view_count - a.view_count;
  });

  return res.json({ items: popular ? filtered.slice(0, 5) : filtered });
});

supportRouter.post("/faqs/:id/view", async (req, res) => {
  const faq = faqs.find((item) => item.id === String(req.params.id));
  if (!faq) return res.status(404).json({ error: "FAQ not found" });
  faq.view_count += 1;
  faq.last_viewed = new Date().toISOString();
  faq.updated_at = faq.last_viewed;
  return res.status(204).send();
});

supportRouter.post("/faqs/:id/feedback", async (req, res) => {
  const parsed = faqFeedbackSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const faq = faqs.find((item) => item.id === String(req.params.id));
  if (!faq) return res.status(404).json({ error: "FAQ not found" });
  if (parsed.data.is_helpful) faq.helpful_yes += 1;
  else faq.helpful_no += 1;
  faq.updated_at = new Date().toISOString();
  return res.status(204).send();
});

supportRouter.get("/tickets", requireAuth, async (req, res) => {
  const userTickets = tickets
    .filter((ticket) => ticket.user_id === req.auth!.userId)
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  return res.json({ items: userTickets });
});

supportRouter.post("/tickets", requireAuth, async (req, res) => {
  const parsed = createTicketSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const now = new Date().toISOString();
  const ticket: SupportTicket = {
    id: nextId("ticket"),
    ticket_number: nextTicketNumber(),
    user_id: req.auth!.userId,
    user_email: String(req.body?.user_email || ""),
    user_phone: parsed.data.user_phone,
    subject: parsed.data.subject,
    description: parsed.data.description,
    category: parsed.data.category,
    priority: "normal",
    status: "open",
    page_url: parsed.data.page_url,
    created_at: now,
    updated_at: now,
  };
  tickets.push(ticket);

  if (parsed.data.initial_message?.trim()) {
    messages.push({
      id: nextId("msg"),
      ticket_id: ticket.id,
      sender_id: req.auth!.userId,
      sender_type: "user",
      content: parsed.data.initial_message.trim(),
      is_internal_note: false,
      read_by_user: true,
      read_by_agent: false,
      created_at: now,
    });
  }

  return res.status(201).json({ ticket });
});

supportRouter.get("/tickets/:id/messages", requireAuth, async (req, res) => {
  const ticket = tickets.find((item) => item.id === String(req.params.id));
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  if (ticket.user_id !== req.auth!.userId) return res.status(403).json({ error: "Forbidden" });

  const ticketMessages = messages
    .filter((message) => message.ticket_id === ticket.id)
    .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at));
  return res.json({ items: ticketMessages });
});

supportRouter.post("/tickets/:id/messages", requireAuth, async (req, res) => {
  const parsed = sendMessageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const ticket = tickets.find((item) => item.id === String(req.params.id));
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  if (ticket.user_id !== req.auth!.userId) return res.status(403).json({ error: "Forbidden" });

  const message: SupportMessage = {
    id: nextId("msg"),
    ticket_id: ticket.id,
    sender_id: req.auth!.userId,
    sender_type: "user",
    content: parsed.data.content,
    is_internal_note: false,
    read_by_user: true,
    read_by_agent: false,
    created_at: new Date().toISOString(),
  };
  messages.push(message);
  ticket.updated_at = message.created_at;

  return res.status(201).json({ message });
});

supportRouter.get("/tickets-unread-count", requireAuth, async (req, res) => {
  const userTicketIds = new Set(
    tickets.filter((ticket) => ticket.user_id === req.auth!.userId).map((ticket) => ticket.id),
  );
  const unread = messages.filter(
    (message) =>
      userTicketIds.has(message.ticket_id) &&
      !message.read_by_user &&
      message.sender_type !== "user",
  ).length;
  return res.json({ count: unread });
});

supportRouter.post("/tickets/:id/read", requireAuth, async (req, res) => {
  const ticket = tickets.find((item) => item.id === String(req.params.id));
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  if (ticket.user_id !== req.auth!.userId) return res.status(403).json({ error: "Forbidden" });

  for (const message of messages) {
    if (message.ticket_id === ticket.id && message.sender_type !== "user") {
      message.read_by_user = true;
    }
  }

  return res.status(204).send();
});

supportRouter.patch("/tickets/:id/rating", requireAuth, async (req, res) => {
  const parsed = rateTicketSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const ticket = tickets.find((item) => item.id === String(req.params.id));
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  if (ticket.user_id !== req.auth!.userId) return res.status(403).json({ error: "Forbidden" });

  ticket.satisfaction = parsed.data.satisfaction;
  ticket.feedback = parsed.data.feedback;
  ticket.updated_at = new Date().toISOString();
  return res.json({ ticket });
});
