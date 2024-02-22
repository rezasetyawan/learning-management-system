"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatTimestampToShortString } from "@/utils";

interface DeletedModule {
  id: string;
  name: string;
  type: string;
  deletedAt: string;
  deletedBy: string;
  moduleGroupId: string;
  moduleGroupName: string;
}

export const columns: ColumnDef<DeletedModule>[] = [
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
    accessorKey: "type",
    header: "Module Type",
  },
  {
    accessorKey: "moduleGroupName",
    header: "Module Group",
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
