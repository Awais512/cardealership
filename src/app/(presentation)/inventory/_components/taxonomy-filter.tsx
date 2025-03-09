"use client";

import { Select } from "@/components/ui/select";
import { endpoints } from "@/config/endpoints";
import { api } from "@/lib/api-client";
import { useEffect, useState } from "react";

import { FilterOptions, TaxonomyFilterProps } from "@/config/types";

export const TaxonomyFilter = ({
  handleChange,
  searchParams,
  ...rest
}: TaxonomyFilterProps) => {
  const [makes, setMakes] = useState<FilterOptions<string, string>>([]);
  const [models, setModels] = useState<FilterOptions<string, string>>([]);
  const [modelVariants, setModelVariants] = useState<
    FilterOptions<string, string>
  >([]);

  useEffect(() => {
    (async function fetchMakesOptions() {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(
        searchParams as Record<string, string>
      )) {
        if (v) params.set(k, v as string);
      }

      const url = new URL(endpoints.taxonomy, window.location.href);
      url.search = params.toString();

      const data = await api.get<{
        makes: FilterOptions<string, string>;
        models: FilterOptions<string, string>;
        modelVariants: FilterOptions<string, string>;
      }>(url.toString());
      setMakes(data.makes);
      setModels(data.models);
      setModelVariants(data.modelVariants);
    })();
  }, [searchParams]);

  return (
    <>
      {" "}
      <Select
        name="make"
        label="Make"
        value={searchParams?.make as string}
        onChange={handleChange}
        options={makes}
      />
      <Select
        name="model"
        label="Model"
        value={searchParams?.model as string}
        onChange={handleChange}
        options={models}
        disabled={!models.length}
      />
      <Select
        name="modelVariant"
        label="Model Variant"
        value={searchParams?.modelVariant as string}
        onChange={handleChange}
        options={modelVariants}
        disabled={!modelVariants.length}
      />
    </>
  );
};
