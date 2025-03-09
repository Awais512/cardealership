"use client";

import { SearchInput } from "@/components/shared/search-input";
import { routes } from "@/config/routes";
import { AwaitedPageProps } from "@/config/types";
import {
  cn,
  formatBodyType,
  formatColor,
  formatFuelType,
  formatOdoUnit,
  formatTransmission,
  formatUlezCompliance,
} from "@/lib/utils";
import { parseAsString, useQueryStates } from "nuqs";
import { ChangeEvent, useEffect, useState } from "react";
import { TaxonomyFilter } from "./taxonomy-filter";
import { useRouter } from "next/navigation";
import { RangeFilter } from "./range-filter";
import {
  BodyType,
  Colour,
  CurrencyCode,
  FuelType,
  OdoUnit,
  Transmission,
  ULEZCompliance,
} from "@prisma/client";
import { Select } from "@/components/ui/select";
import { SidebarProps } from "@/config/types";

export const Sidebar = ({ minMaxValues, searchParams }: SidebarProps) => {
  const router = useRouter();
  const [filterCount, setFilterCount] = useState(0);

  const { _min, _max } = minMaxValues;

  const [queryStates, setQueryStates] = useQueryStates(
    {
      make: parseAsString.withDefault(""),
      model: parseAsString.withDefault(""),
      modelVariant: parseAsString.withDefault(""),
      minYear: parseAsString.withDefault(""),
      maxYear: parseAsString.withDefault(""),
      minPrice: parseAsString.withDefault(""),
      maxPrice: parseAsString.withDefault(""),
      minReading: parseAsString.withDefault(""),
      maxReading: parseAsString.withDefault(""),
      currency: parseAsString.withDefault(""),
      odoUnit: parseAsString.withDefault(""),
      transmission: parseAsString.withDefault(""),
      fuelType: parseAsString.withDefault(""),
      bodyType: parseAsString.withDefault(""),
      colour: parseAsString.withDefault(""),
      doors: parseAsString.withDefault(""),
      seats: parseAsString.withDefault(""),
      ulezCompliance: parseAsString.withDefault(""),
    },
    {
      shallow: false,
    }
  );

  useEffect(() => {
    const filterCount = Object.entries(
      searchParams as Record<string, string>
    ).filter(([key, value]) => key !== "page" && value).length;

    setFilterCount(filterCount);
  }, [searchParams]);

  const clearFilters = () => {
    setQueryStates({
      make: "",
      model: "",
      modelVariant: "",
      minYear: "",
      maxYear: "",
      minPrice: "",
      maxPrice: "",
      minReading: "",
      maxReading: "",
      currency: "",
      odoUnit: "",
      transmission: "",
      fuelType: "",
      bodyType: "",
      colour: "",
      doors: "",
      seats: "",
      ulezCompliance: "",
    });

    setFilterCount(0);
    router.push(routes.inventory);
  };

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setQueryStates({
      [name]: value || null,
    });

    if (name === "make") {
      setQueryStates({
        model: null,
        modelVariant: null,
      });
    }

    router.refresh();
  };

  return (
    <div className="py-4 w-[21.25rem] bg-white border-r border-muted hidden lg:block">
      <div>
        <div className="text-lg font-semibold flex justify-between px-4">
          <span>Filters</span>
          <button
            type="button"
            onClick={clearFilters}
            aria-disabled={!filterCount}
            className={cn(
              "text-sm text-gray-500 py-1",
              !filterCount
                ? "disabled opacity-50 pointer-events-none cursor-default"
                : "hover:underline cursor-pointer"
            )}
          >
            Clear all {filterCount ? `(${filterCount})` : null}
          </button>
        </div>
        <div className="mt-2" />
      </div>
      <div className="p-4">
        <SearchInput
          placeholder="Search Classified..."
          className="w-full px-3 py-2 border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="p-4 space-y-2">
        <TaxonomyFilter
          searchParams={searchParams}
          handleChange={handleChange}
        />
        <RangeFilter
          label="Year"
          minName="minYear"
          maxName="maxYear"
          defaultMin={_min.year || 1925}
          defaultMax={_max.year || new Date().getFullYear()}
          handleChange={handleChange}
          searchParams={searchParams}
        />
        <RangeFilter
          label="Price"
          minName="minPrice"
          maxName="maxPrice"
          defaultMin={_min.price || 0}
          defaultMax={_max.price || 21474836}
          handleChange={handleChange}
          searchParams={searchParams}
          increment={1000000}
          thousandSeparator
          currency={{
            currencyCode: "GBP",
          }}
        />
        <RangeFilter
          label="Odometer Reading"
          minName="minReading"
          maxName="maxReading"
          defaultMin={_min.odoReading || 0}
          defaultMax={_max.odoReading || 1000000}
          handleChange={handleChange}
          searchParams={searchParams}
          increment={5000}
          thousandSeparator
        />

        <Select
          label="Currency"
          name="currency"
          value={queryStates.currency || ""}
          onChange={handleChange}
          options={Object.values(CurrencyCode).map((value) => ({
            label: value,
            value,
          }))}
        />
        <Select
          label="Odometery Unit"
          name="odoUnit"
          value={queryStates.odoUnit || ""}
          onChange={handleChange}
          options={Object.values(OdoUnit).map((value) => ({
            label: formatOdoUnit(value),
            value,
          }))}
        />
        <Select
          label="Transmission"
          name="transmission"
          value={queryStates.transmission || ""}
          onChange={handleChange}
          options={Object.values(Transmission).map((value) => ({
            label: formatTransmission(value),
            value,
          }))}
        />
        <Select
          label="Fuel Type"
          name="fuelType"
          value={queryStates.fuelType || ""}
          onChange={handleChange}
          options={Object.values(FuelType).map((value) => ({
            label: formatFuelType(value),
            value,
          }))}
        />
        <Select
          label="Body Type"
          name="bodyType"
          value={queryStates.bodyType || ""}
          onChange={handleChange}
          options={Object.values(BodyType).map((value) => ({
            label: formatBodyType(value),
            value,
          }))}
        />
        <Select
          label="Color"
          name="colour"
          value={queryStates.colour || ""}
          onChange={handleChange}
          options={Object.values(Colour).map((value) => ({
            label: formatColor(value),
            value,
          }))}
        />
        <Select
          label="ULez Compliance"
          name="ulezCompliance"
          value={queryStates.ulezCompliance || ""}
          onChange={handleChange}
          options={Object.values(ULEZCompliance).map((value) => ({
            label: formatUlezCompliance(value),
            value,
          }))}
        />
        <Select
          label="Doors"
          name="doors"
          value={queryStates.doors || ""}
          onChange={handleChange}
          options={Array.from({ length: 6 }).map((_, i) => ({
            label: Number(i + 1).toString(),
            value: Number(i + 1).toString(),
          }))}
        />
        <Select
          label="Seats"
          name="seats"
          value={queryStates.seats || ""}
          onChange={handleChange}
          options={Array.from({ length: 6 }).map((_, i) => ({
            label: Number(i + 1).toString(),
            value: Number(i + 1).toString(),
          }))}
        />
      </div>
    </div>
  );
};
