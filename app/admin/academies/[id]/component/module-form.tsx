"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";
import { ModuleList } from "./module-list";
import { useRouter } from "next/navigation";

interface ModuleFormProps {
  initalData: {
    moduleGroups: ModuleGroup[];
  };
  academyId: string;
}

export default function ModuleForm({ initalData, academyId }: ModuleFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const onSubmit = async () => {
    try {
      //   await axios.post(`/api/courses/${academyId}/chapters`, values);
      //   toast.success("Chapter created");
      //   toggleCreating();
      //   router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);

      //   await axios.put(`/api/courses/${academyId}/chapters/reorder`, {
      //     list: updateData
      //   });
      toast.success("Chapters reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${academyId}/chapters/${id}`);
  };
  return (
    <div>
      {initalData.moduleGroups.map((group, index) => {
        return (
          <Accordion type="single" collapsible key={group.id} className="bg-blue-200 p-4 rounded-md mb-2">
            <AccordionItem value={"item" + index}>
              <AccordionTrigger>{group.name}</AccordionTrigger>
              <AccordionContent key={module.id}>
                <ModuleList
                  items={group.modules}
                  onEdit={onEdit}
                  onReorder={onReorder}
                >
                  {/* {module.name} */}
                </ModuleList>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </div>
  );
}
