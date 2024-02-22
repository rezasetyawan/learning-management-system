"use client";

import { Activity } from "@/components/audit/activity";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { formatTimestampToShortString } from "@/utils";
import { X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

interface ModuleGroupModalProps {
  moduleGroup: ModuleGroup;
  auditLogs: AuditLog[];
}

export default function ModuleGroupModal({
  moduleGroup,
  auditLogs,
}: ModuleGroupModalProps) {
  const params = useParams<{ academyId: string; moduleGroupId: string }>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);
  return (
    <div>
      <AlertDialog open={isOpen}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent className="xl:max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex justify-between items-center">
              {moduleGroup.name}
              <Link href={`/admin/academies/${params.academyId}`}>
                <Button variant="ghost">
                  <X />
                </Button>
              </Link>
            </AlertDialogTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Terakhir diubah :{" "}
              {formatTimestampToShortString(moduleGroup.updatedAt)}
            </p>
            <Activity items={auditLogs} />
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
