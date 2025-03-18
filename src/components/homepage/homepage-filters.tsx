// "use client";

// import { TaxonomyFilter } from "@/app/(presentation)/inventory/_components/taxonomy-filter";
// import { AwaitedPageProps } from "@/config/types";
// import { parseAsString, useQueryStates } from "nuqs";

// export const HomepageTaxonomyFilters = ({ searchParams }: AwaitedPageProps) => {
//   const [, setState] = useQueryStates({
//     make: parseAsString.withDefault(""),
//     model: parseAsString.withDefault(""),
//     modelVariant: parseAsString.withDefault(""),
//     minYear: parseAsString.withDefault(""),
//     maxYear: parseAsString.withDefault(""),
//     minPrice: parseAsString.withDefault(""),
//     maxPrice: parseAsString.withDefault(""),
//   });

//   const handleChange = async (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;

//     switch (name) {
//       case "make":
//         await setState({ make: value, model: null, modelVariant: null });
//         break;
//       case "model":
//         await setState({ model: value, modelVariant: null });
//         break;
//       default:
//         await setState({ [name]: value });
//     }
//   };

//   return (
//     <>
//       <TaxonomyFilter handleChange={handleChange} searchParams={searchParams} />
//     </>
//   );
// };

"use client";

import type { AwaitedPageProps, SidebarProps } from "@/config/types";
import { parseAsString, useQueryStates } from "nuqs";
import { RangeFilter } from "@/app/(presentation)/inventory/_components/range-filter";
import { TaxonomyFilter } from "@/app/(presentation)/inventory/_components/taxonomy-filter";

export const HomepageTaxonomyFilters = ({ searchParams }: AwaitedPageProps) => {
  const [, setState] = useQueryStates(
    {
      make: parseAsString.withDefault(""),
      model: parseAsString.withDefault(""),
      modelVariant: parseAsString.withDefault(""),
      minYear: parseAsString.withDefault(""),
      maxYear: parseAsString.withDefault(""),
      minPrice: parseAsString.withDefault(""),
      maxPrice: parseAsString.withDefault(""),
    },
    { shallow: false }
  );

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "make":
        await setState({ make: value, model: null, modelVariant: null });
        break;
      case "model":
        await setState({ model: value, modelVariant: null });
        break;
      default:
        await setState({ [name]: value });
    }
  };

  return (
    <>
      <TaxonomyFilter handleChange={handleChange} searchParams={searchParams} />
    </>
  );
};
