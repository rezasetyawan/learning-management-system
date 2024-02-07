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
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface ReplyActionProps {
  discussionId: string;
  accessToken: string;
  replyId: string;
}
export default function ReplyAction({
  discussionId,
  accessToken,
  replyId,
}: ReplyActionProps) {
  const router = useRouter();
  const onDeleteHandler = async () => {
    try {
      await axiosInstance.delete(
        `/module-discussions/${discussionId}/replies/${replyId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      router.refresh();
      toast.success("Balasan berhasil dihapus");
    } catch (error) {
      toast.error("Balasan gagal dihapus");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          type="button"
          variant="ghost"
          className="text-sm flex gap-1 items-center font-medium p-1"
        >
          <Trash className="stroke-[#3F3F46] w-4 h-4" />
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan menghapus balasan ini secara permanen
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteHandler}>Hapus</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
