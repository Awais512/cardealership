import { AwaitedPageProps, Favourites, PageProps } from "@/config/types";
import { prisma } from "@/lib/prisma";
import { ClassifiedsList } from "./_components/classified-list";
import { redis } from "@/lib/redis-store";
import { getSourceId } from "@/lib/source-id";
import { CustomPagination } from "@/components/shared/custom-pagination";
import { routes } from "@/config/routes";
import { z } from "zod";
import { CLASSIFIED_PER_PAGE } from "@/config/constants";
import { Sidebar } from "./_components/sidebar";
import { ClassifiedStatus, Prisma } from "@prisma/client";

const PageSchema = z
  .string()
  .transform((val) => Math.max(Number(val), 1))
  .optional();

const ClassifiedFilterSchema = z.object({
  q: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  modelVariant: z.string().optional(),
  minYear: z.string().optional(),
  maxYear: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  minReading: z.string().optional(),
  maxReading: z.string().optional(),
  currency: z.string().optional(),
  odoUnit: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  colour: z.string().optional(),
  bodyType: z.string().optional(),
  doors: z.string().optional(),
  seats: z.string().optional(),
  ulezCompliance: z.string().optional(),
  color: z.string().optional(),
});

const buildClassifiedFilterQuery = (
  searchParams: AwaitedPageProps["searchParams"] | undefined
): Prisma.ClassifiedWhereInput => {
  const { data } = ClassifiedFilterSchema.safeParse(searchParams);
  if (!data) return { status: ClassifiedStatus.LIVE };

  const keys = Object.keys(data);

  const taxonomyFilters = ["make", "model", "modelVariant"];

  const rangeFilters = {
    minYear: "year",
    maxYear: "year",
    minPrice: "price",
    maxPrice: "price",
    minReading: "odoReading",
    maxReading: "odoReading",
  };

  const fieldMappings: Record<string, string> = {
    color: "colour",
  };

  const directSelectFilters = [
    "transmission",
    "fuelType",
    "bodyType",
    "colour",
    "odoUnit",
    "currency",
    "ulezCompliance",
  ];

  const numericSelectFilters = ["doors", "seats"];

  const mapParamsToField = keys.reduce((acc, key) => {
    const value = searchParams?.[key] as string | undefined;
    if (!value) return acc;

    // Handle field name mapping (e.g., color -> colour)
    const mappedKey = fieldMappings[key] || key;

    if (taxonomyFilters.includes(mappedKey)) {
      acc[mappedKey] = { id: Number(value) };
    } else if (key in rangeFilters) {
      const field = rangeFilters[key as keyof typeof rangeFilters];
      acc[field] = acc[field] || {};
      if (key.startsWith("min")) {
        acc[field].gte = Number(value);
      } else if (key.startsWith("max")) {
        acc[field].lte = Number(value);
      }
    } else if (directSelectFilters.includes(mappedKey)) {
      // Direct mapping for enum-based select filters
      acc[mappedKey] = value;
    } else if (numericSelectFilters.includes(mappedKey)) {
      // Convert string to number for numeric select filters
      acc[mappedKey] = Number(value);
    }

    return acc;
  }, {} as { [key: string]: any });

  return {
    status: ClassifiedStatus.LIVE,
    ...(searchParams?.q && {
      OR: [
        {
          title: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchParams.q as string,
            mode: "insensitive",
          },
        },
      ],
    }),
    ...mapParamsToField,
  };
};

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  const validPage = PageSchema.parse(searchParams?.page);

  const page = validPage ? validPage : 1;
  const offset = (page - 1) * CLASSIFIED_PER_PAGE;

  return prisma.classified.findMany({
    where: buildClassifiedFilterQuery(searchParams),
    include: {
      images: { take: 1 },
    },
    skip: offset,
    take: CLASSIFIED_PER_PAGE,
  });
};

const InventoryPage = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const classifieds = await getInventory(searchParams);
  const count = await prisma.classified.count({
    where: buildClassifiedFilterQuery(searchParams),
  });

  const minMaxResult = await prisma.classified.aggregate({
    where: {
      status: ClassifiedStatus.LIVE,
    },
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

  const sourceId = await getSourceId();

  const favourites = await redis.get<Favourites>(sourceId ?? "");
  const totalPages = Math.ceil(count / CLASSIFIED_PER_PAGE);

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <Sidebar minMaxValues={minMaxResult} searchParams={searchParams} />
      <div className="flex-1 p-4 bg-white">
        <div className="flex space-y-2 flex-col items-center justify-center pb-4 -mt-1">
          <div className="flex justify-between items-center w-full">
            <h2 className="text-sm md:text-base lg:text-xl font-semibold min-w-fit">
              We have found {count} classifieds
            </h2>
            {/* Filter */}
          </div>
          <CustomPagination
            baseUrl={routes.inventory}
            totalPages={totalPages}
            styles={{
              paginationRoot: "flex justify-end",
              paginationPrevious: "",
              paginationNext: "",
              paginationLink: "border-none active:border text-black",
              paginationLinkActive: "",
            }}
          />
          <ClassifiedsList
            classifieds={classifieds}
            favourites={favourites ? favourites.ids : []}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
