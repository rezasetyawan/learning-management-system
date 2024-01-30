"use client";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { Module, ModuleGroup } from "@/types";
import { ArrowLeft, ChevronLeft, ChevronRight, List } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ModuleGroupAccordion from "./module-group-accordion";

interface ModuleContentProps {
  academyId: string;
  moduleGroupId: string;
  academyName: string;
  currentModule: Module;
  moduleGroups: ModuleGroup[];
  accessToken: string;
}
export default function ModuleContent({
  academyId,
  moduleGroupId,
  academyName,
  currentModule,
  moduleGroups,
  accessToken,
}: ModuleContentProps) {
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => {
    setShowSidebar((current) => !current);
  };

  const currentModuleGroupIndex = moduleGroups.findIndex(
    (group) => group.id === moduleGroupId
  );

  const currentModuleGroup = moduleGroups.filter(
    (group) => group.id === moduleGroupId
  )[0];
  const currentModuleIndex = currentModuleGroup.modules.findIndex(
    (module) => module.id === currentModule.id
  );

  //   both prev and next module with check their module group for getting the module
  const prevModule =
    currentModuleIndex >= 0
      ? currentModuleGroup.modules[currentModuleIndex - 1]
      : moduleGroups[currentModuleGroupIndex - 1]
      ? moduleGroups[currentModuleGroupIndex - 1].modules[
          moduleGroups[currentModuleGroupIndex - 1].modules.length - 1
        ]
      : undefined;
  const nextModule =
    currentModuleIndex >= 0 &&
    currentModuleGroup.modules[currentModuleIndex + 1]
      ? currentModuleGroup.modules[currentModuleIndex + 1]
      : moduleGroups[currentModuleGroupIndex + 1] &&
        moduleGroups[currentModuleGroupIndex + 1].modules[0]
      ? moduleGroups[currentModuleGroupIndex + 1].modules[0]
      : undefined;

  const updateUserLastReadedModule = async (
    academyId: string,
    moduleGroupId: string,
    moduleId: string
  ) => {
    const payload = {
      academyId,
      moduleGroupId,
      moduleId,
    };

    await axiosInstance.post(`/academies/${academyId}/progess`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log(payload);
  };
  return (
    <>
      {/* HEADER */}
      <header className="bg-white border-b px-4 py-4 fixed top-0 left-0 right-0 w-full h-14 flex items-center justify-between z-[100] lg:px-10 lg:justify-start">
        <Link
          href={`/academies/${academyId}`}
          className="flex items-center gap-4"
        >
          <ArrowLeft />
          <h2 className="font-semibold text-base">{academyName}</h2>
        </Link>
        <Button variant="ghost" onClick={toggleSidebar} className="lg:hidden">
          <List className="w-4 h-4 stroke-black rotate-180" />
        </Button>
      </header>
      {/* END OF HEADER */}

      <div className="relative">
        <div className="flex justify-center mt-14 relative">
          <div
            className={`text-3xl h-screen mb-96 transition-all mx-3  w-full lg:w-3/5 ${
              showSidebar ? "lg:mr-[300px]" : ""
            }`}
          >
            <Preview value={currentModule.content} />
          </div>
          {/* MODULE LIST */}
          <aside
            id="module-list"
            className={`w-full p-4 border-l-2 h-[calc(100vh-7.5rem)] transition-transform duration-500 bg-white md:w-[300px] fixed top-14 right-0 ${
              !showSidebar && "translate-x-[1000px]"
            }`}
          >
            <div className="flex gap-5 items-center justify-between">
              <Button
                onClick={toggleSidebar}
                className="w-9 h-9 p-0 rounded-full flex items-center justify-center max-lg:hidden"
              >
                <ChevronRight className="w-5 h-5 stroke-white xl:w-7 xl:h-7" />
              </Button>
              <Button
                className={`translate-x-[300px] transition-transform delay-500 duration-500 opacity-0 w-16 h-10 p-3 hidden items-center justify-start rounded-l-full lg:flex ${
                  !showSidebar && "-translate-x-[830px] opacity-100"
                }`}
                onClick={toggleSidebar}
              >
                <List className="w-4 h-4 stroke-white xl:w-6 xl:h-6" />
              </Button>
              <p className="text-lg font-semibold">Daftar Modul</p>
            </div>
            <div>
              <div className={`overflow-hidden`}>
                {moduleGroups.map((group) => (
                  <ModuleGroupAccordion
                    key={group.id}
                    academyId={academyId}
                    moduleGroup={group}
                    updateUserLastReadedModule={updateUserLastReadedModule}
                  />
                ))}
              </div>
            </div>
          </aside>
          {/* END OF MODULE LIST */}
        </div>
        <div className="bg-white px-3  border h-16 fixed bottom-0 w-full grid grid-cols-12 lg:px-10">
          {prevModule && (
            <div className="col-start-1 col-end-3 flex items-center justify-start md:col-end-5">
              <Link
                href={`/academies/${academyId}/module-groups/${currentModuleGroup.id}/modules/${prevModule.id}`}
                className="flex items-center w-4/5 lg:w-3/5"
                onClick={() =>
                  updateUserLastReadedModule(
                    academyId,
                    currentModuleGroup.id,
                    prevModule.id
                  )
                }
              >
                <ChevronLeft className="stroke-gray-900 w-5 h-5 md:w-10 md:h-10" />
                <p className="truncate font-medium text-slate-500 max-md:hidden">
                  {prevModule.name} doidufd dfdfdf dfdfdfdf dfoidufdofiu
                  dfoidufodiuf ddofiudf
                </p>
              </Link>
            </div>
          )}
          <div className="col-start-3 col-end-11 flex justify-center items-center md:col-start-5 md:col-end-9">
            <h3 className="font-medium truncate">
              {currentModule.name} dododo dfodfodf ddfddof dfdfdfdfdf
              dfoidufodiuf ddofiudf
            </h3>
          </div>
          {nextModule && (
            <div className="col-start-11 col-end-13 flex items-center justify-end w-full md:col-start-9">
              <Link
                href={`/academies/${academyId}/module-groups/${currentModuleGroup.id}/modules/${nextModule.id}`}
                className="flex items-center w-4/5 lg:w-3/5"
                onClick={() =>
                  updateUserLastReadedModule(
                    academyId,
                    currentModuleGroup.id,
                    nextModule.id
                  )
                }
              >
                <p className="truncate font-medium text-slate-500 max-md:hidden">
                  {nextModule.name} dofdfdf dfdfdf dfdf dfddfdfdf dfoidufodiuf
                  ddofiudf
                </p>
                <ChevronRight className="stroke-gray-900 w-5 h-5 md:w-10 md:h-10" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
