import { imageSources } from "@/config/constants";
import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import { createPngDataUri } from "unlazy/blurhash";

export async function seedImages(prisma: PrismaClient) {
  const classifieds = await prisma.classified.findMany();

  const classifiedIds = classifieds.map((classified) => classified.id);

  for (const classifiedId of classifiedIds) {
    const image: Prisma.ImageCreateInput = {
      src: imageSources.classifiedPlaceholder,
      alt: faker.lorem.words(2),
      classified: { connect: { id: classifiedId } },
      blurHash: createPngDataUri("nfcZBYKWiId/d3eLd4eJiClPc/iY"),
    };

    await prisma.image.create({
      data: image,
    });
  }
}
