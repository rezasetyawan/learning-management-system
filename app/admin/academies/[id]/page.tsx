/* eslint-disable @next/next/no-assign-module-variable */
import Navbar from "@/components/admin/navbar";
import NameForm from "./component/name-form";
import { DescriptionForm } from "./component/description-form";
import ModuleContainer from "./component/module-container";
import { Toaster } from "react-hot-toast";
import { ImageForm } from "./component/image-form";
import { IconBadge } from "@/components/ui/icon-badge";
import { LayoutDashboard } from "lucide-react";
import { Actions } from "./component/actions";
import { Academy } from "@/types";
export default async function Academy({ params }: { params: { id: string } }) {
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/academies/" +
      params.id,
    { cache: "no-store" }
  );

  const academyResponse = await data.json();
  const academy = academyResponse.data as Academy;

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {/* <NameForm initialData={academy} academyId={params.id}/>
      <DescriptionForm initialData={academy} academyId={params.id}/> */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-semibold">Academy setup</h1>
            <span className="text-sm text-slate-700">
              {/* Complete all fields {completionText} */}
            </span>
          </div>
          <Actions academyId={params.id} isPublished={academy.isPublished}/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <div className="rounded-full flex items-center justify-center bg-sky-100 text-sky-700 p-1.5">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold">Customize your academy</h2>
            </div>
            <NameForm initialData={academy} academyId={params.id} />
            <DescriptionForm initialData={academy} academyId={params.id} />
            {/* <ImageForm initialData={academy} academyId={params.id} /> */}
            {/*
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            /> */}
          </div>
          <div className="space-y-6">
            <ModuleContainer initialData={academy} academyId={params.id} />
          </div>
        </div>
      </div>
    </>
  );
}
