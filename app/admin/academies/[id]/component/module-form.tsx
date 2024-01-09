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
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

interface ModuleFormProps {
  initialData: {
    moduleGroups: ModuleGroup[];
  };
  addModule: (newModule: Module, moduleGroupId: string) => void;
  academyId: string;
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
}: ModuleFormProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const [isInitialRender, setIsInitialRender] = useState(true);
  const oldModuleGroups = initialData.moduleGroups;

  const [updateData, setUpdateData] = useState<
    {
      moduleId: string;
      academyModuleGroupId: string;
      order: number;
    }[]
  >();

  const onSubmit = async () => {
    try {
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onEdit = (id: string) => {
    // router.push(`/teacher/courses/${academyId}/chapters/${id}`);
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

  const onDragEnd = (result: DropResult) => {
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

      if (sourceCol.id === destinationCol.id) {
        const newRow = reorderRowList(
          sourceCol,
          source.index,
          destination.index
        );

        const newState = {
          ...state,
          rows: {
            ...state.rows,
            [newRow.id]: newRow,
          },
        };
        setState(newState);

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

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col w-full bg-slate-100 rounded-md p-4 border">
          <div className="flex flex-col">
            <div className="font-medium flex items-center justify-between">
              Academy modules
            </div>
            {state.rowOrder.map((rowId) => {
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
                />
              );
            })}
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
}: {
  row: Row;
  modules: Module[];
  academyId: string;
  moduleGroupId: string;
  addModule: (newModule: Module, moduleGroupId: string) => void;
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
        payload
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
      toggleCreating();
      toast.success("New module added");
    } catch {
      toast.error("Something went wrong");
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
              className="p-1 rounded-md mb-2"
            >
              <AccordionItem value={"item" + row.id}>
                <AccordionTrigger>{row.title}</AccordionTrigger>
                <AccordionContent key={row.id} className="">
                  <div className="flex justify-end mb-2">
                    <Button onClick={toggleCreating} variant="ghost">
                      {isCreating ? (
                        <>Cancel</>
                      ) : (
                        <>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add a module
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
                          Create
                        </Button>
                      </form>
                    </Form>
                  )}

                  {!isCreating && (
                    <div className="bg-slate-200 p-4 rounded-md">
                      {!modules.length ? (
                        <p className="font-medium text-center">
                          No module groups
                        </p>
                      ) : null}
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
                                  {module.name}
                                  <div className="ml-auto pr-2 flex items-center gap-x-2">
                                    <Badge
                                      className={cn(
                                        "bg-slate-500",
                                        module.isPublished && "bg-sky-700"
                                      )}
                                    >
                                      {module.isPublished
                                        ? "Published"
                                        : "Draft"}
                                    </Badge>
                                    <Pencil className="w-4 h-4 cursor-pointer hover:opacity-75 transition" />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        : null}
                      <p className="text-xs text-muted-foreground mt-4">
                        {modules.length} modules
                      </p>
                      <p className="text-xs text-muted-foreground mt-4">
                        Drag and drop to reorder the module groups
                      </p>
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
