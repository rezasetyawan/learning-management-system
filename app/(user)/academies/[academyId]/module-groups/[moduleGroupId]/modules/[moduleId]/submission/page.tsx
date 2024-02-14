import { cookies } from "next/headers";
import SubmissionForm from "./components/submission-form";
import SubmissionHeader from "./components/submission-header";
import { Toaster } from "react-hot-toast";

export default function SubmissionPage({
  params,
}: {
  params: { academyId: string; moduleGroupId: string; moduleId: string };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
      <SubmissionHeader
        moduleUrl={`/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`}
      />
      <div className="mt-20 mx-80">
        <div className="">
          <h1 className="text-black text-2xl font-medium">Submission</h1>
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
