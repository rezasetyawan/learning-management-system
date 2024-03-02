/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import SidebarItem from "./admin/sidebar-item";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();
  const routes = [
    {
      href: `/`,
      label: "Home",
      active: false,
    },
    // {
    //   href: `/learning-path`,
    //   label: "Learning Path",
    //   active: false,
    // },
    {
      href: `/academies`,
      label: "Academies",
      active: false,
    },
  ];
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <h1>
        <Link href={"/"} className="py-2 px-2 text-sm font-semibold flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="w-10 h-10" /> Learningspace
        </Link>
      </h1>

      <div className="flex flex-col w-full">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.label}
              href={route.href}
              type="button"
              className={cn(
                "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
                isActive &&
                  "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
              )}
            >
              <span className="py-4">{route.label}</span>
              <div
                className={cn(
                  "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all",
                  isActive && "opacity-100"
                )}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
