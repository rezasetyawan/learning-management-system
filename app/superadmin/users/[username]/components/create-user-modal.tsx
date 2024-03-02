/* eslint-disable react/no-unescaped-entities */
"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateUserProps {
  accessToken: string;
}

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username minimal memiliki 3 karakter")
    .default(""),
  email: z.string().email("Tolong masukan email yang valid").default(""),
  password: z.string().min(8).default(""),
  fullname: z.string().default(""),
  role: z.enum(["user", "admin", "superadmin"]).default("user"),
});

const roles = [
  {
    label: "USER",
    value: "user",
  },
  {
    label: "ADMIN",
    value: "admin",
  },
  {
    label: "SUPERADMIN",
    value: "superadmin",
  },
];

export default function CreateUserModal({ accessToken }: CreateUserProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const timestamp = Date.now().toString();
      const payload = {
        ...values,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await axiosInstance.post("/users", payload, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOpenDialog(false);
      toast.success("Pengguna berhasil ditambahkan");
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Gagal menambahkan pengguna");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={setOpenDialog} open={openDialog}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpenDialog(true)} size={"sm"}>Tambah user</Button>
      </DialogTrigger>
      <DialogContent className="xl:max-w-3xl z-[1001]">
        <DialogHeader>
          <DialogTitle>Tambahkan User</DialogTitle>
        </DialogHeader>
        <div className="mt-2.5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitHandler)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder=""
                        {...field}
                        required
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
                    <FormLabel className="">Username</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder=""
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder=""
                        {...field}
                        required
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Password</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder=""
                        type="password"
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Role pengguna</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      required
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[1500]">
                        {roles.map((value, index) => (
                          <SelectItem value={value.value} key={index}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-end gap-x-2">
                <Button
                  disabled={!isValid || isSubmitting}
                  type="submit"
                  size="sm"
                >
                  Tambah
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
