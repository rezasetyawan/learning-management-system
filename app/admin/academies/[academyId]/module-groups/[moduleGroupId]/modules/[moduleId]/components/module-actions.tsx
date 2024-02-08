"use client";

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
  accessToken: string;
}

export const Actions = ({
  academyId,
  isPublished,
  moduleGroupId,
  moduleId,
  accessToken,
}: ActionsProps) => {
  const router = useRouter();
  const [currentIsPublished, setCurrentIsPublished] = useState(isPublished);
  const [isLoading, setIsLoading] = useState(false);

  const toggleIsPublished = () => {
    setCurrentIsPublished((current) => !current);
  };

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (currentIsPublished) {
        await axiosInstance.patch(
          `/academies/${academyId}/module-groups/${moduleGroupId}/modules/${moduleId}`,
          {
            isPublished: false,
            updatedAt: Date.now().toString(),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toggleIsPublished();
        toast.success("Module unpublished");
      } else {
        await axiosInstance.patch(
          `/academies/${academyId}/module-groups/${moduleGroupId}/modules/${moduleId}`,
          {
            isPublished: true,
            updatedAt: Date.now().toString(),
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toggleIsPublished();
        toast.success("Module published");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axiosInstance.patch(
        `/academies/${academyId}/module-groups/${moduleGroupId}/modules/${moduleId}`,
        {
          isDeleted: true,
          deletedAt: Date.now().toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Module deleted");
      router.push(`/admin/academies/${academyId}`);
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
        {currentIsPublished ? "Unpublish" : "Publish"}
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
