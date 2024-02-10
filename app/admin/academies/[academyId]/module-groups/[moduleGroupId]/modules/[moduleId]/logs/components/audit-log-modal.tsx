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
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

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
  auditLogs: AuditLog[];
}

export default function AuditLogModal({ auditLogs }: ModuleGroupModalProps) {
  const params = useParams<{ academyId: string; moduleGroupId: string; moduleId:string }>();
  const searchParams = useSearchParams();
  const moduleName = searchParams.get("moduleName") || "-";
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
              {moduleName}
              <Link href={`/admin/academies/${params.academyId}/module-groups/${params.moduleGroupId}/modules/${params.moduleId}`}>
                <Button variant="ghost">
                  <X />
                </Button>
              </Link>
            </AlertDialogTitle>
            <Activity items={auditLogs} />
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
