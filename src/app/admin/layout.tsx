import AdminHeader from "@/components/layouts/admin-header";
import React, { PropsWithChildren } from "react";

const AdminDashboardLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <div className="flex bg-primary-900 min-h-screen w-full">
      {/* Admin Sidebar */}
      <div className="flex flex-col overflow-hidden">
        <AdminHeader />
      </div>
      <main className="admin-scrollbar flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
