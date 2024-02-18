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
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function JoinRequestAlert({
  accessToken,
  academyId,
}: {
  accessToken: string;
  academyId: string;
}) {
  const router = useRouter();
  const requestToJoinAcademyHandler = async () => {
    try {
      await axiosInstance.post(
        "/academy-applications",
        {
          academyId: academyId,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      toast.success(
        "Permintaan Anda berhasil dikirim, silahkan tunggu kabar berikutnya"
      );
      router.refresh();
    } catch (error) {
      toast.error("Gagal mengirimkan permintaan bergabung ke kelas");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Belajar Sekarang</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Permintaan Bergabung ke Kelas</AlertDialogTitle>
          <AlertDialogDescription>
            Maaf, Anda belum tergabung di kelas ini, apakah Anda ingin
            mengajukan permintaan untuk bergabung ke kelas ini?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Kembali</AlertDialogCancel>
          <AlertDialogAction onClick={requestToJoinAcademyHandler}>
            Ajukan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
