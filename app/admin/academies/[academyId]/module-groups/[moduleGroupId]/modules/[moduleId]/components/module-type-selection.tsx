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
import { useEffect, useState } from "react";

interface TypeSelectionProps {
  initialValue: {
    type: "QUIZZ" | "LESSON" | "SUBMISSION";
  };
  moduleId: string;
}
export default function TypeSelection({
  initialValue,
  moduleId,
}: TypeSelectionProps) {
  const [selectedType, setSelectedType] = useState(initialValue.type);
  const router = useRouter();

  // TODO: IMPROVE THIS SH*T
  useEffect(() => {
    const timestamp = Date.now().toString();
    async function createQuizz() {
      await axiosInstance.post(`/academies/modules/${moduleId}/quizz`, {
        moduleId: moduleId,
        createdAt: timestamp,
        updatedAt: timestamp,
        questionAmounts: 3,
      });
    }
    if (selectedType === "QUIZZ") {
      createQuizz();
    }
    router.refresh();
  }, [moduleId, router, selectedType]);
  return (
    <div className="md:mt-6 border bg-white rounded-md p-4 font-medium">
      Module type
      <Select
        onValueChange={(value: "QUIZZ" | "LESSON" | "SUBMISSION") =>
          setSelectedType(value)
        }
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
