import { cookies } from "next/headers";
import AuditLogModal from "./components/audit-log-modal";

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

export default async function AcademyAuditLogsPage({
  params,
}: {
  params: { academyId: string;};
}) {
  const cookieStore = cookies();

  const accessToken = cookieStore.get("accessToken")?.value || "";

  const auditLogsData = await fetch(
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) +
      `/audit-log?entityType=academy&entityId=${params.academyId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }
  );

  const auditLogResponse = (await auditLogsData.json()) as AuditLogsResponse;

  return <AuditLogModal auditLogs={auditLogResponse.data} />;
}
