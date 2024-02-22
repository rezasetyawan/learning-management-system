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
export const generateLogMessage = (log: AuditLog) => {
  const { actionType, entityName, entityType } = log;

  switch (actionType) {
    case "CREATE":
      return `membuat ${entityType.toLowerCase()} "${entityName}"`;
    case "UPDATE":
      return `mengubah ${entityType.toLowerCase()} "${entityName}"`;
    case "DELETE":
      return `menghapus ${entityType.toLowerCase()} "${entityName}"`;
    default:
      return `"tidak diketahui" ${entityType.toLowerCase()} "${entityName}"`;
  };
};