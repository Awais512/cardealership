import { ClassifiedWithImages } from "@/config/types";
import { Prisma } from "@prisma/client";
import React from "react";
import { ClassifiedCard } from "./classified-card";

interface Props {
  classifieds: ClassifiedWithImages[];
}

export const ClassifiedsList = ({ classifieds }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {classifieds.map((classified) => (
        <ClassifiedCard key={classified.id} classified={classified} />
      ))}
    </div>
  );
};
