"use client";
import { Button } from "@/components/ui/button";
import { formatTimestampToShortString } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

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
