/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-assign-module-variable */
"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/lib/axios";

interface ModuleFormProps {
  initalData: {
    moduleGroups: ModuleGroup[];
  };
  academyId: string;
}

interface Column {
  id: string;
  title: string;
  moduleIds: string[];
}

interface Data {
  modules: Record<string, Module>;
  columns: Record<string, Column>;
}

const reorderColumnList = (
  sourceCol: Column,
  startIndex: number,
  endIndex: number
) => {
  const newModuleIds = Array.from(sourceCol.moduleIds);
  const [removed] = newModuleIds.splice(startIndex, 1);
  newModuleIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    moduleIds: newModuleIds,
  };

  return newColumn;
};

const getInitalData = (moduleGroups: ModuleGroup[]) => {
  const initialData: Data = {
    modules: {},
    columns: {},
  };

  moduleGroups.forEach((moduleGroup) => {
    moduleGroup.modules.forEach((module) => {
      initialData.modules[module.id] = module;
    });

    initialData.columns[moduleGroup.id] = {
      id: moduleGroup.id,
      title: moduleGroup.name,
      moduleIds: moduleGroup.modules.map((module) => module.id),
    };
  });

  return initialData;
};

const getUpdateData = (initialData: Data) => {
  const updateData: {
    moduleId: string;
    academyModuleGroupId: string;
    order: number;
  }[] = [];

  for (const columnId in initialData.columns) {
    const column = initialData.columns[columnId];
    column.moduleIds.sort((a, b) => {
      const orderDiff =
        initialData.modules[a].order - initialData.modules[b].order;
      if (orderDiff !== 0) {
        return orderDiff;
      } else {
        return a.localeCompare(b);
      }
    });

    column.moduleIds.forEach((moduleId) => {
      if (!updateData.some((item) => item.moduleId === moduleId)) {
        const module = initialData.modules[moduleId];

        updateData.push({
          moduleId,
          academyModuleGroupId: columnId,
          order: column.moduleIds.findIndex((id) => id === moduleId) + 1,
        });
      }
    });
  }

  return updateData;
};

export default function ModuleForm({ initalData, academyId }: ModuleFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const [isInitialRender, setIsInitialRender] = useState(true);

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

  const columnOrder = initalData.moduleGroups
    .sort((a, b) => a.order - b.order)
    .map((moduleGroup) => moduleGroup.id);

  const [state, setState] = useState(getInitalData(initalData.moduleGroups));

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

      // If the user drops within the same column but in a different positoin
      const sourceCol = state.columns[source.droppableId];
      const destinationCol = state.columns[destination.droppableId];

      if (sourceCol.id === destinationCol.id) {
        const newColumn = reorderColumnList(
          sourceCol,
          source.index,
          destination.index
        );

        const newState = {
          ...state,
          columns: {
            ...state.columns,
            [newColumn.id]: newColumn,
          },
        };
        setState(newState);

        return;
      }

      // If the user moves from one column to another
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
        columns: {
          ...state.columns,
          [newStartCol.id]: newStartCol,
          [newEndCol.id]: newEndCol,
        },
      };

      setState(newState);
    }
  };

  useEffect(() => {
    if (isInitialRender) {
      // After the initial render, set isInitialRender to false
      return setIsInitialRender(false);
    }
    console.log("use effect 1");
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
        console.log(updateData);
        toast.success("Modules reordered");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  }, [updateData]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col min-h-screen w-full">
        <div className="flex flex-col">
          {columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const module = column.moduleIds.map((id) => state.modules[id]);

            return <Column key={column.id} column={column} modules={module} />;
          })}
        </div>
      </div>
    </DragDropContext>
  );
}

const Column = ({ column, modules }: { column: Column; modules: Module[] }) => {
  return (
    <div className="flex flex-col">
      <Droppable droppableId={column.id} type="module">
        {(droppableProvided, droppableSnapshot) => (
          <div
            className="flex flex-col"
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
          >
            <Accordion
              type="single"
              collapsible
              key={column.id}
              className="p-4 rounded-md mb-2"
            >
              <AccordionItem value={"item" + column.id}>
                <AccordionTrigger>{column.title}</AccordionTrigger>
                <AccordionContent key={module.id}>
                  {modules.map(
                    (
                      module: {
                        id: Key | null | undefined;
                        isPublished: any;
                        name:
                          | string
                          | number
                          | boolean
                          | ReactElement<
                              any,
                              string | JSXElementConstructor<any>
                            >
                          | Iterable<ReactNode>
                          | ReactPortal
                          | PromiseLikeOfReactNode
                          | null
                          | undefined;
                      },
                      index: number
                    ) => (
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
                                {module.isPublished ? "Published" : "Draft"}
                              </Badge>
                              <Pencil className="w-4 h-4 cursor-pointer hover:opacity-75 transition" />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    )
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
