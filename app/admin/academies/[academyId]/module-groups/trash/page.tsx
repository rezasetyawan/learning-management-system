import { cookies } from "next/headers";
import { columns } from "./colums";
import { DataTable } from "./data-table";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DeletedModuleGroup {
  id: string;
  name: string;
  academyId: string;
  deletedAt: string;
  deletedBy: string;
}

interface DeletedModuleGroupsResponse {
  data: DeletedModuleGroup[];
}
export default async function AcademyModuleGroupsTrashPage({
  params,
}: {
  params: { academyId: string };
}) {
  const deletedModuleGroupsData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/academies/${params.academyId}/module-groups?isDeleted=true`,
    { cache: "no-store" }
  );

  const deletedModuleGroupsResponse =
    (await deletedModuleGroupsData.json()) as DeletedModuleGroupsResponse;

  const cookieStore = cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  return (
    <div className={"p-5 space-y-5"}>
      <div className="relative w-full">
        <Link href={`/admin/academies/${params.academyId}`} className="block absolute left-0 top-1/2 -translate-y-1/2">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h2 className="font-bold text-lg text-center xl:text-2xl">
          Deleted Module Group
        </h2>
      </div>
      <div className={"p-5"}>
        <DataTable
          columns={columns}
          data={deletedModuleGroupsResponse.data}
          accessToken={accessToken}
        />
      </div>
    </div>
  );
}
