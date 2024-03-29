"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
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

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

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

  console.log(rowSelection);
  const handleDataDeletion = async () => {
    try {
      setIsLoading(true);
      const dataSelected: { [key: string]: boolean } = rowSelection;
      const ids: string[] = [];
      for (const key in dataSelected) {
        // @ts-ignore
        ids.push(data[key].id);
      }

        const deletionPromises = ids.map((id) =>
          axiosInstance.delete(
            `/academies/${id}`,

            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
        );

        await Promise.all(deletionPromises);
      toast.success("Kelas berhasil dihapus");
      router.refresh();
    } catch (error) {
      toast.error("Kelas gagal dihapus");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDataRestoration = async () => {
    try {
      setIsLoading(true);
      const timestamp = Date.now().toString();
      const dataSelected: { [key: string]: boolean } = rowSelection;
      const ids: string[] = [];
      for (const key in dataSelected) {
        // @ts-ignore
        ids.push(data[key].id);
      }

        const restorationPromises = ids.map((id) =>
          axiosInstance.patch(
            `/academies/${id}/`,
            { isDeleted: false, updatedAt: timestamp },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
        );

        await Promise.all(restorationPromises);
      toast.success("Kelas berhasil dipulihkan");
      router.refresh();
    } catch (error) {
      toast.error("Kelas gagal dipulihkan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex items-center py-4">
        <Input
          placeholder="Cari kelas yang telah dihapus"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
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
                  Kelas tidak ditemukan
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
                Hapus
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah Anda benar-benar yakin?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Hal ini tidak bisa diundur. Ini akan menghapus data yang telah
                  dipilih secara permanen dari server
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    size={"sm"}
                    variant="destructive"
                    disabled={isLoading}
                    onClick={handleDataDeletion}
                  >
                    Lanjut
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button disabled variant={"destructive"} size={"sm"}>
            Hapus
          </Button>
        )}
        {table.getRowModel().rows?.length ? (
          <Button
            size={"sm"}
            onClick={handleDataRestoration}
            disabled={Object.keys(rowSelection).length < 1 || isLoading}
          >
            Pulihkan
          </Button>
        ) : (
          <Button disabled size={"sm"}>
            Pulihkan
          </Button>
        )}
      </div>
    </div>
  );
}
