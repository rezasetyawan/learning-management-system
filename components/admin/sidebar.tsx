/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import SidebarRoutes from "./sidebar-routes";

interface SidebarProps {
  userRole: "admin" | "user" | "superadmin";
}

const Sidebar = ({ userRole }: SidebarProps) => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <h1 className="px-2 h-16 font-semibold text-xl flex items-center">
        <Link
          href={"/admin"}
          className="text-sm font-semibold flex items-center gap-2"
        >
          <img src="/logo.svg" alt="logo" className="w-10 h-10" /> Learningspace
        </Link>
      </h1>
      <div className="flex flex-col w-full">
        <SidebarRoutes userRole={userRole} />
      </div>
    </div>
  );
};

export default Sidebar;
