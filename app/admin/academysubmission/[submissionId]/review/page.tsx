import { cookies } from "next/headers";
import SubmissionInfo from "../components/submission-info";
import ReviewForm from "./components/review-form";
import toast, { Toaster } from "react-hot-toast";
import { redirect } from "next/navigation";

interface Reviewer {
  fullname: string;
  username: string;
}

interface Result {
  id: string;
  reviewer: Reviewer;
  createdAt: string;
  reviewerNote: string;
  score: number;
  isPassed: boolean;
  submissionId: string;
}

interface Module {
  name: string;
  id: string;
  group: {
    id: string;
  };
}

interface Academy {
  name: string;
  id: string;
}

interface User {
  fullname: string;
  username: string;
}

interface UserSubmissionDetail {
  id: string;
  userId: string;
  createdAt: string;
  note: string;
  academyId: string;
  moduleId: string;
  fileUrl: string;
  status: string;
  result: Result[];
  module: Module;
  academy: Academy;
  user: User;
}

interface UserSubmissionDetailResponse {
  data: UserSubmissionDetail;
}

export default async function SubmissionReviewPage({
  params,
}: {
  params: { submissionId: string };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/user-submissions/" +
      params.submissionId,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const userSubmissionDetailResponse =
    (await data.json()) as UserSubmissionDetailResponse;

  if (userSubmissionDetailResponse.data.status === "REVIEWED") {
    redirect(`/admin/academysubmission/${params.submissionId}`);
  }

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="mx-10">
        <div className="my-5">
          <h2 className="text-xl font-semibold">
            Submission: {userSubmissionDetailResponse.data.module.name}
          </h2>
        </div>
        <SubmissionInfo submission={userSubmissionDetailResponse.data} />
        <div className="mb-40">
          <ReviewForm
            accessToken={accessToken}
            submission={userSubmissionDetailResponse.data}
          />
        </div>
      </div>
    </>
  );
}
