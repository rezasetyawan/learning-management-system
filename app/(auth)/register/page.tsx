"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormEvent, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { create } from "@/actions/cookies";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  fullname: z.string(),
  username: z.string(),
  email: z.string().email("Tolong masukan email yang valid").default(""),
  password: z.string().min(8).default(""),
});

export default function Register() {
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
        .post("/auth/register", values)
        .then((result) => {
          if (result.status === 200 && result.data.status === "success") {
            create(result.data.access_token);
            router.push("/admin");
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            toast.error(error.response.data.message, {
              duration: 5000,
            });
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
        <h1 className="text-2xl font-bold mb-10">Sign Up</h1>
        <Form {...form}>
          <form
            className=" min-w-[400px] max-w-lg"
            onSubmit={form.handleSubmit(onSubmitHandler)}
          >
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder=""
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
                <FormItem className="mt-1">
                  <FormLabel className="font-medium">Username</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder=""
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
              name="email"
              render={({ field }) => (
                <FormItem className="mt-1">
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
                <FormItem className="mt-1">
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
              Sudah punya akun?{" "}
              <Link
                href={"/login"}
                className="text-blue-700 font-semibold text-left"
              >
                Login terlebih dahulu
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </>
  );
}
