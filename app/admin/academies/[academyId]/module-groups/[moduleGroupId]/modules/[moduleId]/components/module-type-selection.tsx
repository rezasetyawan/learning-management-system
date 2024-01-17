"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODULE_TYPES } from "@/constants";
import { axiosInstance } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface TypeSelectionProps {
  initialValue: {
    type: "QUIZZ" | "LESSON" | "SUBMISSION";
  };
  academyId: string;
  moduleGroupId: string;
  moduleId: string;
}
export default function TypeSelection({
  initialValue,
  moduleId,
  academyId,
  moduleGroupId,
}: TypeSelectionProps) {
  const isInitialRender = useRef(true);
  const [selectedType, setSelectedType] = useState(initialValue.type);
  const router = useRouter();

  // TODO: IMPROVE THIS SH*T
  useEffect(() => {
    if (isInitialRender.current) {
      return;
    }

    console.log("test");
    console.log(isInitialRender);
    const timestamp = Date.now().toString();
    async function createQuizz() {
      await axiosInstance.post(`/academies/modules/${moduleId}/quizz`, {
        moduleId: moduleId,
        createdAt: timestamp,
        updatedAt: timestamp,
        questionAmounts: 3,
      });
    }

    async function updateQuizzType(type: string) {
      const timestamp = Date.now().toString();
      await axiosInstance.patch(
        `/academies/${academyId}/module-groups/${moduleGroupId}/modules/${moduleId}`,
        {
          updatedAt: timestamp,
          type: type,
        }
      );
    }
    if (selectedType === "QUIZZ") {
      updateQuizzType(selectedType);
      createQuizz();
      window.location.reload()
    } else {
      updateQuizzType(selectedType);
      window.location.reload()
    }
    
  }, [academyId, moduleGroupId, moduleId, router, selectedType]);
  return (
    <div className="md:mt-6 border bg-white rounded-md p-4 font-medium">
      Module type
      <Select
        onValueChange={(value: "QUIZZ" | "LESSON" | "SUBMISSION") => {
          setSelectedType(value);
          isInitialRender.current = false;
        }}
        defaultValue={initialValue.type}
      >
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Select module type" />
        </SelectTrigger>

        <SelectContent>
          {MODULE_TYPES.map((type) => (
            <SelectItem value={type} key={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
