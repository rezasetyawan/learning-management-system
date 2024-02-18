import { cookies } from "next/headers";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface AcademyApplication {
  id: string;
  userId: string;
  academyId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message: string;
  createdAt: number;
  updatedAt: number;
  user: {
    username: string;
    fullname: string;
  };
  academy: {
    id: string;
    name: string;
  };
}

interface AcademyApplicationsResponse {
  data: AcademyApplication[];
}
export default async function AcademyApplications() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const data = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) + "/academy-applications/all",
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const academyApplicationsResponse =
    (await data.json()) as AcademyApplicationsResponse;

  return (
    <div className={"p-5 space-y-5"}>
      <div className="relative w-full">
        <h2 className="font-bold text-lg text-center xl:text-2xl">
          Daftar Permintaan Bergabung Kelas
        </h2>
      </div>
      <div className={"p-5"}>
        <DataTable
          columns={columns}
          data={academyApplicationsResponse.data}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
}
