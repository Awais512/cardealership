import { FeaturesSection } from "@/components/homepage/features-section";
import { HeroSection } from "@/components/homepage/hero-section";
import { LatestArrivals } from "@/components/homepage/latest-arrivals";
import { OurBrandsSection } from "@/components/homepage/our-brands-section";
import { PageProps } from "@/config/types";
import { prisma } from "@/lib/prisma";
import { ClassifiedStatus } from "@prisma/client";

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;

  const minMaxResult = await prisma.classified.aggregate({
    where: { status: ClassifiedStatus.LIVE },
    _min: {
      year: true,
      price: true,
      odoReading: true,
    },
    _max: {
      price: true,
      year: true,
      odoReading: true,
    },
  });

  return (
    <div className="min-h-screen w-full bg-background">
      <HeroSection searchParams={searchParams} />
      <FeaturesSection />
      <LatestArrivals />
      <OurBrandsSection />
    </div>
  );
}
