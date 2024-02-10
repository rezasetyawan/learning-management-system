"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ModuleGroup } from "@/types";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ModuleGroupListProps {
  items: ModuleGroup[];
  onReorder: (updateData: { id: string; order: number }[]) => void;
  toggleEdit: () => void;
  setCurrentEditModuleGroup: (data: ModuleGroup) => void;
  academyId: string;
}

export const ModuleGroupList = ({
  items,
  onReorder,
  toggleEdit,
  academyId,
  setCurrentEditModuleGroup,
}: ModuleGroupListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [moduleGroups, setModuleGroups] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setModuleGroups(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(moduleGroups);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setModuleGroups(items);

    const bulkUpdateData = items.map((moduleGroup) => ({
      id: moduleGroup.id,
      order: items.findIndex((item) => item.id === moduleGroup.id) + 1,
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="max-h-[300px] w-full lg:pr-4 module-groups-container overflow-y-scroll">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="moduleGroups">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {moduleGroups.map((moduleGroup, index) => (
                <Draggable
                  key={moduleGroup.id}
                  draggableId={moduleGroup.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={cn(
                        "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                        moduleGroup.isPublished &&
                          "bg-sky-100 border-sky-200 text-sky-700"
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        className={cn(
                          "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                          moduleGroup.isPublished &&
                            "border-r-sky-200 hover:bg-sky-200"
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip className="h-5 w-5" />
                      </div>
                      <Link
                        href={`/admin/academies/${academyId}/module-groups/${moduleGroup.id}`}
                        className="block text-xs lg:text-sm"
                      >
                        {moduleGroup.name}
                      </Link>
                      <div className="ml-auto pr-2 flex items-center gap-x-2">
                        <Badge
                          className={cn(
                            "bg-slate-500",
                            moduleGroup.isPublished && "bg-sky-700"
                          )}
                        >
                          <span className="text-xs">
                            {moduleGroup.isPublished ? "Published" : "Draft"}
                          </span>
                        </Badge>
                        <Button
                          type="button"
                          variant={"ghost"}
                          onClick={() => {
                            setCurrentEditModuleGroup(moduleGroup);
                          }}
                        >
                          <Pencil className="w-4 h-4 cursor-pointer hover:opacity-75 transition" />
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};
