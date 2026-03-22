import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { Router } from "express";
import { z } from "zod";
import { config, isProduction } from "../config";
import { canSendMail, sendPasswordResetEmail } from "../lib/mailer";
import { requireAuth } from "../middleware/auth";
import { requireCsrf } from "../middleware/csrf";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../lib/jwt";
import { prisma } from "../lib/prisma";
import { sha256 } from "../lib/security";

const REFRESH_COOKIE = "twist_refresh";
const cookieSameSite = isProduction ? "none" : "lax";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  metadata: z
    .object({
      username: z.string().optional(),
      full_name: z.string().optional(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
      phone: z.string().optional(),
      city: z.string().optional(),
      address: z.string().optional(),
    })
    .optional(),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
const googleSigninSchema = z.object({
  idToken: z.string().min(1),
});

const checkEmailSchema = z.object({
  email: z.string().email(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

const phoneSendSchema = z.object({
  phone: z.string().min(5),
});

const phoneVerifySchema = z.object({
  phone: z.string().min(5),
  code: z.string().length(6),
});

const setRefreshCookie = (res: any, token: string) => {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: config.cookieSecure || isProduction,
    sameSite: cookieSameSite,
    path: "/",
    maxAge: config.jwt.refreshTtlDays * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshCookie = (res: any) => {
  res.clearCookie(REFRESH_COOKIE, {
    path: "/",
    secure: config.cookieSecure || isProduction,
    sameSite: cookieSameSite,
  });
};

export const authRouter = Router();
const phoneCodes = new Map<string, { code: string; expiresAt: number }>();
let passwordResetTableReady = false;
const googleClient = config.google.clientId ? new OAuth2Client(config.google.clientId) : null;

const issueSession = async (user: { id: string; role: UserRole }, res: any) => {
  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, tokenId: crypto.randomUUID() });
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: sha256(refreshToken),
      expiresAt: new Date(Date.now() + config.jwt.refreshTtlDays * 24 * 60 * 60 * 1000),
    },
  });
  setRefreshCookie(res, refreshToken);
  return { accessToken, refreshToken };
};

const ensurePasswordResetTable = async () => {
  if (passwordResetTableReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "PasswordResetToken" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
      "tokenHash" TEXT NOT NULL UNIQUE,
      "expiresAt" TIMESTAMPTZ NOT NULL,
      "usedAt" TIMESTAMPTZ,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS "PasswordResetToken_userId_expiresAt_idx" ON "PasswordResetToken"("userId", "expiresAt")`,
  );
  passwordResetTableReady = true;
};

authRouter.get("/check-email", async (req, res) => {
  const parsed = checkEmailSchema.safeParse({ email: req.query.email });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid email" });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    return res.json({ available: !existing });
  } catch {
    // Fail open for UX here; signup endpoint still validates duplicates.
    return res.json({ available: true });
  }
});

authRouter.post("/forgot-password", async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  await ensurePasswordResetTable();

  if (isProduction && !canSendMail()) {
    return res.status(503).json({ error: "Password recovery is temporarily unavailable" });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (user) {
    const token = crypto.randomUUID();
    const tokenHash = sha256(token);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await prisma.$executeRaw`
      INSERT INTO "PasswordResetToken" ("id", "userId", "tokenHash", "expiresAt")
      VALUES (${crypto.randomUUID()}, ${user.id}, ${tokenHash}, ${expiresAt})
    `;

    const resetUrl = `${config.frontendUrl}/reset-password?token=${encodeURIComponent(token)}`;
    try {
      const sent = await sendPasswordResetEmail(user.email, resetUrl);
      if (!sent && !isProduction) {
        return res.json({ ok: true, resetUrl });
      }
    } catch {
      if (!isProduction) {
        return res.json({ ok: true, resetUrl });
      }
    }
  }
  return res.json({ ok: true });
});

authRouter.post("/reset-password", async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  await ensurePasswordResetTable();

  const tokenHash = sha256(parsed.data.token);
  const records = await prisma.$queryRaw<Array<{ id: string; userId: string; expiresAt: Date; usedAt: Date | null }>>`
    SELECT "id", "userId", "expiresAt", "usedAt"
    FROM "PasswordResetToken"
    WHERE "tokenHash" = ${tokenHash}
    LIMIT 1
  `;
  const record = records[0];

  if (!record || record.usedAt || new Date(record.expiresAt).getTime() < Date.now()) {
    return res.status(400).json({ error: "Invalid or expired reset token" });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.$executeRaw`UPDATE "PasswordResetToken" SET "usedAt" = NOW() WHERE "id" = ${record.id}`,
    prisma.refreshToken.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ]);

  return res.json({ ok: true });
});

authRouter.post("/phone/send", async (req, res) => {
  const parsed = phoneSendSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  phoneCodes.set(parsed.data.phone, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });

  if (!isProduction) {
    return res.json({ success: true, devCode: code });
  }
  return res.json({ success: true });
});

authRouter.post("/phone/verify", async (req, res) => {
  const parsed = phoneVerifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const record = phoneCodes.get(parsed.data.phone);
  if (!record || record.expiresAt < Date.now()) {
    return res.json({ success: false, message: "Code expired" });
  }
  if (record.code !== parsed.data.code) {
    return res.json({ success: false, message: "Invalid code" });
  }
  phoneCodes.delete(parsed.data.phone);
  return res.json({ success: true });
});

authRouter.post("/signup", requireCsrf, async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password, metadata } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      username: metadata?.username,
      fullName: metadata?.full_name,
      firstName: metadata?.first_name,
      lastName: metadata?.last_name,
      phone: metadata?.phone,
      city: metadata?.city,
      address: metadata?.address,
      role: UserRole.BUYER,
    },
  });

  const { accessToken, refreshToken } = await issueSession(user, res);
  return res.json({ accessToken, refreshToken, user: sanitizeUser(user) });
});

authRouter.post("/login", requireCsrf, async (req, res) => {
  const parsed = signinSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const { accessToken, refreshToken } = await issueSession(user, res);
  return res.json({ accessToken, refreshToken, user: sanitizeUser(user) });
});

authRouter.post("/google", requireCsrf, async (req, res) => {
  if (!googleClient || !config.google.clientId) {
    return res.status(503).json({ error: "Google sign-in is not configured" });
  }

  const parsed = googleSigninSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: parsed.data.idToken,
      audience: config.google.clientId,
    });
    const payload = ticket.getPayload();

    const email = payload?.email?.toLowerCase().trim();
    if (!email || payload.email_verified !== true) {
      return res.status(401).json({ error: "Invalid Google account" });
    }

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          passwordHash: await bcrypt.hash(crypto.randomUUID(), 12),
          fullName: payload.name || undefined,
          firstName: payload.given_name || undefined,
          lastName: payload.family_name || undefined,
          avatarUrl: payload.picture || undefined,
          emailVerifiedAt: new Date(),
          role: UserRole.BUYER,
        },
      });
    } else if (!user.emailVerifiedAt) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { emailVerifiedAt: new Date() },
      });
    }

    const { accessToken, refreshToken } = await issueSession(user, res);
    return res.json({ accessToken, refreshToken, user: sanitizeUser(user) });
  } catch {
    return res.status(401).json({ error: "Google sign-in failed" });
  }
});

authRouter.post("/refresh", requireCsrf, async (req, res) => {
  const bodyToken =
    req.body && typeof req.body === "object" && typeof (req.body as { refreshToken?: unknown }).refreshToken === "string"
      ? (req.body as { refreshToken: string }).refreshToken
      : undefined;
  const token = req.cookies?.[REFRESH_COOKIE] || bodyToken;
  if (!token) return res.status(401).json({ error: "Missing refresh token" });

  try {
    const payload = verifyRefreshToken(token);
    const record = await prisma.refreshToken.findFirst({
      where: { userId: payload.sub, tokenHash: sha256(token), revokedAt: null, expiresAt: { gt: new Date() } },
    });
    if (!record) return res.status(401).json({ error: "Invalid refresh token" });

    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) return res.status(401).json({ error: "User not found" });

    await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } });

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const newRefreshToken = signRefreshToken({ sub: user.id, tokenId: crypto.randomUUID() });
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: sha256(newRefreshToken),
        expiresAt: new Date(Date.now() + config.jwt.refreshTtlDays * 24 * 60 * 60 * 1000),
      },
    });
    setRefreshCookie(res, newRefreshToken);
    return res.json({ accessToken, refreshToken: newRefreshToken });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

authRouter.post("/logout", requireCsrf, requireAuth, async (req, res) => {
  const bodyToken =
    req.body && typeof req.body === "object" && typeof (req.body as { refreshToken?: unknown }).refreshToken === "string"
      ? (req.body as { refreshToken: string }).refreshToken
      : undefined;
  const token = req.cookies?.[REFRESH_COOKIE] || bodyToken;
  if (token) {
    await prisma.refreshToken.updateMany({
      where: { userId: req.auth!.userId, tokenHash: sha256(token), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  clearRefreshCookie(res);
  return res.status(204).send();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({ user: sanitizeUser(user) });
});

function sanitizeUser(user: any) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    full_name: user.fullName,
    first_name: user.firstName,
    last_name: user.lastName,
    phone: user.phone,
    phone_verified: user.phoneVerified,
    bio: user.bio,
    city: user.city,
    address: user.address,
    postal_code: user.postalCode,
    avatar_url: user.avatarUrl,
    is_seller: user.role === "SELLER" || user.role === "ADMIN",
    role: user.role,
    email_confirmed_at: user.emailVerifiedAt,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}

