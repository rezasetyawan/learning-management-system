import { cookies } from "next/headers";
import SubmissionForm from "./components/submission-form";
import SubmissionHeader from "./components/submission-header";
import { Toaster } from "react-hot-toast";
import { notFound, redirect } from "next/navigation";

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

interface AcademyApplication {
  id: string;
  academyId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message: string;
}
interface AcademyApplicationResponse {
  data: AcademyApplication | undefined;
}

export default async function SubmissionPage({
  params,
}: {
  params: { academyId: string; moduleGroupId: string; moduleId: string };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  const moduleData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (moduleData.status === 404) {
    notFound();
  }

  const currentModule = (await moduleData.json()).data as Module;

  const academyApplicationResponse = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/academy-applications?academyId=" +
      params.academyId,
    { cache: "no-store", headers: { Authorization: `Bearer ${accessToken}` } }
  );

  const academyApplicationData =
    (await academyApplicationResponse.json()) as AcademyApplicationResponse;

  if (academyApplicationData.data?.status !== "APPROVED")
    redirect(`/academies/${params.academyId}`);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <SubmissionHeader
        moduleUrl={`/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`}
      />
      <div className="mt-10 mx-5 md:mx-10 lg:mx-40 xl:mt-20 xl:mx-80">
        <div className="">
          <h1 className="text-black text-xl font-semibold">
            Submission: {currentModule.name}
          </h1>
        </div>
        <div className="mt-20">
          <SubmissionForm
            accessToken={accessToken}
            moduleUrl={`/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`}
          />
        </div>
      </div>
    </>
  );
}
