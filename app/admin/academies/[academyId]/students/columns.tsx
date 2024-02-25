"use client";
import { formatTimestampToShortString } from "@/utils";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
export interface AcademyStudent {
  fullname: string;
  username: string;
  userProgressPercentage: number;
  lastActivity: string;
  academyName: string;
  academyId: string;
}

export const columns: ColumnDef<AcademyStudent>[] = [
  {
    header: "No",
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
  },
  {
    accessorKey: "academyName",
    header: "Nama Kelas",
    // cell: ({ row }) => {
    //   return (
    //     <Link href={`/admin/academies/${row.getValue("academyId")}`}>
    //       {row.getValue("academyName")}
    //     </Link>
    //   );
    // },
  },
  {
    accessorKey: "fullname",
    header: "Nama Lengkap",
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => {
      return (
        <Link href={`/superadmin/users/${row.getValue("username")}`}>
          {row.getValue("username")}
        </Link>
      );
    },
  },
  {
    accessorKey: "userProgressPercentage",
    header: "Progress User",
    cell: ({ row }) => {
      return <span>{row.getValue("userProgressPercentage")}%</span>;
    },
  },
  {
    accessorKey: "lastActivity",
    header: "Waktu Aktivitas Terakhir",
    cell: ({ row }) => {
      return formatTimestampToShortString(row.getValue("lastActivity"));
    },
  },
];
