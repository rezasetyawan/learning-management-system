import { cookies } from "next/headers";
import SubmissionInfo from "./components/submission-info";

interface UserSubmissionDetail {
  id: string;
  createdAt: string;
  note: string;
  fileUrl: string;
  status: "PENDING" | "REVIEW" | "REVIEWED";
  academyId: string;
  academyName: string;
  user: {
    id: string;
    fullname: string;
  };
  moduleName: string;
  moduleId: string;
  moduleGroupId: string;
  result: null | {};
}

interface UserSubmissionDetailResponse {
  data: UserSubmissionDetail;
}
export default async function AcademySubmissionDetail({
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

  return (
    <div className="mx-10">
      <div className="my-5">
        <h2 className="text-xl font-semibold">Submission: {userSubmissionDetailResponse.data.moduleName}</h2>
      </div>
      <SubmissionInfo submission={userSubmissionDetailResponse.data} />
    </div>
  );
}
