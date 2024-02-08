"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
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

interface QuestionAmountsProps {
  initialData: {
    questionAmounts: number;
  };
  moduleId: string;
  totalQuestions: number;
  accessToken: string;
}

const formSchema = z.object({
  questionAmounts: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().gte(3, "Minimun question amounts is 3")
  ),
});

export default function QuestionAmounts({
  initialData,
  moduleId,
  totalQuestions,
  accessToken,
}: QuestionAmountsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [questionAmounts, setQuestionAmounts] = useState(
    initialData.questionAmounts
  );

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axiosInstance.patch(
        `/academies/modules/${moduleId}/quizz`,
        {
          questionAmounts: values.questionAmounts,
          updatedAt: Date.now().toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setQuestionAmounts(values.questionAmounts);
      toast.success("Quizz questionAmounts updated");
      toggleEdit();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="border bg-white rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Quizz question amounts
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
      {!isEditing && (
        <>
          <p className="text-sm mt-2">{questionAmounts} questions</p>
          <p className="text-xs text-muted-foreground mt-2">
            {totalQuestions} questions in this module
          </p>
        </>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="questionAmounts"
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
}
