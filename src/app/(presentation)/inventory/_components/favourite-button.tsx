import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";

type Props = {};

export const FavouriteButton = (props: Props) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute top-2.5 left-3.5 rounded-full z-10 group !h-6 !w-6 lg:!h-8 lg:!w-8 xl:!w-10 xl:!h-10"
      )}
    >
      <Heart
        className={cn(
          "duration-200 transition-colors ease-in-out w-3.5 h-3.5 lg:w-4 lg:h-4 xl:w-6 xl:h-6 text-white"
        )}
      />
    </Button>
  );
};
