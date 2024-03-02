"use client";
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
import Link from "next/link";

export default function NotLoginAlert() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Belajar Sekarang</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Pemberitahuan untuk login</AlertDialogTitle>
          <AlertDialogDescription>
            Maaf, Anda belum melakukan login, Anda perlu login untuk mengakses
            kelas ini. Apakah anda ingin login terlebih dahulu?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Kembali</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link href={"/login"}>Ya</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
