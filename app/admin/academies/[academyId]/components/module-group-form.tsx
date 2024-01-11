"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ModuleGroupList } from "./module-group-list";
import { axiosInstance } from "@/lib/axios";
import { ModuleGroup, createModuleGroup } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmModal } from "@/components/modals/confirmation-modal";

interface ModuleGroupFormProps {
  initialData: {
    moduleGroups: ModuleGroup[];
  };
  sortModuleGroups: (updateData: { id: string; order: number }[]) => void;
  addModuleGroups: (newModuleGroup: ModuleGroup) => void;
  updateModuleGroup: (
    newModuleGroup: ModuleGroup,
    moduleGroupId: string
  ) => void;
  deleteModuleGroup: (moduleGroupId:string) => void;
  academyId: string;
}

const formSchema = z.object({
  name: z.string().min(1),
  isPublished: z.boolean(),
});

const editFormSchema = z.object({
  name: z.string().min(1),
  isPublished: z.boolean(),
});

export const ModuleGroupForm = ({
  initialData,
  academyId,
  sortModuleGroups,
  addModuleGroups,
  updateModuleGroup,
  deleteModuleGroup
}: ModuleGroupFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditModuleGroup, setCurrentEditModuleGroup] =
    useState<ModuleGroup | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const toggleEdit = useCallback(() => {
    setIsEditing((current) => !current);
  }, []);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isPublished: false,
    },
  });
  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: "",
      isPublished: false,
    },
  });

  useEffect(() => {
    toggleEdit();
    if (currentEditModuleGroup) {
      editForm.setValue("name", currentEditModuleGroup.name);
      editForm.setValue("isPublished", currentEditModuleGroup.isPublished);
    }
  }, [currentEditModuleGroup, toggleEdit, editForm]);

  const { isSubmitting, isValid } = form.formState;
  const { isSubmitting: editIsSubmitting, isValid: editIsValid } =
    editForm.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const timestamp = Date.now().toString();
      const payload: createModuleGroup = {
        name: values.name,
        academyId: academyId,
        createdAt: timestamp,
        updatedAt: timestamp,
        order: initialData.moduleGroups.length + 1,
        isPublished: values.isPublished,
      };

      const response = await axiosInstance.post(
        `/academies/${academyId}/module-groups`,
        payload
      );

      addModuleGroups({
        id: response.data.moduleGroupId,
        name: payload.name,
        order: payload.order,
        modules: [],
        isPublished: payload.isPublished,
      });

      toast.success("New group module added");
      form.reset();
      toggleCreating();
      //   router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onSubmitEdit = async (values: z.infer<typeof editFormSchema>) => {
    if (!currentEditModuleGroup) return;

    const payload = {
      ...values,
      updatedAt: Date.now().toString(),
    };

    await axiosInstance.patch(
      `/academies/${academyId}/module-groups/${currentEditModuleGroup.id}`,
      payload
    );

    updateModuleGroup(
      {
        ...currentEditModuleGroup,
        ...values,
      },
      currentEditModuleGroup.id
    );

    toast.success("Module group updated");
    editForm.reset();
    toggleEdit();
  };
  const onReorder = async (updateData: { id: string; order: number }[]) => {
    try {
      setIsUpdating(true);
      updateData.forEach(async (data) => {
        await axiosInstance.patch(
          `/academies/${academyId}/module-groups/${data.id}`,
          {
            order: data.order,
          }
        );
      });
      sortModuleGroups(updateData);
      toast.success("Module Group reordered");
      //   router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onDelete = async (moduleGroupId: string) => {
    try {
      setIsLoading(true);
      await axiosInstance.patch(
        `/academies/${academyId}/module-groups/${moduleGroupId}`,
        {
          isDeleted: true,
        }
      );
      
      toast.success("Module group deleted");
      deleteModuleGroup(moduleGroupId)
      toggleEdit()
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Academy module groups
        {!isEditing && (
          <Button onClick={toggleCreating} variant="ghost">
            {isCreating ? (
              <>Cancel</>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add a module group
              </>
            )}
          </Button>
        )}
        {!isCreating && isEditing ? (
          <Button onClick={toggleEdit} variant="ghost">
            Cancel
          </Button>
        ) : null}
      </div>
      {isEditing && currentEditModuleGroup ? (
        <Form {...editForm}>
          <form
            onSubmit={editForm.handleSubmit(onSubmitEdit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={editForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={editIsSubmitting}
                      placeholder="Module group name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={editForm.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Publish</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center">
              <Button disabled={!editIsValid || editIsSubmitting} type="submit">
                Update
              </Button>
              <ConfirmModal
                onConfirm={() => onDelete(currentEditModuleGroup.id)}
                message="Are you want to delete this module group?"
              >
                <Button size="sm" disabled={isLoading}>
                  <Trash className="h-4 w-4" />
                </Button>
              </ConfirmModal>
            </div>
          </form>
        </Form>
      ) : null}
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Module group name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Publish</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && !isEditing ? (
        <div>
          <div
            className={cn(
              "text-sm mt-2",
              !initialData.moduleGroups.length && "text-slate-500 italic"
            )}
          >
            {!initialData.moduleGroups.length && "No module groups"}
            <ModuleGroupList
              onReorder={onReorder}
              items={initialData.moduleGroups || []}
              toggleEdit={toggleEdit}
              setCurrentEditModuleGroup={setCurrentEditModuleGroup}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Drag and drop to reorder the module groups
          </p>
        </div>
      ) : null}
    </div>
  );
};
