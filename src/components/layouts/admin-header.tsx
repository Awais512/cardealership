import React from "react";
import { AdminSearch } from "../admin/search";

const AdminHeader = async () => {
  return (
    <header>
      <div className="items-center flex-1 gap-4 md:gap-8 grid grid-cols-3 w-full">
        <div className="col-span-1">
          <AdminSearch />
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
