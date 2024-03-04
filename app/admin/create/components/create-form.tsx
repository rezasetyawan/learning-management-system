"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Name is required",
  }),
});

interface CreateFormProps {
  accessToken: string;
}

export default function CreateForm({ accessToken }: CreateFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const timestamp = Date.now().toString();
      const response = await axiosInstance.post(
        "/academies",
        {
          ...values,
          createdAt: timestamp,
          updatedAt: timestamp,
          description: "",
          isPublished: false,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      router.push(`/admin/academies/${response.data.data.academy_id}`);
      console.log(response);
      toast.success("Academy created");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-semibold">Nama kelas</h1>
        <p className="text-sm text-slate-600">
          Apa nama kelas yang ingin Anda buat? Anda juga bisa menggantinya nanti
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama kelas</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/admin/academies">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
