import { ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import FilterSection from "./components/filter-section";

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
  academy: {
    name: string;
    id: string;
  };
}

interface UserSubmissionResponse {
  data: UserSubmission[];
}

export default async function AcademySubmissions({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const academyId = (searchParams?.academyId as string) || "";
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/user-submissions?academyId=" +
      academyId,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const userSubmissionResponse = (await data.json()) as UserSubmissionResponse;
  console.log(userSubmissionResponse);

  const academiesData = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL as string}/academies/autocomplete`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const academiesList = (await academiesData.json()) as {
    id: string;
    name: string;
  }[];
  
  return (
    <div className={"p-5 space-y-5"}>
      <div className="relative w-full">
        <h2 className="font-bold text-lg text-center xl:text-2xl">
          Daftar Submission Kelas
        </h2>
      </div>
      <div className={"p-5"}>
        <div className="max-w-[300px] mb-4">
          <FilterSection data={academiesList} />
        </div>
        <DataTable
          columns={columns}
          data={userSubmissionResponse.data}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
}
