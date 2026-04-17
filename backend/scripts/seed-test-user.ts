import bcrypt from "bcrypt";

import { prisma } from "../src/db/prisma.js";

const EMAIL = "admin@gmail.com";
const PASSWORD = "admin123";
const DISPLAY_NAME = "admin";
const BCRYPT_ROUNDS = 12;

async function main() {
  const passwordHash = await bcrypt.hash(PASSWORD, BCRYPT_ROUNDS);

  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: {
      displayName: DISPLAY_NAME,
      passwordHash,
    },
    create: {
      email: EMAIL,
      displayName: DISPLAY_NAME,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
    },
  });

  console.log("Seeded test user:", user);
}

main()
  .catch((err) => {
    console.error("Failed to seed test user", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
