"use client";

import { AwaitedPageProps } from "@/config/types";
import { ClassifiedStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface Props extends AwaitedPageProps {
  items: string[];
}

export const RadioFilter = ({ items, searchParams }: Props) => {
  const router = useRouter();
  const status = (searchParams?.status as string) || "all";

  const handleStatus = (status: Lowercase<ClassifiedStatus>) => {
    const currentUrlSearchParams = new URLSearchParams(window.location.search);
    currentUrlSearchParams.set("status", status.toUpperCase());

    const url = new URL(window.location.href);
    url.search = currentUrlSearchParams.toString();
    router.push(url.toString());
  };

  return (
    <RadioGroup
      onValueChange={handleStatus}
      defaultValue="all"
      className="flex items-center gap-4"
    >
      {items.map((item) => (
        <Label
          htmlFor={item.toLowerCase()}
          key={item}
          className={cn(
            "flex-1 rounded-md px-4 py-2 text-center text-muted text-sm transition-colors hover:bg-primary-800 cursor-pointer",
            status?.toLocaleLowerCase() === item.toLowerCase() &&
              "text-white bg-primary-800"
          )}
        >
          <RadioGroupItem
            id={item.toLowerCase()}
            value={item.toLowerCase()}
            checked={status?.toLowerCase() === item.toLowerCase()}
            className="peer sr-only"
          />
          {item}
        </Label>
      ))}
    </RadioGroup>
  );
};
