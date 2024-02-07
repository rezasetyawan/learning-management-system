"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
}

interface EditReplyFormProps {
  user: User;
  accessToken: string;
  additionalFunction?: () => void;
  initialValue: string;
  replyId: string;
}

export default function EditReplyForm({
  user,
  accessToken,
  additionalFunction,
  initialValue,
  replyId,
}: EditReplyFormProps) {
  const [body, setBody] = useState(initialValue);
  const params = useParams<{ academyId: string; discussionId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmitHandler = async (event: FormEvent) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const timestamp = Date.now().toString();

      const payload = {
        discussionId: params.discussionId,
        body,
        updatedAt: timestamp
      }

      await axiosInstance.patch(
        `/module-discussions/${params.discussionId}/replies/${replyId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Balasan berhasil ditambahkan");
      if (additionalFunction !== undefined) {
        additionalFunction();
      }
      router.refresh();
    } catch (error) {
      toast.error("Gagal menambahkan balasan");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={onSubmitHandler}>
      <div className="flex gap-2 items-center">
        <div className="overflow-hidden rounded-[50%] w-5 h-5 flex justify-center lg:w-6 lg:h-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              fill="#d1d5db"
              d="M224 256a128 128 0 1 0 0-256 128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3 0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7 0-98.5-79.8-178.3-178.3-178.3h-91.4z"
            ></path>
          </svg>
        </div>
        <p className="font-semibold">{user.fullname}</p>
      </div>
      <Textarea
        rows={5}
        value={body}
        onChange={(event: React.FormEvent<HTMLTextAreaElement>) =>
          setBody(event.currentTarget.value)
        }
        placeholder="Type something"
        className="mt-3 resize-none"
      />
      <div className="flex justify-end items-center mt-3 gap-3">
        {additionalFunction && (
          <Button variant="ghost" type="button" onClick={additionalFunction}>
            Batal
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          Simpan
        </Button>
      </div>
    </form>
  );
}
