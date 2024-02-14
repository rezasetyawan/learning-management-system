"use client";
import SidebarRoutes from "./sidebar-routes";

interface SidebarProps {
  userRole: "admin" | "user" | "superadmin";
}

const Sidebar = ({ userRole }: SidebarProps) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <h1 className="p-6 font-semibold text-xl">LMS</h1>
      <div className="flex flex-col w-full">
        <SidebarRoutes userRole={userRole} />
      </div>
    </div>
  );
};

export default Sidebar;
