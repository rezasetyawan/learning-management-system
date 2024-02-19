"use client";

import { useState } from "react";
import ModuleForm from "./module-form";
import { ModuleGroupForm } from "./module-group-form";
import { ListChecks } from "lucide-react";
import { ModuleGroup, Module } from "@/types";

interface ModuleContainerProps {
  initialData: {
    moduleGroups: ModuleGroup[];
  };
  academyId: string;
  accessToken:string
}

export default function ModuleContainer({
  initialData,
  academyId,
  accessToken
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
    setModuleGroups(updatedModuleGroups);
  };

  const addModuleGroups = (newModuleGroup: ModuleGroup) => {
    const currentModuleGroups = [...moduleGroups];
    currentModuleGroups.push(newModuleGroup);
    setModuleGroups(currentModuleGroups);
  };

  const addModule = (newModule: Module, moduleGroupId: string) => {
    const currentModuleGroups = [...moduleGroups];
    const index = currentModuleGroups.findIndex(
      (group) => group.id === moduleGroupId
    );

    currentModuleGroups[index].modules.push(newModule);

    setModuleGroups(currentModuleGroups);
  };

  const updateModuleGroup = (
    newModuleGroup: ModuleGroup,
    moduleGroupId: string
  ) => {
    const currentModuleGroups = [...moduleGroups];
    const index = currentModuleGroups.findIndex(
      (group) => group.id === moduleGroupId
    );

    currentModuleGroups[index] = newModuleGroup;

    setModuleGroups(currentModuleGroups);
  };

  const deleteModuleGroup = (moduleGroupId: string) => {
    const currentModuleGroups = [...moduleGroups];
    const index = currentModuleGroups.findIndex(
      (group) => group.id === moduleGroupId
    );

    currentModuleGroups.splice(index, 1);
    setModuleGroups(currentModuleGroups);
  };

  // const deleteModule = (moduleGroupId: string, moduleId: string) => {
  //   const currentModuleGroups = [...moduleGroups];
  //   const index = currentModuleGroups.findIndex(
  //     (group) => group.id === moduleGroupId
  //   );

  //   const moduleIndex = currentModuleGroups[index].modules.findIndex(
  //     (module) => module.id === moduleId
  //   );
  //   currentModuleGroups[index].modules.slice(1, moduleIndex);
  // };
  return (
    <>
      <div className="flex items-center gap-x-2">
        <div className="rounded-full flex items-center justify-center bg-sky-100 text-sky-700 p-1.5">
          <ListChecks className="w-6 h-6" />
        </div>
        <h2 className="text-base font-semibold lg:text-lg">Modul Group & Modul Kelas</h2>
      </div>
      <ModuleGroupForm
        initialData={{ moduleGroups }}
        academyId={academyId}
        sortModuleGroups={sortModuleGroups}
        addModuleGroups={addModuleGroups}
        updateModuleGroup={updateModuleGroup}
        deleteModuleGroup={deleteModuleGroup}
        accessToken={accessToken}
      />

      <ModuleForm
        initialData={{ moduleGroups }}
        academyId={academyId}
        addModule={addModule}
        accessToken={accessToken}
      />
    </>
  );
}
