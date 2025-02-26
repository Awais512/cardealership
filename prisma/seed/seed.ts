import { PrismaClient } from "@prisma/client";
import { seedTaxonomy } from "./taxonomy.seed";

const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRaw`TRUNCATE TABLE "Make" RESTART IDENTITY CASCADE`;
  await seedTaxonomy();
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
