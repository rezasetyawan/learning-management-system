"use client";

import { useState } from "react";
import ModuleForm from "./module-form";
import { ModuleGroupForm } from "./module-group-form";

interface ModuleContainerProps {
  initialData: {
    moduleGroups: ModuleGroup[];
  };
  academyId: string;
}

export default function ModuleContainer({
  initialData,
  academyId,
}: ModuleContainerProps) {
  const [moduleGroups, setModuleGroups] = useState(initialData.moduleGroups);

  const sortModuleGroups = (updateData: { id: string; order: number }[]) => {
    const currentModuleGroups = [...moduleGroups];

    const updatedModuleGroups = currentModuleGroups.map((group, index) => {
      return {
        ...group,
        order:
          updateData[updateData.findIndex((data) => data.id === group.id)]
            .order,
      };
    });

    updatedModuleGroups.sort((a, b) => a.order - b.order);
    setModuleGroups(updatedModuleGroups)
  };
  return (
    <>
      <ModuleGroupForm initialData={initialData} academyId={academyId} sortModuleGroups={sortModuleGroups}/>

      <ModuleForm initalData={{moduleGroups}} academyId={academyId} />
    </>
  );
}
