import { ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface UserSubmission {
  id: string;
  createdAt: string;
  note: string;
  academyId: string;
  moduleId: string;
  fileUrl: string;
  status: "PENDING" | "REVIEW" | "REVIEWED";
  user: {
    fullname: string;
  };
  module: {
    name: string;
    id: string;
  };
}

interface UserSubmissionResponse {
  data: UserSubmission[];
}

export default async function AcademySubmission({
  params,
}: {
  params: { academyId: string };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/user-submissions?academyId=" +
      params.academyId,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const userSubmissionResponse = (await data.json()) as UserSubmissionResponse;
  console.log(userSubmissionResponse);
  return (
    <div className={"p-5 space-y-5"}>
      <div className="relative w-full">
        <Link
          href={`/admin/academies/${params.academyId}`}
          className="block absolute left-0 top-1/2 -translate-y-1/2"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="font-bold text-lg text-center xl:text-2xl">
          User Submissions
        </h2>
      </div>
      <div className={"p-5"}>
        <DataTable
          columns={columns}
          data={userSubmissionResponse.data}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
}
