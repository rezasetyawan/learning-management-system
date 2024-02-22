"use client";

import { Activity } from "@/components/audit/activity";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
  const params = useParams<{ academyId: string; }>();
  const searchParams = useSearchParams();
  const academyName = searchParams.get("academyName") || "-";
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
              {academyName}
              <Link href={`/admin/academies/${params.academyId}`}>
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
