"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { axiosInstance } from "@/lib/axios";
import { formatTimestamp } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  reviewerNote: z.string().min(3, {
    message: "Catatan minimal memilik 500 karater (± 100 kata)",
  }),
  isPassed: z.boolean(),
  score: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z
      .number()
      .min(0, {
        message: "Nilai tidak boleh ",
      })
      .max(100, {
        message: "Maksimal nilai adalah 100",
      })
  ),
});

interface Reviewer {
  fullname: string;
  username: string;
}

interface Result {
  id: string;
  reviewer: Reviewer;
  createdAt: string;
  reviewerNote: string;
  score: number;
  isPassed: boolean;
  submissionId: string;
}

interface Module {
  name: string;
  id: string;
  group: {
    id: string;
  };
}

interface Academy {
  name: string;
  id: string;
}

interface User {
  fullname: string;
  username: string;
}

interface UserSubmissionDetail {
  id: string;
  userId: string;
  createdAt: string;
  note: string;
  academyId: string;
  moduleId: string;
  fileUrl: string;
  status: string;
  result: Result[];
  module: Module;
  academy: Academy;
  user: User;
}

interface ReviewFormProps {
  accessToken: string;
  submission: UserSubmissionDetail;
}

export default function ReviewForm({
  accessToken,
  submission,
}: ReviewFormProps) {
  const router = useRouter();
  const params = useParams<{ submissionId: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [payload, setPayload] = useState({
    reviewerNote: "",
    isPassed: false,
    score: 0,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reviewerNote: `kerja bagus ${submission.user.fullname}`,
      isPassed: submission.fileUrl ? true : false,
      score: submission.fileUrl ? 100 : 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      setPayload(values);
    } catch {}
  };

  const onSaveButtonClickHandler = async () => {
    try {
      setIsLoading(true);

      await axiosInstance.post(
        `/user-submissions/${params.submissionId}/result`,
        {
          ...payload,
          createdAt: Date.now().toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      await axiosInstance.patch(
        `/user-submissions/${params.submissionId}`,
        {
          status: "REVIEWED",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Submission berhasil direview");
    } catch {
      toast.error("Submission gagal direview");
    } finally {
      setIsLoading(false);
    }
  };
  const { isValid } = form.formState;
  return (
    <Form {...form}>
      <form className="mt-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="reviewerNote"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isLoading}
                  placeholder="Tulis catatan untuk pengirim disini"
                  required
                  rows={5}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        ></FormField>

        <FormField
          control={form.control}
          name="score"
          render={({ field }) => (
            <FormItem className="mb-2">
              <FormLabel>Nilai</FormLabel>
              <FormControl>
                <Input disabled={isLoading} type="number" {...field} required />
              </FormControl>
            </FormItem>
          )}
        ></FormField>
        <FormField
          control={form.control}
          name="isPassed"
          render={({ field }) => (
            <div>
              <FormItem className="flex gap-2 space-y-0 mt-4">
                <FormControl>
                  <Checkbox
                    disabled={isLoading}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    required
                    className="p-0 m-0"
                  />
                </FormControl>
                <FormLabel className="">Lulus</FormLabel>
              </FormItem>
              <p className="text-xs text-muted-foreground mt-2">
                *Syarat minimal nilai untuk lulus adalah 80
              </p>
            </div>
          )}
        ></FormField>
        <div className="flex justify-end items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" type="submit">
                Simpan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Apakah anda yakin untuk mengirim data dibawah ini?
                </AlertDialogTitle>
                <ScrollArea className="h-[300px] rounded-md border p-4">
                  <div className="text-sm">
                    <div>
                      <div className="flex gap-2">
                        <span className="w-24 font-semibold text-slate-500">
                          Dikirim oleh
                        </span>
                        <span>{submission.user.fullname}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-24 font-semibold text-slate-500">
                          Nama kelas
                        </span>
                        <span>
                          <Link
                            href={`/admin/academies/${submission.academyId}`}
                          >
                            {submission.academy.name}
                          </Link>
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-24 font-semibold text-slate-500">
                          Nama modul
                        </span>
                        <span>
                          <Link
                            href={`/admin/academies/${submission.academyId}/module-groups/${submission.module.group.id}/modules/${submission.moduleId}`}
                          >
                            {submission.module.name}
                          </Link>
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <span className="w-24 font-semibold text-slate-500">
                          Id Submission
                        </span>
                        <span>{submission.id}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-24 font-semibold text-slate-500">
                          Dikirim pada
                        </span>
                        <span>{formatTimestamp(submission.createdAt)}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-24 font-semibold text-slate-500">
                          Status
                        </span>
                        <span>{submission.status}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <span className="w-24 font-semibold text-slate-500">
                          Nilai
                        </span>
                        <span>{payload.score}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-24 font-semibold text-slate-500">
                          Status kelulusan
                        </span>
                        <span>
                          {payload.isPassed ? "LULUS" : "TIDAK LULUS"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-24 font-semibold text-slate-500">
                          Catatan dari reviewer
                        </span>
                        <p className="line-clamp-3">{payload.reviewerNote}</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
                <AlertDialogDescription>
                  Pastikan data yang sudah benar sebelum menekan tombol kirim
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button onClick={onSaveButtonClickHandler}>Simpan</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Form>
  );
}
