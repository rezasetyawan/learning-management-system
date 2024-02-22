"use client";

import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface DiscussionStatusAction {
  isSolved: boolean;
  disccussionId: string;
  accessToken: string;
}
export default function DiscussionStatusAction({
  isSolved,
  disccussionId,
  accessToken,
}: DiscussionStatusAction) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const actionHandler = async () => {
    try {
      setIsLoading(true);
      await axiosInstance.patch(
        `/module-discussions/${disccussionId}`,
        {
          isSolved: !isSolved,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success(
        `${
          isSolved
            ? "Diskusi telah ditandai sebagai belum selesai"
            : "Diskusi telah ditandai sebagai sudah selesai"
        }`
      );
      router.refresh()
    } catch (error) {
      toast.error("Gagal mengupdate status diskusi");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className={`bg-slate-100 p-3 rounded-[2px] border ${
        isSolved ? "border-gray-300" : "border-blue-700"
      }`}
    >
      <div className="flex items-center gap-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-blue-500"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8ZM10 11C10 10.4477 10.4477 10 11 10H12C12.5523 10 13 10.4477 13 11V15C13.5523 15 14 15.4477 14 16C14 16.5523 13.5523 17 13 17H12C11.4477 17 11 16.5523 11 16V12C10.4477 12 10 11.5523 10 11Z"
            fill="currentColor"
          ></path>
        </svg>
        <p className="text-sm font-semibold">Tandai Diskusi</p>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        {isSolved
          ? "Apakah diskusi ini belum selesai? Silahkan tandai diskusi ini sebagai diskusi yang belum selesai"
          : "Apakah diskusi ini sudah selesai? Silahkan tandai diskusi ini sebagai diskusi yang sudah selesai"}
      </p>
      <div className="flex justify-end mt-3">
        {isSolved ? (
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={actionHandler}
          >
            Tandai belum selesai
          </Button>
        ) : (
          <Button size="sm" disabled={isLoading} onClick={actionHandler}>
            Tandai sudah selesai
          </Button>
        )}
      </div>
    </div>
  );
}
