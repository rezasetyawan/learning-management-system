"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { create } from "@/actions/cookies";
import { z } from "zod";
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
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Tolong masukan email yang valid").default(""),
  password: z.string().min(8).default(""),
});

export default function Login() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((current) => !current);
  };
  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    try {
      axiosInstance
        .post("/auth/login", values)
        .then((result) => {
          if (result.status === 201 && result.data.status === "success") {
            create(result.data.access_token);
            router.push("/");
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            toast.error(
              "Gagal untuk login, pastikan email dan password anda benar",
              {
                duration: 5000,
              }
            );
          }

          if (error.response.status === 404) {
            toast.error(
              "Pengguna tidak ditemukan, pastikan anda sudah melakukan registrasi",
              {
                duration: 5000,
              }
            );
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const { isSubmitting, isValid } = form.formState;
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex flex-col justify-center items-center h-svh">
        <h1 className="text-2xl font-bold mb-10">Sign In</h1>
        <Form {...form}>
          <form
            className=" min-w-[400px] max-w-lg"
            onSubmit={form.handleSubmit(onSubmitHandler)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Email</FormLabel>
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
                <FormItem className="mt-4">
                  <FormLabel className="font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        disabled={isSubmitting}
                        placeholder=""
                        {...field}
                        required
                        type={showPassword ? "text" : "password"}
                        className="w-full"
                        minLength={8}
                      />
                      <button
                        className="absolute top-[28%] right-4"
                        onClick={togglePasswordVisibility}
                        type="button"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 stroke-slate-400" />
                        ) : (
                          <Eye className="w-4 h-4 stroke-slate-400" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="mt-4 w-full"
              type={"submit"}
              disabled={isSubmitting || !isValid}
            >
              Submit
            </Button>
            <p className="text-sm mt-2">
              Belum punya akun?{" "}
              <Link
                href={"/register"}
                className="text-blue-700 font-semibold text-left"
              >
                Buat akun terlebih dahulu
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </>
  );
}
