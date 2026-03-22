/**
 * Create a user directly in the database (bypasses HTTP).
 * Requires DATABASE_URL (e.g. from backend/.env or Cloud SQL proxy).
 *
 * Usage:
 *   cd backend
 *   npx tsx scripts/create-user.ts <email> <password> [ROLE]
 *
 * Example:
 *   npx tsx scripts/create-user.ts twist-debug@example.com 'SecurePass12' BUYER
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const emailArg = process.argv[2];
  const passwordArg = process.argv[3];
  const roleArg = (process.argv[4] || "BUYER").toUpperCase() as keyof typeof UserRole;

  if (!emailArg || !passwordArg) {
    console.error(
      "Usage: npx tsx scripts/create-user.ts <email> <password> [BUYER|SELLER|ADMIN|COURIER]",
    );
    process.exit(1);
  }

  if (passwordArg.length < 8) {
    console.error("Password must be at least 8 characters (same rule as API).");
    process.exit(1);
  }

  if (!UserRole[roleArg]) {
    console.error(`Invalid role: ${roleArg}. Use BUYER, SELLER, ADMIN, or COURIER.`);
    process.exit(1);
  }

  const email = emailArg.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.error(`User already exists: ${email} (${existing.id})`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(passwordArg, 12);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: UserRole[roleArg],
    },
  });

  console.log("Created user:", {
    id: user.id,
    email: user.email,
    role: user.role,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
