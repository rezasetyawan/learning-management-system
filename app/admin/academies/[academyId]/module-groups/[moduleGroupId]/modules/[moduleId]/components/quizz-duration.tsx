"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { useForm } from "react-hook-form";

interface DurationFormProps {
  initialData: {
    duration: number;
  };
  moduleId: string;
}

const formSchema = z.object({
  duration: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().gte(300, "Minimun duration is 300 seconds")
  ),
});

const DurationForm = ({ initialData, moduleId }: DurationFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [duration, setDuration] = useState(initialData.duration);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axiosInstance.patch(`/academies/modules/${moduleId}/quizz`, {
        duration: values.duration,
        updatedAt: Date.now().toString(),
      });
      setDuration(values.duration);
      toast.success("Quizz duration updated");
      toggleEdit();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="border bg-white rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Quizz duration
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{duration}s</p>}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isSubmitting} type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isSubmitting || !isValid} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default DurationForm;
