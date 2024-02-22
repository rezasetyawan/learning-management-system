"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";

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
      toast.success("Konten berhasil disimpan");
      toggleEdit();
    } catch {
      toast.error("Gagal menyimpan konten");
    }
  };

  return (
    <div
      className={`mt-6 border rounded-md p-4 ${
        isEditing ? "bg-white" : "bg-white-100"
      }`}
    >
      <div className="font-medium flex items-center justify-between">
        Konten Modul
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
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </div>
  );
};
