import { ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import { columns } from "./columns";
import { DataTable } from "./data-table";

interface DeletedModule {
  id: string;
  name: string;
  type: string;
  deletedAt: string;
  deletedBy: string;
  moduleGroupId: string;
  moduleGroupName: string;
}

interface DeletedModulesResponse {
  data: DeletedModule[];
}
export default async function AcademyModulesTrashPage({
  params,
}: {
  params: { academyId: string; moduleGroupId: string };
}) {
  const deletedModulesData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/academies/${params.academyId}/modules?isDeleted=true`,
    { cache: "no-store" }
  );

  const deletedModulesResponse =
    (await deletedModulesData.json()) as DeletedModulesResponse;
  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
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
          Deleted Module
        </h2>
      </div>
      <div className={"p-5"}>
        <DataTable
          columns={columns}
          data={deletedModulesResponse.data}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
}
