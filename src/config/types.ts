import { Prisma } from "@prisma/client";

type Params = {
  [x: string]: string | string[] | undefined;
};

export type PageProps = {
  params?: Promise<Params>;
  searchParams?: Promise<{ [x: string]: string | string[] | undefined }>;
};

export type AwaitedPageProps = {
  params?: Awaited<PageProps["params"]>;
  searchParams?: Awaited<PageProps["searchParams"]>;
};

export type ClassifiedWithImages = Prisma.ClassifiedGetPayload<{
  include: {
    images: true;
  };
}>;

export interface Favourites {
  ids: number[];
}

export enum MultiStepFormEnum {
  WELCOME = 1,
  SELECT_DATE = 2,
  SUBMIT_DETAILS = 3,
}
