/* eslint-disable @next/next/no-img-element */
"use client";

import { create } from "@/actions/cookies";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface UserProfile {
  id: string;
  fullname: string;
  username: string;
  role: string;
  createdAt: string;
  profile: {
    id: string;
    about: string;
    profileImageUrl: string;
  };
}
interface ProfileImageFormProps {
  userProfile: UserProfile;
  accessToken: string;
}

export default function ProfileForm({
  userProfile,
  accessToken,
}: ProfileImageFormProps) {
  const router = useRouter();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const formSchema = z.object({
    fullname: z.string().default(userProfile.fullname),
    username: z.string().default(userProfile.username),
    about: z.string().default(userProfile.profile.about),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: userProfile.username,
      fullname: userProfile.fullname,
      about: userProfile.profile.about,
    },
  });

  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      if (profileImageFile) {
        const formData = new FormData();
        formData.append("username", values.username);
        formData.append("fullname", values.fullname);
        formData.append("about", values.about);
        formData.append("profile-image", profileImageFile);

        axiosInstance
          .put("/profile", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
            timeout: 200000,
          })
          .then((result) => {
            if (result.status === 200 && result.data.status === "success") {
              console.log(result.data.data.accessToken);
              create(result.data.data.accessToken);
              toast.success("Profile berhasil diperbarui")
              router.refresh();
            }
          })
          .catch((error) => {
            if (error.response.status === 400) {
              toast.error(error.response.data.message, {
                duration: 5000,
              });
            }
          });
        return;
      }

      axiosInstance
        .put("/profile", values, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          timeout: 200000,
        })
        .then((result) => {
          if (result.status === 200 && result.data.status === "success") {
            console.log(result.data.data.accessToken);
            create(result.data.data.accessToken);
            toast.success("Profile berhasil diperbarui")
            router.refresh();
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            toast.error(error.response.data.message, {
              duration: 5000,
            });
          }
        });
      return;
    } catch (error) {
      toast.error("Profile gagal diperbarui")
    }
  };

  const handleFileChange = (event: ChangeEvent) => {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files) {
      if (eventTarget.files[0]) {
        setProfileImageFile(eventTarget.files[0]);
        return;
      }
    }
  };

  const { isSubmitting, isValid } = form.formState;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)}>
        <div className="mt-2">
          <div>
            <FormLabel className="font-medium mb-2">Foto Profil</FormLabel>
            {profileImageFile && (
              <img
                src={URL.createObjectURL(profileImageFile)}
                alt={userProfile.username}
                className="w-28 h-28 rounded-md object-cover"
              />
            )}
            {userProfile.profile.profileImageUrl && !profileImageFile ? (
              <img
                src={userProfile.profile.profileImageUrl}
                alt={userProfile.username}
                className="w-28 h-28 rounded-md object-cover"
              />
            ) : null}
          </div>

          <div className="self-end mt-2">
            <Button size="sm" className="mb-2" type="button">
              <label>
                <input
                  type="file"
                  className="hidden"
                  onChange={(event: ChangeEvent) => handleFileChange(event)}
                />
                Pilih Foto
              </label>
            </Button>
            <p className="text-xs">
              Gambar Profile Anda sebaiknya memiliki rasio 1:1
            </p>
          </div>
        </div>
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel className="font-medium">Nama Lengkap</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  {...field}
                  required
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel className="font-medium">Username</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  {...field}
                  required
                  type="text"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem className="mt-2">
              <FormLabel className="font-medium">Tentang saya</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  {...field}
                  required
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-2 flex justify-end">
          <Button type="submit" size="sm" disabled={!isValid || isSubmitting}>
            Simpan
          </Button>
        </div>
      </form>
    </Form>
  );
}
