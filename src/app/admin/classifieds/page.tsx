import { AdminClassifiedHeader } from "@/components/admin/classifieds/classified-header";
import { PageProps } from "@/config/types";

const AdminClassifiedPage = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  return (
    <>
      <AdminClassifiedHeader searchParams={searchParams} />
    </>
  );
};

export default AdminClassifiedPage;
