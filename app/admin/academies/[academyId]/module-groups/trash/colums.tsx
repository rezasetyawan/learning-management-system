"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatTimestampToShortString } from "@/utils";

export type DeletedModuleGroup = {
  id: string;
  name: string;
  academyId: string;
  deletedAt: string;
  deletedBy: string;
};

export const columns: ColumnDef<DeletedModuleGroup>[] = [
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
    header: "Name",
  },
  {
    accessorKey: "deletedAt",
    header: "Deleted At",
    cell: ({ row }) => {
      return formatTimestampToShortString(row.getValue("deletedAt"));
    },
  },
  {
    accessorKey: "deletedBy",
    header: "Deleted By",
  },
];
