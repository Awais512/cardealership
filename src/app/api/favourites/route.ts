import { number, z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { setSourceId } from "@/lib/source-id";
import { redis } from "@/lib/redis-store";
import { Favourites } from "@/config/types";
import { revalidatePath } from "next/cache";
import { routes } from "@/config/routes";

const validateIdSchema = z.object({ id: number().int() });

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const { data, error } = validateIdSchema.safeParse(body);

  if (!data) {
    return NextResponse.json({ error: error?.message }, { status: 400 });
  }

  if (typeof data.id !== "number") {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const sourceId = await setSourceId();
  const storedFavourites = await redis.get<Favourites>(sourceId);
  const favourites: Favourites = storedFavourites || { ids: [] };

  if (favourites.ids.includes(data.id)) {
    // Add or Remove the ID based on its current presence
    favourites.ids = favourites.ids.filter((favId) => favId !== data.id);
  } else {
    favourites.ids.push(data.id);
  }

  await redis.set(sourceId, JSON.stringify(favourites));

  revalidatePath(routes.favourites);

  console.log(favourites.ids);

  return NextResponse.json({ ids: favourites.ids }, { status: 200 });
};
