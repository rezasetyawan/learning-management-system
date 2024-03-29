/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-assign-module-variable */
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Module, ModuleGroup, createModule } from "@/types";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import { Grip, Pencil, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ModuleFormProps {
  initialData: {
    moduleGroups: ModuleGroup[];
  };
  addModule: (newModule: Module, moduleGroupId: string) => void;
  academyId: string;
  accessToken: string;
  handleModuleSearch: (moduleName: string) => void;
}

interface Row {
  id: string;
  title: string;
  moduleIds: string[];
}

interface Data {
  modules: Record<string, Module>;
  rows: Record<string, Row>;
  rowOrder: string[];
}

const reorderRowList = (
  sourceCol: Row,
  startIndex: number,
  endIndex: number
) => {
  const newModuleIds = Array.from(sourceCol.moduleIds);
  const [removed] = newModuleIds.splice(startIndex, 1);
  newModuleIds.splice(endIndex, 0, removed);

  const newRow = {
    ...sourceCol,
    moduleIds: newModuleIds,
  };

  return newRow;
};

const getUpdateData = (initialData: Data) => {
  const updateData: {
    moduleId: string;
    academyModuleGroupId: string;
    order: number;
  }[] = [];

  for (const rowId in initialData.rows) {
    const row = initialData.rows[rowId];
    row.moduleIds.sort((a, b) => {
      const orderDiff =
        initialData.modules[a].order - initialData.modules[b].order;
      if (orderDiff !== 0) {
        return orderDiff;
      } else {
        return a.localeCompare(b);
      }
    });

    row.moduleIds.forEach((moduleId) => {
      if (!updateData.some((item) => item.moduleId === moduleId)) {
        const module = initialData.modules[moduleId];

        updateData.push({
          moduleId,
          academyModuleGroupId: rowId,
          order: row.moduleIds.findIndex((id) => id === moduleId) + 1,
        });
      }
    });
  }

  return updateData;
};

export default function ModuleForm({
  initialData,
  academyId,
  addModule,
  accessToken,
  handleModuleSearch,
}: ModuleFormProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const router = useRouter();

  const [updateData, setUpdateData] = useState<
    {
      moduleId: string;
      academyModuleGroupId: string;
      order: number;
    }[]
  >();

  const onEdit = (moduleGroupId: string, moduleId: string) => {
    router.push(
      `/admin/academies/${academyId}/module-groups/${moduleGroupId}/modules/${moduleId}`
    );
  };

  const getInitialData = (moduleGroups: ModuleGroup[]) => {
    const initialData: Data = {
      modules: {},
      rows: {},
      rowOrder: [],
    };

    moduleGroups.forEach((moduleGroup) => {
      moduleGroup.modules.forEach((module) => {
        initialData.modules[module.id] = module;
      });

      initialData.rows[moduleGroup.id] = {
        id: moduleGroup.id,
        title: moduleGroup.name,
        moduleIds: moduleGroup.modules.map((module) => module.id),
      };
    });

    initialData.rowOrder = moduleGroups
      .sort((a, b) => a.order - b.order)
      .map((moduleGroup) => moduleGroup.id);
    // forceUpdate();

    return initialData;
  };

  const [state, setState] = useState(getInitialData(initialData.moduleGroups));

  function moveElement<T>(array: T[], fromIndex: number, toIndex: number): T[] {
    if (toIndex >= array.length) {
      let k = toIndex - array.length;
      while (k-- + 1) {
        array.push(undefined!);
      }
    }
    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0]);
    return array;
  }

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result;
    if (type === "module") {
      // If user tries to drop in an unknown destination
      if (!destination) return;

      // if the user drags and drops back in the same position
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      // If the user drops within the same row but in a different positoin
      const sourceCol = state.rows[source.droppableId];
      const destinationCol = state.rows[destination.droppableId];

      // TODO: IMPROVE THIS SHIT CODE
      if (sourceCol.id === destinationCol.id) {
        const currentRow = state.rows[source.droppableId];
        const updatedModuleIds = moveElement(
          currentRow.moduleIds,
          source.index,
          destination.index
        );

        const newState = {
          ...state,
          rows: {
            ...state.rows,
            [source.droppableId]: {
              ...currentRow,
              moduleIds: updatedModuleIds,
            },
          },
        };

        const updatePromises = updatedModuleIds.map(async (d, index) => {
          axiosInstance.patch(
            `/academies/${academyId}/module-groups/${source.droppableId}/modules/${d}`,
            {
              academyModuleGroupId: source.droppableId,
              order: index + 1,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        });
        await Promise.all(updatePromises);
        router.refresh();
        return;
      }

      // If the user moves from one row to another
      const startModuleIds = Array.from(sourceCol.moduleIds);
      const [removed] = startModuleIds.splice(source.index, 1);
      const newStartCol = {
        ...sourceCol,
        moduleIds: startModuleIds,
      };

      const endModuleIds = Array.from(destinationCol.moduleIds);
      endModuleIds.splice(destination.index, 0, removed);
      const newEndCol = {
        ...destinationCol,
        moduleIds: endModuleIds,
      };

      const newState = {
        ...state,
        rows: {
          ...state.rows,
          [newStartCol.id]: newStartCol,
          [newEndCol.id]: newEndCol,
        },
      };

      setState(newState);
    }
  };

  // MY FUTURE SELF, IF YOU FACE A ORDER PROBLEM THE COMMENT THE USEEFFECT BELOW AND SACRIFICE THE SEARCH FILTER
  useEffect(() => {
    // Update state whenever the initialData prop changes
    setState(getInitialData(initialData.moduleGroups));
  }, [initialData.moduleGroups]);

  useEffect(() => {
    if (isInitialRender) {
      // After the initial render, set isInitialRender to false
      return setIsInitialRender(false);
    }
    setUpdateData(getUpdateData(state));
  }, [state]);

  useEffect(() => {
    // TODO: ONLY UPDATE THE NEW ORDER
    if (isInitialRender) {
      return;
    }
    try {
      if (updateData) {
        setIsUpdating(true);
        updateData.map(async (d) => {
          axiosInstance.patch(
            `/academies/${academyId}/module-groups/${d.academyModuleGroupId}/modules/${d.moduleId}`,
            {
              academyModuleGroupId: d.academyModuleGroupId,
              order: d.order,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        });

        // toast.success("Modules reordered");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  }, [updateData]);

  const totalModules = useMemo(() => {
    return initialData.moduleGroups
      ? initialData.moduleGroups.reduce(
          (accumulator, currentValue) =>
            accumulator + currentValue.modules.length,
          0
        )
      : 0;
  }, [initialData.moduleGroups]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col w-full bg-slate-100 rounded-md p-4 border">
          <div className="flex flex-col">
            <div className="font-medium flex items-center justify-between mb-2">
              <p className="text-sm font-medium lg:text-base">Modul Kelas</p>
              <div className="flex items-center gap-4">
                <p className="text-xs text-muted-foreground">
                  Total {totalModules} modul
                </p>
                <Link href={`/admin/academies/${academyId}/modules/trash`}>
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
            <div className="mt-2 mb-4">
              <Input
                onChange={(value) =>
                  handleModuleSearch(value.currentTarget.value)
                }
                placeholder="Cari modul"
                className="bg-white"
              />
            </div>
            {initialData.moduleGroups.length ? (
              state.rowOrder.map((rowId) => {
                const row = state.rows[rowId];
                const module = row.moduleIds.map((id) => state.modules[id]);

                return (
                  <Row
                    key={row.id}
                    row={row}
                    modules={module}
                    academyId={academyId}
                    moduleGroupId={rowId}
                    addModule={addModule}
                    onEdit={onEdit}
                    accessToken={accessToken}
                    refresh={() => router.refresh()}
                  />
                );
              })
            ) : (
              <div className="flex items-center justify-center p-4 text-sm">
                Tidak ada modul untuk ditampilkan
              </div>
            )}
          </div>
        </div>
      </DragDropContext>
    </>
  );
}

const Row = ({
  row,
  modules,
  academyId,
  moduleGroupId,
  addModule,
  onEdit,
  accessToken,
  refresh,
}: {
  row: Row;
  modules: Module[];
  academyId: string;
  moduleGroupId: string;
  addModule: (newModule: Module, moduleGroupId: string) => void;
  onEdit: (moduleGroupId: string, moduleId: string) => void;
  accessToken: string;
  refresh: () => void;
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };
  const formSchema = z.object({
    name: z.string().min(1),
    isPublished: z.boolean(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isPublished: false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onCreateModule = async (values: z.infer<typeof formSchema>) => {
    try {
      const timestamp = Date.now().toString();
      const payload: createModule = {
        name: values.name,
        academyId: academyId,
        createdAt: timestamp,
        updatedAt: timestamp,
        order: row.moduleIds.length + 1,
        isPublished: values.isPublished,
        academyModuleGroupId: moduleGroupId,
      };

      //   router.refresh();
      const response = await axiosInstance.post(
        `/academies/${academyId}/module-groups/${moduleGroupId}/modules`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      addModule(
        {
          id: response.data.data.moduleId,
          name: payload.name,
          order: payload.order,
          type: "LESSON",
          content: "",
          isPublished: payload.isPublished,
        },
        moduleGroupId
      );

      form.reset();
      toggleCreating();
      toast.success("Modul berhasil ditambahkan");
      refresh();
    } catch (error) {
      toast.error("Modul gagal ditambahkan");
    }
  };
  return (
    <div className="flex flex-col">
      <Droppable droppableId={row.id} type="module">
        {(droppableProvided, droppableSnapshot) => (
          <div
            className="flex flex-col"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            <Accordion
              type="single"
              collapsible
              key={row.id}
              className="rounded-md mb-2 bg-blue-100"
            >
              <AccordionItem value={"item" + row.id}>
                <AccordionTrigger className="hover:no-underline bg-sky-100 p-3 rounded-md">
                  <p className="font-medium text-xs lg:text-sm">{row.title}</p>
                </AccordionTrigger>
                <AccordionContent key={row.id}>
                  <div className="flex justify-end mb-2 p-2">
                    <Button
                      onClick={toggleCreating}
                      variant="ghost"
                      className="text-xs lg:text-sm"
                    >
                      {isCreating ? (
                        <>Batal</>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Tambah
                        </>
                      )}
                    </Button>
                  </div>
                  {isCreating && (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onCreateModule)}
                        className="space-y-4 mt-4 p-3 rounded-md"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  disabled={isSubmitting}
                                  placeholder="Module name"
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
                        <Button
                          disabled={!isValid || isSubmitting}
                          type="submit"
                        >
                          Buat
                        </Button>
                      </form>
                    </Form>
                  )}

                  {!isCreating && (
                    <div className="p-4 rounded-md">
                      {!modules.length && (
                        <p className="font-medium text-center text-xs lg:text-sm">
                          Belum ada modul untuk ditampilkan
                        </p>
                      )}
                      <div className="max-h-[300px] overflow-y-scroll w-full lg:pr-4 modules-container">
                        {modules.length
                          ? modules.map((module, index) => (
                              <Draggable
                                key={module.id}
                                draggableId={`${module.id}`}
                                index={index}
                              >
                                {(draggableProvided, draggableSnapshot) => (
                                  <div
                                    className={cn(
                                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                                      module.isPublished &&
                                        "bg-sky-100 border-sky-200 text-sky-700"
                                    )}
                                    key={module.id}
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                  >
                                    <div
                                      className={cn(
                                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                        module.isPublished &&
                                          "border-r-sky-200 hover:bg-sky-200"
                                      )}
                                      {...draggableProvided.dragHandleProps}
                                    >
                                      <Grip className="h-5 w-5" />
                                    </div>
                                    <Link
                                      href={`/admin/academies/${academyId}/module-groups/${moduleGroupId}/modules/${module.id}/preview`}
                                      className="text-xs lg:text-sm"
                                    >
                                      {module.name}
                                    </Link>
                                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                                      <Badge
                                        className={cn(
                                          "bg-slate-500",
                                          module.isPublished && "bg-sky-700"
                                        )}
                                      >
                                        <span className="text-xs">
                                          {module.isPublished
                                            ? "Published"
                                            : "Draft"}
                                        </span>
                                      </Badge>
                                      <button
                                        onClick={() =>
                                          onEdit(row.id, module.id)
                                        }
                                      >
                                        <Pencil className="w-4 h-4 cursor-pointer hover:opacity-75 transition" />
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          : null}
                      </div>
                      {!!modules.length && (
                        <div>
                          <p className="text-xs text-muted-foreground mt-4">
                            {modules.length} module
                          </p>
                          <p className="text-xs text-muted-foreground mt-4">
                            Drag and drop to reorder the module groups
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

const getNewUpdateData = (
  data1:
    | {
        moduleId: string;
        academyModuleGroupId: string;
        order: number;
      }[]
    | undefined,
  data2: {
    moduleId: string;
    academyModuleGroupId: string;
    order: number;
  }[]
) => {
  if (data1 === undefined) {
    return data2;
  }

  const newData = data2.filter((item) => {
    return !data1.some((existingItem) => {
      // Consider items "equal" if their moduleId, moduleGroupId, and order match
      return (
        existingItem.moduleId === item.moduleId &&
        existingItem.academyModuleGroupId === item.academyModuleGroupId &&
        existingItem.order === item.order
      );
    });
  });

  return newData;
};
