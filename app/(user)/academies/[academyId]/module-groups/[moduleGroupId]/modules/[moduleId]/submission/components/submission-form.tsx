"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import { File } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

interface SubmissionFormProps {
  accessToken: string;
  moduleUrl: string;
}
export default function SubmissionForm({
  accessToken,
  moduleUrl,
}: SubmissionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const params = useParams<{
    academyId: string;
    moduleGroupId: string;
    moduleId: string;
  }>();
  const [note, setNote] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setSelectedFile(event.target.files[0]);
  };
  const formatFileSize = (bytes: number): string => {
    const MB = 1024 * 1024; // 1 MB is equal to 1024 KB
    if (bytes < MB) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / MB).toFixed(2)} MB`;
    }
  };

  const onSubmitHandler = async (event: FormEvent) => {
    try {
      event.preventDefault();
      setIsLoading(true)
      if (selectedFile) {
        const formData = new FormData();
        formData.append("submissionFile", selectedFile);
        formData.append("createdAt", Date.now().toString());
        formData.append("note", note);
        formData.append("moduleId", params.moduleId);
        formData.append("academyId", params.academyId);

        await axiosInstance.post("/user-submissions", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 30000,
        });
      }
      toast.success("Submission berhasil dikirim")
    } catch (error) {
        toast.error("Gagal mengirim submission")
    } finally {
        setIsLoading(false)
    }
  };
  return (
    <form onSubmit={onSubmitHandler}>
      <div className="flex flex-col items-center justify-center border border-dashed rounded-md">
        <label
          className={`flex flex-col items-center justify-center cursor-pointer`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {selectedFile ? (
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 stroke-slate-400" />
                <div className="text-sm text-gray-500">
                  <span>{selectedFile.name}</span> -{" "}
                  {formatFileSize(selectedFile.size)}
                </div>
              </div>
            ) : (
              <div>
                <File className="w-10 h-10 stroke-slate-400" />
              </div>
            )}
            <p className="underline text-sm mt-2">
              {selectedFile ? "Ganti berkas" : "Unggah berkas"}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleChange}
            required
          />
        </label>

        <ul className="list-disc text-sm">
          <li>
            Pastikan berkas telah sesuai dengan ketentuan tugas submission.
          </li>
          <li>
            Berkas yang tidak sesuai dengan ketentuan tugas submission
            berpotensi ditolak oleh Reviewer.
          </li>
        </ul>
      </div>
      <div className="mt-8">
        <Label className="text-slate-500 text-sm mb-4">Catatan</Label>
        <Textarea
          rows={5}
          value={note}
          onChange={(event: React.FormEvent<HTMLTextAreaElement>) =>
            setNote(event.currentTarget.value)
          }
          className="mt-3 resize-none"
        />
        <p className="mt-2 text-xs text-slate-500">
          Jika ada catatan khusus terkait submission yang Anda kirimkan, Anda
          dapat memasukkannya pada kolom di atas ini.
        </p>
      </div>
      <div className="flex items-center justify-end mt-4">
        <Link href={moduleUrl}>
          <Button variant="ghost" type="button">
            Batal
          </Button>
        </Link>
        <Button type="submit" disabled={!selectedFile || isLoading}>
          Lanjut
        </Button>
      </div>
    </form>
  );
}
