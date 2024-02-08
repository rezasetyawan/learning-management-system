"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { Preview } from "@/components/preview";
import Editor from "@/components/editor";
import { axiosInstance } from "@/lib/axios";

interface ModuleContentFormProps {
  initialData: {
    content: string;
  };
  academyId: string;
  moduleGroupId: string;
  moduleId: string;
  accessToken: string;
}

export const ModuleContentForm = ({
  initialData,
  academyId,
  moduleGroupId,
  moduleId,
  accessToken,
}: ModuleContentFormProps) => {
  let content = initialData.content;
  const setContent = (value: string) => {
    content = value;
  };
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (event: FormEvent) => {
    try {
      event.preventDefault();
      await axiosInstance.patch(
        `/academies/${academyId}/module-groups/${moduleGroupId}/modules/${moduleId}`,
        {
          content: content,
          updatedAt: Date.now().toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Module content updated");
      toggleEdit();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div
      className={`mt-6 border rounded-md p-4 ${
        isEditing ? "bg-white" : "bg-white-100"
      }`}
    >
      <div className="font-medium flex items-center justify-between">
        Module content
      </div>
      <form className="mt-4" onSubmit={onSubmit}>
        <Editor
          value={content}
          setContent={setContent}
          academyId={academyId}
          moduleGroupId={moduleGroupId}
          moduleId={moduleId}
        />

        <div className="flex items-center justify-end gap-x-2 mt-4">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};
