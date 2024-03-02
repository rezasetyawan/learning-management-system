import { ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface AcademyStudent {
  fullname: string;
  username: string;
  userProgressPercentage: number;
  lastActivity: string;
  academyName: string;
  academyId: string;
}

interface AcademyStudentsData {
  data: AcademyStudent[];
}

export default async function AcademyStudents({
  params,
}: {
  params: { academyId: string };
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const academyStudentsResponse = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/academy-applications/joined?academyId=${params.academyId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const academyStudentsData =
    (await academyStudentsResponse.json()) as AcademyStudentsData;

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
          Daftar Murid
        </h2>
      </div>
      <div className={"p-5"}>
        <DataTable
          columns={columns}
          data={academyStudentsData.data}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
}
