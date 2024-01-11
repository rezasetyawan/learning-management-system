/* eslint-disable @next/next/no-async-client-component */
import { axiosInstance } from "@/lib/axios";
import { Toaster } from "react-hot-toast";
import { Actions } from "./components/module-actions";
import NameForm from "./components/module-name";
import { ModuleContentForm } from "./components/module-content";

type Module = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  order: number;
  academyModuleGroupId: string;
  type: "LESSON" | "QUIZZ" | "SUBMISSION";
  content: string;
  isPublished: boolean;
};

export default async function ModuleDetail({
  params,
}: {
  params: { academyId: string; moduleGroupId: string; moduleId: string };
}) {
  const data = await axiosInstance.get(
    `/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`
  );

  const moduleData = data.data.data as Module;
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-semibold">Module setup</h1>
            <span className="text-sm text-slate-700">
              {/* Complete all fields {completionText} */}
            </span>
          </div>
          <Actions
            academyId={params.academyId}
            moduleGroupId={params.moduleGroupId}
            moduleId={params.moduleId}
            isPublished={moduleData.isPublished}
          />
        </div>
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <div className=" col-span-1">
              <NameForm
                initialData={moduleData}
                academyId={params.academyId}
                moduleGroupId={params.moduleGroupId}
                moduleId={params.moduleId}
              />
            </div>
          </div>
          <ModuleContentForm
            initialData={moduleData}
            academyId={params.academyId}
            moduleGroupId={params.moduleGroupId}
            moduleId={params.moduleId}
          />
        </div>
      </div>
    </>
  );
}
