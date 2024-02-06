"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
}

interface ReplyFormProps {
  user: User;
  accessToken: string;
}

export default function ReplyForm({ user, accessToken }: ReplyFormProps) {
  const [body, setBody] = useState("");
  const params = useParams<{ academyId: string; discussionId: string }>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmitHandler = async (event: FormEvent) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const timestamp = Date.now().toString();
      const payload = {
        discussionId: params.discussionId,
        body,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      await axiosInstance.post(
        `/module-discussions/${params.discussionId}/replies`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Balasan berhasil ditambahkan");
    } catch (error) {
      toast.error("Gagal menambahkan balasan");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={onSubmitHandler}>
      <h3>{user.fullname}</h3>
      <Textarea
        rows={5}
        value={body}
        onChange={(event: React.FormEvent<HTMLTextAreaElement>) =>
          setBody(event.currentTarget.value)
        }
        placeholder="Type something"
      />
      <div className="flex justify-end items-center">
        <Button variant="outline" type="button">
          Batal
        </Button>
        <Button type="submit" disabled={isLoading}>Balas</Button>
      </div>
    </form>
  );
}
