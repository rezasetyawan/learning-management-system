"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatTimestampToShortString } from "@/utils";
import { Button } from "@/components/ui/button";

interface UserSubmission {
  id: string;
  createdAt: string;
  note: string;
  academyId: string;
  moduleId: string;
  fileUrl: string;
  status: "PENDING" | "REVIEW" | "REVIEWED";
  user: {
    fullname: string;
  };
  module: {
    name: string;
    id: string;
  };
}

export const columns: ColumnDef<UserSubmission>[] = [
  {
    header: "No",
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
  },
  {
    header: "Dikirim oleh",
    accessorKey: "user.fullname",
  },
  {
    header: "Modul",
    accessorKey: "module.name",
  },
  {
    accessorKey: "createdAt",
    header: "Dikirim pada",
    cell: ({ row }) => {
      return formatTimestampToShortString(row.getValue("createdAt"));
    },
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm">
          Detail
        </Button>
        <Button size="sm">Review</Button>
      </div>
    ),
  },
];
