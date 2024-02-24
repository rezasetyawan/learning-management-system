"use client";

import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect, useState } from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { create, deleteCookies } from "@/actions/cookies";
import toast from "react-hot-toast";

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
/* eslint-disable @next/next/no-img-element */
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
              console.log(result.data.data.accessToken)
              create(result.data.data.accessToken);
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
            console.log(result.data.data.accessToken)
            create(result.data.data.accessToken);
            router.refresh()
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
      console.log(error);
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
        <div className="flex gap-2">
          <div>
            <p className="font-medium mb-2">Foto Profil</p>
            {profileImageFile && (
              <img
                src={URL.createObjectURL(profileImageFile)}
                alt={userProfile.username}
              />
            )}
            {userProfile.profile.profileImageUrl && !profileImageFile ? (
              <img
                src={userProfile.profile.profileImageUrl}
                alt={userProfile.username}
              />
            ) : null}
          </div>

          <div className="self-end">
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
            <FormItem>
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
            <FormItem>
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
            <FormItem>
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
        <Button type="submit" size="sm" disabled={!isValid || isSubmitting}>
          Simpan
        </Button>
      </form>
    </Form>
  );
}
