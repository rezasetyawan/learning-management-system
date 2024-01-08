/* eslint-disable @next/next/no-img-element */
"use client";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";

interface ImageFormProps {
  initialData: Academy;
  academyId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
});

export const ImageForm = ({ initialData, academyId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();
  const handleFileChange = (event: ChangeEvent) => {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files) {
      if (eventTarget.files[0]) {
        setImage(eventTarget.files[0]);
        return;
      }
    }
  };

  const onSubmit = async (event: FormEvent) => {
    try {
      event.preventDefault();
      if (image) {
        const formData = new FormData();
        formData.append("academyCoverPicture", image);
        formData.append("updatedAt", Date.now().toString());
        await axiosInstance.patch(`/academies/${academyId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000,
        });
        setImage(null);
        toast.success("Cover image updated");
        toggleEdit();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    console.log(image);
  }, [image]);

  console.log(initialData);
  const previewImageUrl = useMemo(() => {
    if (image) return URL.createObjectURL(image);
  }, [image]);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Academy cover image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.coverImageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && initialData.coverImageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.coverImageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={initialData.coverImageUrl}
            />
          </div>
        ))}
      {isEditing && (
        <form onSubmit={onSubmit}>
          <div className="flex items-center justify-center w-full relative">
            <label
              //   for="dropzone-file"
              className={`flex flex-col items-center justify-center w-full min-h-[16rem] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 ${
                image && "absolute inset-0 h-full border-0 hover:bg-transparent"
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className={`w-8 h-8 mb-4 text-gray-500 ${
                    image && "text-white"
                  }`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p
                  className={`mb-2 text-sm text-gray-500 ${
                    image && "text-white"
                  }`}
                >
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className={`text-xs text-gray-500 ${image && "text-white"}`}>
                  PNG, JPG or GIF
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                onChange={(event: ChangeEvent) => handleFileChange(event)}
              />
            </label>
            {image && (
              <img
                src={previewImageUrl}
                alt="image"
                className="inset-0 rounded-lg"
              />
            )}
          </div>

          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
          <Button type="submit" disabled={!image}>
            Save
          </Button>
        </form>
      )}
    </div>
  );
};
