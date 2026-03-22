import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  const hash = await bcrypt.hash('password123', 10);
  
  console.log('Creating test user 1...');
  await prisma.user.upsert({
    where: { email: 'test1@twist.com' },
    update: {},
    create: {
      email: 'test1@twist.com',
      passwordHash: hash,
      username: 'testuser1',
      fullName: 'Test User One',
      role: 'BUYER',
    },
  });

  console.log('Creating test user 2...');
  await prisma.user.upsert({
    where: { email: 'test2@twist.com' },
    update: {},
    create: {
      email: 'test2@twist.com',
      passwordHash: hash,
      username: 'testuser2',
      fullName: 'Test User Two',
      role: 'BUYER',
    },
  });

  console.log('2 Test users created successfully! (Passwords: password123)');
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
