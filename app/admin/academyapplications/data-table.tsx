"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
import { useParams, useRouter } from "next/navigation";
import React from "react";
import toast, { Toaster } from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  accessToken: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  accessToken,
}: DataTableProps<TData, TValue>) {
  const params = useParams<{ academyId: string }>();
  const [rowSelection, setRowSelection] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const router = useRouter();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      rowSelection,
      columnFilters,
    },
  });

  const handleDataRejection = async () => {
    try {
      setIsLoading(true);
      const dataSelected: { [key: string]: boolean } = rowSelection;
      const keys: string[] = [];
      for (const key in dataSelected) {
        // @ts-ignore
        keys.push(data[key].id);
      }

      const rejectionPromises = keys.map((key) =>
        axiosInstance.patch(
          `/academy-applications/${key}`,
          {
            status: "REJECTED",
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      );

      await Promise.all(rejectionPromises);
      toast.success("Berhasil menolak permintaan");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menolak permintaan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataAcception = async () => {
    try {
      setIsLoading(true);
      const dataSelected: { [key: string]: boolean } = rowSelection;
      const keys: string[] = [];
      for (const key in dataSelected) {
        // @ts-ignore
        keys.push(data[key].id);
      }

      const acceptionPromises = keys.map((key) =>
        axiosInstance.patch(
          `/academy-applications/${key}`,
          {
            status: "APPROVED",
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      );

      await Promise.all(acceptionPromises);
      toast.success("Berhasil menerima permintaan");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menerima permintaan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Data tidak ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {table.getRowModel().rows?.length ? (
          <AlertDialog>
            <AlertDialogTrigger
              asChild
              disabled={Object.keys(rowSelection).length < 1 || isLoading}
            >
              <Button variant="destructive" size={"sm"}>
                Tolak
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin akan menolak semua data yang telak Anda
                  pilih?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    size={"sm"}
                    variant="destructive"
                    disabled={isLoading}
                    onClick={handleDataRejection}
                  >
                    Lanjut
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button disabled variant={"destructive"} size={"sm"}>
            Tolak
          </Button>
        )}
        {table.getRowModel().rows?.length ? (
          <Button
            size={"sm"}
            onClick={handleDataAcception}
            disabled={Object.keys(rowSelection).length < 1 || isLoading}
          >
            Terima
          </Button>
        ) : (
          <Button disabled size={"sm"}>
            Terima
          </Button>
        )}
      </div>
    </div>
  );
}
