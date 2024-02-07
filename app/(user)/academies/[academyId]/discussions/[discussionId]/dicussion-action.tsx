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

interface DiscussionActionProps {
  discussionId: string;
  accessToken: string;
}
export default function DiscussionAction({
  discussionId,
  accessToken,
}: DiscussionActionProps) {
  const router = useRouter();
  const onDeleteHandler = async () => {
    try {
      await axiosInstance.delete(`/module-discussions/${discussionId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      router.back();
      toast.success("Diskusi berhasil dihapus");
    } catch (error) {
      toast.error("Diskusi gagal dihapus");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive" size="sm">
          Hapus
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan menghapus diskusi ini secara permanen
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
