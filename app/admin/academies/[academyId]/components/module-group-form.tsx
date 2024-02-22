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
import Link from "next/link";

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
  deleteModuleGroup: (moduleGroupId: string) => void;
  academyId: string;
  accessToken: string;
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
  deleteModuleGroup,
  accessToken,
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
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      addModuleGroups({
        id: response.data.moduleGroupId,
        name: payload.name,
        order: payload.order,
        modules: [],
        isPublished: payload.isPublished,
      });

      toast.success("Modul Group berhasil ditambahkan");
      form.reset();
      toggleCreating();
      //   router.refresh();
    } catch {
      toast.error("Modul Group gagal ditambahkan");
    }
  };

  const onSubmitEdit = async (values: z.infer<typeof editFormSchema>) => {
   try {
    if (!currentEditModuleGroup) return;

    const payload = {
      ...values,
      updatedAt: Date.now().toString(),
    };

    await axiosInstance.patch(
      `/academies/${academyId}/module-groups/${currentEditModuleGroup.id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    updateModuleGroup(
      {
        ...currentEditModuleGroup,
        ...values,
      },
      currentEditModuleGroup.id
    );

    toast.success("Module Group berhasil diubah");
    editForm.reset();
    toggleEdit();
   } catch (error) {
    toast.error("Modul Group gagal diubah")
   }
  };
  const onReorder = async (updateData: { id: string; order: number }[]) => {
    try {
      setIsUpdating(true);
      updateData.forEach(async (data) => {
        await axiosInstance.patch(
          `/academies/${academyId}/module-groups/${data.id}`,
          {
            order: data.order,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      });
      sortModuleGroups(updateData);
      toast.success("Modul group berhasil diurutkan");
      //   router.refresh();
    } catch {
      toast.error("Modul group gagal diurutkan");
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
          deletedAt: Date.now().toString(),
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("Modul group berhasil dihapus");
      deleteModuleGroup(moduleGroupId);
      toggleEdit();
    } catch {
      toast.error("Modul group gagal dihapus");
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
        <p className="text-sm font-medium lg:text-base">
          Modul Group Kelas
        </p>
        <div className="flex items-center gap-4">
          {!isEditing && (
            <Button onClick={toggleCreating} variant="ghost" className="p-0 m-0">
              {isCreating ? (
                <>Batal</>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tambah
                </>
              )}
            </Button>
          )}
          {!isCreating && isEditing ? (
            <Button onClick={toggleEdit} variant="ghost" className="p-0 m-0">
              Batal
            </Button>
          ) : null}
          <Link href={`/admin/academies/${academyId}/module-groups/trash`}>
            <Button variant="ghost" className="p-0 m-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M7.035 3.5c-.9 0-1.629.675-1.737 1.527A.75.75 0 0 1 5.5 5h13c.07 0 .137.01.201.027A1.75 1.75 0 0 0 16.965 3.5zM6.85 19.83a.75.75 0 0 0 .745.67h8.807a.75.75 0 0 0 .746-.67L18.59 6.496a.758.758 0 0 1-.09.005h-13a.758.758 0 0 1-.091-.005zM3.803 5.6A3.25 3.25 0 0 1 7.035 2h9.93a3.25 3.25 0 0 1 3.231 3.6L18.64 19.991A2.25 2.25 0 0 1 16.403 22H7.596a2.25 2.25 0 0 1-2.237-2.008zm7.989 4.81a.25.25 0 0 1 .415 0l.67 1a.75.75 0 0 0 1.246-.835l-.669-1a1.75 1.75 0 0 0-2.909 0l-.669 1a.75.75 0 1 0 1.247.834zM9.636 12.6a.75.75 0 0 1 .257 1.028l-.364.607a.5.5 0 0 0 .428.757h.793a.75.75 0 0 1 0 1.5h-.793c-1.554 0-2.514-1.696-1.715-3.029l.365-.607a.75.75 0 0 1 1.029-.257m4.473 1.028a.75.75 0 1 1 1.286-.771l.364.607c.799 1.333-.161 3.028-1.715 3.028h-.794a.75.75 0 0 1 0-1.5h.794a.5.5 0 0 0 .429-.757z"
                />
              </svg>
              Sampah
            </Button>
          </Link>
        </div>
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
                Simpan
              </Button>
              <ConfirmModal
                onConfirm={() => onDelete(currentEditModuleGroup.id)}
                message="Apakah anda yakin ingin menghapus module group ini?"
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
              Buat
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
              academyId={academyId}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {initialData.moduleGroups.length} module group
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Drag and drop to reorder the module groups
          </p>
        </div>
      ) : null}
    </div>
  );
};
