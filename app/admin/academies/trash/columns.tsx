"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatTimestampToShortString } from "@/utils";

export type DeletedAcademy = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  coverImageUrl: string;
  isPublished: boolean;
  deletedAt: string;
  deletedBy: string;
};

export const columns: ColumnDef<DeletedAcademy>[] = [
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
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "name",
    header: "Nama Kelas",
  },
  {
    accessorKey: "deletedAt",
    header: "Waktu dihapus",
    cell: ({ row }) => {
      return formatTimestampToShortString(row.getValue("deletedAt"));
    },
  },
  {
    accessorKey: "deletedBy",
    header: "Dihapus oleh",
  },
];
