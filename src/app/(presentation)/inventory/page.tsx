import { AwaitedPageProps, PageProps } from "@/config/types";
import { prisma } from "@/lib/prisma";
import { ClassifiedCard } from "./_components/classified-card";
import { ClassifiedsList } from "./_components/classified-list";

const getInventory = async (searchParams: AwaitedPageProps["searchParams"]) => {
  return prisma.classified.findMany({
    include: {
      images: true,
    },
  });
};

const InventoryPage = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const classifieds = await getInventory(searchParams);
  const count = await prisma.classified.count();

  return (
    <div className="p-4 mt-4">
      <ClassifiedsList classifieds={classifieds} />
    </div>
  );
};

export default InventoryPage;
