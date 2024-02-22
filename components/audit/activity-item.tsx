/* eslint-disable @next/next/no-img-element */
import { generateLogMessage } from "@/lib/generate-log-message";
import { formatTimestampToShortString } from "@/utils";

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

interface ActivityItemProps {
  data: AuditLog;
}

export const ActivityItem = ({ data }: ActivityItemProps) => {
  return (
    <li className="flex items-center gap-x-2">
      <div className="w-8 h-8 overflow-hidden rounded-full lg:w-10 lg:h-10">
        <img
          src={`https://ui-avatars.com/api/?name=${data.user.fullname.replaceAll(
            " ",
            " + "
          )}`}
          alt={data.user.fullname}
        />
      </div>
      <div className="flex flex-col space-y-0.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-neutral-700">
            {data.user.fullname}
          </span>{" "}
          {generateLogMessage(data)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatTimestampToShortString(data.createdAt)}
        </p>
      </div>
    </li>
  );
};
