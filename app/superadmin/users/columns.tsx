"use client";
import { ColumnDef } from "@tanstack/react-table";
import { formatTimestampToShortString } from "@/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  role: "user" | "admin" | "superadmin";
  createdAt: string;
  updatedAt: string;
}

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "fullname",
  },
  {
    header: "Username",
    accessorKey: "username",
  },
  {
    header: "Email",
    accessorKey: "email",
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
    header: "Role pengguna",
    accessorKey: "role",
  },
  {
    accessorKey: "username",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Link href={`/superadmin/users/${row.getValue("username")}`}>
          <Button variant="outline" size="sm">
            Detail
          </Button>
        </Link>
      </div>
    ),
  },
];
