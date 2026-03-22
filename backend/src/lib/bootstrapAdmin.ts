import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * One-time first admin setup via env (no SQL).
 *
 * Runs on API startup when there are zero ADMIN users:
 * - If BOOTSTRAP_ADMIN_EMAIL matches an existing user → promote them to ADMIN.
 * - Else if BOOTSTRAP_ADMIN_PASSWORD is set (≥8 chars) → create a new ADMIN user.
 *
 * If at least one ADMIN already exists, does nothing.
 * Remove or leave env vars after the first successful bootstrap (idempotent).
 */
export async function bootstrapFirstAdmin(): Promise<void> {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) return;

  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD?.trim();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { role: UserRole.ADMIN },
    });
    console.log(`[bootstrap] promoted existing user to ADMIN: ${email}`);
    return;
  }

  if (!password || password.length < 8) {
    console.warn(
      "[bootstrap] user not found for email and BOOTSTRAP_ADMIN_PASSWORD missing or < 8 chars — cannot create admin",
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: UserRole.ADMIN,
    },
  });
  console.log(`[bootstrap] created first ADMIN user: ${email}`);
}
