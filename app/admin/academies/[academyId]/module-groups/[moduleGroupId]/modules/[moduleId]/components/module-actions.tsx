"use client";

import axios from "axios";
import { Trash } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/modals/confirmation-modal";
import { axiosInstance } from "@/lib/axios";

interface ActionsProps {
  academyId: string;
  isPublished: boolean;
  moduleGroupId: string;
  moduleId: string;
  //   disabled: boolean
}

export const Actions = ({
  academyId,
  isPublished,
  moduleGroupId,
  moduleId,
}: ActionsProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axiosInstance.patch(
          `/academies/${academyId}/module-groups/${moduleGroupId}/modules/${moduleId}`,
          {
            isPublished: false,
            updatedAt: Date.now().toString(),
          }
        );
        toast.success("Academy unpublished");
      } else {
        await axiosInstance.patch(
          `/academies/${academyId}/module-groups/${moduleGroupId}/modules/${moduleId}`,
          {
            isPublished: true,
            updatedAt: Date.now().toString(),
          }
        );
        toast.success("Academy published");
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      //   await axios.delete(`/api/courses/${academyId}`);

      toast.success("Academy deleted");
      router.refresh();
      //   router.push(`/teacher/courses`);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        // disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <ConfirmModal
        onConfirm={onDelete}
        message="Are you want to delete this module?"
      >
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
