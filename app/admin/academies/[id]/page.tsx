/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @next/next/no-assign-module-variable */
import Navbar from "@/components/admin/Navbar";
import NameForm from "./component/name-form";
import { DescriptionForm } from "./component/description-form";
import { ModuleGroupForm } from "./component/module-group-form";
import ModuleForm from "./component/module-form";
import { Toaster } from "react-hot-toast";
export default async function Academy({ params }: { params: { id: string } }) {
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + "/academies/" + params.id
  );

  const academyResponse = await data.json();
  const academy = academyResponse.data as Academy

  
  return (
    <>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      {/* <NameForm initialData={academy} academyId={params.id}/>
      <DescriptionForm initialData={academy} academyId={params.id}/> */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              {/* Complete all fields {completionText} */}
            </span>
          </div>
          {/* <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          /> */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              {/* <IconBadge icon={LayoutDashboard} /> */}
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <NameForm initialData={academy} academyId={params.id} />
            <DescriptionForm initialData={academy} academyId={params.id} />
            {/* <ImageForm
              initialData={course}
              courseId={course.id}
            />
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
            <ModuleGroupForm
              initialData={academy}
              academyId={params.id}
            />

            <ModuleForm
              initalData={academy}
              academyId={params.id}
            />

            {/* <ChaptersForm
                initialData={course}
                courseId={course.id}
              />
           */}
          </div>
        </div>
      </div>
    </>
  );
}
