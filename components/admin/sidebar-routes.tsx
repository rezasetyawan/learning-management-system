"use client";

import { BookCopy, LayoutGrid, LogIn, UsersRound } from "lucide-react";

import SidebarItem from "./sidebar-item";

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
      href: "/admin/academyapplications"
    }
  ];

  if (userRole === "superadmin") {
    routes.push({
      icon: UsersRound,
      label: "Users",
      href: "/superadmin/users",
    });
  }

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
    </div>
  );
};

export default SidebarRoutes;
