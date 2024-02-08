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
  toggleIsPublished: () => void;
  accessToken: string;
}

export const Actions = ({
  academyId,
  isPublished,
  toggleIsPublished,
  accessToken,
}: ActionsProps) => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      const updatedAt = Date.now().toString()
      if (isPublished) {
        await axiosInstance.patch(
          `/academies/${academyId}`,
          {
            isPublished: false,
            updatedAt
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toggleIsPublished();
        toast.success("Academy unpublished");
      } else {
        await axiosInstance.patch(
          `/academies/${academyId}`,
          {
            isPublished: true,
            updatedAt
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        toggleIsPublished();
        toast.success("Academy published");
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
      const updatedAt = Date.now().toString()
      await axiosInstance.patch(
        `/academies/${academyId}`,
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

      toast.success("Academy deleted");
      router.push("/admin/academies");
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
        message="Are you want to delete this academy?"
      >
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};
