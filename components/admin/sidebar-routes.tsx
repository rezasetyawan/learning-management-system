"use client";

import { BookCopy, LayoutGrid } from "lucide-react";

import SidebarItem from "./sidebar-item";

const teacherRoutes = [
  {
    icon: LayoutGrid,
    label: "Home",
    href: "/admin",
  },
  {
    icon: BookCopy,
    label: "Academies",
    href: "/admin/academies",
  },
];

const SidebarRoutes = () => {
  const routes = teacherRoutes;

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
