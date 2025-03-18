import { HeroSection } from "@/components/homepage/hero-section";
import { HomepageTaxonomyFilters } from "@/components/homepage/homepage-filters";
import { SearchButton } from "@/components/homepage/search-button";
import { imageSources } from "@/config/constants";
import { PageProps } from "@/config/types";
import { imgixLoader } from "@/lib/imgix-loader";

export default async function Home(props: PageProps) {
  const searchParams = await props.searchParams;
  return (
    <div className="min-h-screen w-full bg-background">
      <HeroSection searchParams={searchParams} />
    </div>
  );
}
