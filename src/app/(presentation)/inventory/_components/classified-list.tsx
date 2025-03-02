import { ClassifiedWithImages, Favourites } from "@/config/types";
import { ClassifiedCard } from "./classified-card";

interface Props {
  classifieds: ClassifiedWithImages[];
  favourites: number[];
}

export const ClassifiedsList = ({ classifieds, favourites }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {classifieds.map((classified) => (
        <ClassifiedCard
          key={classified.id}
          classified={classified}
          favourites={favourites}
        />
      ))}
    </div>
  );
};
