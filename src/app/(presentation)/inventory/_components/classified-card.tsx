import { HTMLParser } from "@/components/shared/htnl-parser";
import { Button } from "@/components/ui/button";
import { routes } from "@/config/routes";
import { ClassifiedWithImages, MultiStepFormEnum } from "@/config/types";
import { Color, FuelType, OdoUnit, Transmission } from "@prisma/client";
import { Cog, Fuel, GaugeCircle, Paintbrush2 } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  classified: ClassifiedWithImages;
}

function formatColor(color: Color) {
  switch (color) {
    case Color.BLACK:
      return "Black";

    case Color.BLUE:
      return "Blue";

    case Color.BROWN:
      return "Brown";

    case Color.GOLD:
      return "Gold";

    case Color.GREEN:
      return "Green";

    case Color.GREY:
      return "Grey";

    case Color.ORANGE:
      return "Orange";

    case Color.PINK:
      return "Pink";

    case Color.PURPLE:
      return "Purple";

    case Color.RED:
      return "Red";

    case Color.SILVER:
      return "Silver";

    case Color.WHITE:
      return "White";

    default:
      return "Unknown";
  }
}

function formatFuelType(fuelType: FuelType) {
  switch (fuelType) {
    case FuelType.PETROL:
      return "Petrol";

    case FuelType.DIESEL:
      return "Diesel";

    case FuelType.ELECTRIC:
      return "Electric";

    case FuelType.HYBRID:
      return "Hybrid";

    default:
      return "Unknown";
  }
}

function formatTransmission(transmission: Transmission) {
  return transmission === Transmission.AUTOMATIC ? "Automatic" : "Manual";
}

function formatOdoUnit(unit?: OdoUnit) {
  return unit === OdoUnit.MILES ? "mi" : "km";
}

function formatNumber(num: number | null, options?: Intl.NumberFormatOptions) {
  if (!num) return "0";

  return new Intl.NumberFormat("en-gb", options).format(num);
}

const getKeyClassifiedInfo = (classified: ClassifiedWithImages) => {
  return [
    {
      id: "odoReading",
      icon: <GaugeCircle className="w-4 h-4" />,
      value: `${formatNumber(classified?.odoReading)} ${formatOdoUnit(
        classified?.odoUnit
      )}`,
    },
    {
      id: "transmission",
      icon: <Cog className="w-4 h-4" />,
      value: formatTransmission(classified?.transmission),
    },
    {
      id: "fuelType",
      icon: <Fuel className="w-4 h-4" />,
      value: formatFuelType(classified?.fuelType),
    },
    {
      id: "color",
      icon: <Paintbrush2 className="w-4 h-4" />,
      value: formatColor(classified?.color),
    },
  ];
};

export const ClassifiedCard = ({ classified }: Props) => {
  return (
    <div className="bg-white relative rounded-md shadow-md overflow-hidden flex flex-col">
      <div className="aspect-3/2 relative">
        <Link href={routes.singleClassified(classified.slug)}>
          <Image
            placeholder="blur"
            blurDataURL={classified.images[0]?.blurHash}
            src={classified.images[0]?.src}
            alt={classified.images[0]?.alt}
            className="object-cover"
            fill={true}
            quality={25}
          />
        </Link>
        <div className="absolute top-2.5 right-3.5 bg-primary text-slate-50 font-bold px-2 py-1 rounded">
          <p className="text-xs lg:text-base xl:text-lg font-semibold">
            {classified.price}
          </p>
        </div>
      </div>
      <div className="p-4 flex flex-col space-y-3">
        <div>
          <Link
            href={routes.singleClassified(classified.slug)}
            className="text-sm md:text-base lg:text-lg font-semibold line-clamp-1 transition-colors hover:text-primary"
          >
            {classified.title}
          </Link>
          {classified?.description && (
            <div className="text-xs md:text-sm xl:text-base text-gray-500 line-clamp-2">
              <HTMLParser html={classified.description} />
              &nbsp;
            </div>
          )}
          <ul className="text-xs md:text-sm text-gray-600 xl:flex grid grid-cols-1 grid-rows-4 md:grid-cols-2 md:grid-rows-4 items-center justify-between w-full">
            {getKeyClassifiedInfo(classified)
              .filter((v) => v.value)
              .map(({ id, icon, value }) => (
                <li
                  key={id}
                  className="font-semibold flex xl:flex-col items-center gap-x-1.5"
                >
                  {icon} {value}
                </li>
              ))}
          </ul>
        </div>
        <div className="mt-4 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:gap-x-2 w-full">
          <Button
            className="flex-1 transition-colors hover:border-white hover:bg-primary hover:text-white py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base"
            asChild
            variant="outline"
            size="sm"
          >
            <Link
              href={routes.reserve(classified.slug, MultiStepFormEnum.WELCOME)}
            >
              Reserve
            </Link>
          </Button>
          <Button
            className="flex-1 py-2 lg:py-2.5 h-full text-xs md:text-sm xl:text-base"
            asChild
            size="sm"
          >
            <Link href={routes.singleClassified(classified.slug)}>
              view Details
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
