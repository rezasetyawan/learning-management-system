"use client";
import { ColumnDef } from "@tanstack/react-table";
import { formatTimestampToShortString } from "@/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface AcademyApplication {
  id: string;
  userId: string;
  academyId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  message: string;
  createdAt: number;
  updatedAt: number;
  user: {
    username: string;
    fullname: string;
  };
  academy: {
    id: string;
    name: string;
  };
}

export const columns: ColumnDef<AcademyApplication>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    header: "No",
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
  },
  {
    header: "Nama Lengkap",
    accessorKey: "user.fullname",
  },
  {
    header: "Nama Kelas",
    accessorKey: "academy.name",
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat pada",
    cell: ({ row }) => {
      return formatTimestampToShortString(row.getValue("createdAt"));
    },
  },
  {
    header: "Diubah pada",
    accessorKey: "updatedAt",
    cell: ({ row }) => {
      return formatTimestampToShortString(row.getValue("updatedAt"));
    },
  },
  {
    header: "Status",
    accessorKey: "status",
  },
];
