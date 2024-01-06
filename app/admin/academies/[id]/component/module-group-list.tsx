"use client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ModuleGroupListProps {
  items: ModuleGroup[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
};

export const ModuleGroupList = ({
  items,
  onReorder,
  onEdit
}: ModuleGroupListProps) => {
  console.log(items)
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

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedModuleGroups = items.slice(startIndex, endIndex + 1);

    setModuleGroups(items);

    const bulkUpdateData = updatedModuleGroups.map((moduleGroup) => ({
      id: moduleGroup.id,
      position: items.findIndex((item) => item.id === moduleGroup.id)
    }));

    onReorder(bulkUpdateData);
  }

  if (!isMounted) {
    return null;
  }

  return (
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
                      moduleGroup.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        moduleGroup.isPublished && "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip
                        className="h-5 w-5"
                      />
                    </div>
                    {moduleGroup.name}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {/* {moduleGroup.isFree && (
                        <Badge>
                          Free
                        </Badge>
                      )} */}
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          moduleGroup.isPublished && "bg-sky-700"
                        )}
                      >
                        {moduleGroup.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(moduleGroup.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
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
  )
}