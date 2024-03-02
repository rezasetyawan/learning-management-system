"use client";

import { BookCopy, BookText, LayoutGrid, LogIn, LogOut, UsersRound } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { useRouter } from "next/navigation";
import { deleteCookies } from "@/actions/cookies";

interface SidebarRoutesProps {
  userRole: "admin" | "user" | "superadmin";
}
const SidebarRoutes = ({ userRole }: SidebarRoutesProps) => {
  const routes = [
    {
      icon: LayoutGrid,
      label: "Dashboard",
      href: "/admin",
    },
    {
      icon: BookCopy,
      label: "Academies",
      href: "/admin/academies",
    },
    {
      icon: LogIn,
      label: "Academy Applications",
      href: "/admin/academyapplications",
    },
    {
      icon: BookText,
      label: "Submissions",
      href: "/admin/academysubmission"
    }
  ];

  if (userRole === "superadmin") {
    routes.push({
      icon: UsersRound,
      label: "Users",
      href: "/superadmin/users",
    });
  }

  const router = useRouter();
  const logoutHandler = () => {
    deleteCookies("accessToken");
    router.push("/login");
  };

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
      <div
        className="flex items-center gap-2 cursor-pointer gap-x-2 pl-6 transition-all py-4 text-red-600 hover:bg-slate-300/20"
        onClick={logoutHandler}
      >
        <LogOut size={22} className="stroke-red-600" />
        Keluar
      </div>
    </div>
  );
};

export default SidebarRoutes;
