"use client";
import { ModuleGroup } from "@/types";
import { ChevronUp } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function ModuleGroupAccordion({
  academyId,
  moduleGroup,
  updateUserLastReadedModule,
}: {
  academyId: string;
  moduleGroup: ModuleGroup;
  updateUserLastReadedModule: (
    academyId: string,
    moduleGroupId: string,
    moduleId: string
  ) => Promise<void>;
}) {
  const params = useParams<{
    academyId: string;
    moduleGroupId: string;
    moduleId: string;
  }>();
  const [open, setOpen] = useState(params.moduleGroupId === moduleGroup.id);
  const toggleOpen = () => {
    setOpen((current) => !current);
  };

  return (
    <div className="">
      <div className="flex items-center gap-4" onClick={toggleOpen}>
        <ChevronUp
          className={`w-3 h-3 stroke-black transition-transform ${
            open && "rotate-180"
          }`}
        />
        <h3
          className="font-semibold text-base cursor-pointer p-2 my-1.5"
          id="module-name"
        >
          {moduleGroup.name}
        </h3>
      </div>
      <div
        id="module-group-modules"
        className={`modules-accordion ml-1 ${open ? "show" : ""}`}
      >
        <div className="overflow-hidden">
          <div className="p-3 border-l-2 space-y-1">
            {moduleGroup.modules.map((module) => (
              <Link
                key={module.id}
                href={`/academies/${academyId}/module-groups/${moduleGroup.id}/modules/${module.id}`}
                className={`block ${
                  params.moduleId === module.id && "font-semibold"
                }`}
                onClick={() =>
                  updateUserLastReadedModule(
                    academyId,
                    moduleGroup.id,
                    module.id
                  )
                }
              >
                {module.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
