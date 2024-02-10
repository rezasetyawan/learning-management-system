import { cookies } from "next/headers";
import ModuleGroupModal from "./components/module-group-modal";
interface ModuleGroup {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedBy: string | null;
}

interface ModuleGroupResponse {
  data: ModuleGroup;
}

interface AuditLog {
  id: string;
  entityId: string;
  entityType: string;
  actionType: "CREATE" | "UPDATE" | "DELETE";
  entityName: string;
  createdAt: string;
  user: {
    fullname: string;
  };
}

interface AuditLogsResponse {
  data: AuditLog[];
}

export default async function ModuleGroupDetailPage({
  params,
}: {
  params: { academyId: string; moduleGroupId: string };
}) {
  const cookieStore = cookies();

  const accessToken = cookieStore.get("accessToken")?.value || "";
  const moduleGroupData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      "/academies/" +
      params.academyId +
      "/module-groups/" +
      params.moduleGroupId,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  const moduleGroupResponse =
    (await moduleGroupData.json()) as ModuleGroupResponse;

  const auditLogsData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/audit-log?entityType=module+group&entityId=${params.moduleGroupId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  const auditLogResponse = (await auditLogsData.json()) as AuditLogsResponse;
  console.log(moduleGroupResponse);
  console.log(auditLogResponse);
  return (
    <ModuleGroupModal
      moduleGroup={moduleGroupResponse.data}
      auditLogs={auditLogResponse.data}
    />
  );
}
