import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./sidebar";

interface MobileSidebarProps {
  userRole: "admin" | "user" | "superadmin";
}

const MobileSidebar = ({ userRole }: MobileSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden pr-4 hover:opacity-75 transition">
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <Sidebar userRole={userRole} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
